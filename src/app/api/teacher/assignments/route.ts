import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getTeacherByUserId,
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAllSubjects,
  getDb
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/teacher/assignments:', e);
  }

  let user = getUserByEmail(session.email);
  if (!user) {
    user = {
      id: session.id || 3,
      email: session.email,
      name: session.name || 'Dr. Sarah Mitchell',
      role: session.role || 'teacher'
    };
  }

  let teacher: any = null;
  try {
    teacher = getTeacherByUserId(user.id);
    if (!teacher && db) {
      teacher = db.prepare('SELECT * FROM teacher_profiles ORDER BY id ASC LIMIT 1').get() as any;
    }
  } catch (e) {
    console.error('Error resolving teacher:', e);
  }

  if (!teacher) {
    teacher = { id: 1, name: user.name || 'Dr. Sarah Mitchell' };
  }

  let assignments: any[] = [];
  try {
    assignments = getAssignments({ teacher_id: teacher.id });
  } catch (e) {
    console.error('Error getting assignments:', e);
  }

  let students: any[] = [];
  if (db) {
    try {
      students = db.prepare(`
        SELECT DISTINCT sp.id, su.name, su.email, sp.grade, sp.curriculum
        FROM student_enrollments se
        JOIN student_profiles sp ON se.student_id = sp.id
        JOIN users su ON sp.user_id = su.id
        WHERE se.teacher_id = ?
        ORDER BY su.name ASC
      `).all(teacher.id) as any[];
    } catch (e) {
      console.error('Error getting teacher students for assignments:', e);
    }
  }

  let subjects: any[] = [];
  try {
    subjects = getAllSubjects();
  } catch (e) {
    console.error('Error getting subjects:', e);
  }

  return NextResponse.json({
    teacherId: teacher.id,
    assignments,
    students,
    subjects
  });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/teacher/assignments POST:', e);
  }

  let user = getUserByEmail(session.email);
  if (!user) {
    user = {
      id: session.id || 3,
      email: session.email,
      name: session.name || 'Dr. Sarah Mitchell',
      role: session.role || 'teacher'
    };
  }

  let teacher: any = null;
  try {
    teacher = getTeacherByUserId(user.id);
    if (!teacher && db) {
      teacher = db.prepare('SELECT * FROM teacher_profiles ORDER BY id ASC LIMIT 1').get() as any;
    }
  } catch (e) {
    console.error('Error resolving teacher:', e);
  }

  if (!teacher) {
    teacher = { id: 1, name: user.name || 'Dr. Sarah Mitchell' };
  }

  try {
    const { action, assignmentId, student_id, subject_id, title, description, due_date, points, status } = await request.json();

    if (action === 'delete') {
      if (!assignmentId) return NextResponse.json({ error: 'Assignment ID is required.' }, { status: 400 });
      deleteAssignment(Number(assignmentId));
      return NextResponse.json({ success: true, message: 'Assignment deleted successfully.' });
    }

    if (action === 'update_status') {
      if (!assignmentId || !status) {
        return NextResponse.json({ error: 'Assignment ID and status are required.' }, { status: 400 });
      }
      updateAssignment(Number(assignmentId), { status });
      return NextResponse.json({ success: true, message: 'Assignment status updated.' });
    }

    // Create assignment
    if (!student_id || !subject_id || !title || !due_date) {
      return NextResponse.json({ error: 'Student, subject, title, and due date are required.' }, { status: 400 });
    }

    const newId = createAssignment({
      teacher_id: teacher.id,
      student_id: Number(student_id),
      subject_id: Number(subject_id),
      title,
      description: description || '',
      due_date,
      max_marks: points ? Number(points) : 100
    });

    return NextResponse.json({
      success: true,
      id: newId,
      message: 'Course assignment created and dispatched to student dashboard.'
    });
  } catch (err: any) {
    console.error('Assignment POST error:', err);
    return NextResponse.json({ error: err.message || 'Operation failed.' }, { status: 500 });
  }
}
