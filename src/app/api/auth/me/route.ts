import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getUserByEmail, getStudentByUserId, getTeacherByUserId } from '@/lib/db';

export async function GET() {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = getUserByEmail(session.email);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  let profile = null;
  if (user.role === 'student') {
    profile = getStudentByUserId(user.id);
  } else if (user.role === 'teacher') {
    profile = getTeacherByUserId(user.id);
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profileId: profile?.id || null,
      profile
    }
  });
}
