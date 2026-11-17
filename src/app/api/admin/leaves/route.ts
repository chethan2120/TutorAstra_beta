import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getAllLeaves } from '@/lib/db';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('student_id') ? Number(searchParams.get('student_id')) : undefined;

  const leaves = getAllLeaves(studentId);
  return NextResponse.json({ leaves });
}
