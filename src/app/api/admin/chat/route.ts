import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getTeacherBoxMessages,
  sendTeacherBoxMessage,
  markTeacherBoxMessagesRead,
  getAllTeachers,
  getDb
} from '@/lib/db';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'Admin not found.' }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const partnerUserId = searchParams.get('partner_user_id') ? Number(searchParams.get('partner_user_id')) : undefined;

  const db = getDb();

  // List all teachers as available contacts
  const teachers = db.prepare(`
    SELECT u.id as user_id, u.name, u.email, u.role, tp.qualification,
           (SELECT message FROM teacher_box_messages
            WHERE (sender_user_id = u.id AND receiver_user_id = ?) OR (sender_user_id = ? AND receiver_user_id = u.id)
            ORDER BY created_at DESC LIMIT 1) as last_message,
           (SELECT created_at FROM teacher_box_messages
            WHERE (sender_user_id = u.id AND receiver_user_id = ?) OR (sender_user_id = ? AND receiver_user_id = u.id)
            ORDER BY created_at DESC LIMIT 1) as last_message_time,
           (SELECT COUNT(*) FROM teacher_box_messages
            WHERE sender_user_id = u.id AND receiver_user_id = ? AND is_read = 0) as unread_count
    FROM users u
    JOIN teacher_profiles tp ON u.id = tp.user_id
    WHERE u.role = 'teacher'
    ORDER BY last_message_time DESC NULLS LAST
  `).all(user.id, user.id, user.id, user.id, user.id);

  if (!partnerUserId) {
    return NextResponse.json({ contacts: teachers, messages: [] });
  }

  markTeacherBoxMessagesRead(partnerUserId, user.id);
  const messages = getTeacherBoxMessages(user.id, partnerUserId);

  return NextResponse.json({
    contacts: teachers,
    messages
  });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'Admin not found.' }, { status: 404 });

  try {
    const { partnerUserId, message, attachment_name, attachment_url, attachment_type, attachment_size } = await request.json();
    if (!partnerUserId) {
      return NextResponse.json({ error: 'Partner user ID is required.' }, { status: 400 });
    }

    const msgId = sendTeacherBoxMessage({
      sender_user_id: user.id,
      receiver_user_id: Number(partnerUserId),
      message: message || '',
      attachment_name,
      attachment_url,
      attachment_type,
      attachment_size
    });

    return NextResponse.json({
      success: true,
      messageId: msgId
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to dispatch message.' }, { status: 500 });
  }
}
