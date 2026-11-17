import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getAllLeaves,
  applyStudentLeave,
  getClassById
} from '@/lib/db';
import { sendBrandedEmail } from '@/lib/email';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const student = getStudentByUserId(user.id);
  if (!student) return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });

  const leaves = getAllLeaves(student.id);
  return NextResponse.json({ leaves });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const user = getUserByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const student = getStudentByUserId(user.id);
  if (!student) return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });

  try {
    const { classId, reason } = await request.json();

    if (!classId || !reason?.trim()) {
      return NextResponse.json({ error: 'Class session and reason are required.' }, { status: 400 });
    }

    const targetClass = getClassById(Number(classId));
    if (!targetClass) {
      return NextResponse.json({ error: 'Scheduled class not found.' }, { status: 404 });
    }

    // Attempt leave application (validates 12h advance notice and max 2 leaves/month/subject)
    const result = applyStudentLeave(student.id, Number(classId), reason.trim());

    // Send email notification to Student
    await sendBrandedEmail({
      toEmail: student.email,
      recipientName: student.name,
      templateType: 'LEAVE_APPROVAL',
      data: {
        subjectName: targetClass.subject_name,
        sessionNumber: targetClass.session_number,
        date: targetClass.session_date,
        reason: reason.trim(),
        replacementSessionId: result.replacementId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Leave application approved automatically under 12-hour policy. Replacement session entitlement issued.',
      leaveId: result.leaveId,
      replacementId: result.replacementId
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Leave application could not be processed.' }, { status: 400 });
  }
}
