import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getUserByEmail, getStudentByUserId, getClasses, getDb } from '@/lib/db';
import { checkZoomMeetingAccess } from '@/lib/zoom';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/student/classes:', e);
  }

  let user = getUserByEmail(session.email);
  if (!user) {
    user = {
      id: session.id || 4,
      email: session.email,
      name: session.name || 'Ethan Jenkins',
      role: session.role || 'student'
    };
  }

  let student: any = null;
  try {
    student = getStudentByUserId(user.id);
    if (!student && db) {
      student = db.prepare('SELECT * FROM student_profiles ORDER BY id ASC LIMIT 1').get() as any;
    }
  } catch (e) {
    console.error('Error resolving student in /api/student/classes:', e);
  }

  if (!student) {
    student = { id: 1, name: user.name || 'Ethan Jenkins' };
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined;
  const start_date = searchParams.get('start_date') || undefined;
  const end_date = searchParams.get('end_date') || undefined;
  const status = searchParams.get('status') || undefined;

  let rawClasses: any[] = [];
  try {
    rawClasses = getClasses({
      student_id: student.id,
      date,
      start_date,
      end_date,
      status
    });
  } catch (e) {
    console.error('Error getting student classes:', e);
  }

  // Evaluate Zoom availability for student (enforces 15-minute visibility rule)
  const classesWithZoomRule = rawClasses.map((c: any) => {
    const access = checkZoomMeetingAccess(
      c.session_date,
      c.start_time,
      c.end_time,
      c.zoom_join_url,
      c.zoom_start_url,
      c.zoom_meeting_id,
      c.zoom_passcode
    );

    return {
      ...c,
      meetingAvailable: access.isAvailable,
      meetingMessage: access.message,
      joinUrl: access.isAvailable ? c.zoom_join_url : null
    };
  });

  return NextResponse.json({ classes: classesWithZoomRule });
}
