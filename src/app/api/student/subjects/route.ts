import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getEnrollmentsByStudentId,
  getClasses,
  getDb
} from '@/lib/db';

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
  const enrollmentId = searchParams.get('enrollment_id') ? Number(searchParams.get('enrollment_id')) : undefined;
  const subjectId = searchParams.get('subject_id') ? Number(searchParams.get('subject_id')) : undefined;

  // If viewing all subjects
  if (!enrollmentId && !subjectId) {
    const enrollments = getEnrollmentsByStudentId(student.id);
    return NextResponse.json({ enrollments });
  }

  // If viewing a specific enrolled subject: return all sessions individually (e.g. all 50 sessions)
  const db = getDb();
  let query = `
    SELECT sc.*, sub.name as subject_name, sub.color as subject_color,
           tu.name as teacher_name
    FROM scheduled_classes sc
    JOIN subjects sub ON sc.subject_id = sub.id
    JOIN teacher_profiles tp ON sc.teacher_id = tp.id
    JOIN users tu ON tp.user_id = tu.id
    WHERE sc.student_id = ?
  `;
  const params: any[] = [student.id];

  if (enrollmentId) {
    query += ' AND sc.enrollment_id = ?';
    params.push(enrollmentId);
  } else if (subjectId) {
    query += ' AND sc.subject_id = ?';
    params.push(subjectId);
  }

  query += ' ORDER BY sc.session_number ASC';
  const sessions = db.prepare(query).all(...params);

  // Get enrollment metadata
  const enrollment = enrollmentId
    ? db.prepare(`
        SELECT se.*, sub.name as subject_name, sub.code as subject_code, sub.color as subject_color,
               tu.name as teacher_name, t.qualification as teacher_qualification
        FROM student_enrollments se
        JOIN subjects sub ON se.subject_id = sub.id
        LEFT JOIN teacher_profiles t ON se.teacher_id = t.id
        LEFT JOIN users tu ON t.user_id = tu.id
        WHERE se.id = ? AND se.student_id = ?
      `).get(enrollmentId, student.id)
    : null;

  return NextResponse.json({
    enrollment,
    sessions,
    totalSessions: sessions.length
  });
}
