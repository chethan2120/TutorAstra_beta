import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getUserByEmail, getTeacherByUserId, getClasses } from '@/lib/db';
import { checkZoomMeetingAccess } from '@/lib/zoom';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const teacher = getTeacherByUserId(user.id);
  if (!teacher) return NextResponse.json({ error: 'Teacher profile not found.' }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined;
  const start_date = searchParams.get('start_date') || undefined;
  const end_date = searchParams.get('end_date') || undefined;
  const status = searchParams.get('status') || undefined;

  const rawClasses = getClasses({
    teacher_id: teacher.id,
    date,
    start_date,
    end_date,
    status
  });

  // Evaluate Zoom availability for each class (enforcing 15-minute visibility rule)
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
      // Only expose host/join start url when available per the 15-minute rule!
      joinUrl: access.isAvailable ? c.zoom_start_url || c.zoom_join_url : null
    };
  });

  return NextResponse.json({ classes: classesWithZoomRule });
}
