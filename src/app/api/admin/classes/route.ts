import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getClasses,
  getClassById,
  rescheduleClass,
  cancelClass,
  logActivity
} from '@/lib/db';
import { sendBrandedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const student_id = searchParams.get('student_id') ? Number(searchParams.get('student_id')) : undefined;
  const teacher_id = searchParams.get('teacher_id') ? Number(searchParams.get('teacher_id')) : undefined;
  const subject_id = searchParams.get('subject_id') ? Number(searchParams.get('subject_id')) : undefined;
  const date = searchParams.get('date') || undefined;
  const start_date = searchParams.get('start_date') || undefined;
  const end_date = searchParams.get('end_date') || undefined;
  const status = searchParams.get('status') || undefined;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

  const classes = getClasses({
    student_id,
    teacher_id,
    subject_id,
    date,
    start_date,
    end_date,
    status,
    limit
  });

  return NextResponse.json({ classes });
}

export async function PUT(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'admin' && session.role !== 'teacher')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { id, newDate, newStartTime, newEndTime, reason } = await request.json();
    if (!id || !newDate || !newStartTime || !newEndTime) {
      return NextResponse.json({ error: 'Class ID, new date, and start/end times are required.' }, { status: 400 });
    }

    const currentClass = getClassById(Number(id));
    if (!currentClass) {
      return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
    }

    rescheduleClass(Number(id), newDate, newStartTime, newEndTime, reason);

    // Send email to student
    if (currentClass.student_email) {
      await sendBrandedEmail({
        toEmail: currentClass.student_email,
        recipientName: currentClass.student_name,
        templateType: 'CLASS_RESCHEDULED',
        data: {
          subjectName: currentClass.subject_name,
          newDate,
          newStartTime,
          newEndTime,
          reason
        }
      });
    }

    logActivity(
      session.email,
      'RESCHEDULE_CLASS',
      'class',
      String(id),
      `Rescheduled ${currentClass.title} to ${newDate} (${newStartTime}-${newEndTime})`
    );

    return NextResponse.json({
      success: true,
      message: 'Class rescheduled successfully. Both Student and Teacher portals updated.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to reschedule class.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    const reason = searchParams.get('reason') || 'Administrative cancellation';

    if (!id) {
      return NextResponse.json({ error: 'Class ID is required.' }, { status: 400 });
    }

    const currentClass = getClassById(id);
    if (!currentClass) {
      return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
    }

    cancelClass(id, reason);

    // Send cancellation notice
    if (currentClass.student_email) {
      await sendBrandedEmail({
        toEmail: currentClass.student_email,
        recipientName: currentClass.student_name,
        templateType: 'CLASS_CANCELLED',
        data: {
          subjectName: currentClass.subject_name,
          date: currentClass.session_date,
          time: currentClass.start_time,
          reason
        }
      });
    }

    logActivity(
      session.email,
      'CANCEL_CLASS',
      'class',
      String(id),
      `Cancelled ${currentClass.title} (Reason: ${reason})`
    );

    return NextResponse.json({
      success: true,
      message: 'Class cancelled and balance preserved. Portals synchronized.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to cancel class.' }, { status: 500 });
  }
}
