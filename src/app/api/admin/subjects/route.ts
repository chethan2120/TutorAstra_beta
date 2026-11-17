import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getAllSubjects, createSubject, deleteSubject } from '@/lib/db';

export const dynamic = 'force-dynamic';

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

export async function DELETE(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'Subject ID is required.' }, { status: 400 });
    }
    deleteSubject(id);
    return NextResponse.json({ success: true, message: 'Subject deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete subject.' }, { status: 500 });
  }
}
