import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { INITIAL_COURSES, INITIAL_PACKAGES, INITIAL_SETTINGS } from './initialData';
import { ALL_CURRICULA } from './curriculumData';

const isVercel = Boolean(process.env.VERCEL);
const DB_DIR = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'ednxt.db');

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
  } catch (e) {
    // Ignore if directory already exists
  }
}

// On Vercel, copy the seeded database from project root to /tmp if not already there
if (isVercel) {
  const sourceDb = path.join(process.cwd(), 'data', 'ednxt.db');
  if (fs.existsSync(sourceDb) && !fs.existsSync(DB_PATH)) {
    try {
      fs.copyFileSync(sourceDb, DB_PATH);
    } catch (e) {
      console.warn('Could not copy source db to /tmp, will initialize fresh:', e);
    }
  }
}

let dbInstance: Database.Database | null = null;
let isDbInitialized = false;

export function hashPassword(password: string): string {
  const salt = 'ednxt_secure_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = new Database(DB_PATH);
  dbInstance.pragma('journal_mode = WAL');

  // Initialize Tables only if not already done in this process
  if (!isDbInitialized) {
    initTables(dbInstance);
    isDbInitialized = true;
  }

  return dbInstance;
}

function initTables(db: Database.Database) {
  // Base core tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      tagline TEXT,
      stream TEXT NOT NULL,
      curriculum TEXT NOT NULL,
      grades TEXT NOT NULL,
      price_aed INTEGER NOT NULL,
      duration TEXT NOT NULL,
      description TEXT NOT NULL,
      learning_outcomes TEXT NOT NULL,
      image_url TEXT,
      badge TEXT,
      is_published INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      schedule_info TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS course_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      subtitle TEXT,
      streams_included TEXT NOT NULL,
      price_aed INTEGER NOT NULL,
      billing_period TEXT DEFAULT 'per term',
      features TEXT NOT NULL,
      is_popular INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS curriculum_topics (
      id TEXT PRIMARY KEY,
      curriculum TEXT NOT NULL,
      subject TEXT NOT NULL,
      grade TEXT NOT NULL,
      term INTEGER NOT NULL,
      term_title TEXT NOT NULL,
      duration TEXT NOT NULL,
      topics_json TEXT NOT NULL,
      learning_approach TEXT,
      assessments_json TEXT,
      capstone TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      student_name TEXT,
      grade TEXT,
      curriculum TEXT,
      interested_stream TEXT,
      preferred_contact_method TEXT,
      subject TEXT,
      message TEXT,
      status TEXT DEFAULT 'New',
      internal_notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_email TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS website_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Try adding is_active to users if upgrading an existing db
  try {
    db.prepare('ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1').run();
  } catch (e) {
    // Column already exists
  }

  // ----------------- TUTORASTRA 3-PORTAL TABLES -----------------
  db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      code TEXT,
      description TEXT,
      color TEXT DEFAULT '#310064',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teacher_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
      phone TEXT,
      qualification TEXT,
      bio TEXT,
      subjects_json TEXT DEFAULT '[]',
      zoom_pmi TEXT,
      zoom_host_url TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
      parent_name TEXT,
      parent_phone TEXT,
      grade TEXT DEFAULT 'Grade 10',
      curriculum TEXT DEFAULT 'CBSE',
      timezone TEXT DEFAULT 'Asia/Dubai',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES student_profiles(id),
      subject_id INTEGER NOT NULL REFERENCES subjects(id),
      teacher_id INTEGER REFERENCES teacher_profiles(id),
      total_sessions INTEGER NOT NULL DEFAULT 50,
      completed_sessions INTEGER DEFAULT 0,
      cancelled_sessions INTEGER DEFAULT 0,
      leave_approved_sessions INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scheduled_classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enrollment_id INTEGER REFERENCES student_enrollments(id),
      student_id INTEGER NOT NULL REFERENCES student_profiles(id),
      teacher_id INTEGER NOT NULL REFERENCES teacher_profiles(id),
      subject_id INTEGER NOT NULL REFERENCES subjects(id),
      session_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      session_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 60,
      timezone TEXT DEFAULT 'Asia/Dubai',
      status TEXT DEFAULT 'scheduled',
      zoom_meeting_id TEXT,
      zoom_join_url TEXT,
      zoom_start_url TEXT,
      zoom_passcode TEXT,
      attendance_status TEXT DEFAULT 'pending',
      teacher_notes TEXT,
      homework_assigned TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_leaves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES student_profiles(id),
      class_id INTEGER NOT NULL REFERENCES scheduled_classes(id),
      subject_id INTEGER NOT NULL REFERENCES subjects(id),
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'approved',
      rejection_reason TEXT,
      replacement_session_id INTEGER REFERENCES scheduled_classes(id),
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      decided_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teacher_box_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_user_id INTEGER NOT NULL REFERENCES users(id),
      receiver_user_id INTEGER NOT NULL REFERENCES users(id),
      student_id INTEGER REFERENCES student_profiles(id),
      teacher_id INTEGER REFERENCES teacher_profiles(id),
      subject_id INTEGER REFERENCES subjects(id),
      message TEXT,
      attachment_url TEXT,
      attachment_name TEXT,
      attachment_type TEXT,
      attachment_size INTEGER,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS class_recordings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL REFERENCES scheduled_classes(id),
      student_id INTEGER NOT NULL REFERENCES student_profiles(id),
      subject_id INTEGER NOT NULL REFERENCES subjects(id),
      title TEXT NOT NULL,
      recording_url TEXT NOT NULL,
      duration_seconds INTEGER DEFAULT 3600,
      view_count INTEGER DEFAULT 0,
      is_consumed INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      first_viewed_at DATETIME,
      consumed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES student_profiles(id),
      subject_id INTEGER NOT NULL REFERENCES subjects(id),
      title TEXT NOT NULL,
      document_name TEXT,
      extracted_text TEXT,
      test_type TEXT DEFAULT 'mcq',
      time_limit_minutes INTEGER DEFAULT 15,
      questions_json TEXT NOT NULL,
      answers_json TEXT,
      score INTEGER,
      max_score INTEGER,
      ai_feedback TEXT,
      teacher_reviewed INTEGER DEFAULT 0,
      teacher_notes TEXT,
      status TEXT DEFAULT 'generated',
      started_at DATETIME,
      submitted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS email_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipient_email TEXT NOT NULL,
      recipient_name TEXT,
      template_type TEXT NOT NULL,
      subject TEXT NOT NULL,
      body_preview TEXT,
      payload_json TEXT,
      status TEXT DEFAULT 'sent',
      error_message TEXT,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teacher_leaves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      reason TEXT NOT NULL,
      cover_teacher_id INTEGER,
      status TEXT DEFAULT 'approved',
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id)
    );

    CREATE TABLE IF NOT EXISTS portal_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_user_id INTEGER NOT NULL,
      target_audience TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      priority TEXT DEFAULT 'normal',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teacher_free_hours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      day_of_week INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      note TEXT DEFAULT 'Available for 1-on-1 & doubt clearing',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id)
    );

    CREATE TABLE IF NOT EXISTS account_permissions (
      role TEXT PRIMARY KEY,
      can_view_recordings INTEGER DEFAULT 1,
      can_apply_leaves INTEGER DEFAULT 1,
      can_use_chat INTEGER DEFAULT 1,
      can_take_ai_test INTEGER DEFAULT 1,
      can_view_other_contacts INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT NOT NULL,
      status TEXT DEFAULT 'assigned',
      max_marks INTEGER DEFAULT 100,
      obtained_marks INTEGER,
      feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id),
      FOREIGN KEY (student_id) REFERENCES student_profiles(id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id)
    );
  `);

  // Seed default core users
  const demoUsers = [
    { email: 'admin@gmail.com', pass: 'demo123', name: 'Super Admin', role: 'admin' },
    { email: 'teacher@gmail.com', pass: 'demo123', name: 'Dr. Sarah Mitchell (Lead Faculty)', role: 'teacher' },
    { email: 'student@gmail.com', pass: 'demo123', name: 'Ethan Jenkins (Student / Parent)', role: 'student' },
    { email: 'admin@ednxt.co', pass: 'Admin@EdNxt2026!', name: 'Lead Administrator', role: 'admin' },
  ];

  for (const u of demoUsers) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(u.email) as { id: number } | undefined;
    const passHash = hashPassword(u.pass);
    if (!existing) {
      db.prepare(`
        INSERT INTO users (email, password_hash, name, role, is_active)
        VALUES (?, ?, ?, ?, 1)
      `).run(u.email, passHash, u.name, u.role);
    } else {
      db.prepare(`
        UPDATE users SET password_hash = ?, name = ?, role = ?, is_active = 1 WHERE email = ?
      `).run(passHash, u.name, u.role, u.email);
    }
  }

  // Seed default courses
  const coursesCount = db.prepare('SELECT count(*) as count FROM courses').get() as { count: number };
  if (coursesCount.count === 0) {
    const insertCourse = db.prepare(`
      INSERT INTO courses (
        slug, title, tagline, stream, curriculum, grades, price_aed, duration,
        description, learning_outcomes, image_url, badge, is_published, is_featured, schedule_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of INITIAL_COURSES) {
      insertCourse.run(
        c.slug, c.title, c.tagline, c.stream, c.curriculum, c.grades, c.price_aed, c.duration,
        c.description, c.learning_outcomes, c.image_url, c.badge, c.is_published, c.is_featured, c.schedule_info
      );
    }
  }

  // Seed default packages
  const packageCount = db.prepare('SELECT count(*) as count FROM course_packages').get() as { count: number };
  if (packageCount.count === 0) {
    const insertPkg = db.prepare(`
      INSERT INTO course_packages (slug, name, subtitle, streams_included, price_aed, billing_period, features, is_popular, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of INITIAL_PACKAGES) {
      insertPkg.run(p.slug, p.name, p.subtitle, p.streams_included, p.price_aed, p.billing_period, p.features, p.is_popular, p.is_published);
    }
  }

  // Seed curriculum topics
  const curriculumCount = db.prepare('SELECT count(*) as count FROM curriculum_topics').get() as { count: number };
  if (curriculumCount.count === 0) {
    const insertTopic = db.prepare(`
      INSERT INTO curriculum_topics (id, curriculum, subject, grade, term, term_title, duration, topics_json, learning_approach, assessments_json, capstone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const t of ALL_CURRICULA) {
      insertTopic.run(
        t.id,
        t.curriculum,
        t.subject,
        t.grade,
        t.term,
        t.termTitle,
        t.duration,
        JSON.stringify(t.topics),
        t.learningApproach,
        JSON.stringify(t.assessments),
        t.capstone || ''
      );
    }
  }

  // Seed website settings
  const settingsCount = db.prepare('SELECT count(*) as count FROM website_settings').get() as { count: number };
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare(`
      INSERT INTO website_settings (key, value) VALUES (?, ?)
    `);

    for (const [key, value] of Object.entries(INITIAL_SETTINGS)) {
      insertSetting.run(key, value);
    }
  }

  // Seed default subjects if not already populated
  const subjectsCount = db.prepare('SELECT count(*) as count FROM subjects').get() as { count: number };
  if (subjectsCount.count === 0) {
    const defaultSubjects = [
      { name: 'Science', code: 'SCI', desc: 'Comprehensive integrated physical & biological science', color: '#310064' },
      { name: 'Mathematics', code: 'MATH', desc: 'Algebra, Calculus, Geometry & Trigonometry', color: '#0284C7' },
      { name: 'Physics', code: 'PHYS', desc: 'Classical Mechanics, Electromagnetism & Modern Physics', color: '#7C3AED' },
      { name: 'Chemistry', code: 'CHEM', desc: 'Organic, Inorganic & Physical Chemistry', color: '#059669' },
      { name: 'Biology', code: 'BIO', desc: 'Molecular Genetics, Ecology & Human Physiology', color: '#10B981' },
      { name: 'English & Literature', code: 'ENG', desc: 'Critical Essay Analysis, Prose & Rhetoric', color: '#D97706' },
      { name: 'Computer Science', code: 'CS', desc: 'Python, Algorithms, Data Structures & Logic', color: '#4F46E5' }
    ];

    const insertSub = db.prepare('INSERT INTO subjects (name, code, description, color, is_active) VALUES (?, ?, ?, ?, 1)');
    for (const s of defaultSubjects) {
      insertSub.run(s.name, s.code, s.desc, s.color);
    }
  }

  // Seed Teacher Profile for User 3 (teacher@gmail.com)
  const teacherUser = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get('teacher@gmail.com') as { id: number; email: string; name: string } | undefined;
  if (teacherUser) {
    const existingTeacher = db.prepare('SELECT id FROM teacher_profiles WHERE user_id = ?').get(teacherUser.id) as { id: number } | undefined;
    if (!existingTeacher) {
      db.prepare(`
        INSERT INTO teacher_profiles (user_id, phone, qualification, bio, subjects_json, zoom_pmi, zoom_host_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        teacherUser.id,
        '+971 50 234 5678',
        'Ph.D. Applied Physics (Cambridge Alum) • 12+ Years Teaching Experience',
        'Senior faculty specialist in secondary and senior board examination mastery across Science, Physics and Advanced Mathematics.',
        JSON.stringify(['Science', 'Physics', 'Mathematics']),
        '987 654 3210',
        'https://zoom.us/s/9876543210?pwd=tutorastrateach'
      );
    }
  }

  // Seed Student Profile for User 4 (student@gmail.com)
  const studentUser = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get('student@gmail.com') as { id: number; email: string; name: string } | undefined;
  if (studentUser) {
    const existingStudent = db.prepare('SELECT id FROM student_profiles WHERE user_id = ?').get(studentUser.id) as { id: number } | undefined;
    let studentProfileId = existingStudent?.id;

    if (!existingStudent) {
      const res = db.prepare(`
        INSERT INTO student_profiles (user_id, parent_name, parent_phone, grade, curriculum, timezone)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        studentUser.id,
        'Mark Jenkins',
        '+971 50 987 6543',
        'Grade 10',
        'CBSE',
        'Asia/Dubai'
      );
      studentProfileId = Number(res.lastInsertRowid);
    }

    // Seed Enrollments for student (Science: 50 sessions, Mathematics: 40 sessions, Physics: 30 sessions)
    if (studentProfileId) {
      const enrollmentsCount = db.prepare('SELECT count(*) as count FROM student_enrollments WHERE student_id = ?').get(studentProfileId) as { count: number };
      const teacherProfile = db.prepare('SELECT id FROM teacher_profiles WHERE user_id = ?').get(teacherUser?.id) as { id: number } | undefined;
      const scienceSub = db.prepare('SELECT id FROM subjects WHERE name = ?').get('Science') as { id: number } | undefined;
      const mathSub = db.prepare('SELECT id FROM subjects WHERE name = ?').get('Mathematics') as { id: number } | undefined;
      const physicsSub = db.prepare('SELECT id FROM subjects WHERE name = ?').get('Physics') as { id: number } | undefined;

      if (enrollmentsCount.count === 0 && teacherProfile && scienceSub && mathSub && physicsSub) {
        // Science - 50 sessions
        const resSci = db.prepare(`
          INSERT INTO student_enrollments (student_id, subject_id, teacher_id, total_sessions, completed_sessions, leave_approved_sessions, status, notes)
          VALUES (?, ?, ?, ?, ?, ?, 'active', ?)
        `).run(studentProfileId, scienceSub.id, teacherProfile.id, 50, 4, 1, 'Enrolled under Annual Term Academic Contract');
        const scienceEnrollmentId = Number(resSci.lastInsertRowid);

        // Mathematics - 40 sessions
        db.prepare(`
          INSERT INTO student_enrollments (student_id, subject_id, teacher_id, total_sessions, completed_sessions, status, notes)
          VALUES (?, ?, ?, ?, ?, 'active', ?)
        `).run(studentProfileId, mathSub.id, teacherProfile.id, 40, 2, 'Focus on Algebra & Coordinate Geometry');

        // Physics - 30 sessions
        db.prepare(`
          INSERT INTO student_enrollments (student_id, subject_id, teacher_id, total_sessions, completed_sessions, status, notes)
          VALUES (?, ?, ?, ?, ?, 'active', ?)
        `).run(studentProfileId, physicsSub.id, teacherProfile.id, 30, 1, 'Mechanics & Electromagnetism intensive track');

        // Generate scheduled sessions for Science (50 sessions)
        const today = new Date();
        const insertClass = db.prepare(`
          INSERT INTO scheduled_classes (
            enrollment_id, student_id, teacher_id, subject_id, session_number,
            title, session_date, start_time, end_time, duration_minutes, timezone,
            status, zoom_meeting_id, zoom_join_url, zoom_start_url, zoom_passcode,
            attendance_status, teacher_notes, homework_assigned
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (let i = 1; i <= 50; i++) {
          const sessionDate = new Date(today);
          // Set days: completed sessions in the past, one session today, rest in the future (Mon & Wed cadence)
          const offsetDays = (i - 5) * 3;
          sessionDate.setDate(today.getDate() + offsetDays);
          const dateStr = sessionDate.toISOString().split('T')[0];

          let status = 'scheduled';
          let attendance = 'pending';
          let notes = '';
          let homework = '';

          if (i < 5) {
            status = 'completed';
            attendance = 'present';
            notes = `Session ${i} completed successfully. Solid comprehension demonstrated.`;
            homework = `Completed worksheet #${i} with 95% accuracy.`;
          } else if (i === 5) {
            // Class for TODAY!
            const todayStr = today.toISOString().split('T')[0];
            status = 'scheduled';
            notes = 'Prepare for Electromagnetic Induction live derivation.';
            homework = 'Review Faraday laws notes beforehand.';
          } else if (i === 12) {
            status = 'leave_approved';
            attendance = 'excused';
            notes = 'Approved leave with advance 24h notice.';
          }

          const padNum = String(i).padStart(2, '0');
          const finalDateStr = (i === 5) ? today.toISOString().split('T')[0] : dateStr;

          insertClass.run(
            scienceEnrollmentId,
            studentProfileId,
            teacherProfile.id,
            scienceSub.id,
            i,
            `Science Session ${padNum}: ${getSessionTopic(i)}`,
            finalDateStr,
            '17:00',
            '18:00',
            60,
            'Asia/Dubai',
            status,
            `987-100-${padNum}`,
            `https://zoom.us/j/987100${padNum}?pwd=tutorastra${padNum}`,
            `https://zoom.us/s/987100${padNum}?pwd=tutorastra${padNum}`,
            `TA${padNum}`,
            attendance,
            notes,
            homework
          );
        }

        // Seed Sample Teacher Box Message
        db.prepare(`
          INSERT INTO teacher_box_messages (
            sender_user_id, receiver_user_id, student_id, teacher_id, subject_id, message,
            attachment_name, attachment_type, is_read
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).run(
          teacherUser!.id,
          studentUser!.id,
          studentProfileId,
          teacherProfile.id,
          scienceSub.id,
          'Welcome to Term 2, Ethan! Please review the uploaded Electromagnetic Induction diagnostic problem set before our live class.',
          'Electromagnetism_Diagnostic_Worksheet.pdf',
          'application/pdf'
        );

        db.prepare(`
          INSERT INTO teacher_box_messages (
            sender_user_id, receiver_user_id, student_id, teacher_id, subject_id, message, is_read
          ) VALUES (?, ?, ?, ?, ?, ?, 1)
        `).run(
          studentUser!.id,
          teacherUser!.id,
          studentProfileId,
          teacherProfile.id,
          scienceSub.id,
          'Thank you, Dr. Sarah! I have prepared questions on Lenz\'s Law and direction of induced current for today\'s class.'
        );

        // Seed Class Recordings (under single-watch policy)
        const firstClass = db.prepare('SELECT id FROM scheduled_classes WHERE session_number = 1 AND enrollment_id = ?').get(scienceEnrollmentId) as { id: number } | undefined;
        const secondClass = db.prepare('SELECT id FROM scheduled_classes WHERE session_number = 2 AND enrollment_id = ?').get(scienceEnrollmentId) as { id: number } | undefined;

        if (firstClass) {
          db.prepare(`
            INSERT INTO class_recordings (class_id, student_id, subject_id, title, recording_url, duration_seconds, view_count, is_consumed)
            VALUES (?, ?, ?, ?, ?, 3600, 0, 0)
          `).run(
            firstClass.id,
            studentProfileId,
            scienceSub.id,
            'Science Session 01: Cell Biology & Respiration Fundamentals',
            'https://storage.googleapis.com/tutorastra-recordings/demo-session-01.mp4'
          );
        }

        if (secondClass) {
          db.prepare(`
            INSERT INTO class_recordings (class_id, student_id, subject_id, title, recording_url, duration_seconds, view_count, is_consumed, first_viewed_at, consumed_at)
            VALUES (?, ?, ?, ?, ?, 3600, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `).run(
            secondClass.id,
            studentProfileId,
            scienceSub.id,
            'Science Session 02: Stoichiometry & Reaction Kinetics',
            'https://storage.googleapis.com/tutorastra-recordings/demo-session-02.mp4'
          );
        }

        // Seed Sample AI Assessment with Ms. Violet
        db.prepare(`
          INSERT INTO ai_assessments (
            student_id, subject_id, title, document_name, test_type, time_limit_minutes,
            questions_json, answers_json, score, max_score, ai_feedback, teacher_reviewed, teacher_notes, status, submitted_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'completed', CURRENT_TIMESTAMP)
        `).run(
          studentProfileId,
          scienceSub.id,
          'Diagnostic Test: Electromagnetic Induction & Lenz\'s Law',
          'Physics_Electromagnetism_Ch6.pdf',
          'mcq',
          15,
          JSON.stringify([
            {
              id: 1,
              question: 'According to Faraday\'s law of induction, the magnitude of induced EMF is proportional to:',
              options: ['The magnetic flux itself', 'The rate of change of magnetic flux', 'The area of the loop only', 'The current in the wire'],
              correct: 1,
              explanation: 'Faraday\'s law states EMF = -d(Phi)/dt, proportional to the time rate of change of magnetic flux.'
            },
            {
              id: 2,
              question: 'Lenz\'s law is a direct consequence of which fundamental conservation law?',
              options: ['Conservation of Momentum', 'Conservation of Charge', 'Conservation of Energy', 'Conservation of Angular Momentum'],
              correct: 2,
              explanation: 'Lenz\'s law enforces energy conservation: induced current produces a magnetic field opposing the change that produced it.'
            }
          ]),
          JSON.stringify({ 1: 1, 2: 2 }),
          2,
          2,
          'Outstanding conceptual clarity! All questions answered accurately. Solid grasp of both Faraday\'s formula and Lenz\'s physical interpretation.',
          'Reviewed by Dr. Sarah Mitchell: Excellent score. Ready to move forward with AC Generator derivations in our next session.'
        );

        // Seed Initial Email Logs
        db.prepare(`
          INSERT INTO email_logs (recipient_email, recipient_name, template_type, subject, body_preview, status)
          VALUES (?, ?, ?, ?, ?, 'sent')
        `).run(
          studentUser.email,
          'Ethan Jenkins',
          'STUDENT_INVITATION',
          'Welcome to TutorAstra: Your 1-on-1 Learning Portal is Ready',
          'Dear Ethan, welcome to TutorAstra. Your enrolled subjects: Science (50 sessions), Mathematics (40 sessions), Physics (30 sessions).'
        );

        db.prepare(`
          INSERT INTO email_logs (recipient_email, recipient_name, template_type, subject, body_preview, status)
          VALUES (?, ?, ?, ?, ?, 'sent')
        `).run(
          studentUser.email,
          'Ethan Jenkins',
          'CLASS_SCHEDULED',
          'Class Scheduled: Science Session 05 with Dr. Sarah Mitchell',
          'Your upcoming Science class is scheduled for today at 5:00 PM. Meeting link unlocks 15 minutes before class.'
        );
        // Seed Teacher Free Hours (Availability)
        const freeCount = db.prepare('SELECT COUNT(*) as count FROM teacher_free_hours WHERE teacher_id = ?').get(teacherProfile.id) as { count: number };
        if (freeCount.count === 0) {
          const insertFree = db.prepare(`
            INSERT INTO teacher_free_hours (teacher_id, day_of_week, start_time, end_time, note)
            VALUES (?, ?, ?, ?, ?)
          `);
          // Mon to Fri morning & afternoon free slots
          for (let d = 1; d <= 5; d++) {
            insertFree.run(teacherProfile.id, d, '09:00', '12:00', 'Morning 1-on-1 Office Hours & Doubt Clearing');
            insertFree.run(teacherProfile.id, d, '14:00', '16:30', 'Afternoon Pre-Class Preparation Slot');
          }
        }

        // Seed Portal Notifications
        const notifCount = db.prepare('SELECT COUNT(*) as count FROM portal_notifications').get() as { count: number };
        if (notifCount.count === 0) {
          const adminUser = db.prepare('SELECT id FROM users WHERE role = "admin"').get() as { id: number } | undefined;
          const adminId = adminUser?.id || 1;
          const insertNotif = db.prepare(`
            INSERT INTO portal_notifications (sender_user_id, target_audience, title, message, priority)
            VALUES (?, ?, ?, ?, ?)
          `);
          insertNotif.run(
            adminId,
            'all',
            'Academic Term 2 Timetable & Curriculum Guidelines',
            'Welcome to Term 2! All students and teachers are requested to verify their weekly scheduled 1-on-1 timings.',
            'high'
          );
          insertNotif.run(
            adminId,
            'students',
            'Ms. Violet AI Tutor Diagnostic Assessment Window Open',
            'You can now upload up to 3 pages of study material for diagnostic practice with Ms. Violet.',
            'normal'
          );
          insertNotif.run(
            adminId,
            'teachers',
            'Biometric & Portal Shift Attendance Logging Protocol',
            'Please ensure punch-in occurs at the start of your teaching shift before live Zoom classes commence.',
            'normal'
          );
        }

        // Seed Default Account Permissions
        db.prepare(`
          INSERT OR IGNORE INTO account_permissions (role, can_view_recordings, can_apply_leaves, can_use_chat, can_take_ai_test, can_view_other_contacts)
          VALUES ('student', 1, 1, 1, 1, 0)
        `).run();
        db.prepare(`
          INSERT OR IGNORE INTO account_permissions (role, can_view_recordings, can_apply_leaves, can_use_chat, can_take_ai_test, can_view_other_contacts)
          VALUES ('teacher', 1, 1, 1, 1, 1)
        `).run();

        // Seed Sample Assignments
        const assignCount = db.prepare('SELECT COUNT(*) as count FROM assignments').get() as { count: number };
        if (assignCount.count === 0 && teacherProfile && studentProfileId) {
          const scienceSub = db.prepare('SELECT id FROM subjects WHERE name LIKE "%Science%" OR name LIKE "%Physics%"').get() as { id: number } | undefined;
          const subId = scienceSub?.id || 1;
          const insertAssign = db.prepare(`
            INSERT INTO assignments (teacher_id, student_id, subject_id, title, description, due_date, status, max_marks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `);
          insertAssign.run(
            teacherProfile.id,
            studentProfileId,
            subId,
            'CBSE Grade 10 Light & Optics - Ray Diagram Analysis',
            'Draw accurate ray diagrams for concave and convex mirrors at varying object positions (C, F, between F and P). Calculate focal length using mirror equation.',
            '2026-11-20',
            'assigned',
            100
          );
          insertAssign.run(
            teacherProfile.id,
            studentProfileId,
            subId,
            'Chemical Reactions & Balanced Equations Practice',
            'Balance all 15 chemical equations provided in Worksheet 4. Identify redox, displacement, and precipitation reactions.',
            '2026-11-22',
            'assigned',
            50
          );
        }
      }
    }
  }
}

function getSessionTopic(idx: number): string {
  const topics = [
    'Foundational Scientific Inquiry & Measurement',
    'Atomic Structure & Periodic Trends',
    'Chemical Reactions, Bonding & Valency',
    'Cell Structure, Functions & Organelles',
    'Electromagnetic Induction & Lenz\'s Law',
    'Newton\'s Laws of Motion & Dynamic Equilibrium',
    'Thermodynamics & Energy Transfer',
    'Acids, Bases & pH Calculations',
    'Human Physiology & Cardiovascular System',
    'Optics: Refraction, Lenses & Dispersion',
    'Organic Chemistry: Hydrocarbons & Functional Groups',
    'Genetics & Mendelian Inheritance',
    'Chemical Equilibrium & Le Chatelier\'s Principle',
    'Wave Mechanics & Sound Propagation',
    'Ecological Pyramids & Nutrient Cycling',
    'Electrochemistry & Galvanic Cells',
    'Gravitational Fields & Planetary Motion',
    'Reproduction in Flowering Plants',
    'Nuclear Physics: Radioactivity & Half-Life',
    'Co-ordination Compounds & Nomenclature',
    'Molecular Basis of Inheritance (DNA & RNA)',
    'Rotational Dynamics & Moment of Inertia',
    'Solutions: Colligative Properties & Raoult\'s Law',
    'Biotechnology: Principles & Recombinant DNA',
    'Semiconductors, Diodes & Logic Gates',
    'Aldehydes, Ketones & Carboxylic Acids',
    'Evolution: Natural Selection & Speciation',
    'Fluid Mechanics: Pascal & Bernoulli Principles',
    'Coordination Chemistry: Crystal Field Theory',
    'Ecosystem Dynamics & Biodiversity Conservation',
    'Alternating Currents & Transformer Efficiency',
    'Polymers & Biomolecules in Action',
    'Human Health & Immune Response Mechanisms',
    'Thermal Properties of Matter & Calorimetry',
    'Chemical Kinetics & Arrhenius Equation',
    'Microbes in Human Welfare & Industrial Fermentation',
    'Electromagnetic Waves & Spectrum Applications',
    'Surface Chemistry: Adsorption & Colloids',
    'Environmental Issues & Climate Science',
    'Kinetic Theory of Gases & Gas Laws',
    'd-Block and f-Block Elements Mastery',
    'Photosynthesis: Light vs Dark Reactions',
    'Ray Optics: Telescopes & Microscopes',
    'Coordination Isomerism & Magnetic Moments',
    'Cell Cycle: Mitosis & Meiotic Recombination',
    'Oscillations: Simple Harmonic Motion & Damping',
    'Solid State Chemistry: Crystal Lattices',
    'Genetics: Chromosomal Disorders & Pedigree Analysis',
    'Past-Year Board Exam Paper Analysis & Traps',
    'Full Syllabus Mock Exam & 1-on-1 Performance Audit'
  ];
  return topics[(idx - 1) % topics.length] || `Advanced Topic Drill ${idx}`;
}

// ----------------- QUERY HELPER EXPORTS -----------------

// Users
export function getAllUsers(roleFilter?: string, search?: string) {
  const db = getDb();
  let query = 'SELECT id, email, name, role, is_active, created_at FROM users WHERE 1=1';
  const params: any[] = [];

  if (roleFilter && roleFilter !== 'all') {
    query += ' AND role = ?';
    params.push(roleFilter);
  }

  if (search && search.trim() !== '') {
    query += ' AND (name LIKE ? OR email LIKE ?)';
    const s = `%${search.trim()}%`;
    params.push(s, s);
  }

  query += ' ORDER BY id DESC';
  return db.prepare(query).all(...params);
}

export function getUserById(id: number) {
  const db = getDb();
  return db.prepare('SELECT id, email, name, role, is_active, created_at FROM users WHERE id = ?').get(id) as any;
}

export function getUserByEmail(email: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase()) as any;
}

export function createUser(data: { email: string; passwordPlain: string; name: string; role: string }) {
  const db = getDb();
  const existing = getUserByEmail(data.email);
  if (existing) {
    throw new Error(`An account with email ${data.email} already exists.`);
  }

  const hash = hashPassword(data.passwordPlain);
  const info = db.prepare(`
    INSERT INTO users (email, password_hash, name, role, is_active)
    VALUES (?, ?, ?, ?, 1)
  `).run(data.email.trim().toLowerCase(), hash, data.name.trim(), data.role);

  return Number(info.lastInsertRowid);
}

export function updateUser(id: number, data: { name?: string; email?: string; role?: string; is_active?: number }) {
  const db = getDb();
  const fields: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    params.push(data.name.trim());
  }
  if (data.email !== undefined) {
    fields.push('email = ?');
    params.push(data.email.trim().toLowerCase());
  }
  if (data.role !== undefined) {
    fields.push('role = ?');
    params.push(data.role);
  }
  if (data.is_active !== undefined) {
    fields.push('is_active = ?');
    params.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return;

  params.push(id);
  db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...params);
}

export function verifyUserCredentials(email: string, passwordPlain: string) {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase()) as any;
  if (!user) return null;
  if (user.is_active === 0) return null; // Deactivated account
  const hash = hashPassword(passwordPlain);
  if (user.password_hash === hash) {
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
  return null;
}

export function updateUserPassword(email: string, newPasswordPlain: string) {
  const db = getDb();
  const newHash = hashPassword(newPasswordPlain);
  db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(newHash, email.trim().toLowerCase());
}

// Subjects
export function getAllSubjects() {
  const db = getDb();
  return db.prepare('SELECT * FROM subjects WHERE is_active = 1 ORDER BY name ASC').all();
}

export function getSubjectById(id: number) {
  const db = getDb();
  return db.prepare('SELECT * FROM subjects WHERE id = ?').get(id) as any;
}

export function createSubject(data: { name: string; code?: string; description?: string; color?: string }) {
  const db = getDb();
  const info = db.prepare(`
    INSERT INTO subjects (name, code, description, color, is_active)
    VALUES (?, ?, ?, ?, 1)
  `).run(data.name.trim(), data.code?.trim() || '', data.description?.trim() || '', data.color || '#310064');
  return Number(info.lastInsertRowid);
}

// Teachers
export function getAllTeachers() {
  const db = getDb();
  return db.prepare(`
    SELECT t.*, u.name, u.email, u.is_active as user_active
    FROM teacher_profiles t
    JOIN users u ON t.user_id = u.id
    ORDER BY u.name ASC
  `).all();
}

export function getTeacherById(id: number) {
  const db = getDb();
  return db.prepare(`
    SELECT t.*, u.name, u.email, u.is_active as user_active
    FROM teacher_profiles t
    JOIN users u ON t.user_id = u.id
    WHERE t.id = ?
  `).get(id) as any;
}

export function getTeacherByUserId(userId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT t.*, u.name, u.email, u.is_active as user_active
    FROM teacher_profiles t
    JOIN users u ON t.user_id = u.id
    WHERE t.user_id = ?
  `).get(userId) as any;
}

export function createTeacher(data: {
  name: string;
  email: string;
  passwordPlain: string;
  phone?: string;
  qualification?: string;
  bio?: string;
  subjects?: string[];
  zoom_pmi?: string;
  zoom_host_url?: string;
}) {
  const db = getDb();
  const userId = createUser({
    email: data.email,
    passwordPlain: data.passwordPlain,
    name: data.name,
    role: 'teacher'
  });

  const subjectsJson = JSON.stringify(data.subjects || []);
  const info = db.prepare(`
    INSERT INTO teacher_profiles (user_id, phone, qualification, bio, subjects_json, zoom_pmi, zoom_host_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    data.phone || '',
    data.qualification || 'Subject Authority',
    data.bio || '',
    subjectsJson,
    data.zoom_pmi || '',
    data.zoom_host_url || ''
  );

  return {
    teacherId: Number(info.lastInsertRowid),
    userId
  };
}

// Students
export function getAllStudents(search?: string) {
  const db = getDb();
  let query = `
    SELECT s.*, u.name, u.email, u.is_active as user_active,
      (SELECT COUNT(*) FROM student_enrollments e WHERE e.student_id = s.id AND e.status = 'active') as active_enrollments_count,
      (SELECT COUNT(*) FROM scheduled_classes sc WHERE sc.student_id = s.id) as total_scheduled_sessions,
      (SELECT COUNT(*) FROM scheduled_classes sc WHERE sc.student_id = s.id AND sc.status = 'completed') as completed_sessions
    FROM student_profiles s
    JOIN users u ON s.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (search && search.trim() !== '') {
    query += ' AND (u.name LIKE ? OR u.email LIKE ? OR s.parent_name LIKE ? OR s.grade LIKE ?)';
    const sStr = `%${search.trim()}%`;
    params.push(sStr, sStr, sStr, sStr);
  }

  query += ' ORDER BY u.name ASC';
  return db.prepare(query).all(...params);
}

export function getStudentById(id: number) {
  const db = getDb();
  return db.prepare(`
    SELECT s.*, u.name, u.email, u.is_active as user_active
    FROM student_profiles s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ?
  `).get(id) as any;
}

export function getStudentByUserId(userId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT s.*, u.name, u.email, u.is_active as user_active
    FROM student_profiles s
    JOIN users u ON s.user_id = u.id
    WHERE s.user_id = ?
  `).get(userId) as any;
}

export function createStudent(data: {
  name: string;
  email: string;
  passwordPlain: string;
  parent_name?: string;
  parent_phone?: string;
  grade?: string;
  curriculum?: string;
  timezone?: string;
  enrollments?: Array<{ subject_id: number; total_sessions: number; teacher_id?: number; notes?: string }>;
}) {
  const db = getDb();
  const userId = createUser({
    email: data.email,
    passwordPlain: data.passwordPlain,
    name: data.name,
    role: 'student'
  });

  const studentInfo = db.prepare(`
    INSERT INTO student_profiles (user_id, parent_name, parent_phone, grade, curriculum, timezone)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    data.parent_name || '',
    data.parent_phone || '',
    data.grade || 'Grade 10',
    data.curriculum || 'CBSE',
    data.timezone || 'Asia/Dubai'
  );

  const studentId = Number(studentInfo.lastInsertRowid);

  if (data.enrollments && data.enrollments.length > 0) {
    const insertEnrollment = db.prepare(`
      INSERT INTO student_enrollments (student_id, subject_id, teacher_id, total_sessions, status, notes)
      VALUES (?, ?, ?, ?, 'active', ?)
    `);

    for (const e of data.enrollments) {
      insertEnrollment.run(studentId, e.subject_id, e.teacher_id || null, e.total_sessions || 50, e.notes || '');
    }
  }

  return { studentId, userId };
}

// Enrollments
export function getEnrollmentsByStudentId(studentId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT e.*, sub.name as subject_name, sub.code as subject_code, sub.color as subject_color,
           tu.name as teacher_name, t.phone as teacher_phone,
           (SELECT COUNT(*) FROM scheduled_classes sc WHERE sc.enrollment_id = e.id) as scheduled_count,
           (SELECT COUNT(*) FROM scheduled_classes sc WHERE sc.enrollment_id = e.id AND sc.status = 'completed') as completed_count,
           (SELECT COUNT(*) FROM scheduled_classes sc WHERE sc.enrollment_id = e.id AND sc.status = 'leave_approved') as leave_approved_count
    FROM student_enrollments e
    JOIN subjects sub ON e.subject_id = sub.id
    LEFT JOIN teacher_profiles t ON e.teacher_id = t.id
    LEFT JOIN users tu ON t.user_id = tu.id
    WHERE e.student_id = ?
    ORDER BY sub.name ASC
  `).all(studentId);
}

export function getEnrollmentById(id: number) {
  const db = getDb();
  return db.prepare(`
    SELECT e.*, sub.name as subject_name, sub.code as subject_code, sub.color as subject_color,
           tu.name as teacher_name, su.name as student_name
    FROM student_enrollments e
    JOIN subjects sub ON e.subject_id = sub.id
    LEFT JOIN teacher_profiles t ON e.teacher_id = t.id
    LEFT JOIN users tu ON t.user_id = tu.id
    LEFT JOIN student_profiles s ON e.student_id = s.id
    LEFT JOIN users su ON s.user_id = su.id
    WHERE e.id = ?
  `).get(id) as any;
}

export function createEnrollment(data: {
  student_id: number;
  subject_id: number;
  teacher_id?: number | null;
  total_sessions: number;
  notes?: string;
}) {
  const db = getDb();
  const info = db.prepare(`
    INSERT INTO student_enrollments (student_id, subject_id, teacher_id, total_sessions, status, notes)
    VALUES (?, ?, ?, ?, 'active', ?)
  `).run(
    data.student_id,
    data.subject_id,
    data.teacher_id || null,
    data.total_sessions || 50,
    data.notes || ''
  );
  return Number(info.lastInsertRowid);
}

// Scheduled Classes / Synchronization
export function getClasses(filters: {
  student_id?: number;
  teacher_id?: number;
  subject_id?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  limit?: number;
}) {
  const db = getDb();
  let query = `
    SELECT c.*,
           sub.name as subject_name, sub.code as subject_code, sub.color as subject_color,
           su.name as student_name, sp.grade as student_grade, sp.curriculum as student_curriculum,
           tu.name as teacher_name, tu.email as teacher_email
    FROM scheduled_classes c
    JOIN subjects sub ON c.subject_id = sub.id
    JOIN student_profiles sp ON c.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    JOIN teacher_profiles tp ON c.teacher_id = tp.id
    JOIN users tu ON tp.user_id = tu.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.student_id) {
    query += ' AND c.student_id = ?';
    params.push(filters.student_id);
  }
  if (filters.teacher_id) {
    query += ' AND c.teacher_id = ?';
    params.push(filters.teacher_id);
  }
  if (filters.subject_id) {
    query += ' AND c.subject_id = ?';
    params.push(filters.subject_id);
  }
  if (filters.date) {
    query += ' AND c.session_date = ?';
    params.push(filters.date);
  }
  if (filters.start_date) {
    query += ' AND c.session_date >= ?';
    params.push(filters.start_date);
  }
  if (filters.end_date) {
    query += ' AND c.session_date <= ?';
    params.push(filters.end_date);
  }
  if (filters.status && filters.status !== 'all') {
    query += ' AND c.status = ?';
    params.push(filters.status);
  }

  query += ' ORDER BY c.session_date ASC, c.start_time ASC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
  }

  return db.prepare(query).all(...params);
}

export function getClassById(id: number) {
  const db = getDb();
  return db.prepare(`
    SELECT c.*,
           sub.name as subject_name, sub.code as subject_code, sub.color as subject_color,
           su.name as student_name, su.email as student_email, sp.grade as student_grade, sp.curriculum as student_curriculum,
           tu.name as teacher_name, tu.email as teacher_email
    FROM scheduled_classes c
    JOIN subjects sub ON c.subject_id = sub.id
    JOIN student_profiles sp ON c.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    JOIN teacher_profiles tp ON c.teacher_id = tp.id
    JOIN users tu ON tp.user_id = tu.id
    WHERE c.id = ?
  `).get(id) as any;
}

export function checkScheduleConflicts(params: {
  teacher_id: number;
  student_id: number;
  date: string;
  start_time: string;
  end_time: string;
  exclude_class_id?: number;
}) {
  const db = getDb();
  let query = `
    SELECT c.id, c.session_date, c.start_time, c.end_time, c.teacher_id, c.student_id,
           tu.name as teacher_name, su.name as student_name
    FROM scheduled_classes c
    JOIN teacher_profiles tp ON c.teacher_id = tp.id
    JOIN users tu ON tp.user_id = tu.id
    JOIN student_profiles sp ON c.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    WHERE c.session_date = ?
      AND c.status NOT IN ('cancelled', 'leave_approved')
      AND (
        (c.start_time < ? AND c.end_time > ?) OR
        (c.start_time >= ? AND c.start_time < ?)
      )
  `;
  const queryParams: any[] = [
    params.date,
    params.end_time,
    params.start_time,
    params.start_time,
    params.end_time
  ];

  if (params.exclude_class_id) {
    query += ' AND c.id != ?';
    queryParams.push(params.exclude_class_id);
  }

  const matches = db.prepare(query).all(...queryParams) as any[];

  const teacherClash = matches.find((m) => m.teacher_id === params.teacher_id);
  const studentClash = matches.find((m) => m.student_id === params.student_id);

  return {
    hasConflict: Boolean(teacherClash || studentClash),
    teacherClash: teacherClash ? `Teacher ${teacherClash.teacher_name} is already booked from ${teacherClash.start_time} to ${teacherClash.end_time}` : null,
    studentClash: studentClash ? `Student ${studentClash.student_name} already has a session from ${studentClash.start_time} to ${studentClash.end_time}` : null
  };
}

export function batchGenerateSchedule(params: {
  enrollment_id: number;
  student_id: number;
  teacher_id: number;
  subject_id: number;
  total_sessions: number;
  days_of_week: number[]; // 1 = Monday, 2 = Tuesday, ... 7 = Sunday
  start_time: string;
  end_time: string;
  start_date: string;
  timezone?: string;
}) {
  const db = getDb();
  const subject = getSubjectById(params.subject_id);
  const subjectName = subject ? subject.name : 'Session';

  // Find existing session count for this enrollment
  const existingCountRow = db.prepare('SELECT COUNT(*) as count FROM scheduled_classes WHERE enrollment_id = ?').get(params.enrollment_id) as { count: number };
  let currentSessionNum = existingCountRow ? existingCountRow.count : 0;

  const generatedSessions: any[] = [];
  const currentDate = new Date(params.start_date);
  const maxIterations = 365 * 2; // prevent infinite loops
  let iterations = 0;

  while (generatedSessions.length < params.total_sessions && iterations < maxIterations) {
    iterations++;
    // Get ISO day of week: Monday=1, Sunday=7
    let dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;

    if (params.days_of_week.includes(dayOfWeek)) {
      currentSessionNum++;
      const dateStr = currentDate.toISOString().split('T')[0];
      const pad = String(currentSessionNum).padStart(2, '0');

      // Check conflict
      const conflict = checkScheduleConflicts({
        teacher_id: params.teacher_id,
        student_id: params.student_id,
        date: dateStr,
        start_time: params.start_time,
        end_time: params.end_time
      });

      generatedSessions.push({
        session_number: currentSessionNum,
        title: `${subjectName} Session ${pad}: ${getSessionTopic(currentSessionNum)}`,
        session_date: dateStr,
        start_time: params.start_time,
        end_time: params.end_time,
        duration_minutes: 60,
        timezone: params.timezone || 'Asia/Dubai',
        has_conflict: conflict.hasConflict,
        conflict_detail: conflict.teacherClash || conflict.studentClash || null
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return generatedSessions;
}

export function confirmBatchSchedule(sessions: Array<{
  enrollment_id: number;
  student_id: number;
  teacher_id: number;
  subject_id: number;
  session_number: number;
  title: string;
  session_date: string;
  start_time: string;
  end_time: string;
  duration_minutes?: number;
  timezone?: string;
}>) {
  const db = getDb();
  const insert = db.prepare(`
    INSERT INTO scheduled_classes (
      enrollment_id, student_id, teacher_id, subject_id, session_number,
      title, session_date, start_time, end_time, duration_minutes, timezone,
      status, zoom_meeting_id, zoom_join_url, zoom_start_url, zoom_passcode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, ?, ?, ?)
  `);

  const createdIds: number[] = [];
  const transaction = db.transaction((items: typeof sessions) => {
    for (const s of items) {
      const pad = String(s.session_number).padStart(2, '0');
      const meetingId = `987-${s.subject_id}${s.student_id}-${pad}`;
      const zoomJoin = `https://zoom.us/j/${meetingId.replace(/-/g, '')}?pwd=tutorastra${pad}`;
      const zoomStart = `https://zoom.us/s/${meetingId.replace(/-/g, '')}?pwd=tutorastra${pad}`;

      const res = insert.run(
        s.enrollment_id,
        s.student_id,
        s.teacher_id,
        s.subject_id,
        s.session_number,
        s.title,
        s.session_date,
        s.start_time,
        s.end_time,
        s.duration_minutes || 60,
        s.timezone || 'Asia/Dubai',
        meetingId,
        zoomJoin,
        zoomStart,
        `TA${pad}`
      );
      createdIds.push(Number(res.lastInsertRowid));
    }
  });

  transaction(sessions);
  return createdIds;
}

export function rescheduleClass(id: number, newDate: string, newStartTime: string, newEndTime: string, reason?: string) {
  const db = getDb();
  const current = getClassById(id);
  if (!current) throw new Error('Class session not found.');

  const conflict = checkScheduleConflicts({
    teacher_id: current.teacher_id,
    student_id: current.student_id,
    date: newDate,
    start_time: newStartTime,
    end_time: newEndTime,
    exclude_class_id: id
  });

  if (conflict.hasConflict) {
    throw new Error(conflict.teacherClash || conflict.studentClash || 'Schedule conflict detected for the selected time slot.');
  }

  db.prepare(`
    UPDATE scheduled_classes SET
      session_date = ?,
      start_time = ?,
      end_time = ?,
      status = 'rescheduled',
      teacher_notes = CASE WHEN ? IS NOT NULL THEN (COALESCE(teacher_notes, '') || ' | Rescheduled: ' || ?) ELSE teacher_notes END,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(newDate, newStartTime, newEndTime, reason || null, reason || 'None', id);
}

export function cancelClass(id: number, reason?: string) {
  const db = getDb();
  db.prepare(`
    UPDATE scheduled_classes SET
      status = 'cancelled',
      teacher_notes = CASE WHEN ? IS NOT NULL THEN (COALESCE(teacher_notes, '') || ' | Cancelled: ' || ?) ELSE teacher_notes END,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(reason || null, reason || 'Cancelled by Admin', id);
}

// Student Leaves
export function getAllLeaves(studentId?: number) {
  const db = getDb();
  let query = `
    SELECT l.*,
           c.session_date, c.start_time, c.end_time, c.title as class_title, c.session_number,
           sub.name as subject_name,
           su.name as student_name, tu.name as teacher_name
    FROM student_leaves l
    JOIN scheduled_classes c ON l.class_id = c.id
    JOIN subjects sub ON l.subject_id = sub.id
    JOIN student_profiles sp ON l.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    JOIN teacher_profiles tp ON c.teacher_id = tp.id
    JOIN users tu ON tp.user_id = tu.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (studentId) {
    query += ' AND l.student_id = ?';
    params.push(studentId);
  }

  query += ' ORDER BY l.requested_at DESC';
  return db.prepare(query).all(...params);
}

export function applyStudentLeave(studentId: number, classId: number, reason: string) {
  const db = getDb();
  const cls = getClassById(classId);
  if (!cls) throw new Error('Class session not found.');
  if (cls.student_id !== studentId) throw new Error('Unauthorized to apply leave for this session.');

  if (cls.status === 'completed' || cls.status === 'cancelled' || cls.status === 'leave_approved') {
    throw new Error(`Cannot request leave for a session with status "${cls.status}".`);
  }

  // 12-hour advance requirement check
  const classDateTimeStr = `${cls.session_date}T${cls.start_time}:00`;
  const classTime = new Date(classDateTimeStr).getTime();
  const nowTime = Date.now();
  const diffHours = (classTime - nowTime) / (1000 * 60 * 60);

  if (diffHours < 12) {
    throw new Error('Leave requests require at least 12 hours advance notice prior to scheduled class start time.');
  }

  // Max 2 leaves per month per subject check
  const classMonth = cls.session_date.substring(0, 7); // YYYY-MM
  const monthLeaves = db.prepare(`
    SELECT count(*) as count
    FROM student_leaves l
    JOIN scheduled_classes c ON l.class_id = c.id
    WHERE l.student_id = ? AND l.subject_id = ? AND c.session_date LIKE ? AND l.status = 'approved'
  `).get(studentId, cls.subject_id, `${classMonth}%`) as { count: number };

  if (monthLeaves.count >= 2) {
    throw new Error(`Maximum allowance reached: You can request at most 2 approved leaves per month per subject (Used: ${monthLeaves.count}/2 for ${classMonth}).`);
  }

  // Auto-approve per client policy
  const leaveRes = db.prepare(`
    INSERT INTO student_leaves (student_id, class_id, subject_id, reason, status)
    VALUES (?, ?, ?, ?, 'approved')
  `).run(studentId, classId, cls.subject_id, reason.trim());

  const leaveId = Number(leaveRes.lastInsertRowid);

  // Update original class status to leave_approved
  db.prepare(`
    UPDATE scheduled_classes SET
      status = 'leave_approved',
      attendance_status = 'excused',
      teacher_notes = COALESCE(teacher_notes, '') || ' | Leave approved: ' || ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(reason.trim(), classId);

  // Update enrollment leave count
  if (cls.enrollment_id) {
    db.prepare(`
      UPDATE student_enrollments SET
        leave_approved_sessions = leave_approved_sessions + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(cls.enrollment_id);
  }

  // Automatically create a Replacement Session Entitlement at the end of the schedule
  const lastSession = db.prepare(`
    SELECT MAX(session_number) as max_num, MAX(session_date) as max_date
    FROM scheduled_classes
    WHERE enrollment_id = ?
  `).get(cls.enrollment_id) as { max_num: number; max_date: string } | undefined;

  const nextSessionNum = (lastSession?.max_num || cls.session_number) + 1;
  const replacementDate = new Date(lastSession?.max_date || cls.session_date);
  replacementDate.setDate(replacementDate.getDate() + 7); // 1 week after last session
  const replDateStr = replacementDate.toISOString().split('T')[0];
  const pad = String(nextSessionNum).padStart(2, '0');

  const replRes = db.prepare(`
    INSERT INTO scheduled_classes (
      enrollment_id, student_id, teacher_id, subject_id, session_number,
      title, session_date, start_time, end_time, duration_minutes, timezone,
      status, zoom_meeting_id, zoom_join_url, zoom_start_url, zoom_passcode,
      teacher_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, ?, ?, ?, ?)
  `).run(
    cls.enrollment_id,
    cls.student_id,
    cls.teacher_id,
    cls.subject_id,
    nextSessionNum,
    `${cls.subject_name} Session ${pad}: Replacement for Session ${cls.session_number}`,
    replDateStr,
    cls.start_time,
    cls.end_time,
    cls.duration_minutes || 60,
    cls.timezone || 'Asia/Dubai',
    `987-RPL-${pad}`,
    `https://zoom.us/j/987RPL${pad}?pwd=tutorastrarepl${pad}`,
    `https://zoom.us/s/987RPL${pad}?pwd=tutorastrarepl${pad}`,
    `TAR${pad}`,
    `Replacement session granted for approved leave on session ${cls.session_number}.`
  );

  const replacementId = Number(replRes.lastInsertRowid);
  db.prepare('UPDATE student_leaves SET replacement_session_id = ? WHERE id = ?').run(replacementId, leaveId);

  return {
    leaveId,
    replacementId,
    status: 'approved'
  };
}

// Teacher Box Messaging
export function getTeacherBoxMessages(userId1: number, userId2: number) {
  const db = getDb();
  return db.prepare(`
    SELECT m.*, su.name as sender_name, ru.name as receiver_name
    FROM teacher_box_messages m
    JOIN users su ON m.sender_user_id = su.id
    JOIN users ru ON m.receiver_user_id = ru.id
    WHERE (m.sender_user_id = ? AND m.receiver_user_id = ?)
       OR (m.sender_user_id = ? AND m.receiver_user_id = ?)
    ORDER BY m.created_at ASC
  `).all(userId1, userId2, userId2, userId1);
}

export function sendTeacherBoxMessage(data: {
  sender_user_id: number;
  receiver_user_id: number;
  student_id?: number | null;
  teacher_id?: number | null;
  subject_id?: number | null;
  message?: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_type?: string;
  attachment_size?: number;
}) {
  const db = getDb();
  const info = db.prepare(`
    INSERT INTO teacher_box_messages (
      sender_user_id, receiver_user_id, student_id, teacher_id, subject_id,
      message, attachment_url, attachment_name, attachment_type, attachment_size
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.sender_user_id,
    data.receiver_user_id,
    data.student_id || null,
    data.teacher_id || null,
    data.subject_id || null,
    data.message?.trim() || '',
    data.attachment_url || '',
    data.attachment_name || '',
    data.attachment_type || '',
    data.attachment_size || 0
  );
  return Number(info.lastInsertRowid);
}

export function markTeacherBoxMessagesRead(senderUserId: number, receiverUserId: number) {
  const db = getDb();
  db.prepare(`
    UPDATE teacher_box_messages SET is_read = 1
    WHERE sender_user_id = ? AND receiver_user_id = ? AND is_read = 0
  `).run(senderUserId, receiverUserId);
}

// Class Recordings
export function getStudentRecordings(studentId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT r.*, sub.name as subject_name, sub.color as subject_color,
           c.session_number, c.session_date, tu.name as teacher_name
    FROM class_recordings r
    JOIN scheduled_classes c ON r.class_id = c.id
    JOIN subjects sub ON r.subject_id = sub.id
    JOIN teacher_profiles tp ON c.teacher_id = tp.id
    JOIN users tu ON tp.user_id = tu.id
    WHERE r.student_id = ? AND r.is_deleted = 0
    ORDER BY c.session_date DESC
  `).all(studentId);
}

export function markRecordingConsumed(recordingId: number, studentId: number) {
  const db = getDb();
  const rec = db.prepare('SELECT * FROM class_recordings WHERE id = ? AND student_id = ?').get(recordingId, studentId) as any;
  if (!rec) throw new Error('Recording not found or unauthorized.');

  db.prepare(`
    UPDATE class_recordings SET
      view_count = view_count + 1,
      is_consumed = 1,
      consumed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(recordingId);
}

// AI Assessments (Ms. Violet)
export function getStudentAssessments(studentId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT a.*, sub.name as subject_name, sub.color as subject_color
    FROM ai_assessments a
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE a.student_id = ?
    ORDER BY a.created_at DESC
  `).all(studentId);
}

export function getAssessmentById(id: number) {
  const db = getDb();
  return db.prepare(`
    SELECT a.*, sub.name as subject_name, su.name as student_name
    FROM ai_assessments a
    JOIN subjects sub ON a.subject_id = sub.id
    JOIN student_profiles sp ON a.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    WHERE a.id = ?
  `).get(id) as any;
}

export function createAssessment(data: {
  student_id: number;
  subject_id: number;
  title: string;
  document_name?: string;
  extracted_text?: string;
  test_type: 'mcq' | 'written';
  time_limit_minutes: number;
  questions_json: string;
}) {
  const db = getDb();
  const info = db.prepare(`
    INSERT INTO ai_assessments (
      student_id, subject_id, title, document_name, extracted_text,
      test_type, time_limit_minutes, questions_json, status, started_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'in_progress', CURRENT_TIMESTAMP)
  `).run(
    data.student_id,
    data.subject_id,
    data.title,
    data.document_name || '',
    data.extracted_text || '',
    data.test_type,
    data.time_limit_minutes,
    data.questions_json
  );
  return Number(info.lastInsertRowid);
}

export function submitAssessmentAnswers(id: number, answersJson: string, score: number, maxScore: number, aiFeedback: string) {
  const db = getDb();
  db.prepare(`
    UPDATE ai_assessments SET
      answers_json = ?,
      score = ?,
      max_score = ?,
      ai_feedback = ?,
      status = 'completed',
      submitted_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(answersJson, score, maxScore, aiFeedback, id);
}

export function updateAssessmentTeacherReview(id: number, teacherNotes: string) {
  const db = getDb();
  db.prepare(`
    UPDATE ai_assessments SET
      teacher_reviewed = 1,
      teacher_notes = ?
    WHERE id = ?
  `).run(teacherNotes, id);
}

export function getAllAssessments(limit = 100) {
  const db = getDb();
  return db.prepare(`
    SELECT a.*, sub.name as subject_name, sub.color as subject_color,
           su.name as student_name, su.email as student_email
    FROM ai_assessments a
    JOIN subjects sub ON a.subject_id = sub.id
    JOIN student_profiles sp ON a.student_id = sp.id
    JOIN users su ON sp.user_id = su.id
    ORDER BY a.created_at DESC LIMIT ?
  `).all(limit);
}

// Email Notifications
export function getAllEmailLogs(limit = 50) {
  const db = getDb();
  return db.prepare('SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT ?').all(limit);
}

export function logEmail(data: {
  recipient_email: string;
  recipient_name?: string;
  template_type: string;
  subject: string;
  body_preview?: string;
  payload_json?: string;
  status?: string;
  error_message?: string;
}) {
  const db = getDb();
  const info = db.prepare(`
    INSERT INTO email_logs (
      recipient_email, recipient_name, template_type, subject,
      body_preview, payload_json, status, error_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.recipient_email,
    data.recipient_name || '',
    data.template_type,
    data.subject,
    data.body_preview || '',
    data.payload_json || '',
    data.status || 'sent',
    data.error_message || ''
  );
  return Number(info.lastInsertRowid);
}

// ----------------- PRESERVED EXISTING HELPERS -----------------
export function getAllCourses() {
  const db = getDb();
  return db.prepare('SELECT * FROM courses ORDER BY id ASC').all();
}

export function getPublishedCourses() {
  const db = getDb();
  return db.prepare('SELECT * FROM courses WHERE is_published = 1 ORDER BY id ASC').all();
}

export function getCourseBySlug(slug: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM courses WHERE slug = ?').get(slug);
}

export function createCourse(data: any) {
  const db = getDb();
  const info = db.prepare(`
    INSERT INTO courses (
      slug, title, tagline, stream, curriculum, grades, price_aed, duration,
      description, learning_outcomes, image_url, badge, is_published, is_featured, schedule_info
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.slug, data.title, data.tagline, data.stream, data.curriculum,
    typeof data.grades === 'string' ? data.grades : JSON.stringify(data.grades || []),
    Number(data.price_aed) || 0, data.duration || '12 Weeks per Term',
    data.description || '',
    typeof data.learning_outcomes === 'string' ? data.learning_outcomes : JSON.stringify(data.learning_outcomes || []),
    data.image_url || '', data.badge || '', data.is_published ? 1 : 0, data.is_featured ? 1 : 0,
    data.schedule_info || ''
  );
  return Number(info.lastInsertRowid);
}

export function updateCourse(id: number, data: any) {
  const db = getDb();
  db.prepare(`
    UPDATE courses SET
      slug = ?, title = ?, tagline = ?, stream = ?, curriculum = ?, grades = ?,
      price_aed = ?, duration = ?, description = ?, learning_outcomes = ?,
      image_url = ?, badge = ?, is_published = ?, is_featured = ?, schedule_info = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    data.slug, data.title, data.tagline, data.stream, data.curriculum,
    typeof data.grades === 'string' ? data.grades : JSON.stringify(data.grades || []),
    Number(data.price_aed) || 0, data.duration,
    data.description,
    typeof data.learning_outcomes === 'string' ? data.learning_outcomes : JSON.stringify(data.learning_outcomes || []),
    data.image_url, data.badge, data.is_published ? 1 : 0, data.is_featured ? 1 : 0,
    data.schedule_info, id
  );
}

export function deleteCourse(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM courses WHERE id = ?').run(id);
}

export function getAllPackages() {
  const db = getDb();
  return db.prepare('SELECT * FROM course_packages ORDER BY id ASC').all();
}

export function updatePackage(id: number, data: any) {
  const db = getDb();
  db.prepare(`
    UPDATE course_packages SET
      name = ?, subtitle = ?, streams_included = ?, price_aed = ?,
      billing_period = ?, features = ?, is_popular = ?, is_published = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    data.name, data.subtitle,
    typeof data.streams_included === 'string' ? data.streams_included : JSON.stringify(data.streams_included || []),
    Number(data.price_aed) || 0, data.billing_period || 'per term',
    typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []),
    data.is_popular ? 1 : 0, data.is_published ? 1 : 0, id
  );
}

export function getAllCurriculum() {
  const db = getDb();
  return db.prepare('SELECT * FROM curriculum_topics ORDER BY curriculum, subject, grade, term ASC').all();
}

export function getCurriculumTopicById(id: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM curriculum_topics WHERE id = ?').get(id);
}

export function updateCurriculumTopic(id: string, data: any) {
  const db = getDb();
  db.prepare(`
    UPDATE curriculum_topics SET
      term_title = ?, duration = ?, topics_json = ?, learning_approach = ?,
      assessments_json = ?, capstone = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    data.term_title, data.duration,
    typeof data.topics_json === 'string' ? data.topics_json : JSON.stringify(data.topics || []),
    data.learning_approach,
    typeof data.assessments_json === 'string' ? data.assessments_json : JSON.stringify(data.assessments || []),
    data.capstone || '', id
  );
}

export function createEnquiry(data: {
  type: 'free_trial' | 'contact';
  name: string;
  email: string;
  phone?: string;
  student_name?: string;
  grade?: string;
  curriculum?: string;
  interested_stream?: string;
  preferred_contact_method?: string;
  subject?: string;
  message?: string;
}) {
  const db = getDb();
  const info = db.prepare(`
    INSERT INTO enquiries (
      type, name, email, phone, student_name, grade, curriculum,
      interested_stream, preferred_contact_method, subject, message, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
  `).run(
    data.type, data.name, data.email, data.phone || '', data.student_name || '',
    data.grade || '', data.curriculum || '', data.interested_stream || '',
    data.preferred_contact_method || 'WhatsApp', data.subject || '', data.message || ''
  );
  return Number(info.lastInsertRowid);
}

export function getAllEnquiries(typeFilter?: string, statusFilter?: string, search?: string) {
  const db = getDb();
  let query = 'SELECT * FROM enquiries WHERE 1=1';
  const params: any[] = [];

  if (typeFilter && typeFilter !== 'all') {
    query += ' AND type = ?';
    params.push(typeFilter);
  }

  if (statusFilter && statusFilter !== 'all') {
    query += ' AND status = ?';
    params.push(statusFilter);
  }

  if (search && search.trim() !== '') {
    query += ' AND (name LIKE ? OR email LIKE ? OR student_name LIKE ? OR phone LIKE ?)';
    const s = `%${search.trim()}%`;
    params.push(s, s, s, s);
  }

  query += ' ORDER BY created_at DESC';
  return db.prepare(query).all(...params);
}

export function getEnquiryById(id: number) {
  const db = getDb();
  return db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id);
}

export function updateEnquiryStatus(id: number, status: string, internal_notes?: string) {
  const db = getDb();
  if (internal_notes !== undefined) {
    db.prepare(`
      UPDATE enquiries SET status = ?, internal_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(status, internal_notes, id);
  } else {
    db.prepare(`
      UPDATE enquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(status, id);
  }
}

export function deleteEnquiry(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM enquiries WHERE id = ?').run(id);
}

export function logActivity(admin_email: string, action: string, target_type: string, target_id?: string, details?: string) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO admin_activity_log (admin_email, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, ?)
    `).run(admin_email, action, target_type, target_id || '', details || '');
  } catch (e) {
    console.error('Failed to log admin activity:', e);
  }
}

export function getRecentActivities(limit = 25) {
  const db = getDb();
  return db.prepare('SELECT * FROM admin_activity_log ORDER BY created_at DESC LIMIT ?').all(limit);
}

export function getDashboardStats() {
  const db = getDb();
  const totalEnquiries = db.prepare('SELECT count(*) as count FROM enquiries').get() as { count: number };
  const newEnquiries = db.prepare("SELECT count(*) as count FROM enquiries WHERE status = 'New'").get() as { count: number };
  const totalStudents = db.prepare('SELECT count(*) as count FROM student_profiles WHERE is_active = 1').get() as { count: number };
  const totalTeachers = db.prepare('SELECT count(*) as count FROM teacher_profiles WHERE is_active = 1').get() as { count: number };
  const activeEnrollments = db.prepare("SELECT count(*) as count FROM student_enrollments WHERE status = 'active'").get() as { count: number };
  const classesToday = db.prepare(`SELECT count(*) as count FROM scheduled_classes WHERE session_date = date('now')`).get() as { count: number };
  const totalScheduledClasses = db.prepare('SELECT count(*) as count FROM scheduled_classes').get() as { count: number };
  const pendingLeaves = db.prepare("SELECT count(*) as count FROM student_leaves WHERE status = 'approved'").get() as { count: number };

  return {
    totalEnquiries: totalEnquiries.count,
    newEnquiries: newEnquiries.count,
    totalStudents: totalStudents.count,
    totalTeachers: totalTeachers.count,
    activeEnrollments: activeEnrollments.count,
    classesToday: classesToday.count,
    totalScheduledClasses: totalScheduledClasses.count,
    pendingLeaves: pendingLeaves.count
  };
}

export function getAllSettings(): Record<string, string> {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM website_settings').all() as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export function getSetting(key: string, defaultValue = ''): string {
  const db = getDb();
  const row = db.prepare('SELECT value FROM website_settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row ? row.value : defaultValue;
}

export function updateSetting(key: string, value: string) {
  const db = getDb();
  db.prepare(`
    INSERT INTO website_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(key, value);
}

export function updateSettingsBatch(record: Record<string, string>) {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO website_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `);
  const transaction = db.transaction((entries: [string, string][]) => {
    for (const [k, v] of entries) {
      upsert.run(k, v);
    }
  });
  transaction(Object.entries(record));
}

// ==========================================
// NEW MODULES: FREE HOURS, NOTIFICATIONS, TEACHER LEAVES, PERMISSIONS
// ==========================================

export function getTeacherFreeHours(teacherId?: number) {
  const db = getDb();
  let q = `
    SELECT tfh.*, u.name as teacher_name
    FROM teacher_free_hours tfh
    JOIN teacher_profiles tp ON tfh.teacher_id = tp.id
    JOIN users u ON tp.user_id = u.id
    WHERE tfh.is_active = 1
  `;
  const params: any[] = [];
  if (teacherId) {
    q += ' AND tfh.teacher_id = ?';
    params.push(teacherId);
  }
  q += ' ORDER BY tfh.day_of_week ASC, tfh.start_time ASC';
  return db.prepare(q).all(...params);
}

export function addTeacherFreeHour(data: { teacher_id: number; day_of_week: number; start_time: string; end_time: string; note?: string }) {
  const db = getDb();
  return db.prepare(`
    INSERT INTO teacher_free_hours (teacher_id, day_of_week, start_time, end_time, note)
    VALUES (?, ?, ?, ?, ?)
  `).run(data.teacher_id, data.day_of_week, data.start_time, data.end_time, data.note || 'Available for 1-on-1');
}

export function deleteTeacherFreeHour(id: number) {
  const db = getDb();
  return db.prepare('DELETE FROM teacher_free_hours WHERE id = ?').run(id);
}

export function getPortalNotifications(role?: string) {
  const db = getDb();
  let q = `
    SELECT pn.*, u.name as sender_name
    FROM portal_notifications pn
    JOIN users u ON pn.sender_user_id = u.id
  `;
  const params: any[] = [];
  if (role && role !== 'admin') {
    q += ' WHERE pn.target_audience = "all" OR pn.target_audience = ?';
    params.push(role === 'student' ? 'students' : 'teachers');
  }
  q += ' ORDER BY pn.created_at DESC';
  return db.prepare(q).all(...params);
}

export function createPortalNotification(data: { sender_user_id: number; target_audience: string; title: string; message: string; priority?: string }) {
  const db = getDb();
  return db.prepare(`
    INSERT INTO portal_notifications (sender_user_id, target_audience, title, message, priority)
    VALUES (?, ?, ?, ?, ?)
  `).run(data.sender_user_id, data.target_audience, data.title, data.message, data.priority || 'normal');
}

export function deletePortalNotification(id: number) {
  const db = getDb();
  return db.prepare('DELETE FROM portal_notifications WHERE id = ?').run(id);
}

export function getTeacherLeaves(teacherId?: number) {
  const db = getDb();
  let q = `
    SELECT tl.*, u.name as teacher_name, cu.name as cover_teacher_name
    FROM teacher_leaves tl
    JOIN teacher_profiles tp ON tl.teacher_id = tp.id
    JOIN users u ON tp.user_id = u.id
    LEFT JOIN teacher_profiles ctp ON tl.cover_teacher_id = ctp.id
    LEFT JOIN users cu ON ctp.user_id = cu.id
  `;
  const params: any[] = [];
  if (teacherId) {
    q += ' WHERE tl.teacher_id = ?';
    params.push(teacherId);
  }
  q += ' ORDER BY tl.created_at DESC';
  return db.prepare(q).all(...params);
}

export function applyTeacherLeave(data: { teacher_id: number; start_date: string; end_date: string; reason: string; cover_teacher_id?: number }) {
  const db = getDb();
  return db.prepare(`
    INSERT INTO teacher_leaves (teacher_id, start_date, end_date, reason, cover_teacher_id, status)
    VALUES (?, ?, ?, ?, ?, 'approved')
  `).run(data.teacher_id, data.start_date, data.end_date, data.reason, data.cover_teacher_id || null);
}

export function updateTeacherLeaveStatus(id: number, status: string, adminNotes?: string) {
  const db = getDb();
  return db.prepare('UPDATE teacher_leaves SET status = ?, admin_notes = ? WHERE id = ?').run(status, adminNotes || '', id);
}

export function getAccountPermissions(role: string) {
  const db = getDb();
  const perm = db.prepare('SELECT * FROM account_permissions WHERE role = ?').get(role);
  if (!perm) {
    return {
      role,
      can_view_recordings: 1,
      can_apply_leaves: 1,
      can_use_chat: 1,
      can_take_ai_test: 1,
      can_view_other_contacts: role === 'student' ? 0 : 1
    };
  }
  return perm;
}

export function updateAccountPermissions(role: string, perms: { can_view_recordings: number; can_apply_leaves: number; can_use_chat: number; can_take_ai_test: number; can_view_other_contacts: number }) {
  const db = getDb();
  db.prepare(`
    INSERT INTO account_permissions (role, can_view_recordings, can_apply_leaves, can_use_chat, can_take_ai_test, can_view_other_contacts, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(role) DO UPDATE SET
      can_view_recordings = excluded.can_view_recordings,
      can_apply_leaves = excluded.can_apply_leaves,
      can_use_chat = excluded.can_use_chat,
      can_take_ai_test = excluded.can_take_ai_test,
      can_view_other_contacts = excluded.can_view_other_contacts,
      updated_at = CURRENT_TIMESTAMP
  `).run(role, perms.can_view_recordings, perms.can_apply_leaves, perms.can_use_chat, perms.can_take_ai_test, perms.can_view_other_contacts);
}

export function deleteSubject(id: number) {
  const db = getDb();
  return db.prepare('DELETE FROM subjects WHERE id = ?').run(id);
}

export function getAssignments(filters?: { teacher_id?: number; student_id?: number }) {
  const db = getDb();
  let q = `
    SELECT 
      a.*,
      s.name as subject_name,
      s.code as subject_code,
      s.color as subject_color,
      tp.name as teacher_name,
      sp.name as student_name
    FROM assignments a
    JOIN subjects s ON a.subject_id = s.id
    JOIN teacher_profiles tp ON a.teacher_id = tp.id
    JOIN student_profiles sp ON a.student_id = sp.id
  `;
  const params: any[] = [];
  const conditions: string[] = [];

  if (filters?.teacher_id) {
    conditions.push('a.teacher_id = ?');
    params.push(filters.teacher_id);
  }
  if (filters?.student_id) {
    conditions.push('a.student_id = ?');
    params.push(filters.student_id);
  }

  if (conditions.length > 0) {
    q += ' WHERE ' + conditions.join(' AND ');
  }

  q += ' ORDER BY a.due_date ASC, a.created_at DESC';
  return db.prepare(q).all(...params);
}

export function createAssignment(data: {
  teacher_id: number;
  student_id: number;
  subject_id: number;
  title: string;
  description?: string;
  due_date: string;
  max_marks?: number;
}) {
  const db = getDb();
  return db.prepare(`
    INSERT INTO assignments (teacher_id, student_id, subject_id, title, description, due_date, max_marks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.teacher_id,
    data.student_id,
    data.subject_id,
    data.title,
    data.description || '',
    data.due_date,
    data.max_marks || 100
  );
}

export function updateAssignment(id: number, data: { status?: string; obtained_marks?: number; feedback?: string }) {
  const db = getDb();
  const sets: string[] = [];
  const params: any[] = [];

  if (data.status !== undefined) {
    sets.push('status = ?');
    params.push(data.status);
  }
  if (data.obtained_marks !== undefined) {
    sets.push('obtained_marks = ?');
    params.push(data.obtained_marks);
  }
  if (data.feedback !== undefined) {
    sets.push('feedback = ?');
    params.push(data.feedback);
  }

  if (sets.length === 0) return;
  params.push(id);

  return db.prepare(`UPDATE assignments SET ${sets.join(', ')} WHERE id = ?`).run(...params);
}

export function deleteAssignment(id: number) {
  const db = getDb();
  return db.prepare('DELETE FROM assignments WHERE id = ?').run(id);
}
