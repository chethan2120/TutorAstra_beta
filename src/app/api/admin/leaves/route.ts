import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getAllLeaves, getTeacherLeaves, updateTeacherLeaveStatus, logActivity } from '@/lib/db';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('student_id') ? Number(searchParams.get('student_id')) : undefined;
  const teacherId = searchParams.get('teacher_id') ? Number(searchParams.get('teacher_id')) : undefined;

  const studentLeaves = getAllLeaves(studentId);
  const teacherLeaves = getTeacherLeaves(teacherId);

  return NextResponse.json({
    leaves: studentLeaves, // backward compatibility
    studentLeaves,
    teacherLeaves
  });
}

export async function PUT(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { id, type, status, adminNotes } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Leave ID and status are required.' }, { status: 400 });
    }

    if (type === 'teacher') {
      updateTeacherLeaveStatus(Number(id), status, adminNotes);
      logActivity(session.email, 'UPDATE_TEACHER_LEAVE', 'leave', String(id), `Updated teacher leave to ${status}`);
    }

    return NextResponse.json({ success: true, message: 'Leave status updated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update leave.' }, { status: 500 });
  }
}
