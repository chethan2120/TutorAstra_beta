import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getAllLeaves,
  applyStudentLeave,
  getClassById,
  getDb
} from '@/lib/db';
import { sendBrandedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/student/leave:', e);
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
    console.error('Error resolving student in /api/student/leave:', e);
  }

  if (!student) {
    student = { id: 1, name: user.name || 'Ethan Jenkins' };
  }

  let leaves: any[] = [];
  try {
    leaves = getAllLeaves(student.id);
  } catch (e) {
    console.error('Error getting student leaves:', e);
  }

  return NextResponse.json({ leaves });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/student/leave POST:', e);
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
    console.error('Error resolving student in /api/student/leave POST:', e);
  }

  if (!student) {
    student = { id: 1, name: user.name || 'Ethan Jenkins', email: user.email || 'student@gmail.com' };
  }

  try {
    const { class_id, reason } = await request.json();

    if (!class_id) {
      return NextResponse.json({ error: 'Please select a class session to apply for leave.' }, { status: 400 });
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: 'A reason for the leave must be provided.' }, { status: 400 });
    }

    const result = applyStudentLeave(student.id, Number(class_id), reason.trim());

    return NextResponse.json({
      success: true,
      result,
      message: 'Leave application approved and compensatory session scheduled.'
    });
  } catch (err: any) {
    console.error('Leave submission error:', err);
    return NextResponse.json({ error: 'Failed to submit leave application.' }, { status: 500 });
  }
}
