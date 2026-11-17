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

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const teacher = getTeacherByUserId(user.id);
  if (!teacher) return NextResponse.json({ error: 'Teacher profile not found.' }, { status: 404 });

  const db = getDb();
  const assignments = getAssignments({ teacher_id: teacher.id });
  const students = db.prepare(`
    SELECT DISTINCT sp.id, su.name, su.email, sp.grade, sp.curriculum
    FROM student_enrollments se
    JOIN student_profiles sp ON se.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    WHERE se.teacher_id = ? AND se.status = 'active'
    ORDER BY su.name ASC
  `).all(teacher.id) as any[];

  const subjects = getAllSubjects();

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

  const user = getUserByEmail(session.email);
  const teacher = user ? getTeacherByUserId(user.id) : null;
  if (!teacher) return NextResponse.json({ error: 'Teacher profile not found.' }, { status: 404 });

  try {
    const { student_id, subject_id, title, description, due_date, max_marks } = await request.json();
    if (!student_id || !subject_id || !title || !due_date) {
      return NextResponse.json({ error: 'Student, subject, title, and due date are required.' }, { status: 400 });
    }

    createAssignment({
      teacher_id: teacher.id,
      student_id: Number(student_id),
      subject_id: Number(subject_id),
      title,
      description,
      due_date,
      max_marks: Number(max_marks) || 100
    });

    return NextResponse.json({ success: true, message: 'Assignment created successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create assignment.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { id, status, obtained_marks, feedback } = await request.json();
    if (!id) return NextResponse.json({ error: 'Assignment ID required.' }, { status: 400 });

    updateAssignment(Number(id), {
      status,
      obtained_marks: obtained_marks !== undefined ? Number(obtained_marks) : undefined,
      feedback
    });

    return NextResponse.json({ success: true, message: 'Assignment updated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update assignment.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Assignment ID required.' }, { status: 400 });

    deleteAssignment(id);
    return NextResponse.json({ success: true, message: 'Assignment deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete assignment.' }, { status: 500 });
  }
}
