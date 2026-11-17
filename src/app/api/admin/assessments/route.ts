import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getAllAssessments } from '@/lib/db';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const assessments = getAllAssessments(100);
  return NextResponse.json({ assessments });
}
