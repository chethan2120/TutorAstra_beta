'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Video,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function TeacherSingleStudentPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');

  useEffect(() => {
    async function loadStudentProfile() {
      try {
        const res = await fetch(`/api/teacher/students/${params.id}`);
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
    loadStudentProfile();
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#5A5A65]">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
        <span>Loading student syllabus and upcoming schedule...</span>
      </div>
    );
  }

  if (!data?.student) {
    return (
      <div className="p-8 text-center text-xs text-rose-600 bg-white rounded-xl border border-rose-200">
        Student profile not found or unauthorized.
      </div>
    );
  }

  const { student, enrollments, sessions, assessments } = data;

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingSessions = sessions.filter((s: any) => s.session_date >= todayStr && s.status !== 'completed');
  const completedSessions = sessions.filter((s: any) => s.status === 'completed' || s.session_date < todayStr);

  const displayedSessions = filterTab === 'upcoming'
    ? upcomingSessions
    : filterTab === 'completed'
    ? completedSessions
    : sessions;

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Back button */}
      <div>
        <Link
          href="/teacher/students"
          className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#310064] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Assigned Students</span>
        </Link>
      </div>

      {/* Student Profile Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#310064] text-white font-heading font-bold text-xl flex items-center justify-center shadow-md">
            {student.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24]">
                {student.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#F2ECFC] text-[#310064]">
                {student.grade} • {student.curriculum}
              </span>
            </div>
            <div className="text-xs text-[#5A5A65] mt-1 space-y-0.5">
              <div>Email: {student.email}</div>
              {student.parentName && <div>Parent: {student.parentName} ({student.parentPhone})</div>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/teacher/box"
            className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] hover:bg-[#F2ECFC] text-[#310064] font-heading font-bold text-xs"
          >
            Open Teacher Box →
          </Link>
        </div>
      </div>

      {/* Sessions Filter Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#ECE6DA]">
          <div>
            <h2 className="font-heading font-extrabold text-base text-[#1E1E24]">
              Upcoming Classes & Session Schedule ({student.name})
            </h2>
            <p className="text-xs text-[#5A5A65]">
              Every enrolled session with confirmed dates, times, and syllabus lesson topics.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setFilterTab('upcoming')}
              className={`px-3 py-1.5 rounded-lg font-heading font-bold transition-all ${
                filterTab === 'upcoming' ? 'bg-[#310064] text-white shadow-xs' : 'text-[#5A5A65]'
              }`}
            >
              Upcoming ({upcomingSessions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded-lg font-heading font-bold transition-all ${
                filterTab === 'completed' ? 'bg-[#310064] text-white shadow-xs' : 'text-[#5A5A65]'
              }`}
            >
              Completed ({completedSessions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg font-heading font-bold transition-all ${
                filterTab === 'all' ? 'bg-[#310064] text-white shadow-xs' : 'text-[#5A5A65]'
              }`}
            >
              All Sessions ({sessions.length})
            </button>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#ECE6DA] text-[11px] font-heading font-bold text-[#5A5A65] uppercase tracking-wider">
                <th className="py-2.5 px-3">Session</th>
                <th className="py-2.5 px-3">Topic / Syllabus Lesson</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Timing</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Zoom Meeting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE6DA]/60">
              {displayedSessions.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-heading font-bold text-[#310064]">
                    #{String(s.session_number).padStart(2, '0')}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#1E1E24]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.subject_color || '#310064' }} />
                      <span>{s.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#1E1E24] whitespace-nowrap font-medium">
                    {s.session_date}
                  </td>
                  <td className="py-3 px-3 text-[#5A5A65] whitespace-nowrap">
                    {s.start_time} - {s.end_time}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      s.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : s.status === 'leave_approved'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-[#F2ECFC] text-[#310064] border border-[#E0D3F5]'
                    }`}>
                      {s.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className="text-[11px] text-[#5A5A65] font-mono">
                      {s.zoom_meeting_id || '987-100-01'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
