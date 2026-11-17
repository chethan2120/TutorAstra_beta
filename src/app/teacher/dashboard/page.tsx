'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  Users,
  Video,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  MessageSquare
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Live clock matching screenshot format: 2026-11-17 · 10:40:01 am
    const updateTimer = () => {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(`${dateStr} · ${timeStr}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadTeacherData() {
      try {
        const res = await fetch('/api/teacher/dashboard');
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
    loadTeacherData();
  }, []);

  const togglePunch = () => {
    setIsPunchedIn(!isPunchedIn);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* CARD 1: TODAY'S ATTENDANCE (Recreating exact layout from Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-[#ECE6DA] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
              Today's attendance
            </h2>
            <div className="text-xs text-[#5A5A65] font-mono mt-1">
              {currentTime || '2026-11-17 · 10:40:01 am'}
            </div>

            <div className="mt-4 space-y-1">
              <div className="text-xs text-[#1E1E24] font-semibold">
                Status:{' '}
                <span className={isPunchedIn ? 'text-emerald-700 font-bold' : 'text-slate-400 font-bold'}>
                  {isPunchedIn ? 'Present / In Progress' : 'Off-Duty / Logged Out'}
                </span>
              </div>
              <div className="text-xs text-[#5A5A65]">
                {isPunchedIn
                  ? 'Punched in 17 Nov 2026, 09:00 am • Active Academic Shift'
                  : 'Currently logged out of class duty register.'}
              </div>
            </div>
          </div>

          {/* Punch Button (Deep Burgundy/Purple styled from screenshot) */}
          <button
            type="button"
            onClick={togglePunch}
            className={`px-6 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm text-white shadow-xs transition-all ${
              isPunchedIn ? 'bg-[#310064] hover:bg-[#430080]' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isPunchedIn ? 'Punch Out' : 'Punch In'}
          </button>
        </div>

        {/* Attendance History Field */}
        <div>
          <label className="block text-xs font-heading font-bold text-[#5A5A65] uppercase tracking-wider mb-1.5">
            Attendance history
          </label>
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] text-xs text-[#1E1E24] font-mono">
            {isPunchedIn
              ? '17 Nov 2026, 09:00 am → In Progress (Teaching & Doubt Resolution Active)'
              : 'Shift concluded.'}
          </div>
        </div>
      </div>

      {/* CARD 2: TODAY'S 1-ON-1 SESSIONS & ZOOM 15-MINUTE UNLOCK */}
      <div className="bg-white rounded-2xl border border-[#ECE6DA] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA]">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-[#1E1E24]">
              Today's Live Classes (Zoom 15-Min Lock)
            </h3>
            <p className="text-xs text-[#5A5A65]">
              Meeting links release automatically 15 minutes before the scheduled class time.
            </p>
          </div>
          <Link
            href="/teacher/classes"
            className="text-xs font-heading font-bold text-[#310064] hover:underline flex items-center gap-1"
          >
            <span>View All Today Classes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.todayClasses && data.todayClasses.length > 0 ? (
          <div className="space-y-3">
            {data.todayClasses.map((c: any) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#310064]" />
                    <strong className="font-heading font-bold text-sm text-[#1E1E24]">
                      {c.title}
                    </strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F2ECFC] text-[#310064]">
                      Session #{c.session_number}
                    </span>
                  </div>
                  <div className="text-xs text-[#5A5A65] flex items-center gap-3">
                    <span>Student: <strong>{c.student_name}</strong> ({c.student_grade || 'Grade 10'})</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#310064]" />
                      <span>{c.start_time} - {c.end_time}</span>
                    </span>
                  </div>
                </div>

                {/* 15-Minute Zoom Visibility Button */}
                <div className="text-right">
                  {c.meetingAvailable ? (
                    <a
                      href={c.joinUrl || `https://zoom.us/j/${c.zoom_meeting_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#310064] hover:bg-[#430080] text-white font-heading font-bold text-xs shadow-md inline-flex items-center gap-2"
                    >
                      <Video className="w-4 h-4 text-[#F4CC45]" />
                      <span>Join Class (Zoom Host)</span>
                    </a>
                  ) : (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium">
                      Your meeting link will be available 15 minutes before class.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#5A5A65] border border-dashed border-[#ECE6DA] rounded-xl">
            No remaining sessions scheduled for today. Check your Weekly Calendar for upcoming classes.
          </div>
        )}
      </div>

      {/* CARD 3: ASSIGNED COURSES & STUDENTS (Recreated from Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-[#ECE6DA] p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-heading font-extrabold text-lg text-[#1E1E24]">
          Assigned 1-on-1 Students & Courses
        </h3>
        <p className="text-xs text-[#5A5A65]">
          You are assigned to <strong>3 subjects</strong> and <strong>{data?.assignedStudentsCount || 1} student</strong> in the active teaching register.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Card 1 */}
          <div className="rounded-xl border border-[#ECE6DA] overflow-hidden bg-[#FAF8F5]">
            <img
              src="/hero-slide-1.jpg"
              alt="Science Class"
              className="w-full h-36 object-cover"
            />
            <div className="p-4 space-y-1.5">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2 py-0.5 rounded">
                1-on-1 Enrolment (50 Sessions)
              </span>
              <h4 className="font-heading font-bold text-sm text-[#1E1E24]">
                Ethan Jenkins – Science (Secondary Board Prep)
              </h4>
              <p className="text-xs text-[#5A5A65]">
                CBSE Grade 10 • Electromagnetism, Chemistry Kinetics & Genetics
              </p>
              <div className="pt-2">
                <Link
                  href="/teacher/students/1"
                  className="text-xs font-heading font-bold text-[#310064] hover:underline"
                >
                  View Student Profile & All Sessions →
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-[#ECE6DA] overflow-hidden bg-[#FAF8F5]">
            <img
              src="/hero-slide-2.jpg"
              alt="Physics Track"
              className="w-full h-36 object-cover"
            />
            <div className="p-4 space-y-1.5">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2 py-0.5 rounded">
                1-on-1 Enrolment (30 Sessions)
              </span>
              <h4 className="font-heading font-bold text-sm text-[#1E1E24]">
                Ethan Jenkins – Physics Intensive
              </h4>
              <p className="text-xs text-[#5A5A65]">
                CBSE Grade 10 • Calculus-Based Kinematics & Mechanics
              </p>
              <div className="pt-2">
                <Link
                  href="/teacher/students/1"
                  className="text-xs font-heading font-bold text-[#310064] hover:underline"
                >
                  View Student Profile & All Sessions →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
