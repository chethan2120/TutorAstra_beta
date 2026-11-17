import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getTeacherByUserId,
  getClasses,
  getTeacherFreeHours,
  addTeacherFreeHour,
  deleteTeacherFreeHour,
  getAllTeachers,
  getDb
} from '@/lib/db';
import { checkZoomMeetingAccess } from '@/lib/zoom';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const teacherIdParam = searchParams.get('teacher_id') ? Number(searchParams.get('teacher_id')) : undefined;
  const dateParam = searchParams.get('date') || undefined;

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  // 1. STUDENT VIEW: ONLY that student's classes & details
  if (session.role === 'student') {
    const student = getStudentByUserId(user.id);
    if (!student) return NextResponse.json({ error: 'Student not found.' }, { status: 404 });

    const rawClasses = getClasses({ student_id: student.id, date: dateParam });
    const classes = rawClasses.map((c: any) => {
      const zoom = checkZoomMeetingAccess(
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
        isUnlocked: zoom.isAvailable,
        joinUrl: zoom.isAvailable ? c.zoom_join_url : null,
        meetingMessage: zoom.message
      };
    });

    return NextResponse.json({
      role: 'student',
      studentName: student.name,
      classes,
      freeHours: []
    });
  }

  // 2. TEACHER VIEW: ONLY that teacher's classes & free hours
  if (session.role === 'teacher') {
    const teacher = getTeacherByUserId(user.id);
    if (!teacher) return NextResponse.json({ error: 'Teacher profile not found.' }, { status: 404 });

    const rawClasses = getClasses({ teacher_id: teacher.id, date: dateParam });
    const classes = rawClasses.map((c: any) => {
      const zoom = checkZoomMeetingAccess(
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
        isUnlocked: zoom.isAvailable,
        hostUrl: zoom.isAvailable ? c.zoom_start_url : null,
        meetingMessage: zoom.message
      };
    });

    const freeHours = getTeacherFreeHours(teacher.id);

    return NextResponse.json({
      role: 'teacher',
      teacherId: teacher.id,
      teacherName: teacher.name,
      classes,
      freeHours
    });
  }

  // 3. ADMIN VIEW: Full Calendar showing which teacher is free & which is taking class
  if (session.role === 'admin') {
    const rawClasses = getClasses({ teacher_id: teacherIdParam, date: dateParam });
    const classes = rawClasses.map((c: any) => {
      const zoom = checkZoomMeetingAccess(
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
        isUnlocked: zoom.isAvailable,
        joinUrl: c.zoom_join_url,
        hostUrl: c.zoom_start_url,
        statusType: 'taking_class'
      };
    });

    const freeHours = getTeacherFreeHours(teacherIdParam).map((fh: any) => ({
      ...fh,
      statusType: 'free'
    }));

    const teachers = getAllTeachers();

    return NextResponse.json({
      role: 'admin',
      classes,
      freeHours,
      teachers
    });
  }

  return NextResponse.json({ error: 'Unknown role.' }, { status: 400 });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'admin' && session.role !== 'teacher')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { teacher_id, day_of_week, start_time, end_time, note } = await request.json();
    if (!teacher_id || day_of_week === undefined || !start_time || !end_time) {
      return NextResponse.json({ error: 'Teacher, day of week, and start/end time are required.' }, { status: 400 });
    }

    addTeacherFreeHour({
      teacher_id: Number(teacher_id),
      day_of_week: Number(day_of_week),
      start_time,
      end_time,
      note
    });

    return NextResponse.json({ success: true, message: 'Free slot added successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add free slot.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'admin' && session.role !== 'teacher')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Slot ID required.' }, { status: 400 });

    deleteTeacherFreeHour(id);
    return NextResponse.json({ success: true, message: 'Free slot removed.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to remove slot.' }, { status: 500 });
  }
}
