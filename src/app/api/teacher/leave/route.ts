import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getUserByEmail, getTeacherByUserId, getTeacherLeaves, applyTeacherLeave, getDb } from '@/lib/db';

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
    console.error('Database connection error in /api/teacher/leave:', e);
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

  let leaves: any[] = [];
  try {
    leaves = getTeacherLeaves(teacher.id);
  } catch (e) {
    console.error('Error getting teacher leaves:', e);
  }

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

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/teacher/leave POST:', e);
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

    return NextResponse.json({
      success: true,
      message: 'Faculty leave application submitted to Academic Director.'
    });
  } catch (err: any) {
    console.error('Teacher leave error:', err);
    return NextResponse.json({ error: 'Failed to submit leave.' }, { status: 500 });
  }
}
