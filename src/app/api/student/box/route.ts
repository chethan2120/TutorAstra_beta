import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getTeacherBoxMessages,
  sendTeacherBoxMessage,
  markTeacherBoxMessagesRead,
  getDb
} from '@/lib/db';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const student = getStudentByUserId(user.id);
  if (!student) return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });

  const db = getDb();
  // Find assigned teachers for this student
  const teachers = db.prepare(`
    SELECT DISTINCT tu.id as teacher_user_id, tu.name as teacher_name, tp.id as teacher_profile_id,
           tp.qualification, sub.id as subject_id, sub.name as subject_name
    FROM student_enrollments se
    JOIN teacher_profiles tp ON se.teacher_id = tp.id
    JOIN users tu ON tp.user_id = tu.id
    JOIN subjects sub ON se.subject_id = sub.id
    WHERE se.student_id = ? AND se.status = 'active'
  `).all(student.id) as any[];

  if (teachers.length === 0) {
    return NextResponse.json({ teachers: [], messages: [] });
  }

  const primaryTeacher = teachers[0];

  // Mark incoming messages as read
  markTeacherBoxMessagesRead(primaryTeacher.teacher_user_id, user.id);

  // Get messages
  const messages = getTeacherBoxMessages(user.id, primaryTeacher.teacher_user_id);

  return NextResponse.json({
    teachers,
    activeTeacher: primaryTeacher,
    messages
  });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const student = getStudentByUserId(user.id);
  if (!student) return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });

  try {
    const { teacherUserId, teacherId, subjectId, message, attachmentName, attachmentUrl, attachmentType, attachmentSize } = await request.json();

    if (!teacherUserId) {
      return NextResponse.json({ error: 'Target teacher is required.' }, { status: 400 });
    }

    if (!message?.trim() && !attachmentName) {
      return NextResponse.json({ error: 'Cannot send an empty message.' }, { status: 400 });
    }

    const messageId = sendTeacherBoxMessage({
      sender_user_id: user.id,
      receiver_user_id: Number(teacherUserId),
      student_id: student.id,
      teacher_id: teacherId ? Number(teacherId) : null,
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
