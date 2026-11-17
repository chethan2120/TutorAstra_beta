'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  GraduationCap,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function StudentSubjectsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/subjects')
      .then((res) => res.json())
      .then((data) => {
        setEnrollments(data.enrollments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#310064] via-[#4A0D88] to-[#1E003D] p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-400/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F4CC45]/20 text-[#F4CC45] border border-[#F4CC45]/30 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            1-on-1 Personalized Curriculum
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white mb-2">
            My Enrolled Subjects
          </h1>
          <p className="text-sm text-purple-100/90 leading-relaxed">
            Every enrolled subject is custom-paced with dedicated 1-on-1 faculty. Click on any subject to view its complete session-wise breakdown (all 50 sessions), dates, timings, and attendance status.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#ECE6DA] animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#ECE6DA] shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-heading font-bold text-[#310064]">No Enrolled Subjects Found</h3>
          <p className="text-sm text-[#5A5A65] mt-1">
            Please contact your academic counsellor to register your custom 1-on-1 subjects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enr) => {
            const completed = enr.completed_classes || 0;
            const total = enr.total_classes || 50;
            const percentage = Math.min(100, Math.round((completed / total) * 100));

            return (
              <div
                key={enr.id}
                className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Subject Header with color strip */}
                <div
                  className="p-5 border-b border-[#ECE6DA]"
                  style={{ borderTop: `4px solid ${enr.subject_color || '#310064'}` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span
                      className="text-[11px] font-heading font-bold px-2.5 py-1 rounded-md"
                      style={{
                        backgroundColor: `${enr.subject_color || '#310064'}15`,
                        color: enr.subject_color || '#310064'
                      }}
                    >
                      {enr.subject_code || 'SUBJ'}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active 1-on-1
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-black text-[#310064] group-hover:text-[#4A0D88] transition-colors">
                    {enr.subject_name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-xs text-[#5A5A65]">
                    <User className="w-3.5 h-3.5 text-[#310064]" />
                    <span>Faculty:</span>
                    <strong className="text-[#310064] font-heading font-bold">
                      {enr.teacher_name || 'Dr. Sarah Mitchell'}
                    </strong>
                  </div>
                </div>

                {/* Progress Details */}
                <div className="p-5 space-y-4 flex-1 bg-[#FAF8F5]/50">
                  <div className="bg-white rounded-xl p-3.5 border border-[#ECE6DA] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5A5A65] font-medium">Session Progress</span>
                      <span className="font-heading font-black text-[#310064]">
                        {completed} / {total} Sessions
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#ECE6DA] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#310064] to-[#F4CC45] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#5A5A65] pt-1">
                      <span>{total - completed} classes remaining</span>
                      <span className="font-bold text-amber-600">{percentage}% finished</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-[#ECE6DA]">
                      <div className="text-lg font-heading font-black text-[#310064]">{total}</div>
                      <div className="text-[10px] text-[#5A5A65] uppercase font-bold tracking-wider">
                        Enrolled Classes
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#ECE6DA]">
                      <div className="text-lg font-heading font-black text-emerald-600">1-on-1</div>
                      <div className="text-[10px] text-[#5A5A65] uppercase font-bold tracking-wider">
                        Live Dedicated
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-white border-t border-[#ECE6DA] space-y-2">
                  <Link
                    href={`/student/subjects/${enr.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <span>View All {total} Sessions</span>
                    <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
                  </Link>

                  <Link
                    href="/student/box"
                    className="w-full py-2 px-3 rounded-xl border border-[#ECE6DA] hover:bg-[#FAF8F5] text-[#310064] font-heading font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                    <span>Doubt Chat with {enr.teacher_name?.split(' ')[0] || 'Teacher'}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
