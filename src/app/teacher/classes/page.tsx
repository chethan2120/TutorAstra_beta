'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function TeacherTodayClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTodayClasses() {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const res = await fetch(`/api/teacher/classes?date=${todayStr}`);
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
    loadTodayClasses();
    const timer = setInterval(loadTodayClasses, 30000); // refresh every 30s to unlock 15m zoom link automatically
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2ECFC] text-[#310064] text-[11px] font-heading font-bold uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
          <span>Zoom Premium Integration</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
          Today's Live Classes & Zoom Links
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
          Review today's schedule. Official Zoom meeting links unlock 15 minutes before the start time.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#5A5A65]">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#310064] mb-2" />
          <span>Checking scheduled classes and Zoom release status...</span>
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#ECE6DA] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F2ECFC] text-[#310064] flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-sm text-[#1E1E24]">
            No Classes Scheduled for Today
          </h3>
          <p className="text-xs text-[#5A5A65] max-w-md mx-auto">
            You do not have any further 1-on-1 sessions scheduled for today. Check your Weekly Calendar to view upcoming sessions.
          </p>
          <Link
            href="/teacher/calendar"
            className="btn-primary inline-block text-xs font-heading font-bold"
          >
            View Weekly Calendar →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-[#ECE6DA] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cls.subject_color || '#310064' }} />
                  <h3 className="font-heading font-extrabold text-base text-[#1E1E24]">
                    {cls.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F2ECFC] text-[#310064]">
                    Session #{cls.session_number}
                  </span>
                </div>

                <div className="text-xs text-[#5A5A65] flex flex-wrap items-center gap-4">
                  <div>
                    Student: <strong>{cls.student_name}</strong> ({cls.student_grade || 'Grade 10'})
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 font-semibold text-[#1E1E24]">
                    <Clock className="w-3.5 h-3.5 text-[#310064]" />
                    <span>{cls.start_time} - {cls.end_time} ({cls.timezone || 'Asia/Dubai'})</span>
                  </div>
                </div>

                {cls.teacher_notes && (
                  <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] text-[11px] text-[#5A5A65]">
                    <strong>Lesson Plan:</strong> {cls.teacher_notes}
                  </div>
                )}
              </div>

              {/* 15-Minute Zoom Release Section */}
              <div className="w-full md:w-auto text-left md:text-right shrink-0">
                {cls.meetingAvailable ? (
                  <div className="space-y-2">
                    <a
                      href={cls.joinUrl || `https://zoom.us/j/${cls.zoom_meeting_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#310064] hover:bg-[#430080] text-white font-heading font-bold text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-2 transition-all"
                    >
                      <Video className="w-4 h-4 text-[#F4CC45]" />
                      <span>Start Class in Zoom</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                    </a>
                    <div className="text-[10px] text-emerald-700 font-semibold flex items-center md:justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Zoom Meeting Link Active</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left max-w-sm">
                    <div className="text-xs font-heading font-bold text-amber-900 mb-0.5">
                      Zoom Link Locked
                    </div>
                    <div className="text-[11px] text-amber-800">
                      Your meeting link will be available 15 minutes before class.
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
