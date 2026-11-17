'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Video,
  MessageSquare,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Loader2
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      try {
        const res = await fetch('/api/student/dashboard');
        if (res.ok) {
          const d = await res.json();
          setData(d);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
    const timer = setInterval(loadStudentData, 30000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#5A5A65]">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
        <span>Loading your personalized student learning dashboard...</span>
      </div>
    );
  }

  const { student, enrollments, todayClasses, nextClass, stats } = data || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* ROW 1: NEXT CLASS COUNTDOWN BANNER (15-Minute Zoom Unlock) */}
      <div className="bg-gradient-to-r from-[#220046] via-[#310064] to-[#430080] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#F4CC45]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-heading font-semibold text-[#F4CC45] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Upcoming 1-on-1 Session</span>
            </div>

            {nextClass ? (
              <>
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight">
                  {nextClass.title}
                </h2>
                <div className="text-xs sm:text-sm text-purple-200 flex flex-wrap items-center gap-4 pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-[#F4CC45]" />
                    <span>{nextClass.session_date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-[#F4CC45]" />
                    <span>{nextClass.start_time} - {nextClass.end_time} ({nextClass.timezone || 'Asia/Dubai'})</span>
                  </span>
                  <span>•</span>
                  <span>Dedicated Mentor: <strong>{nextClass.teacher_name}</strong></span>
                </div>
              </>
            ) : (
              <h2 className="text-xl font-heading font-bold">
                All scheduled classes for today are completed. Check upcoming dates below.
              </h2>
            )}
          </div>

          {/* Zoom Action Button with 15-Minute Rule */}
          <div className="shrink-0">
            {todayClasses && todayClasses.length > 0 && todayClasses[0].meetingAvailable ? (
              <a
                href={todayClasses[0].joinUrl || `https://zoom.us/j/${todayClasses[0].zoom_meeting_id}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#F4CC45] hover:bg-[#F6D55E] text-[#220046] font-heading font-extrabold text-xs sm:text-sm shadow-lg inline-flex items-center gap-2 transition-all"
              >
                <Video className="w-4 h-4" />
                <span>Join Live Class (Zoom)</span>
              </a>
            ) : (
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-xs text-purple-200 backdrop-blur-md text-left sm:text-right">
                <div className="font-heading font-bold text-white mb-0.5">Meeting Link Locked</div>
                <div className="text-[11px] text-purple-300">
                  Your meeting link will be available 15 minutes before class.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROW 2: ENROLLED SUBJECTS CARDS (Client Example: Science 50, Math 40, Physics 30) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-[#1E1E24]">
              Enrolled Subjects & Total Sessions
            </h3>
            <p className="text-xs text-[#5A5A65]">
              Click any subject to view all individual sessions (Session 01 to Session 50) with confirmed dates and times.
            </p>
          </div>
          <Link
            href="/student/subjects"
            className="text-xs font-heading font-bold text-[#310064] hover:underline flex items-center gap-1"
          >
            <span>View All Subjects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {enrollments?.map((enr: any) => {
            const completed = enr.completed_count || 0;
            const total = enr.total_sessions || 50;
            const remaining = Math.max(0, total - completed);
            const percent = Math.min(100, Math.round((completed / total) * 100));

            return (
              <Link
                key={enr.id}
                href={`/student/subjects/${enr.id}`}
                className="bg-white rounded-2xl border border-[#ECE6DA] p-6 shadow-xs hover:border-[#310064] hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: enr.subject_color || '#310064' }} />
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2 py-0.5 rounded">
                      {total} Classes Enrolled
                    </span>
                  </div>

                  <h4 className="font-heading font-extrabold text-lg text-[#1E1E24] mt-3 group-hover:text-[#310064] transition-colors">
                    {enr.subject_name}
                  </h4>
                  <p className="text-xs text-[#5A5A65]">
                    Faculty: <strong>{enr.teacher_name || 'Dr. Sarah Mitchell'}</strong>
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-[#1E1E24]">
                      <span>Progress</span>
                      <span>{completed} / {total} Completed</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF8F5] border border-[#ECE6DA] overflow-hidden">
                      <div
                        className="h-full bg-[#310064] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ECE6DA]/60 flex items-center justify-between text-xs font-heading font-bold text-[#310064]">
                  <span>{remaining} Sessions Remaining</span>
                  <span className="group-hover:translate-x-1 transition-transform">See all {total} sessions →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ROW 3: QUICK ACTION TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Today Classes */}
        <Link
          href="/student/classes"
          className="bg-white p-5 rounded-2xl border border-[#ECE6DA] hover:border-[#310064] transition-all shadow-xs flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F2ECFC] text-[#310064] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-[#310064]" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-[#1E1E24] group-hover:text-[#310064]">
              Today's Classes
            </h4>
            <p className="text-[11px] text-[#5A5A65]">Join live session in Zoom</p>
          </div>
        </Link>

        {/* Tile 2: Teacher Box */}
        <Link
          href="/student/box"
          className="bg-white p-5 rounded-2xl border border-[#ECE6DA] hover:border-[#310064] transition-all shadow-xs flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#FFF9E6] text-[#8C6D00] flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-[#8C6D00]" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-[#1E1E24] group-hover:text-[#310064]">
              Teacher Box
            </h4>
            <p className="text-[11px] text-[#5A5A65]">Ask doubts, share homework</p>
          </div>
        </Link>

        {/* Tile 3: Class Recordings */}
        <Link
          href="/student/recordings"
          className="bg-white p-5 rounded-2xl border border-[#ECE6DA] hover:border-[#310064] transition-all shadow-xs flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F2ECFC] text-[#310064] flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 text-[#310064]" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-[#1E1E24] group-hover:text-[#310064]">
              Class Recordings
            </h4>
            <p className="text-[11px] text-[#5A5A65]">1-time revision playback</p>
          </div>
        </Link>

        {/* Tile 4: Ms. Violet AI Tutor */}
        <Link
          href="/student/ai-tutor"
          className="bg-white p-5 rounded-2xl border border-[#ECE6DA] hover:border-[#310064] transition-all shadow-xs flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F2ECFC] text-[#310064] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[#F4CC45]" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-[#1E1E24] group-hover:text-[#310064]">
              Ms. Violet AI Tutor
            </h4>
            <p className="text-[11px] text-[#5A5A65]">Timed diagnostic test</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
