import { logEmail } from './db';

export interface EmailPayload {
  toEmail: string;
  recipientName?: string;
  templateType:
    | 'STUDENT_INVITATION'
    | 'TEACHER_INVITATION'
    | 'CLASS_SCHEDULED'
    | 'CLASS_RESCHEDULED'
    | 'CLASS_CANCELLED'
    | 'LEAVE_APPROVAL'
    | 'ASSESSMENT_RESULT'
    | 'TEACHER_ASSESSMENT_NOTIF';
  data: Record<string, any>;
}

export function formatTutorAstraEmail(title: string, subtitle: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Lato', Helvetica, Arial, sans-serif; background-color: #F8F7FA; margin: 0; padding: 24px; color: #1E1E24; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #ECE6F2; overflow: hidden; }
    .header { background: #220046; padding: 28px 32px; text-align: left; border-bottom: 3px solid #F4CC45; }
    .header h1 { color: #FFFFFF; font-size: 20px; margin: 0; font-family: 'Poppins', sans-serif; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: #E0D3F5; font-size: 13px; margin: 6px 0 0 0; }
    .content { padding: 32px; font-size: 14px; line-height: 1.6; }
    .badge { display: inline-block; padding: 4px 10px; background: #F2ECFC; color: #310064; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
    .detail-box { background: #FAF8F5; border: 1px solid #ECE6DA; border-radius: 12px; padding: 18px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px dashed #E5E0D5; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #5A5A65; font-weight: 600; }
    .value { color: #1E1E24; font-weight: 700; }
    .btn { display: inline-block; padding: 12px 24px; background: #310064; color: #FFFFFF !important; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px; margin-top: 20px; }
    .footer { background: #FAF8F5; padding: 20px 32px; font-size: 12px; color: #8C8C99; border-top: 1px solid #ECE6DA; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TutorAstra</h1>
      <p>${subtitle}</p>
    </div>
    <div class="content">
      <span class="badge">Academic Portal Notice</span>
      <h2 style="margin-top:0; color:#1E1E24; font-family:'Poppins', sans-serif;">${title}</h2>
      ${contentHtml}
    </div>
    <div class="footer">
      © 2026 TutorAstra Education. All rights reserved.<br>
      Your Ambition. Our Mission.
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendBrandedEmail(payload: EmailPayload): Promise<{ success: boolean; logId: number }> {
  let subject = 'TutorAstra Notification';
  let bodyHtml = '';
  let previewText = '';

  const { toEmail, recipientName, templateType, data } = payload;

  switch (templateType) {
    case 'STUDENT_INVITATION':
      subject = 'Welcome to TutorAstra: Your 1-on-1 Learning Portal is Ready';
      previewText = `Welcome ${recipientName || 'Student'}! Your account and enrolled subjects have been configured.`;
      bodyHtml = formatTutorAstraEmail(
        'Your Student & Parent Portal Is Active',
        'Welcome to Dedicated 1-on-1 Academic Tutoring',
        `
        <p>Dear ${recipientName || 'Student'},</p>
        <p>Welcome to <strong>TutorAstra</strong>. Your dedicated 1-on-1 learning account is ready. Below are your account details and initial enrolled subjects:</p>
        <div class="detail-box">
          <div class="detail-row"><span class="label">Portal Username:</span><span class="value">${toEmail}</span></div>
          <div class="detail-row"><span class="label">Temporary Password:</span><span class="value">${data.passwordPlain || 'demo123'}</span></div>
          <div class="detail-row"><span class="label">Curriculum / Grade:</span><span class="value">${data.grade || 'Grade 10'} (${data.curriculum || 'CBSE'})</span></div>
          <div class="detail-row"><span class="label">Enrolled Subjects:</span><span class="value">${data.subjectsList || 'Science, Mathematics'}</span></div>
        </div>
        <p>Please log in to review your session calendar, join live Zoom classes, and access your study materials.</p>
        <a href="${data.loginUrl || 'http://localhost:3000/login'}" class="btn">Log In to Student Portal</a>
        `
      );
      break;

    case 'TEACHER_INVITATION':
      subject = 'TutorAstra Faculty Portal: Your Educator Account is Active';
      previewText = `Welcome ${recipientName || 'Educator'}! Your faculty dashboard is ready.`;
      bodyHtml = formatTutorAstraEmail(
        'Faculty Account Provisioned',
        'Top 2% Vetted Educator Network',
        `
        <p>Dear ${recipientName || 'Educator'},</p>
        <p>You have been provisioned as a dedicated 1-on-1 mentor on the TutorAstra platform. Below are your credentials:</p>
        <div class="detail-box">
          <div class="detail-row"><span class="label">Faculty Email:</span><span class="value">${toEmail}</span></div>
          <div class="detail-row"><span class="label">Assigned Subjects:</span><span class="value">${data.subjectsList || 'All Assigned'}</span></div>
          <div class="detail-row"><span class="label">Temporary Password:</span><span class="value">${data.passwordPlain || 'demo123'}</span></div>
        </div>
        <p>Please log in to your Teacher Console to manage assigned students, track weekly calendars, and access Teacher Box.</p>
        <a href="${data.loginUrl || 'http://localhost:3000/login'}" class="btn">Log In to Teacher Portal</a>
        `
      );
      break;

    case 'CLASS_SCHEDULED':
      subject = `Class Confirmed: ${data.subjectName || '1-on-1 Session'} on ${data.date || 'Upcoming'}`;
      previewText = `Class confirmed for ${data.date} at ${data.startTime}.`;
      bodyHtml = formatTutorAstraEmail(
        '1-on-1 Class Confirmed',
        'Upcoming Live Learning Session',
        `
        <p>Hello ${recipientName || 'Learner'},</p>
        <p>Your 1-on-1 live session has been confirmed on the TutorAstra schedule:</p>
        <div class="detail-box">
          <div class="detail-row"><span class="label">Subject:</span><span class="value">${data.subjectName}</span></div>
          <div class="detail-row"><span class="label">Session:</span><span class="value">Session ${data.sessionNumber || '01'} - ${data.topic || 'Diagnostic'}</span></div>
          <div class="detail-row"><span class="label">Date:</span><span class="value">${data.date}</span></div>
          <div class="detail-row"><span class="label">Time:</span><span class="value">${data.startTime} - ${data.endTime} (${data.timezone || 'Asia/Dubai'})</span></div>
          <div class="detail-row"><span class="label">Educator:</span><span class="value">${data.teacherName}</span></div>
        </div>
        <p><strong>Security Note:</strong> Your official Zoom meeting link will become available 15 minutes before the scheduled start time.</p>
        `
      );
      break;

    case 'CLASS_RESCHEDULED':
      subject = `Schedule Update: ${data.subjectName || 'Class'} Rescheduled to ${data.newDate}`;
      previewText = `Your class has been rescheduled to ${data.newDate} at ${data.newTime}.`;
      bodyHtml = formatTutorAstraEmail(
        'Class Rescheduling Notice',
        'Updated Session Time',
        `
        <p>Hello ${recipientName || 'Learner'},</p>
        <p>An administrative update has been made to your scheduled session:</p>
        <div class="detail-box">
          <div class="detail-row"><span class="label">Subject:</span><span class="value">${data.subjectName}</span></div>
          <div class="detail-row"><span class="label">New Date:</span><span class="value" style="color:#310064;">${data.newDate}</span></div>
          <div class="detail-row"><span class="label">New Time:</span><span class="value" style="color:#310064;">${data.newStartTime} - ${data.newEndTime}</span></div>
          <div class="detail-row"><span class="label">Reason / Notes:</span><span class="value">${data.reason || 'Timetable adjustment'}</span></div>
        </div>
        <p>Both your Student Portal and Teacher Portal have been updated automatically.</p>
        `
      );
      break;

    case 'CLASS_CANCELLED':
      subject = `Notice: Class Cancelled for ${data.date} (${data.subjectName})`;
      previewText = `Session on ${data.date} has been cancelled.`;
      bodyHtml = formatTutorAstraEmail(
        'Class Cancellation Notice',
        'Academic Timetable Update',
        `
        <p>Hello ${recipientName || 'Learner'},</p>
        <p>Please note that your scheduled session for <strong>${data.subjectName}</strong> on <strong>${data.date} at ${data.time}</strong> has been cancelled.</p>
        <div class="detail-box">
          <div class="detail-row"><span class="label">Reason:</span><span class="value">${data.reason || 'Requested by administration'}</span></div>
          <div class="detail-row"><span class="label">Balance:</span><span class="value">Session balance has been restored</span></div>
        </div>
        `
      );
      break;

    case 'LEAVE_APPROVAL':
      subject = `Leave Approved: ${data.subjectName} (Replacement Session Granted)`;
      previewText = `Your leave request for ${data.date} has been approved.`;
      bodyHtml = formatTutorAstraEmail(
        'Leave Request Approved',
        'Academic Policy Compliance',
        `
        <p>Dear ${recipientName || 'Student'},</p>
        <p>Your leave application for the upcoming <strong>${data.subjectName}</strong> class on <strong>${data.date}</strong> has been automatically approved under TutorAstra's 12-hour advance policy.</p>
        <div class="detail-box">
          <div class="detail-row"><span class="label">Original Session:</span><span class="value">Session #${data.sessionNumber}</span></div>
          <div class="detail-row"><span class="label">Leave Status:</span><span class="value" style="color:#059669;">Approved</span></div>
          <div class="detail-row"><span class="label">Replacement Session:</span><span class="value">Created automatically at end of syllabus</span></div>
        </div>
        <p>Your dedicated educator has been notified and your schedule updated.</p>
        `
      );
      break;

    case 'ASSESSMENT_RESULT':
      subject = `Astra AI Assessment Report: ${data.score}/${data.maxScore} in ${data.subjectName}`;
      previewText = `Test completed: Score ${data.score}/${data.maxScore}.`;
      bodyHtml = formatTutorAstraEmail(
        'Astra AI Diagnostic Evaluation',
        'Ms. Violet Studio Assessment',
        `
        <p>Dear ${recipientName || 'Student'},</p>
        <p>You have successfully completed the practice assessment with <strong>Ms. Violet</strong>:</p>
        <div class="detail-box">
          <div class="detail-row"><span class="label">Test Title:</span><span class="value">${data.testTitle}</span></div>
          <div class="detail-row"><span class="label">Score:</span><span class="value" style="font-size:16px; color:#310064;">${data.score} / ${data.maxScore} (${Math.round((data.score / data.maxScore) * 100)}%)</span></div>
          <div class="detail-row"><span class="label">Format:</span><span class="value">${data.testType === 'mcq' ? 'Multiple Choice' : 'Written Rubric'}</span></div>
        </div>
        <p><strong>Ms. Violet Feedback:</strong> ${data.aiFeedback}</p>
        `
      );
      break;

    case 'TEACHER_ASSESSMENT_NOTIF':
      subject = `Student Assessment Submitted: ${data.studentName} (${data.subjectName})`;
      previewText = `${data.studentName} submitted an AI assessment.`;
      bodyHtml = formatTutorAstraEmail(
        'Student Assessment Notice',
        'Teacher Box Sync',
        `
        <p>Dear ${recipientName || 'Teacher'},</p>
        <p>Your student <strong>${data.studentName}</strong> has completed a practice test with Ms. Violet:</p>
        <div class="detail-box">
          <div class="detail-row"><span class="label">Subject:</span><span class="value">${data.subjectName}</span></div>
          <div class="detail-row"><span class="label">Test:</span><span class="value">${data.testTitle}</span></div>
          <div class="detail-row"><span class="label">Result:</span><span class="value">${data.score} / ${data.maxScore}</span></div>
        </div>
        <p>This report has been synchronized to your Teacher Box for review before your next live 1-on-1 class.</p>
        `
      );
      break;
  }

  // Persist delivery to email_logs
  const logId = logEmail({
    recipient_email: toEmail,
    recipient_name: recipientName,
    template_type: templateType,
    subject,
    body_preview: previewText,
    payload_json: JSON.stringify(data),
    status: 'sent'
  });

  return { success: true, logId };
}
