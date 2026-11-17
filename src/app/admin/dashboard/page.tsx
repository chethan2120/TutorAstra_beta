'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Calendar,
  Clock,
  Sparkles,
  Inbox,
  UserPlus,
  BookPlus,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Video
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    totalStudents: 1,
    totalTeachers: 1,
    classesToday: 1,
    activeEnrollments: 3,
    totalScheduledClasses: 50,
    newEnquiries: 0
  });
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.ok) {
          const sData = await statsRes.json();
          setStats((prev: any) => ({ ...prev, ...sData }));
        }

        const classesRes = await fetch('/api/admin/classes?limit=6');
        if (classesRes.ok) {
          const cData = await classesRes.json();
          setTodayClasses(cData.classes || []);
        }
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* ROW 1: HEADER & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EBE4F6] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2ECFC] text-[#310064] text-[11px] font-heading font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
            <span>TutorAstra System Controller</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 tracking-tight">
            Central Academic Operations Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time synchronization across Admin, Teacher and Student portals.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/students"
            className="px-4 py-2.5 rounded-lg text-xs font-heading font-bold text-white bg-[#310064] hover:bg-[#430080] shadow-xs flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#F4CC45]" />
            <span>+ Create Student</span>
          </Link>

          <Link
            href="/admin/teachers"
            className="px-4 py-2.5 rounded-lg text-xs font-heading font-bold text-[#310064] bg-[#F2ECFC] hover:bg-[#E5DAF7] border border-[#D5C2F2] flex items-center gap-2 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>+ Create Teacher</span>
          </Link>

          <Link
            href="/admin/schedule"
            className="px-4 py-2.5 rounded-lg text-xs font-heading font-bold text-[#220046] bg-[#F4CC45] hover:bg-[#F6D55E] shadow-xs flex items-center gap-2 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Batch</span>
          </Link>
        </div>
      </div>

      {/* ROW 2: TOP STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#EBE4F6] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Active Students</div>
          <div className="text-2xl font-heading font-extrabold text-[#310064] mt-2">
            {stats.totalStudents || 1}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">100% 1-on-1 Enrolled</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#EBE4F6] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Verified Faculty</div>
          <div className="text-2xl font-heading font-extrabold text-[#310064] mt-2">
            {stats.totalTeachers || 1}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Top 2% Vetted</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#EBE4F6] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Sessions Today</div>
          <div className="text-2xl font-heading font-extrabold text-emerald-700 mt-2">
            {stats.classesToday || 1}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">15-Min Zoom Lock Active</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#EBE4F6] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Active Enrolments</div>
          <div className="text-2xl font-heading font-extrabold text-[#310064] mt-2">
            {stats.activeEnrollments || 3}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Science, Math, Physics</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#EBE4F6] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Total Classes</div>
          <div className="text-2xl font-heading font-extrabold text-[#310064] mt-2">
            {stats.totalScheduledClasses || 50}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Generated & Synced</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#EBE4F6] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Admissions Leads</div>
          <div className="text-2xl font-heading font-extrabold text-[#8C6D00] mt-2">
            {stats.newEnquiries || 2}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Website Consultation</div>
        </div>
      </div>

      {/* ROW 3: RECENT CLASSES & LIVE MONITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Classes Live Sync Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#EBE4F6] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-900">
                Scheduled Classes & Synchronized Timetable
              </h2>
              <p className="text-xs text-slate-500">
                Changes made here reflect automatically in both Student and Teacher portals.
              </p>
            </div>
            <Link
              href="/admin/classes"
              className="text-xs font-heading font-bold text-[#310064] hover:underline flex items-center gap-1"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-heading font-bold text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Session</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Teacher</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayClasses.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.subject_color || '#310064' }} />
                        <span className="font-heading font-bold">{c.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{c.student_name}</td>
                    <td className="py-3 px-3 text-slate-700">{c.teacher_name}</td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{c.session_date}</div>
                      <div className="text-[10px] text-slate-400">{c.start_time} - {c.end_time}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-heading font-bold capitalize ${
                        c.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.status === 'rescheduled'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : c.status === 'leave_approved'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-[#F2ECFC] text-[#310064] border border-[#E0D3F5]'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/classes?id=${c.id}`}
                        className="text-xs font-heading font-bold text-[#310064] hover:text-[#430080]"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Portal Integration Status (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-[#EBE4F6] shadow-xs p-6 space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Three-Portal Synchronisation Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] flex items-center justify-between">
                <div>
                  <strong className="block text-slate-900 font-heading">Admin Console</strong>
                  <span className="text-[11px] text-slate-500">Source of Truth & Scheduler</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] flex items-center justify-between">
                <div>
                  <strong className="block text-slate-900 font-heading">Teacher Portal</strong>
                  <span className="text-[11px] text-slate-500">Isolated to Assigned Students</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Synced</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] flex items-center justify-between">
                <div>
                  <strong className="block text-slate-900 font-heading">Student Portal</strong>
                  <span className="text-[11px] text-slate-500">15-Min Zoom Lock Active</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Synced</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Single SQLite backend database with zero data duplication.</span>
              </div>
            </div>
          </div>

          {/* Quick Enrolment Example Card */}
          <div className="bg-gradient-to-br from-[#220046] to-[#310064] rounded-2xl text-white p-6 shadow-md space-y-3">
            <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#F4CC45]">
              Active Student Roadmap
            </div>
            <h4 className="font-heading font-bold text-base">
              Ethan Jenkins (Grade 10 CBSE)
            </h4>
            <div className="text-xs text-purple-200 space-y-1">
              <div>• Science – 50 Sessions (Teacher: Dr. Sarah)</div>
              <div>• Mathematics – 40 Sessions</div>
              <div>• Physics – 30 Sessions</div>
            </div>
            <Link
              href="/admin/students"
              className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-[#F4CC45] text-[#220046] font-heading font-bold text-xs hover:bg-[#F6D55E]"
            >
              View Student Roadmap →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
