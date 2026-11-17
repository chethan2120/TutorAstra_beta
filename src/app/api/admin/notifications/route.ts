import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getAllEmailLogs, logActivity, getDb } from '@/lib/db';
import { sendBrandedEmail } from '@/lib/email';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const logs = getAllEmailLogs(100);
  return NextResponse.json({ logs });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { logId } = await request.json();
    if (!logId) {
      return NextResponse.json({ error: 'Log ID is required for retry.' }, { status: 400 });
    }

    const db = getDb();
    const log = db.prepare('SELECT * FROM email_logs WHERE id = ?').get(logId) as any;
    if (!log) {
      return NextResponse.json({ error: 'Email log not found.' }, { status: 404 });
    }

    let payloadData = {};
    try {
      payloadData = JSON.parse(log.payload_json || '{}');
    } catch (e) {
      // ignore
    }

    // Trigger retry
    await sendBrandedEmail({
      toEmail: log.recipient_email,
      recipientName: log.recipient_name,
      templateType: log.template_type,
      data: payloadData
    });

    logActivity(session.email, 'RETRY_EMAIL', 'email_log', String(logId), `Retried notification to ${log.recipient_email}`);

    return NextResponse.json({ success: true, message: 'Notification resent successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Retry failed.' }, { status: 500 });
  }
}
