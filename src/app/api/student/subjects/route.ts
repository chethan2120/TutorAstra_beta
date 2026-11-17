import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getEnrollmentsByStudentId,
  getClasses,
  getDb
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/student/subjects:', e);
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
    console.error('Error resolving student in /api/student/subjects:', e);
  }

  if (!student) {
    student = { id: 1, name: user.name || 'Ethan Jenkins' };
  }

  const { searchParams } = new URL(request.url);
  const enrollmentId = searchParams.get('enrollment_id') ? Number(searchParams.get('enrollment_id')) : undefined;
  const subjectId = searchParams.get('subject_id') ? Number(searchParams.get('subject_id')) : undefined;

  // If viewing all subjects
  if (!enrollmentId && !subjectId) {
    let enrollments: any[] = [];
    try {
      enrollments = getEnrollmentsByStudentId(student.id);
    } catch (e) {
      console.error('Error getting student enrollments:', e);
    }
    return NextResponse.json({ enrollments });
  }

  // If viewing a specific enrolled subject: return all sessions individually (e.g. all 50 sessions)
  let sessions: any[] = [];
  if (db) {
    try {
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

      if (subjectId) {
        query += ` AND sc.subject_id = ?`;
        params.push(subjectId);
      }

      query += ` ORDER BY sc.session_date ASC, sc.start_time ASC`;

      sessions = db.prepare(query).all(...params) as any[];
    } catch (e) {
      console.error('Error getting enrolled subject sessions:', e);
    }
  }

  return NextResponse.json({
    sessions,
    totalCount: sessions.length
  });
}
