import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getSubjectById,
  createAssessment,
  getAssessmentById,
  submitAssessmentAnswers,
  sendTeacherBoxMessage,
  getDb
} from '@/lib/db';
import {
  validateStudyMaterial,
  generateMsVioletAssessment,
  evaluateWrittenAnswers
} from '@/lib/aiTutor';
import { sendBrandedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/student/ai-tutor:', e);
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
    console.error('Error resolving student in /api/student/ai-tutor:', e);
  }

  if (!student) {
    student = { id: 1, name: user.name || 'Ethan Jenkins' };
  }

  try {
    const body = await request.json();
    const { action } = body;

    // STEP 1-4: Generate Assessment based on uploaded document and subject
    if (action === 'generate') {
      const { subjectId, documentName, documentSize, pageCount, testType } = body;

      if (!subjectId) {
        return NextResponse.json({ error: 'Please select a subject.' }, { status: 400 });
      }

      // Backend validation of document: <= 3 pages, PDF or image
      const validation = validateStudyMaterial({
        name: documentName || 'Study_Notes.pdf',
        size: documentSize || 1024 * 50,
        pageCount: pageCount || 1
      });

      if (!validation.isValid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const subject = getSubjectById(Number(subjectId));
      const subjectName = subject ? subject.name : 'Science';

      const assessmentPlan = generateMsVioletAssessment({
        subjectName,
        documentName: documentName || 'Study_Notes.pdf',
        testType: testType === 'written' ? 'written' : 'mcq'
      });

      const questionsToStore = testType === 'written'
        ? assessmentPlan.writtenQuestions
        : assessmentPlan.mcqQuestions;

      const assessmentId = createAssessment({
        student_id: student.id,
        subject_id: Number(subjectId),
        title: assessmentPlan.title,
        document_name: documentName || 'Study_Notes.pdf',
        test_type: testType === 'written' ? 'written' : 'mcq',
        time_limit_minutes: assessmentPlan.timeLimitMinutes,
        questions_json: JSON.stringify(questionsToStore)
      });

      return NextResponse.json({
        success: true,
        assessmentId,
        testPlan: assessmentPlan
      });
    }

    // STEP 5-8: Submit Answers, evaluate server-side, save results, notify teacher
    else if (action === 'submit') {
      const { assessmentId, answers } = body;

      if (!assessmentId) {
        return NextResponse.json({ error: 'Assessment ID is required.' }, { status: 400 });
      }

      const assessment = getAssessmentById(Number(assessmentId));
      if (!assessment) {
        return NextResponse.json({ error: 'Assessment not found.' }, { status: 404 });
      }

      const questions = JSON.parse(assessment.questions_json || '[]');
      let score = 0;
      let maxScore = questions.length;
      let aiFeedback = '';

      if (assessment.test_type === 'mcq') {
        // Evaluate MCQs
        for (const q of questions) {
          const studentAns = Number(answers[q.id]);
          if (studentAns === q.correct) {
            score++;
          }
        }

        const percentage = Math.round((score / maxScore) * 100);
        if (percentage >= 80) {
          aiFeedback = `Splendid job! You scored ${score}/${maxScore} (${percentage}%). You have mastered the foundational derivations and avoided the examiner traps.`;
        } else if (percentage >= 50) {
          aiFeedback = `Good effort! You scored ${score}/${maxScore} (${percentage}%). Review the questions you missed and discuss the detailed explanations with your dedicated tutor.`;
        } else {
          aiFeedback = `You scored ${score}/${maxScore}. Let's reinforce the core formulas and concepts in your next 1-on-1 session.`;
        }
      } else {
        // Evaluate Written Answers against rubric
        const evalResult = evaluateWrittenAnswers(answers, questions);
        score = evalResult.score;
        maxScore = evalResult.maxScore;
        aiFeedback = evalResult.feedback;
      }

      // Persist results
      submitAssessmentAnswers(
        Number(assessmentId),
        JSON.stringify(answers),
        score,
        maxScore,
        aiFeedback
      );

      // Find student's assigned teacher for this subject
      const db = getDb();
      const enrollment = db.prepare(`
        SELECT teacher_id FROM student_enrollments
        WHERE student_id = ? AND subject_id = ? AND status = 'active'
      `).get(student.id, assessment.subject_id) as { teacher_id: number } | undefined;

      if (enrollment?.teacher_id) {
        const teacherProfile = db.prepare('SELECT user_id FROM teacher_profiles WHERE id = ?').get(enrollment.teacher_id) as { user_id: number } | undefined;
        if (teacherProfile) {
          // Notify teacher in Teacher Box
          sendTeacherBoxMessage({
            sender_user_id: user.id,
            receiver_user_id: teacherProfile.user_id,
            student_id: student.id,
            teacher_id: enrollment.teacher_id,
            subject_id: assessment.subject_id,
            message: `[Ms. Violet AI Report]: ${student.name} completed "${assessment.title}". Result: ${score}/${maxScore}. AI Evaluation: ${aiFeedback}`
          });
        }
      }

      // Send email report to student
      await sendBrandedEmail({
        toEmail: student.email,
        recipientName: student.name,
        templateType: 'ASSESSMENT_RESULT',
        data: {
          testTitle: assessment.title,
          subjectName: assessment.subject_name,
          score,
          maxScore,
          testType: assessment.test_type,
          aiFeedback
        }
      });

      return NextResponse.json({
        success: true,
        score,
        maxScore,
        percentage: Math.round((score / maxScore) * 100),
        aiFeedback,
        assessment: {
          id: assessment.id,
          title: assessment.title,
          test_type: assessment.test_type
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action. Must be "generate" or "submit".' }, { status: 400 });
  } catch (err: any) {
    console.error('AI Tutor error:', err);
    return NextResponse.json({ error: err.message || 'AI Tutor processing failed.' }, { status: 500 });
  }
}
