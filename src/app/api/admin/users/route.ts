import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getAllUsers,
  createStudent,
  createTeacher,
  createUser,
  logActivity,
  getAllSubjects,
  getUserByEmail
} from '@/lib/db';
import { sendBrandedEmail } from '@/lib/email';

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin credentials required.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'all';
  const search = searchParams.get('search') || '';

  const users = getAllUsers(role, search);
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin credentials required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { accountType, name, email, password, phone } = body;

    if (!accountType || !name || !email) {
      return NextResponse.json({ error: 'Account type, name, and email are required.' }, { status: 400 });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: `An account with email ${email} already exists.` }, { status: 409 });
    }

    const passwordPlain = password?.trim() || 'demo123';

    if (accountType === 'student') {
      const { parentName, parentPhone, grade, curriculum, timezone, enrollments } = body;

      const result = createStudent({
        name: name.trim(),
        email: email.trim(),
        passwordPlain,
        parent_name: parentName || name,
        parent_phone: parentPhone || phone || '',
        grade: grade || 'Grade 10',
        curriculum: curriculum || 'CBSE',
        timezone: timezone || 'Asia/Dubai',
        enrollments: enrollments || []
      });

      // Send branded invitation email
      const subjects: any[] = getAllSubjects();
      const subjectNames = (enrollments || [])
        .map((e: any) => {
          const s = subjects.find((sub: any) => sub.id === Number(e.subject_id)) as any;
          return s ? `${s.name} (${e.total_sessions} sessions)` : null;
        })
        .filter(Boolean)
        .join(', ');

      await sendBrandedEmail({
        toEmail: email.trim(),
        recipientName: name.trim(),
        templateType: 'STUDENT_INVITATION',
        data: {
          passwordPlain,
          grade: grade || 'Grade 10',
          curriculum: curriculum || 'CBSE',
          subjectsList: subjectNames || 'Science, Mathematics'
        }
      });

      logActivity(
        session.email,
        'CREATE_STUDENT',
        'student',
        String(result.studentId),
        `Created student account for ${name} (${email}) with ${(enrollments || []).length} enrollments`
      );

      return NextResponse.json({
        success: true,
        message: 'Student account created and invitation email queued successfully.',
        studentId: result.studentId,
        userId: result.userId
      });
    } else if (accountType === 'teacher') {
      const { qualification, bio, subjects, zoomPmi } = body;

      const result = createTeacher({
        name: name.trim(),
        email: email.trim(),
        passwordPlain,
        phone: phone || '',
        qualification: qualification || 'Senior Subject Authority',
        bio: bio || '',
        subjects: subjects || [],
        zoom_pmi: zoomPmi || ''
      });

      // Send branded teacher invitation email
      await sendBrandedEmail({
        toEmail: email.trim(),
        recipientName: name.trim(),
        templateType: 'TEACHER_INVITATION',
        data: {
          passwordPlain,
          subjectsList: (subjects || []).join(', ') || 'Assigned Subjects'
        }
      });

      logActivity(
        session.email,
        'CREATE_TEACHER',
        'teacher',
        String(result.teacherId),
        `Created teacher account for ${name} (${email})`
      );

      return NextResponse.json({
        success: true,
        message: 'Teacher account created and invitation email queued successfully.',
        teacherId: result.teacherId,
        userId: result.userId
      });
    } else {
      // General Admin creation
      const userId = createUser({
        email: email.trim(),
        passwordPlain,
        name: name.trim(),
        role: 'admin'
      });

      logActivity(session.email, 'CREATE_ADMIN', 'user', String(userId), `Created admin account for ${name} (${email})`);
      return NextResponse.json({ success: true, userId });
    }
  } catch (err: any) {
    console.error('Error creating account:', err);
    return NextResponse.json({ error: err.message || 'Failed to create account.' }, { status: 500 });
  }
}
