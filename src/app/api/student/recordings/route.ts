import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getStudentRecordings,
  markRecordingConsumed
} from '@/lib/db';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const student = getStudentByUserId(user.id);
  if (!student) return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });

  const recordings = getStudentRecordings(student.id);
  return NextResponse.json({ recordings });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const student = getStudentByUserId(user.id);
  if (!student) return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });

  try {
    const { recordingId } = await request.json();
    if (!recordingId) {
      return NextResponse.json({ error: 'Recording ID is required.' }, { status: 400 });
    }

    markRecordingConsumed(Number(recordingId), student.id);
    return NextResponse.json({
      success: true,
      message: 'Recording playback completed. Single-watch policy applied; recording archived.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update recording.' }, { status: 500 });
  }
}
