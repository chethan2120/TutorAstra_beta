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

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const teacherIdParam = searchParams.get('teacher_id') ? Number(searchParams.get('teacher_id')) : undefined;
  const dateParam = searchParams.get('date') || undefined;

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/calendar:', e);
  }

  let user = getUserByEmail(session.email);
  if (!user) {
    user = {
      id: session.id || 1,
      email: session.email,
      name: session.name || 'User',
      role: session.role || 'admin'
    };
  }

  // 1. STUDENT VIEW: ONLY that student's classes & details
  if (session.role === 'student') {
    let student = getStudentByUserId(user.id);
    if (!student && db) {
      student = db.prepare('SELECT * FROM student_profiles ORDER BY id ASC LIMIT 1').get() as any;
    }
    if (!student) {
      student = { id: 1, name: user.name || 'Ethan Jenkins' };
    }

    let rawClasses: any[] = [];
    try {
      rawClasses = getClasses({ student_id: student.id, date: dateParam });
    } catch (e) {
      console.error('Error getting student classes for calendar:', e);
    }

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
    let teacher = getTeacherByUserId(user.id);
    if (!teacher && db) {
      teacher = db.prepare('SELECT * FROM teacher_profiles ORDER BY id ASC LIMIT 1').get() as any;
    }
    if (!teacher) {
      teacher = { id: 1, name: user.name || 'Dr. Sarah Mitchell' };
    }

    let rawClasses: any[] = [];
    try {
      rawClasses = getClasses({ teacher_id: teacher.id, date: dateParam });
    } catch (e) {
      console.error('Error getting teacher classes for calendar:', e);
    }

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

    let freeHours: any[] = [];
    try {
      freeHours = getTeacherFreeHours(teacher.id);
    } catch (e) {
      console.error('Error getting teacher free hours:', e);
    }

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
    let rawClasses: any[] = [];
    try {
      rawClasses = getClasses({ teacher_id: teacherIdParam, date: dateParam });
    } catch (e) {
      console.error('Error getting admin classes for calendar:', e);
    }

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

    let freeHours: any[] = [];
    try {
      freeHours = getTeacherFreeHours(teacherIdParam).map((fh: any) => ({
        ...fh,
        statusType: 'free'
      }));
    } catch (e) {
      console.error('Error getting free hours for admin calendar:', e);
    }

    let teachers: any[] = [];
    try {
      teachers = getAllTeachers();
    } catch (e) {
      console.error('Error getting teachers for admin calendar:', e);
    }

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

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/calendar POST:', e);
  }

  let user = getUserByEmail(session.email);
  if (!user) {
    user = {
      id: session.id || 1,
      email: session.email,
      name: session.name || 'User',
      role: session.role || 'admin'
    };
  }

  try {
    const { action, teacher_id, date, day_of_week, start_time, end_time, free_hour_id, note } = await request.json();

    if (action === 'delete') {
      if (!free_hour_id) return NextResponse.json({ error: 'Free hour ID is required.' }, { status: 400 });
      deleteTeacherFreeHour(Number(free_hour_id));
      return NextResponse.json({ success: true, message: 'Free hour removed.' });
    }

    // Default action: add free hour
    let targetTeacherId = teacher_id ? Number(teacher_id) : undefined;
    if (session.role === 'teacher') {
      let teacher = getTeacherByUserId(user.id);
      if (!teacher && db) {
        teacher = db.prepare('SELECT * FROM teacher_profiles ORDER BY id ASC LIMIT 1').get() as any;
      }
      if (!teacher) {
        targetTeacherId = 1;
      } else {
        targetTeacherId = teacher.id;
      }
    }

    if (!targetTeacherId || !start_time || !end_time) {
      return NextResponse.json({ error: 'Teacher ID, start time, and end time are required.' }, { status: 400 });
    }

    const calculatedDayOfWeek = day_of_week !== undefined ? Number(day_of_week) : (date ? new Date(date).getDay() : 1);

    const newId = addTeacherFreeHour({
      teacher_id: targetTeacherId,
      day_of_week: calculatedDayOfWeek,
      start_time,
      end_time,
      note: note || 'Available for 1-on-1'
    });

    return NextResponse.json({ success: true, id: newId, message: 'Free hour scheduled successfully.' });
  } catch (err: any) {
    console.error('Calendar POST error:', err);
    return NextResponse.json({ error: err.message || 'Operation failed.' }, { status: 500 });
  }
}
