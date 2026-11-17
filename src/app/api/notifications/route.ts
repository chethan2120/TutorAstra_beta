import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getPortalNotifications,
  createPortalNotification,
  deletePortalNotification,
  logActivity,
  getUserByEmail
} from '@/lib/db';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const notifications = getPortalNotifications(session.role);
  return NextResponse.json({ notifications });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { title, message, target_audience, priority } = await request.json();
    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required.' }, { status: 400 });
    }

    const user = getUserByEmail(session.email);
    const senderId = user ? user.id : 1;

    const notifId = createPortalNotification({
      sender_user_id: senderId,
      target_audience: target_audience || 'all',
      title: title.trim(),
      message: message.trim(),
      priority: priority || 'normal'
    });

    logActivity(
      session.email,
      'BROADCAST_NOTIFICATION',
      'notification',
      String(notifId),
      `Broadcasted notice "${title}" to ${target_audience || 'all'}`
    );

    return NextResponse.json({
      success: true,
      message: 'Notification successfully broadcasted to everyone.',
      id: notifId
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to dispatch notification.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Notification ID required.' }, { status: 400 });
    }

    deletePortalNotification(id);
    return NextResponse.json({ success: true, message: 'Notification removed.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete.' }, { status: 500 });
  }
}
