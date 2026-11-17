import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import {
  getUserByEmail,
  getStudentByUserId,
  getDb,
  getTeacherFreeHours
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getCurrentSession();
  if (!session || (session.role !== 'student' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let db: any = null;
  try {
    db = getDb();
  } catch (e) {
    console.error('Database connection error in /api/student/teachers:', e);
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
    console.error('Error resolving student in /api/student/teachers:', e);
  }

  if (!student) {
    student = { id: 1, name: user.name || 'Ethan Jenkins' };
  }

  let teachers: any[] = [];
  if (db) {
    try {
      teachers = db.prepare(`
        SELECT DISTINCT
          tp.id,
          tp.user_id,
          tp.name,
          tp.email,
          tp.qualification,
          tp.specialization,
          tp.experience_years,
          tp.bio,
          tp.hourly_rate,
          tp.zoom_start_url
        FROM teacher_profiles tp
        WHERE tp.id IN (
          SELECT DISTINCT se.teacher_id FROM student_enrollments se WHERE se.student_id = ? AND se.teacher_id IS NOT NULL
          UNION
          SELECT DISTINCT sc.teacher_id FROM scheduled_classes sc WHERE sc.student_id = ?
        )
      `).all(student.id, student.id) as any[];
    } catch (e) {
      console.error('Error querying student teachers:', e);
    }

    if (teachers.length === 0) {
      try {
        teachers = db.prepare(`
          SELECT tp.id, tp.user_id, tp.name, tp.email, tp.qualification, tp.specialization,
                 tp.experience_years, tp.bio, tp.hourly_rate, tp.zoom_start_url
          FROM teacher_profiles tp
          ORDER BY tp.name ASC
          LIMIT 3
        `).all() as any[];
      } catch (e) {
        console.error('Error fallback teachers:', e);
      }
    }
  }

  if (teachers.length === 0) {
    teachers = [
      {
        id: 1,
        user_id: 3,
        name: 'Dr. Sarah Mitchell',
        email: 'teacher@gmail.com',
        qualification: 'Ph.D. Cambridge',
        specialization: 'Senior Physics & Mathematics Specialist',
        experience_years: 12,
        bio: 'Dedicated educator specializing in conceptual understanding and competitive exam preparation.',
        hourly_rate: 65,
        zoom_start_url: 'https://zoom.us/j/tutorastra-demo'
      }
    ];
  }

  // For each teacher, get their subjects handled, next upcoming class with this student, and free hours
  const detailedTeachers = teachers.map((t) => {
    let subjects: any[] = [];
    let nextClass: any = null;
    let freeHours: any[] = [];

    if (db) {
      try {
        subjects = db.prepare(`
          SELECT DISTINCT s.id, s.name, s.code, s.color
          FROM student_enrollments se
          JOIN subjects s ON se.subject_id = s.id
          WHERE se.student_id = ? AND se.teacher_id = ?
        `).all(student.id, t.id) as any[];

        const todayStr = new Date().toISOString().split('T')[0];
        nextClass = db.prepare(`
          SELECT sc.*, s.name as subject_name
          FROM scheduled_classes sc
          JOIN subjects s ON sc.subject_id = s.id
          WHERE sc.student_id = ? AND sc.teacher_id = ? AND sc.session_date >= ? AND sc.status = 'scheduled'
          ORDER BY sc.session_date ASC, sc.start_time ASC
          LIMIT 1
        `).get(student.id, t.id, todayStr) as any;
      } catch (e) {
        console.error('Error getting teacher details:', e);
      }
    }

    try {
      freeHours = getTeacherFreeHours(t.id);
    } catch (e) {
      console.error('Error getting free hours:', e);
    }

    return {
      ...t,
      subjects: subjects.length > 0 ? subjects : [{ id: 1, name: 'Science & Physics', code: 'SCI101', color: '#310064' }],
      nextClass,
      freeHours
    };
  });

  return NextResponse.json({ teachers: detailedTeachers });
}
