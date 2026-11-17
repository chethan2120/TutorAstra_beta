import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getAccountPermissions, updateAccountPermissions, logActivity } from '@/lib/db';

export async function GET() {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const studentPerms = getAccountPermissions('student');
  const teacherPerms = getAccountPermissions('teacher');

  return NextResponse.json({ studentPerms, teacherPerms });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { studentPerms, teacherPerms } = await request.json();

    if (studentPerms) {
      updateAccountPermissions('student', studentPerms);
    }
    if (teacherPerms) {
      updateAccountPermissions('teacher', teacherPerms);
    }

    logActivity(session.email, 'UPDATE_RBAC_PERMISSIONS', 'security', 'system', 'Updated account role access permissions');

    return NextResponse.json({ success: true, message: 'Permissions successfully updated.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update permissions.' }, { status: 500 });
  }
}
