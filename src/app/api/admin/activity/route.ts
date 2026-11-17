import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getRecentActivities } from '@/lib/db';

export async function GET() {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const activities = getRecentActivities(50);
  return NextResponse.json({ activities });
}
