import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  batchGenerateSchedule,
  confirmBatchSchedule,
  logActivity,
  getEnrollmentById,
  getStudentById,
  getTeacherById
} from '@/lib/db';
import { sendBrandedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'preview') {
      const {
        enrollment_id,
        student_id,
        teacher_id,
        subject_id,
        total_sessions,
        days_of_week,
        start_time,
        end_time,
        start_date,
        timezone
      } = body;

      if (!enrollment_id || !student_id || !teacher_id || !subject_id || !total_sessions || !days_of_week?.length || !start_time || !end_time || !start_date) {
        return NextResponse.json({ error: 'All schedule generation fields are required.' }, { status: 400 });
      }

      const generated = batchGenerateSchedule({
        enrollment_id: Number(enrollment_id),
        student_id: Number(student_id),
        teacher_id: Number(teacher_id),
        subject_id: Number(subject_id),
        total_sessions: Number(total_sessions),
        days_of_week: days_of_week.map(Number),
        start_time,
        end_time,
        start_date,
        timezone: timezone || 'Asia/Dubai'
      });

      const conflictsCount = generated.filter((g) => g.has_conflict).length;

      return NextResponse.json({
        success: true,
        previewSessions: generated,
        totalGenerated: generated.length,
        conflictsCount
      });
    } else if (action === 'confirm') {
      const { sessions } = body;
      if (!sessions || !sessions.length) {
        return NextResponse.json({ error: 'No sessions provided for confirmation.' }, { status: 400 });
      }

      const createdIds = confirmBatchSchedule(sessions);

      // Trigger automatic class scheduled notification email to Student and Teacher
      const firstSession = sessions[0];
      const student = getStudentById(firstSession.student_id);
      const teacher = getTeacherById(firstSession.teacher_id);
      const enrollment = getEnrollmentById(firstSession.enrollment_id);

      if (student?.email) {
        await sendBrandedEmail({
          toEmail: student.email,
          recipientName: student.name,
          templateType: 'CLASS_SCHEDULED',
          data: {
            subjectName: enrollment?.subject_name || '1-on-1 Academic Track',
            date: firstSession.session_date,
            startTime: firstSession.start_time,
            endTime: firstSession.end_time,
            timezone: firstSession.timezone || 'Asia/Dubai',
            teacherName: teacher?.name || 'Assigned Faculty',
            sessionNumber: firstSession.session_number,
            topic: firstSession.title
          }
        });
      }

      logActivity(
        session.email,
        'SCHEDULE_BATCH_CONFIRMED',
        'schedule',
        String(firstSession.enrollment_id),
        `Confirmed and generated ${createdIds.length} sessions for student ${student?.name || firstSession.student_id}`
      );

      return NextResponse.json({
        success: true,
        message: `Successfully confirmed and created ${createdIds.length} sessions. Both Student and Teacher portals updated automatically.`,
        createdCount: createdIds.length
      });
    }

    return NextResponse.json({ error: 'Invalid action parameter. Must be "preview" or "confirm".' }, { status: 400 });
  } catch (err: any) {
    console.error('Scheduling error:', err);
    return NextResponse.json({ error: err.message || 'Scheduling workflow failed.' }, { status: 500 });
  }
}
