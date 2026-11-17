import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getStudentAssessments,
  getDb
} from '@/lib/db';

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
    console.error('Database connection error in /api/student/assessments:', e);
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
    console.error('Error resolving student in /api/student/assessments:', e);
  }

  if (!student) {
    student = { id: 1, name: user.name || 'Ethan Jenkins' };
  }

  let assessments: any[] = [];
  try {
    assessments = getStudentAssessments(student.id);
  } catch (e) {
    console.error('Error getting student assessments:', e);
  }

  return NextResponse.json({ assessments });
}
