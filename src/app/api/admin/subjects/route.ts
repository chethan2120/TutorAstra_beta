import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getAllSubjects, createSubject } from '@/lib/db';

export async function GET() {
  const subjects = getAllSubjects();
  return NextResponse.json({ subjects });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { name, code, description, color } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Subject name is required.' }, { status: 400 });
    }
    const id = createSubject({ name, code, description, color });
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create subject.' }, { status: 500 });
  }
}
