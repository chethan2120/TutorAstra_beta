import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getDb,
  getTeacherFreeHours
} from '@/lib/db';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const student = getStudentByUserId(user.id);
  if (!student) return NextResponse.json({ error: 'Student not found.' }, { status: 404 });

  const db = getDb();

  // Find all teachers assigned to this student through enrollments or scheduled classes
  const teachers = db.prepare(`
    SELECT DISTINCT
      tp.id,
      tp.user_id,
      tp.name,
      tp.email,
      tp.qualification,
      tp.specialization,
      tp.experience_years,
      tp.bio,
      tp.hourly_rate,
      tp.zoom_start_url
    FROM teacher_profiles tp
    WHERE tp.id IN (
      SELECT DISTINCT se.teacher_id FROM student_enrollments se WHERE se.student_id = ? AND se.teacher_id IS NOT NULL
      UNION
      SELECT DISTINCT sc.teacher_id FROM scheduled_classes sc WHERE sc.student_id = ?
    )
  `).all(student.id, student.id) as any[];

  // For each teacher, get their subjects handled, next upcoming class with this student, and free hours
  const detailedTeachers = teachers.map((t) => {
    // Subjects handled for this student
    const subjects = db.prepare(`
      SELECT DISTINCT s.id, s.name, s.code, s.color
      FROM student_enrollments se
      JOIN subjects s ON se.subject_id = s.id
      WHERE se.student_id = ? AND se.teacher_id = ?
    `).all(student.id, t.id);

    // Next scheduled class with this student
    const nextClass = db.prepare(`
      SELECT sc.*, s.name as subject_name
      FROM scheduled_classes sc
      JOIN subjects s ON sc.subject_id = s.id
      WHERE sc.student_id = ? AND sc.teacher_id = ? AND sc.session_date >= date('now') AND sc.status = 'scheduled'
      ORDER BY sc.session_date ASC, sc.start_time ASC
      LIMIT 1
    `).get(student.id, t.id);

    // Free hours availability
    const freeHours = getTeacherFreeHours(t.id);

    return {
      ...t,
      subjects: subjects.length > 0 ? subjects : [{ name: 'CBSE Science & Physics', code: 'SCI10', color: '#6425C5' }],
      nextClass,
      freeHours
    };
  });

  return NextResponse.json({
    studentId: student.id,
    studentName: student.name,
    teachers: detailedTeachers
  });
}
