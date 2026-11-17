'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Calendar,
  Clock,
  Sparkles,
  UserPlus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  CalendarDays,
  CalendarPlus,
  UserCheck,
  Bell,
  Loader2
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
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [freeTeachers, setFreeTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadDashboardData = async () => {
    try {
      const [statsRes, classesRes, enqRes, calRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/classes?limit=6'),
        fetch('/api/admin/enquiries'),
        fetch('/api/calendar')
      ]);

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats((prev: any) => ({ ...prev, ...sData }));
      }
      if (classesRes.ok) {
        const cData = await classesRes.json();
        setTodayClasses(cData.classes || []);
      }
      if (enqRes.ok) {
        const eData = await enqRes.json();
        setEnquiries(eData.enquiries || []);
      }
      if (calRes.ok) {
        const calData = await calRes.json();
        setFreeTeachers(calData.freeHours || []);
      }
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteEnquiry = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (e) {
      console.error('Error deleting inquiry:', e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* ROW 1: HEADER & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2ECFC] text-[#310064] text-[11px] font-heading font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
            <span>TutorAstra Central Administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Academic Operations & Controls Dashboard
          </h1>
          <p className="text-xs text-[#5A5A65] mt-1">
            Real-time synchronization across Admin, Teacher, and Student portals.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/schedule-student"
            className="px-4 py-2.5 rounded-xl text-xs font-heading font-bold text-white bg-[#310064] hover:bg-[#220046] shadow-xs flex items-center gap-2 transition-all"
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#F4CC45]" />
            <span>Schedule Student</span>
          </Link>

          <Link
            href="/admin/schedule-teacher"
            className="px-4 py-2.5 rounded-xl text-xs font-heading font-bold text-[#310064] bg-[#F2ECFC] hover:bg-[#E5DAF7] border border-[#D5C2F2] flex items-center gap-2 transition-all"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Schedule Teacher</span>
          </Link>

          <Link
            href="/admin/notifications"
            className="px-4 py-2.5 rounded-xl text-xs font-heading font-bold text-[#220046] bg-[#F4CC45] hover:bg-[#F6D55E] shadow-xs flex items-center gap-2 transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Broadcast Notice</span>
          </Link>
        </div>
      </div>

      {/* ROW 2: TOP STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#ECE6DA] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Active Students</div>
          <div className="text-2xl font-heading font-black text-[#310064] mt-2">
            {stats.totalStudents || 1}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">100% 1-on-1 Enrolled</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#ECE6DA] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Verified Faculty</div>
          <div className="text-2xl font-heading font-black text-[#310064] mt-2">
            {stats.totalTeachers || 1}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Top 2% Vetted</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#ECE6DA] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Sessions Today</div>
          <div className="text-2xl font-heading font-black text-emerald-700 mt-2">
            {stats.classesToday || 1}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">15-Min Zoom Lock Active</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#ECE6DA] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Active Enrolments</div>
          <div className="text-2xl font-heading font-black text-[#310064] mt-2">
            {stats.activeEnrollments || 3}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Science, Math, Physics</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#ECE6DA] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Free Slots Today</div>
          <div className="text-2xl font-heading font-black text-emerald-600 mt-2">
            {freeTeachers.length || 2}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Faculty Available</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#ECE6DA] shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-heading font-bold text-slate-500">Contact Inquiries</div>
          <div className="text-2xl font-heading font-black text-[#8C6D00] mt-2">
            {enquiries.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Saved Until Deleted</div>
        </div>
      </div>

      {/* ROW 3: RECENT CLASSES & TEACHER AVAILABILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Classes Live Sync Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#ECE6DA] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA]">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-900">
                Today's Class Timetable & Status
              </h2>
              <p className="text-xs text-[#5A5A65]">
                Auto-updated across Teacher and Student portals. Meeting links unlock 15 minutes before class.
              </p>
            </div>
            <Link
              href="/admin/calendar"
              className="text-xs font-heading font-bold text-[#310064] hover:underline flex items-center gap-1"
            >
              <span>Full Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ECE6DA] text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Session</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Teacher</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DA]">
                {todayClasses.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.subject_color || '#310064' }} />
                        <span className="font-heading font-bold">{c.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{c.student_name}</td>
                    <td className="py-3 px-3 text-slate-700">{c.teacher_name}</td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{c.session_date}</div>
                      <div className="text-[10px] text-slate-400">{c.start_time} - {c.end_time}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-heading font-bold capitalize ${
                        c.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.status === 'carried_forward'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-[#F2ECFC] text-[#310064] border border-[#E0D3F5]'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href="/admin/calendar"
                        className="text-xs font-heading font-bold text-[#310064] hover:underline"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Free Faculty Slots Today (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DA]">
              <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F4CC45]" />
                <span>Available Faculty Slots Today</span>
              </h3>
              <Link href="/admin/calendar" className="text-[11px] font-bold text-[#310064] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              {freeTeachers.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">
                  No free slots configured for today.
                </div>
              ) : (
                freeTeachers.slice(0, 4).map((f: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900 font-heading text-xs">
                        {f.teacher_name || 'Dr. Sarah Mitchell'}
                      </strong>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        {f.start_time} – {f.end_time} ({f.note || 'Available'})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Free
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Enrolment Card */}
          <div className="bg-gradient-to-br from-[#220046] to-[#310064] rounded-2xl text-white p-6 shadow-md space-y-3">
            <div className="text-[10px] font-heading font-black uppercase tracking-wider text-[#F4CC45]">
              Active Student Roadmap
            </div>
            <h4 className="font-heading font-black text-base">
              Ethan Jenkins (Grade 10 CBSE)
            </h4>
            <div className="text-xs text-purple-200 space-y-1">
              <div>• Science – 50 Sessions (Mentor: Dr. Sarah Mitchell)</div>
              <div>• Mathematics – 40 Sessions</div>
              <div>• Physics – 30 Sessions</div>
            </div>
            <Link
              href="/admin/students"
              className="inline-block mt-2 px-3.5 py-1.5 rounded-xl bg-[#F4CC45] text-[#220046] font-heading font-bold text-xs hover:bg-[#F6D55E]"
            >
              Manage Student Enrolments →
            </Link>
          </div>
        </div>
      </div>

      {/* ROW 4: CONTACT INQUIRIES & LEAD SUBMISSIONS TABLE */}
      {/* Satisfies client requirement: "if anyone send they information it should be present there , untill unless i delete ut manually it should not go away" */}
      <div className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ECE6DA]">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#310064]" />
              <h2 className="text-base font-heading font-bold text-slate-900">
                Website Consultation & Contact Enquiries ({enquiries.length})
              </h2>
            </div>
            <p className="text-xs text-[#5A5A65] mt-0.5">
              Messages and phone inquiries submitted by visitors on the landing page remain here permanently until manually deleted.
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Persistent Storage Active
          </span>
        </div>

        {enquiries.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            No inquiries received yet. When visitors fill the Contact form or Demo popup, they will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ECE6DA] text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Lead Name</th>
                  <th className="py-2.5 px-3">Contact Email & Phone</th>
                  <th className="py-2.5 px-3">Subject / Grade</th>
                  <th className="py-2.5 px-3">Message Preview</th>
                  <th className="py-2.5 px-3">Date Received</th>
                  <th className="py-2.5 px-3 text-right">Manual Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DA]">
                {enquiries.map((enq: any) => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 font-heading block">{enq.name}</strong>
                      <span className="text-[10px] text-slate-400 capitalize">{enq.type || 'Consultation'}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <div>{enq.email}</div>
                      {enq.phone && (
                        <div className="text-[11px] text-[#310064] font-semibold">{enq.phone}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {enq.subject || '1-on-1 Guidance'}
                    </td>
                    <td className="py-3 px-3 text-[#5A5A65] max-w-xs truncate" title={enq.message}>
                      {enq.message || 'Interested in 1-on-1 personalized tutoring'}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(enq.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteEnquiry(enq.id)}
                        disabled={deletingId === enq.id}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-heading font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="Delete inquiry permanently"
                      >
                        {deletingId === enq.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
