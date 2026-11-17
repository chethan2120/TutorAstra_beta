import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getUserByEmail, getTeacherByUserId, getTeacherLeaves, applyTeacherLeave } from '@/lib/db';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const teacher = getTeacherByUserId(user.id);
  if (!teacher) return NextResponse.json({ error: 'Teacher profile not found.' }, { status: 404 });

  const leaves = getTeacherLeaves(teacher.id);

  return NextResponse.json({
    teacherId: teacher.id,
    teacherName: teacher.name,
    leaves
  });
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
    const { start_date, end_date, reason } = await request.json();
    if (!start_date || !end_date || !reason) {
      return NextResponse.json({ error: 'Start date, end date, and reason are required.' }, { status: 400 });
    }

    applyTeacherLeave({
      teacher_id: teacher.id,
      start_date,
      end_date,
      reason
    });

    return NextResponse.json({ success: true, message: 'Faculty leave request submitted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit leave.' }, { status: 500 });
  }
}
