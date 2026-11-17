import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getTeacherByUserId,
  getStudentById,
  getClasses,
  getDb
} from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const teacher = getTeacherByUserId(user.id);
  if (!teacher) return NextResponse.json({ error: 'Teacher profile not found.' }, { status: 404 });

  const studentId = Number(params.id);
  const student = getStudentById(studentId);
  if (!student) {
    return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
  }

  const db = getDb();

  // STRICT PERMISSION CHECK: Verify student is assigned to this teacher
  if (session.role === 'teacher') {
    const enrollment = db.prepare(`
      SELECT id FROM student_enrollments
      WHERE student_id = ? AND teacher_id = ?
    `).get(studentId, teacher.id);

    if (!enrollment) {
      return NextResponse.json({
        error: 'Forbidden. You do not have permission to view private students assigned to other faculty.'
      }, { status: 403 });
    }
  }

  // Enrolled subjects with this teacher
  const enrollments = db.prepare(`
    SELECT se.*, sub.name as subject_name, sub.code as subject_code, sub.color as subject_color,
           (SELECT COUNT(*) FROM scheduled_classes sc WHERE sc.enrollment_id = se.id) as scheduled_count,
           (SELECT COUNT(*) FROM scheduled_classes sc WHERE sc.enrollment_id = se.id AND sc.status = 'completed') as completed_count
    FROM student_enrollments se
    JOIN subjects sub ON se.subject_id = sub.id
    WHERE se.student_id = ? AND se.teacher_id = ?
  `).all(studentId, teacher.id);

  // Scheduled sessions with this teacher
  const sessions = getClasses({
    student_id: studentId,
    teacher_id: teacher.id
  });

  // Leaves for classes with this teacher
  const leaves = db.prepare(`
    SELECT sl.*, sc.session_date, sc.start_time, sc.title as class_title, sub.name as subject_name
    FROM student_leaves sl
    JOIN scheduled_classes sc ON sl.class_id = sc.id
    JOIN subjects sub ON sl.subject_id = sub.id
    WHERE sl.student_id = ? AND sc.teacher_id = ?
    ORDER BY sl.requested_at DESC
  `).all(studentId, teacher.id);

  // Relevant assessment history
  const assessments = db.prepare(`
    SELECT a.*, sub.name as subject_name
    FROM ai_assessments a
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE a.student_id = ?
    ORDER BY a.created_at DESC
  `).all(studentId);

  // Shared files in Teacher Box
  const files = db.prepare(`
    SELECT id, message, attachment_name, attachment_url, attachment_type, attachment_size, created_at, sender_user_id
    FROM teacher_box_messages
    WHERE ((sender_user_id = ? AND receiver_user_id = ?) OR (sender_user_id = ? AND receiver_user_id = ?))
      AND attachment_name != '' AND attachment_name IS NOT NULL
    ORDER BY created_at DESC
  `).all(user.id, student.user_id, student.user_id, user.id);

  return NextResponse.json({
    student: {
      id: student.id,
      userId: student.user_id,
      name: student.name,
      email: student.email,
      parentName: student.parent_name,
      parentPhone: student.parent_phone,
      grade: student.grade,
      curriculum: student.curriculum,
      timezone: student.timezone
    },
    enrollments,
    sessions,
    leaves,
    assessments,
    files
  });
}
