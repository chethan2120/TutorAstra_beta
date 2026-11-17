import { NextResponse } from 'next/server';
import { verifyUserCredentials, logActivity } from '@/lib/db';
import { signSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = verifyUserCredentials(email.trim().toLowerCase(), password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Role-based target dashboard
    let redirectUrl = '/admin/dashboard';
    if (user.role === 'teacher') {
      redirectUrl = '/teacher/dashboard';
    } else if (user.role === 'student') {
      redirectUrl = '/student/dashboard';
    }

    // Create session token with user id
    const token = signSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    setSessionCookie(token);
    logActivity(user.email, 'LOGIN', 'auth', String(user.id), `${user.role.toUpperCase()} logged in successfully`);

    return NextResponse.json({
      success: true,
      redirectUrl,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
