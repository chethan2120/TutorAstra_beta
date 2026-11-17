import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getTeacherByUserId,
  getTeacherBoxMessages,
  sendTeacherBoxMessage,
  markTeacherBoxMessagesRead,
  getUserById,
  getDb
} from '@/lib/db';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const teacher = getTeacherByUserId(user.id);
  if (!teacher) return NextResponse.json({ error: 'Teacher profile not found.' }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const studentUserId = Number(searchParams.get('student_user_id'));

  if (!studentUserId) {
    // Return all conversation threads for this teacher
    const db = getDb();
    const threads = db.prepare(`
      SELECT DISTINCT su.id as student_user_id, su.name as student_name, su.email as student_email,
             sp.id as student_profile_id, sp.grade,
             (SELECT message FROM teacher_box_messages
              WHERE (sender_user_id = su.id AND receiver_user_id = ?) OR (sender_user_id = ? AND receiver_user_id = su.id)
              ORDER BY created_at DESC LIMIT 1) as last_message,
             (SELECT created_at FROM teacher_box_messages
              WHERE (sender_user_id = su.id AND receiver_user_id = ?) OR (sender_user_id = ? AND receiver_user_id = su.id)
              ORDER BY created_at DESC LIMIT 1) as last_message_time,
             (SELECT COUNT(*) FROM teacher_box_messages
              WHERE sender_user_id = su.id AND receiver_user_id = ? AND is_read = 0) as unread_count
      FROM student_enrollments se
      JOIN student_profiles sp ON se.student_id = sp.id
      JOIN users su ON sp.user_id = su.id
      WHERE se.teacher_id = ?
      ORDER BY last_message_time DESC NULLS LAST
    `).all(user.id, user.id, user.id, user.id, user.id, teacher.id);

    return NextResponse.json({ threads });
  }

  // Mark incoming messages from this student as read
  markTeacherBoxMessagesRead(studentUserId, user.id);

  // Return message history
  const messages = getTeacherBoxMessages(user.id, studentUserId);
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const teacher = getTeacherByUserId(user.id);
  if (!teacher) return NextResponse.json({ error: 'Teacher profile not found.' }, { status: 404 });

  try {
    const { studentUserId, studentId, subjectId, message, attachmentName, attachmentUrl, attachmentType, attachmentSize } = await request.json();

    if (!studentUserId) {
      return NextResponse.json({ error: 'Recipient student is required.' }, { status: 400 });
    }

    if (!message?.trim() && !attachmentName) {
      return NextResponse.json({ error: 'Cannot send an empty message.' }, { status: 400 });
    }

    const messageId = sendTeacherBoxMessage({
      sender_user_id: user.id,
      receiver_user_id: Number(studentUserId),
      student_id: studentId ? Number(studentId) : null,
      teacher_id: teacher.id,
      subject_id: subjectId ? Number(subjectId) : null,
      message,
      attachment_name: attachmentName,
      attachment_url: attachmentUrl,
      attachment_type: attachmentType,
      attachment_size: attachmentSize
    });

    return NextResponse.json({
      success: true,
      messageId
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send message.' }, { status: 500 });
  }
}
