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

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized. Student access required.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User record not found.' }, { status: 404 });

  const student = getStudentByUserId(user.id);
  if (!student) return NextResponse.json({ error: 'Student profile not provisioned.' }, { status: 404 });

  const db = getDb();
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Enrolled subjects & session progress
  const enrollments = getEnrollmentsByStudentId(student.id);

  // 2. Today's classes with 15-minute Zoom visibility rule
  const rawTodayClasses = getClasses({
    student_id: student.id,
    date: todayStr
  });

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
  const upcomingClasses = getClasses({
    student_id: student.id,
    start_date: todayStr,
    status: 'scheduled',
    limit: 5
  });

  const nextClass = upcomingClasses.length > 0 ? upcomingClasses[0] : null;

  // 4. Unread messages in Teacher Box
  const unreadMessagesCount = (db.prepare(`
    SELECT COUNT(*) as count
    FROM teacher_box_messages
    WHERE receiver_user_id = ? AND is_read = 0
  `).get(user.id) as { count: number }).count;

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
