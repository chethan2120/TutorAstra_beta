import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getUserByEmail, getTeacherByUserId, getClasses, getDb } from '@/lib/db';
import { checkZoomMeetingAccess } from '@/lib/zoom';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized. Teacher access required.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) {
    return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
  }

  const teacher = getTeacherByUserId(user.id);
  if (!teacher) {
    return NextResponse.json({ error: 'Teacher profile not provisioned.' }, { status: 404 });
  }

  const db = getDb();
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. What classes do I have today?
  const todayClassesRaw = getClasses({
    teacher_id: teacher.id,
    date: todayStr
  });

  const todayClasses = todayClassesRaw.map((c: any) => {
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
      joinUrl: access.isAvailable ? c.zoom_start_url || c.zoom_join_url : null
    };
  });

  // 2. Next upcoming class
  const upcomingClasses = getClasses({
    teacher_id: teacher.id,
    start_date: todayStr,
    status: 'scheduled',
    limit: 5
  });

  const nextClass = upcomingClasses.length > 0 ? upcomingClasses[0] : null;

  // 3. Assigned students count & list
  const assignedStudents = db.prepare(`
    SELECT DISTINCT sp.id as student_id, su.name as student_name, su.email as student_email,
           sp.grade, sp.curriculum, sub.name as subject_name
    FROM student_enrollments se
    JOIN student_profiles sp ON se.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    JOIN subjects sub ON se.subject_id = sub.id
    WHERE se.teacher_id = ? AND se.status = 'active'
    ORDER BY su.name ASC
  `).all(teacher.id) as any[];

  // 4. Unread messages count in Teacher Box
  const unreadMessagesCount = (db.prepare(`
    SELECT COUNT(*) as count
    FROM teacher_box_messages
    WHERE receiver_user_id = ? AND is_read = 0
  `).get(user.id) as { count: number }).count;

  // 5. Pending leaves for teacher's classes
  const pendingLeaves = db.prepare(`
    SELECT l.*, c.session_date, c.start_time, c.title as class_title, su.name as student_name
    FROM student_leaves l
    JOIN scheduled_classes c ON l.class_id = c.id
    JOIN student_profiles sp ON l.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    WHERE c.teacher_id = ?
    ORDER BY l.requested_at DESC
    LIMIT 5
  `).all(teacher.id);

  return NextResponse.json({
    teacher: {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      qualification: teacher.qualification
    },
    todayClasses,
    todayClassesCount: todayClasses.length,
    nextClass,
    assignedStudents,
    assignedStudentsCount: assignedStudents.length,
    unreadMessagesCount,
    pendingLeaves
  });
}
