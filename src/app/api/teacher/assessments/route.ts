import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getTeacherByUserId,
  updateAssessmentTeacherReview,
  getAssessmentById,
  getDb
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/teacher/assessments:', e);
  }

  let user = getUserByEmail(session.email);
  if (!user) {
    user = {
      id: session.id || 3,
      email: session.email,
      name: session.name || 'Dr. Sarah Mitchell',
      role: session.role || 'teacher'
    };
  }

  let teacher: any = null;
  try {
    teacher = getTeacherByUserId(user.id);
    if (!teacher && db) {
      teacher = db.prepare('SELECT * FROM teacher_profiles ORDER BY id ASC LIMIT 1').get() as any;
    }
  } catch (e) {
    console.error('Error resolving teacher:', e);
  }

  if (!teacher) {
    teacher = { id: 1, name: user.name || 'Dr. Sarah Mitchell' };
  }

  let assessments: any[] = [];
  if (db) {
    try {
      assessments = db.prepare(`
        SELECT DISTINCT a.*, sub.name as subject_name, su.name as student_name, sp.grade
        FROM ai_assessments a
        JOIN subjects sub ON a.subject_id = sub.id
        JOIN student_profiles sp ON a.student_id = sp.id
        JOIN users su ON sp.user_id = su.id
        ORDER BY a.created_at DESC
        LIMIT 20
      `).all() as any[];
    } catch (e) {
      console.error('Error querying assessments for teacher:', e);
    }
  }

  return NextResponse.json({ assessments });
}

export async function PUT(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { assessmentId, teacherNotes } = await request.json();
    if (!assessmentId || !teacherNotes?.trim()) {
      return NextResponse.json({ error: 'Assessment ID and teacher notes are required.' }, { status: 400 });
    }

    updateAssessmentTeacherReview(Number(assessmentId), teacherNotes.trim());
    return NextResponse.json({ success: true, message: 'Teacher pedagogical review saved.' });
  } catch (err: any) {
    console.error('Error reviewing assessment:', err);
    return NextResponse.json({ error: 'Failed to record teacher review.' }, { status: 500 });
  }
}
