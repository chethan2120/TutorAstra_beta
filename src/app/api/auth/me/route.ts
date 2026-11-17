import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getUserByEmail, getStudentByUserId, getTeacherByUserId } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  let user = getUserByEmail(session.email);
  if (!user) {
    user = {
      id: session.id || 2,
      email: session.email,
      name: session.name || 'Portal User',
      role: session.role || 'admin',
      is_active: 1
    };
  }

  let profile = null;
  try {
    if (user.role === 'student') {
      profile = getStudentByUserId(user.id);
    } else if (user.role === 'teacher') {
      profile = getTeacherByUserId(user.id);
    }
  } catch (e) {
    console.error('Error fetching profile in /api/auth/me:', e);
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
