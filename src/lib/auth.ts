import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'tutorastra_super_secret_session_key_2026';
const COOKIE_NAME = 'ednxt_admin_session';

export interface UserSession {
  id?: number;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student' | string;
  exp: number;
}

export type AdminSession = UserSession;

export function signSession(payload: Omit<UserSession, 'exp'>): string {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const data = JSON.stringify({ ...payload, exp });
  const encoded = Buffer.from(data).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifySession(token: string): UserSession | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;

    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
    if (signature !== expectedSignature) return null;

    const json = Buffer.from(encoded, 'base64url').toString('utf8');
    const session = JSON.parse(json) as UserSession;

    if (Date.now() / 1000 > session.exp) {
      return null; // Expired
    }

    return session;
  } catch (e) {
    return null;
  }
}

export function getCurrentSession(): UserSession | null {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function setSessionCookie(sessionToken: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
}
