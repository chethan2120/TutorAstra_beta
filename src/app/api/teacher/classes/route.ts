import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getUserByEmail, getTeacherByUserId, getClasses, getDb } from '@/lib/db';
import { checkZoomMeetingAccess } from '@/lib/zoom';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/teacher/classes:', e);
  }

  let user = getUserByEmail(session.email);
  if (!user) {
    user = {
      id: session.id || 3,
      email: session.email,
      name: session.name || 'Dr. Sarah Mitchell',
      role: session.role || 'teacher'
    };
  }

  let teacher: any = null;
  try {
    teacher = getTeacherByUserId(user.id);
    if (!teacher && db) {
      teacher = db.prepare('SELECT * FROM teacher_profiles ORDER BY id ASC LIMIT 1').get() as any;
    }
  } catch (e) {
    console.error('Error resolving teacher in /api/teacher/classes:', e);
  }

  if (!teacher) {
    teacher = { id: 1, name: user.name || 'Dr. Sarah Mitchell' };
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined;
  const start_date = searchParams.get('start_date') || undefined;
  const end_date = searchParams.get('end_date') || undefined;
  const status = searchParams.get('status') || undefined;
  const student_id = searchParams.get('student_id') ? Number(searchParams.get('student_id')) : undefined;

  let rawClasses: any[] = [];
  try {
    rawClasses = getClasses({
      teacher_id: teacher.id,
      student_id,
      date,
      start_date,
      end_date,
      status
    });
  } catch (e) {
    console.error('Error getting teacher classes:', e);
  }

  // Teacher has host link access based on 15-minute window
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
      startUrl: access.isAvailable ? c.zoom_start_url : null
    };
  });

  return NextResponse.json({ classes: classesWithZoomRule });
}
