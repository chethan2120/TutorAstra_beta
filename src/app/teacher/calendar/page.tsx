'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  Video,
  CheckCircle2,
  Users,
  Loader2
} from 'lucide-react';

export default function TeacherCalendarPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  useEffect(() => {
    async function loadCalendar() {
      try {
        const res = await fetch('/api/teacher/classes');
        if (res.ok) {
          const d = await res.json();
          setClasses(d.classes || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCalendar();
  }, []);

  // Compute 7 days of the current week (Monday to Sunday)
  const getWeekDates = (offsetWeeks: number) => {
    const now = new Date();
    // Monday of current week
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
            Weekly Teaching Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
            Overview of upcoming 1-on-1 sessions, student names, and timings from Monday to Sunday.
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
            <span>Prev Week</span>
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
            <span>Next Week</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-[#5A5A65]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
          <span>Synchronizing weekly timetable...</span>
        </div>
      ) : (
        /* Monday-to-Sunday 7-Day Grid */
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((d, idx) => {
            const dateStr = d.toISOString().split('T')[0];
            const isToday = dateStr === new Date().toISOString().split('T')[0];
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
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cls.subject_color || '#310064' }} />
                          <span className="truncate">{cls.subject_name || 'Science'}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-[#1E1E24] truncate">
                          Student: {cls.student_name}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[#5A5A65]">
                          <Clock className="w-3 h-3 text-[#310064]" />
                          <span>{cls.start_time} - {cls.end_time}</span>
                        </div>
                        {cls.meetingAvailable && (
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
                        No sessions
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#ECE6DA]/40 text-center text-[10px] text-[#5A5A65]">
                  {dayClasses.length} class{dayClasses.length === 1 ? '' : 'es'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
