import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getUserByEmail, getTeacherByUserId, getDb } from '@/lib/db';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const teacher = getTeacherByUserId(user.id);
  if (!teacher) return NextResponse.json({ error: 'Teacher profile not found.' }, { status: 404 });

  const db = getDb();
  // Fetch only students assigned to this teacher
  const students = db.prepare(`
    SELECT DISTINCT sp.id, su.name, su.email, sp.grade, sp.curriculum, sp.parent_name, sp.parent_phone,
      (SELECT COUNT(*) FROM scheduled_classes sc WHERE sc.student_id = sp.id AND sc.teacher_id = ?) as total_classes_with_me,
      (SELECT COUNT(*) FROM scheduled_classes sc WHERE sc.student_id = sp.id AND sc.teacher_id = ? AND sc.status = 'completed') as completed_with_me
    FROM student_enrollments se
    JOIN student_profiles sp ON se.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    WHERE se.teacher_id = ? AND se.status = 'active'
    ORDER BY su.name ASC
  `).all(teacher.id, teacher.id, teacher.id);

  return NextResponse.json({ students });
}
