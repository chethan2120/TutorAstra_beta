'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  Video,
  CheckCircle2,
  Users,
  Loader2,
  ExternalLink,
  BookOpen,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function StudentCalendarPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const loadCalendar = async () => {
    try {
      const res = await fetch('/api/calendar');
      if (res.ok) {
        const d = await res.json();
        setClasses(d.classes || []);
        setStudentName(d.studentName || 'Ethan Jenkins');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  // Compute 7 days of the current week (Monday to Sunday)
  const getWeekDates = (offsetWeeks: number) => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) + offsetWeeks * 7;
    const monday = new Date(now.setDate(diff));

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push(d);
    }
    return weekDays;
  };

  const weekDays = getWeekDates(currentWeekOffset);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayClasses = classes.filter((c) => c.session_date === todayStr);

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black uppercase tracking-wider bg-[#F2ECFC] text-[#310064]">
              {studentName} • 1-on-1 Timetable
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
            Student Class Calendar & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
            Track your 1-on-1 tutoring sessions, daily start timings, and launch your Zoom classrooms with 1-click access.
          </p>
        </div>

        {/* Week Switcher Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
            className="p-2 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5] hover:bg-[#F2ECFC] text-[#310064] text-xs font-bold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Week</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentWeekOffset(0)}
            className="px-3 py-2 rounded-xl border border-[#ECE6DA] bg-white hover:bg-[#F2ECFC] text-[#310064] text-xs font-heading font-bold"
          >
            Current Week
          </button>
          <button
            type="button"
            onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
            className="p-2 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5] hover:bg-[#F2ECFC] text-[#310064] text-xs font-bold flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next Week</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TODAY'S CLASS BANNER WITH 15-MIN ZOOM UNLOCK */}
      <div className="bg-gradient-to-r from-[#310064] to-[#171746] text-white rounded-2xl p-6 shadow-md border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4CC45] text-[#310064]">
                TODAY'S 1-ON-1 SESSIONS
              </span>
              <span className="text-xs text-purple-200">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-lg font-heading font-bold text-white mt-1">
              {todayClasses.length} Scheduled Class{todayClasses.length === 1 ? '' : 'es'} Today
            </h2>
          </div>

          <div className="text-xs text-purple-200 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F4CC45]" />
            <span>Join link unlocks <strong>15 minutes</strong> before session begins</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {todayClasses.length === 0 ? (
            <div className="col-span-2 py-4 text-center text-xs text-purple-200">
              No classes scheduled for today. Complete any pending worksheets or practice with Ms. Violet!
            </div>
          ) : (
            todayClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#F4CC45]">
                      {cls.subject_name || 'Science'}
                    </span>
                    <h3 className="text-sm font-heading font-bold text-white">
                      Tutor: {cls.teacher_name || 'Dr. Sarah Mitchell'}
                    </h3>
                    <p className="text-xs text-purple-200 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#F4CC45]" />
                      <span>{cls.start_time} - {cls.end_time}</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-white">
                    Live 1-on-1
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-purple-200">
                    {cls.isUnlocked ? 'Classroom is Ready' : cls.meetingMessage || 'Unlocks 15m prior'}
                  </span>

                  {cls.isUnlocked ? (
                    <a
                      href={cls.joinUrl || `https://zoom.us/j/${cls.zoom_meeting_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all animate-bounce"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Class (Zoom)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-white/50 text-xs font-semibold cursor-not-allowed flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Locked (Awaiting 15m)</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-[#5A5A65]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
          <span>Synchronizing your personalized learning timetable...</span>
        </div>
      ) : (
        /* 7-DAY WEEKLY CALENDAR GRID */
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((d, idx) => {
            const dateStr = d.toISOString().split('T')[0];
            const isToday = dateStr === todayStr;
            const dayClasses = classes.filter((c) => c.session_date === dateStr);

            return (
              <div
                key={dateStr}
                className={`rounded-2xl border p-3.5 flex flex-col justify-between min-h-[320px] transition-all ${
                  isToday
                    ? 'bg-[#FFFDF8] border-[#310064] ring-2 ring-[#310064]/20 shadow-sm'
                    : 'bg-white border-[#ECE6DA]'
                }`}
              >
                <div>
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DA]/60 mb-3">
                    <div>
                      <span className="font-heading font-bold text-xs text-[#1E1E24] block">
                        {dayNames[idx]}
                      </span>
                      <span className="text-[10px] text-[#5A5A65]">
                        {d.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Today" />
                    )}
                  </div>

                  {/* Classes List */}
                  <div className="space-y-2">
                    {dayClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] space-y-1 hover:border-[#310064]/40 transition-all text-left"
                      >
                        <div className="flex items-center gap-1.5 font-heading font-bold text-[11px] text-[#310064]">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cls.subject_color || '#310064' }}
                          />
                          <span className="truncate">{cls.subject_name || 'Science'}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-[#1E1E24] truncate">
                          Tutor: {cls.teacher_name}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[#5A5A65]">
                          <Clock className="w-3 h-3 text-[#310064]" />
                          <span>{cls.start_time} - {cls.end_time}</span>
                        </div>
                        {cls.isUnlocked && (
                          <a
                            href={cls.joinUrl || `https://zoom.us/j/${cls.zoom_meeting_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block text-center py-1 rounded bg-[#310064] text-white font-heading font-bold text-[10px] hover:bg-[#430080]"
                          >
                            Join Class (Zoom)
                          </a>
                        )}
                      </div>
                    ))}

                    {dayClasses.length === 0 && (
                      <div className="py-8 text-center text-[10px] text-slate-300">
                        Self Study / No Class
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#ECE6DA]/40 text-center text-[10px] text-[#5A5A65]">
                  {dayClasses.length} session{dayClasses.length === 1 ? '' : 's'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
