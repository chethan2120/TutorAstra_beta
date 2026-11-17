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

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const teacherUserIdParam = searchParams.get('teacher_user_id') ? Number(searchParams.get('teacher_user_id')) : undefined;

  const db = getDb();
  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  // Resolve student profile. If an Admin is previewing, fall back to the primary enrolled student
  let student = getStudentByUserId(user.id);
  if (!student) {
    student = db.prepare('SELECT * FROM student_profiles ORDER BY id ASC LIMIT 1').get() as any;
  }

  // Find assigned teachers for this student
  let teachers: any[] = [];
  if (student) {
    teachers = db.prepare(`
      SELECT DISTINCT tu.id as teacher_user_id, tu.name as teacher_name, tp.id as teacher_profile_id,
             tp.qualification, sub.id as subject_id, sub.name as subject_name
      FROM student_enrollments se
      JOIN teacher_profiles tp ON se.teacher_id = tp.id
      JOIN users tu ON tp.user_id = tu.id
      JOIN subjects sub ON se.subject_id = sub.id
      WHERE se.student_id = ?
    `).all(student.id) as any[];
  }

  // If no enrolled teachers found, fall back to available faculty
  if (teachers.length === 0) {
    teachers = db.prepare(`
      SELECT DISTINCT tu.id as teacher_user_id, tu.name as teacher_name, tp.id as teacher_profile_id,
             tp.qualification, 1 as subject_id, 'Science & Physics' as subject_name
      FROM teacher_profiles tp
      JOIN users tu ON tp.user_id = tu.id
      ORDER BY tu.name ASC
    `).all() as any[];
  }

  if (teachers.length === 0) {
    teachers = [
      {
        teacher_user_id: 3,
        teacher_name: 'Dr. Sarah Mitchell',
        teacher_profile_id: 1,
        qualification: 'Ph.D. Cambridge',
        subject_id: 1,
        subject_name: 'Science & Physics'
      }
    ];
  }

  const primaryTeacher = (teacherUserIdParam && teachers.find(t => t.teacher_user_id === teacherUserIdParam)) || teachers[0];
  const activeStudentUserId = student ? student.user_id : user.id;

  // Mark incoming messages as read
  markTeacherBoxMessagesRead(primaryTeacher.teacher_user_id, activeStudentUserId);

  // Get messages
  const messages = getTeacherBoxMessages(activeStudentUserId, primaryTeacher.teacher_user_id);

  return NextResponse.json({
    studentId: student?.id,
    studentUserId: activeStudentUserId,
    teachers,
    activeTeacher: primaryTeacher,
    messages
  });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const db = getDb();
  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  let student = getStudentByUserId(user.id);
  if (!student) {
    student = db.prepare('SELECT * FROM student_profiles ORDER BY id ASC LIMIT 1').get() as any;
  }

  try {
    const { teacherUserId, teacherId, subjectId, message, attachmentName, attachmentUrl, attachmentType, attachmentSize } = await request.json();

    if (!teacherUserId) {
      return NextResponse.json({ error: 'Target teacher is required.' }, { status: 400 });
    }

    if (!message?.trim() && !attachmentName) {
      return NextResponse.json({ error: 'Cannot send an empty message.' }, { status: 400 });
    }

    const activeSenderId = student ? student.user_id : user.id;

    const messageId = sendTeacherBoxMessage({
      sender_user_id: activeSenderId,
      receiver_user_id: Number(teacherUserId),
      student_id: student ? student.id : 1,
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
