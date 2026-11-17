import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { updateUser, updateUserPassword, getUserById, logActivity, getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const userId = Number(params.id);
  const targetUser = getUserById(userId);
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, email, role, is_active, resetPassword } = body;

    if (resetPassword) {
      updateUserPassword(targetUser.email, resetPassword.trim());
      logActivity(session.email, 'RESET_PASSWORD', 'user', String(userId), `Reset password for user ${targetUser.email}`);
    }

    updateUser(userId, { name, email, role, is_active });
    logActivity(session.email, 'UPDATE_USER', 'user', String(userId), `Updated user details for ${targetUser.email}`);

    return NextResponse.json({ success: true, message: 'User updated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update user.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const userId = Number(params.id);
  const targetUser = getUserById(userId);
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  if (targetUser.email === session.email) {
    return NextResponse.json({ error: 'Cannot delete your own administrative account.' }, { status: 400 });
  }

  try {
    const db = getDb();
    db.prepare('UPDATE users SET is_active = 0 WHERE id = ?').run(userId);
    logActivity(session.email, 'DEACTIVATE_USER', 'user', String(userId), `Deactivated account ${targetUser.email}`);
    return NextResponse.json({ success: true, message: 'Account deactivated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to deactivate user.' }, { status: 500 });
  }
}
