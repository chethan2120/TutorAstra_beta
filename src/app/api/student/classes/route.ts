import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getUserByEmail, getStudentByUserId, getClasses } from '@/lib/db';
import { checkZoomMeetingAccess } from '@/lib/zoom';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const student = getStudentByUserId(user.id);
  if (!student) return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined;
  const start_date = searchParams.get('start_date') || undefined;
  const end_date = searchParams.get('end_date') || undefined;
  const status = searchParams.get('status') || undefined;

  const rawClasses = getClasses({
    student_id: student.id,
    date,
    start_date,
    end_date,
    status
  });

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
      // Strictly expose attendee joinUrl ONLY when unlocked!
      joinUrl: access.isAvailable ? c.zoom_join_url : null
    };
  });

  return NextResponse.json({ classes: classesWithZoomRule });
}
