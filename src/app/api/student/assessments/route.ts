import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getStudentAssessments
} from '@/lib/db';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const student = getStudentByUserId(user.id);
  if (!student) return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });

  const assessments = getStudentAssessments(student.id);
  return NextResponse.json({ assessments });
}
