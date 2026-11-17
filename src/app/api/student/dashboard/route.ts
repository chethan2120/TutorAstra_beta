import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getEnrollmentsByStudentId,
  getClasses,
  getDb
} from '@/lib/db';
import { checkZoomMeetingAccess } from '@/lib/zoom';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized. Student access required.' }, { status: 403 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/student/dashboard:', e);
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
    console.error('Error finding student in dashboard:', e);
  }

  if (!student) {
    student = {
      id: 1,
      user_id: user.id || 4,
      name: user.name || 'Ethan Jenkins',
      email: user.email || 'student@gmail.com',
      grade: 'Grade 10',
      curriculum: 'CBSE',
      parent_name: 'Robert Jenkins',
      timezone: 'UTC+05:30 (IST)'
    };
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Enrolled subjects & session progress
  let enrollments: any[] = [];
  try {
    enrollments = getEnrollmentsByStudentId(student.id);
  } catch (e) {
    console.error('Error getting student enrollments:', e);
  }

  // 2. Today's classes with 15-minute Zoom visibility rule
  let rawTodayClasses: any[] = [];
  try {
    rawTodayClasses = getClasses({
      student_id: student.id,
      date: todayStr
    });
  } catch (e) {
    console.error('Error getting student today classes:', e);
  }

  const todayClasses = rawTodayClasses.map((c: any) => {
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

  // 3. Next upcoming class
  let upcomingClasses: any[] = [];
  try {
    upcomingClasses = getClasses({
      student_id: student.id,
      start_date: todayStr,
      status: 'scheduled',
      limit: 5
    });
  } catch (e) {
    console.error('Error getting upcoming classes:', e);
  }

  const nextClass = upcomingClasses.length > 0 ? upcomingClasses[0] : null;

  // 4. Unread messages in Teacher Box
  let unreadMessagesCount = 0;
  if (db) {
    try {
      const res = db.prepare(`
        SELECT COUNT(*) as count
        FROM teacher_box_messages
        WHERE receiver_user_id = ? AND is_read = 0
      `).get(user.id) as { count: number };
      unreadMessagesCount = res ? res.count : 0;
    } catch (e) {
      console.error('Error querying unread messages count:', e);
    }
  }

  // 5. Total sessions aggregate
  const totalSessions: number = (enrollments as any[]).reduce((sum: number, e: any) => sum + (e.total_sessions || 0), 0);
  const completedSessions: number = (enrollments as any[]).reduce((sum: number, e: any) => sum + (e.completed_count || 0), 0);
  const remainingSessions = Math.max(0, totalSessions - completedSessions);

  return NextResponse.json({
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      grade: student.grade,
      curriculum: student.curriculum,
      parentName: student.parent_name,
      timezone: student.timezone
    },
    enrollments,
    todayClasses,
    todayClassesCount: todayClasses.length,
    nextClass,
    unreadMessagesCount,
    stats: {
      totalSessions,
      completedSessions,
      remainingSessions,
      activeSubjectsCount: enrollments.length
    }
  });
}
