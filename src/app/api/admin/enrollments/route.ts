import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getEnrollmentsByStudentId, createEnrollment, logActivity, getStudentById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const studentId = Number(searchParams.get('student_id'));
  if (!studentId) {
    return NextResponse.json({ error: 'student_id parameter is required.' }, { status: 400 });
  }

  const enrollments = getEnrollmentsByStudentId(studentId);
  return NextResponse.json({ enrollments });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { student_id, subject_id, teacher_id, total_sessions, notes } = await request.json();
    if (!student_id || !subject_id || !total_sessions) {
      return NextResponse.json({ error: 'Student, subject, and session count are required.' }, { status: 400 });
    }

    const id = createEnrollment({
      student_id: Number(student_id),
      subject_id: Number(subject_id),
      teacher_id: teacher_id ? Number(teacher_id) : null,
      total_sessions: Number(total_sessions),
      notes
    });

    const student = getStudentById(student_id);
    logActivity(
      session.email,
      'CREATE_ENROLLMENT',
      'enrollment',
      String(id),
      `Created enrollment for student ${student?.name || student_id}: ${total_sessions} sessions`
    );

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create enrollment.' }, { status: 500 });
  }
}
