'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  VideoOff,
  User,
  GraduationCap,
  CalendarX2,
  MessageSquare,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export default function StudentSubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const enrollmentId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!enrollmentId) return;

    fetch(`/api/student/subjects?enrollment_id=${enrollmentId}`)
      .then((res) => res.json())
      .then((data) => {
        setEnrollment(data.enrollment);
        setSessions(data.sessions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [enrollmentId]);

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'completed' && s.status !== 'completed') return false;
    if (filter === 'upcoming' && s.status === 'completed') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchNum = `session ${s.session_number}`.toLowerCase().includes(q);
      const matchTitle = (s.session_title || '').toLowerCase().includes(q);
      const matchDate = (s.session_date || '').toLowerCase().includes(q);
      return matchNum || matchTitle || matchDate;
    }
    return true;
  });

  const total = sessions.length;
  const completed = sessions.filter((s) => s.status === 'completed').length;
  const remaining = total - completed;

  return (
    <div className="space-y-6">
      {/* Top back nav */}
      <div className="flex items-center gap-3">
        <Link
          href="/student/subjects"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#ECE6DA] text-xs font-heading font-bold text-[#310064] hover:bg-[#FAF8F5] transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Subjects</span>
        </Link>
        <span className="text-xs text-[#5A5A65]">/</span>
        <span className="text-xs font-semibold text-[#310064]">
          {enrollment?.subject_name || 'Subject Curriculum'}
        </span>
      </div>

      {/* Subject Header Banner */}
      <div
        className="rounded-2xl p-6 text-white shadow-md relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${enrollment?.subject_color || '#310064'} 0%, #171746 100%)`
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-white/20 text-white backdrop-blur-xs">
                {enrollment?.subject_code || 'SUBJ'}
              </span>
              <span className="text-xs text-white/80">Grade 10 CBSE 1-on-1</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              {enrollment?.subject_name || 'Enrolled Subject'}
            </h1>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              Assigned Faculty: <strong className="text-white">{enrollment?.teacher_name || 'Faculty Mentor'}</strong> ({enrollment?.teacher_qualification || 'Subject Specialist'})
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center">
            <div className="px-3">
              <div className="text-xl font-heading font-black text-[#F4CC45]">{total}</div>
              <div className="text-[10px] text-white/80 font-bold uppercase">Total Sessions</div>
            </div>
            <div className="px-3 border-x border-white/20">
              <div className="text-xl font-heading font-black text-emerald-300">{completed}</div>
              <div className="text-[10px] text-white/80 font-bold uppercase">Completed</div>
            </div>
            <div className="px-3">
              <div className="text-xl font-heading font-black text-white">{remaining}</div>
              <div className="text-[10px] text-white/80 font-bold uppercase">Remaining</div>
            </div>
          </div>
        </div>

        {/* Progress Bar in Banner */}
        <div className="mt-5 pt-4 border-t border-white/15">
          <div className="flex items-center justify-between text-xs text-white/90 mb-1.5 font-heading">
            <span>Overall Session Completion</span>
            <span className="font-bold">{total > 0 ? Math.round((completed / total) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F4CC45] rounded-full transition-all duration-500"
              style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search session # or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#ECE6DA] focus:outline-hidden focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#310064] text-white shadow-xs'
                : 'bg-[#FAF8F5] text-[#5A5A65] hover:bg-[#F2ECFC] hover:text-[#310064]'
            }`}
          >
            All Sessions ({total})
          </button>
          <button
            type="button"
            onClick={() => setFilter('upcoming')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
              filter === 'upcoming'
                ? 'bg-[#310064] text-white shadow-xs'
                : 'bg-[#FAF8F5] text-[#5A5A65] hover:bg-[#F2ECFC] hover:text-[#310064]'
            }`}
          >
            Upcoming ({remaining})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
              filter === 'completed'
                ? 'bg-[#310064] text-white shadow-xs'
                : 'bg-[#FAF8F5] text-[#5A5A65] hover:bg-[#F2ECFC] hover:text-[#310064]'
            }`}
          >
            Completed ({completed})
          </button>
        </div>
      </div>

      {/* Client Requirement Highlight: "if student enroll 50 classes for science subjects all 50 classes need to visible on screen as session wise with date and time." */}
      <div className="bg-[#FCFAFF] border border-[#F2ECFC] rounded-xl px-4 py-3 flex items-center justify-between text-xs text-[#310064]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F4CC45] flex-shrink-0" />
          <span>
            Viewing <strong>{filteredSessions.length}</strong> of <strong>{total} individual sessions</strong> scheduled for this enrollment.
          </span>
        </div>
        <Link
          href="/student/leave"
          className="text-xs font-bold text-[#310064] hover:underline flex items-center gap-1"
        >
          <CalendarX2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Apply Leave Policy (Max 2/mo)</span>
        </Link>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-[#ECE6DA] animate-pulse space-y-3">
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-8 bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#ECE6DA]">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-heading font-bold text-[#310064]">No Sessions Match Your Search</h4>
          <p className="text-xs text-[#5A5A65] mt-1">Try switching filters or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => {
            const isCompleted = session.status === 'completed';
            const isCarriedForward = session.status === 'carried_forward';
            const isScheduled = session.status === 'scheduled';
            const sessionNumPadded = String(session.session_number).padStart(2, '0');

            return (
              <div
                key={session.id}
                className={`bg-white rounded-xl border p-4.5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/15'
                    : isCarriedForward
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-[#ECE6DA]'
                }`}
              >
                <div>
                  {/* Top Bar: Session Number & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-[#310064] text-[#F4CC45]">
                      SESSION {sessionNumPadded}
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Completed
                      </span>
                    ) : isCarriedForward ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Carried Forward (+1)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock className="w-3 h-3 text-blue-500" />
                        Scheduled
                      </span>
                    )}
                  </div>

                  {/* Session Topic */}
                  <h4 className="text-sm font-heading font-black text-[#310064] line-clamp-1 mb-2">
                    {session.session_title || `Curriculum Module ${session.session_number}`}
                  </h4>

                  {/* Date and Time */}
                  <div className="space-y-1.5 text-xs text-[#5A5A65] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#ECE6DA]/60">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#310064]" />
                      <span>{session.session_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {session.start_time} – {session.end_time} (60 min)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3 border-t border-[#ECE6DA] flex items-center justify-between gap-2">
                  {isCompleted ? (
                    <Link
                      href="/student/recordings"
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5 text-[#F4CC45]" />
                      <span>Watch Recording</span>
                    </Link>
                  ) : (
                    <div className="w-full flex items-center gap-2">
                      <Link
                        href="/student/classes"
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <Clock className="w-3 h-3 text-[#F4CC45]" />
                        <span>Class Link</span>
                      </Link>
                      <Link
                        href={`/student/leave?classId=${session.id}`}
                        className="py-1.5 px-2.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-heading font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                        title="Apply leave (>12h advance notice required)"
                      >
                        <CalendarX2 className="w-3 h-3" />
                        <span>Leave</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
