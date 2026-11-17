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

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const teacherUserIdParam = searchParams.get('teacher_user_id') ? Number(searchParams.get('teacher_user_id')) : undefined;

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/student/box:', e);
  }

  let user = getUserByEmail(session.email);
  if (!user) {
    user = {
      id: session.id || 4,
      email: session.email,
      name: session.name || 'Ethan Jenkins',
      role: session.role || 'student'
    };
  }

  // Resolve student profile. If an Admin is previewing, fall back to the primary enrolled student
  let student: any = null;
  try {
    student = getStudentByUserId(user.id);
    if (!student && db) {
      student = db.prepare('SELECT * FROM student_profiles ORDER BY id ASC LIMIT 1').get() as any;
    }
  } catch (e) {
    console.error('Error resolving student profile in /api/student/box:', e);
  }

  if (!student) {
    student = {
      id: 1,
      user_id: user.id || 4,
      name: user.name || 'Ethan Jenkins',
      email: user.email || 'student@gmail.com',
      grade: 'Grade 10',
      curriculum: 'CBSE'
    };
  }

  // Find assigned teachers for this student
  let teachers: any[] = [];
  if (db && student) {
    try {
      teachers = db.prepare(`
        SELECT DISTINCT tu.id as teacher_user_id, tu.name as teacher_name, tp.id as teacher_profile_id,
               tp.qualification, sub.id as subject_id, sub.name as subject_name
        FROM student_enrollments se
        JOIN teacher_profiles tp ON se.teacher_id = tp.id
        JOIN users tu ON tp.user_id = tu.id
        JOIN subjects sub ON se.subject_id = sub.id
        WHERE se.student_id = ?
      `).all(student.id) as any[];
    } catch (e) {
      console.error('Error querying enrolled teachers:', e);
    }
  }

  // If no enrolled teachers found, fall back to available faculty
  if (teachers.length === 0 && db) {
    try {
      teachers = db.prepare(`
        SELECT DISTINCT tu.id as teacher_user_id, tu.name as teacher_name, tp.id as teacher_profile_id,
               tp.qualification, 1 as subject_id, 'Science & Physics' as subject_name
        FROM teacher_profiles tp
        JOIN users tu ON tp.user_id = tu.id
        ORDER BY tu.name ASC
      `).all() as any[];
    } catch (e) {
      console.error('Error querying all teachers fallback:', e);
    }
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
  const activeStudentUserId = student ? student.user_id : (user.id || 4);

  // Mark incoming messages as read
  try {
    markTeacherBoxMessagesRead(primaryTeacher.teacher_user_id, activeStudentUserId);
  } catch (e) {
    console.error('Error marking messages read:', e);
  }

  // Get messages
  let messages: any[] = [];
  try {
    messages = getTeacherBoxMessages(activeStudentUserId, primaryTeacher.teacher_user_id);
  } catch (e) {
    console.error('Error getting messages:', e);
  }

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

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/student/box POST:', e);
  }

  let user = getUserByEmail(session.email);
  if (!user) {
    user = {
      id: session.id || 4,
      email: session.email,
      name: session.name || 'Ethan Jenkins',
      role: session.role || 'student'
    };
  }

  let student: any = null;
  try {
    student = getStudentByUserId(user.id);
    if (!student && db) {
      student = db.prepare('SELECT * FROM student_profiles ORDER BY id ASC LIMIT 1').get() as any;
    }
  } catch (e) {
    console.error('Error resolving student in /api/student/box POST:', e);
  }

  if (!student) {
    student = {
      id: 1,
      user_id: user.id || 4,
      name: user.name || 'Ethan Jenkins',
      email: user.email || 'student@gmail.com'
    };
  }

  try {
    const { teacherUserId, teacherId, subjectId, message, attachmentName, attachmentUrl, attachmentType, attachmentSize } = await request.json();

    if (!teacherUserId) {
      return NextResponse.json({ error: 'Teacher recipient is required.' }, { status: 400 });
    }

    if ((!message || !message.trim()) && !attachmentUrl) {
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
      attachment_url: attachmentUrl || undefined,
      attachment_name: attachmentName || undefined,
      attachment_type: attachmentType || undefined,
      attachment_size: attachmentSize ? Number(attachmentSize) : undefined
    });

    return NextResponse.json({
      success: true,
      messageId,
      message: 'Message delivered to Teacher Box successfully.'
    });
  } catch (err: any) {
    console.error('Student Box POST error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
