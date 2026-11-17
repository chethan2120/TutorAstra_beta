'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  BookOpen,
  Calendar,
  Clock,
  MessageSquare,
  GraduationCap,
  Award,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  ExternalLink
} from 'lucide-react';

export default function StudentTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeachers() {
      try {
        const res = await fetch('/api/student/teachers');
        if (res.ok) {
          const d = await res.json();
          setTeachers(d.teachers || []);
          setStudentName(d.studentName || 'Student');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  const getDayNameFromNumber = (n: number) => {
    const names = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return names[n] || 'Day';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black uppercase tracking-wider bg-[#F2ECFC] text-[#310064]">
              Dedicated 1-on-1 Faculty
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
            My Teachers & Mentors
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
            Meet your assigned expert tutors, inspect the subjects they handle, view upcoming classes, and send doubts directly via Teacher Box.
          </p>
        </div>

        <Link
          href="/student/box"
          className="px-4 py-2.5 rounded-xl bg-[#310064] text-white font-heading font-bold text-xs hover:bg-[#430080] shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-[#F4CC45]" />
          <span>Ask Doubt in Teacher Box</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-[#5A5A65]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
          <span>Loading your assigned educators...</span>
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ECE6DA] p-12 text-center space-y-3">
          <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-heading font-bold text-[#1E1E24]">No Teachers Assigned Yet</h3>
          <p className="text-xs text-[#5A5A65]">
            Administration is currently assigning your 1-on-1 subject specialists based on your diagnostic evaluation.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {teachers.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-[#ECE6DA] p-6 sm:p-8 shadow-xs hover:border-[#310064]/40 transition-all space-y-6"
            >
              {/* Teacher Identity Row */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#ECE6DA]">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#310064] to-[#171746] text-[#F4CC45] font-heading font-black text-2xl flex items-center justify-center shadow-sm shrink-0 border-2 border-[#F4CC45]">
                    {t.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Senior Faculty
                      </span>
                      <span className="text-xs text-[#5A5A65]">• {t.experience_years || 12}+ Years Experience</span>
                    </div>

                    <h2 className="text-xl font-heading font-extrabold text-[#1E1E24]">
                      {t.name}
                    </h2>
                    <p className="text-xs text-[#5A5A65] font-medium flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#310064]" />
                      <span>{t.qualification || 'Ph.D. Cambridge, M.Sc Applied Mathematics'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/student/box"
                    className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECFC] border border-[#ECE6DA] text-[#310064] text-xs font-heading font-bold flex items-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-[#310064]" />
                    <span>Message in Teacher Box</span>
                  </Link>

                  <Link
                    href="/student/calendar"
                    className="px-4 py-2 rounded-xl bg-[#310064] text-white text-xs font-heading font-bold hover:bg-[#430080] shadow-xs flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#F4CC45]" />
                    <span>View Class Timetable</span>
                  </Link>
                </div>
              </div>

              {/* Grid: Subjects Handled + Next Class + Free Hours */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. SUBJECTS HANDLED */}
                <div className="bg-[#FAF8F5] rounded-xl p-5 border border-[#ECE6DA] space-y-3">
                  <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] block">
                    Subjects Handled For You
                  </span>
                  <div className="space-y-2">
                    {t.subjects?.map((sub: any) => (
                      <div
                        key={sub.id || sub.name}
                        className="p-2.5 rounded-lg bg-white border border-[#ECE6DA] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: sub.color || '#6425C5' }}
                          />
                          <span className="text-xs font-bold text-[#1E1E24]">{sub.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#5A5A65]">{sub.code || 'CORE'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. NEXT UPCOMING SESSION */}
                <div className="bg-[#FAF8F5] rounded-xl p-5 border border-[#ECE6DA] space-y-3">
                  <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] block">
                    Next 1-on-1 Class
                  </span>
                  {t.nextClass ? (
                    <div className="bg-white p-3.5 rounded-lg border border-[#ECE6DA] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#310064]">{t.nextClass.subject_name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          Scheduled
                        </span>
                      </div>
                      <div className="text-xs text-[#1E1E24] font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t.nextClass.session_date}</span>
                      </div>
                      <div className="text-xs text-[#5A5A65] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#310064]" />
                        <span>{t.nextClass.start_time} - {t.nextClass.end_time}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-lg border border-dashed border-[#ECE6DA] text-xs text-[#5A5A65] text-center">
                      No upcoming sessions scheduled this week.
                    </div>
                  )}
                </div>

                {/* 3. DESIGNATED FREE HOURS & OFFICE DOUBT SLOTS */}
                <div className="bg-[#FAF8F5] rounded-xl p-5 border border-[#ECE6DA] space-y-3">
                  <span className="text-[10px] font-heading font-black uppercase tracking-wider text-emerald-800 block">
                    Teacher Office & Doubt Hours
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {t.freeHours?.length > 0 ? (
                      t.freeHours.slice(0, 3).map((fh: any) => (
                        <div
                          key={fh.id}
                          className="bg-white p-2 rounded-lg border border-emerald-200 text-xs text-[#1E1E24] flex items-center justify-between"
                        >
                          <span className="font-bold text-[11px] text-emerald-800">
                            {getDayNameFromNumber(fh.day_of_week)}
                          </span>
                          <span className="text-[11px] font-mono text-[#5A5A65]">
                            {fh.start_time} - {fh.end_time}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-[#5A5A65]">
                        Available during standard weekday study slots.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
