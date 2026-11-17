import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getTeacherByUserId,
  updateAssessmentTeacherReview,
  getAssessmentById,
  getDb
} from '@/lib/db';

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
  // Fetch assessments for students enrolled with this teacher
  const assessments = db.prepare(`
    SELECT DISTINCT a.*, sub.name as subject_name, su.name as student_name, sp.grade
    FROM ai_assessments a
    JOIN subjects sub ON a.subject_id = sub.id
    JOIN student_profiles sp ON a.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    JOIN student_enrollments se ON se.student_id = sp.id
    WHERE se.teacher_id = ?
    ORDER BY a.created_at DESC
  `).all(teacher.id);

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

    const current = getAssessmentById(Number(assessmentId));
    if (!current) {
      return NextResponse.json({ error: 'Assessment not found.' }, { status: 404 });
    }

    updateAssessmentTeacherReview(Number(assessmentId), teacherNotes.trim());
    return NextResponse.json({ success: true, message: 'Teacher feedback recorded successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update review.' }, { status: 500 });
  }
}
