'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Video,
  VideoOff,
  User,
  BookOpen,
  Calendar,
  Sparkles,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function StudentClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Clock ticker every 1 second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchClasses = () => {
    fetch('/api/student/classes')
      .then((res) => res.json())
      .then((data) => {
        setClasses(data.classes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClasses();
    // Auto-refresh every 30 seconds to update 15-minute zoom availability status
    const interval = setInterval(fetchClasses, 30000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = currentTime.toISOString().split('T')[0];
  const formattedToday = currentTime.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Live Time */}
      <div className="rounded-2xl bg-gradient-to-r from-[#310064] via-[#4A0D88] to-[#1E003D] p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4CC45] text-[#310064]">
              LIVE SCHEDULE
            </span>
            <span className="text-xs text-purple-200">{formattedToday}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
            Today's 1-on-1 Classes
          </h1>
          <p className="text-xs text-purple-100/90 mt-1 max-w-xl">
            Live interactive sessions are conducted via Zoom Premium. In accordance with platform security protocols, meeting links unlock automatically <strong>15 minutes before class start time</strong>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center min-w-[180px]">
          <div className="text-xs text-purple-200 font-bold uppercase tracking-wider mb-1">
            Current Time
          </div>
          <div className="text-2xl font-mono font-black text-[#F4CC45]">{formattedTime}</div>
          <div className="text-[10px] text-purple-300 mt-1">Indian Standard Time (IST)</div>
        </div>
      </div>

      {/* 15-minute Zoom Rule Information Pill */}
      <div className="bg-[#FAF8F5] border border-[#ECE6DA] rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#5A5A65] space-y-1">
          <strong className="text-[#310064] block font-heading font-bold text-sm">
            Zoom Premium 15-Minute Link Unlock Rule
          </strong>
          <p>
            To prevent early interruptions and ensure your teacher is fully prepared, your live Zoom button will turn active precisely 15 minutes before your scheduled slot. When the button turns purple/gold, click it to join the classroom directly.
          </p>
        </div>
      </div>

      {/* Class Schedule List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-heading font-bold text-[#310064] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F4CC45]" />
            <span>Scheduled Sessions for Today</span>
          </h2>
          <button
            type="button"
            onClick={fetchClasses}
            className="text-xs font-bold text-[#310064] hover:underline"
          >
            Refresh Status
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#ECE6DA] animate-pulse space-y-3">
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#ECE6DA] shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-heading font-bold text-[#310064]">
              No More Classes Scheduled for Today!
            </h3>
            <p className="text-xs text-[#5A5A65] mt-1 max-w-md mx-auto">
              You are all caught up for today. You can review past recorded sessions or practice with Ms. Violet AI Tutor.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Link
                href="/student/recordings"
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] text-xs font-heading font-bold text-[#310064] hover:bg-[#F2ECFC]"
              >
                Watch Recordings
              </Link>
              <Link
                href="/student/ai-tutor"
                className="px-4 py-2 rounded-xl bg-[#310064] text-white text-xs font-heading font-bold hover:bg-[#220046] flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F4CC45]" />
                <span>Practice with Ms. Violet</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map((cls) => {
              const isUnlocked = cls.meetingAvailable && cls.joinUrl;
              const isCompleted = cls.status === 'completed';

              return (
                <div
                  key={cls.id}
                  className={`bg-white rounded-2xl border p-6 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isUnlocked
                      ? 'border-[#310064] ring-2 ring-[#310064]/10 shadow-md'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-[#ECE6DA]'
                  }`}
                >
                  {/* Left Info */}
                  <div className="space-y-3 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#310064] text-[#F4CC45]">
                        SESSION {String(cls.session_number).padStart(2, '0')}
                      </span>
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${cls.subject_color || '#310064'}15`,
                          color: cls.subject_color || '#310064'
                        }}
                      >
                        {cls.subject_name}
                      </span>
                      {isCompleted ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Class Completed
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          Zoom Class Live Now
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-400" />
                          Unlocks 15 min before
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-heading font-black text-[#310064]">
                      {cls.session_title || '1-on-1 Interactive Mentorship Session'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A5A65]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#310064]" />
                        <span>Teacher:</span>
                        <strong className="text-[#310064] font-heading font-bold">
                          {cls.teacher_name || 'Dr. Sarah Mitchell'}
                        </strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Timing:</span>
                        <strong className="text-[#310064] font-bold">
                          {cls.start_time} – {cls.end_time}
                        </strong>
                      </div>
                    </div>

                    {/* Lock / Unlock Notice */}
                    <div className="text-xs font-medium">
                      {isUnlocked ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Meeting is ready! Click the button to enter Zoom classroom.
                        </span>
                      ) : isCompleted ? (
                        <span className="text-emerald-600">
                          Class was successfully completed. Recording is ready in Class Recordings.
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                          {cls.meetingMessage || 'Zoom link will appear 15 minutes before the session.'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 min-w-[200px]">
                    {isCompleted ? (
                      <Link
                        href="/student/recordings"
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Video className="w-4 h-4 text-[#F4CC45]" />
                        <span>Watch Recording</span>
                      </Link>
                    ) : isUnlocked ? (
                      <a
                        href={cls.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#310064] to-[#4A0D88] hover:from-[#220046] hover:to-[#310064] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md transform hover:-translate-y-0.5 border border-[#F4CC45]"
                      >
                        <Video className="w-4 h-4 text-[#F4CC45] animate-bounce" />
                        <span>Join Zoom Live Class</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-400 font-heading font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200"
                      >
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>Zoom Locked (15-min Rule)</span>
                      </button>
                    )}

                    <Link
                      href="/student/box"
                      className="w-full py-2 px-3 rounded-xl border border-[#ECE6DA] hover:bg-[#FAF8F5] text-[#310064] font-heading font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                      <span>Message Teacher</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
