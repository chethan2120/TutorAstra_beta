'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  UserCheck,
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Loader2
} from 'lucide-react';

export default function AdminAttendancePage() {
  const [tab, setTab] = useState<'teacher' | 'student'>('teacher');
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/classes?limit=50')
      .then((res) => res.json())
      .then((data) => {
        setClasses(data.classes || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const sampleTeacherLogs = [
    { name: 'Dr. Sarah Mitchell', in: '09:00 AM', out: 'In Progress', hours: '4h 30m', date: 'Today, 17 Nov 2026', status: 'Present' },
    { name: 'Prof. David Vance', in: '10:00 AM', out: '04:00 PM', hours: '6h 00m', date: 'Today, 17 Nov 2026', status: 'Completed' },
    { name: 'Dr. Sarah Mitchell', in: '09:00 AM', out: '05:30 PM', hours: '8h 30m', date: 'Yesterday, 16 Nov 2026', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
            Biometric & Session Logs
          </span>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-2">
            Attendance & Shift Management
          </h1>
          <p className="text-xs text-[#5A5A65] mt-0.5">
            Monitor faculty punch-in shifts and 1-on-1 student classroom attendance.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 p-1 bg-[#FAF8F5] rounded-xl border border-[#ECE6DA]">
          <button
            type="button"
            onClick={() => setTab('teacher')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              tab === 'teacher'
                ? 'bg-[#310064] text-white shadow-xs'
                : 'text-[#5A5A65] hover:text-[#310064]'
            }`}
          >
            Staff Shifts
          </button>
          <button
            type="button"
            onClick={() => setTab('student')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              tab === 'student'
                ? 'bg-[#310064] text-white shadow-xs'
                : 'text-[#5A5A65] hover:text-[#310064]'
            }`}
          >
            Student Classes
          </button>
        </div>
      </div>

      {/* Staff Shifts Table */}
      {tab === 'teacher' && (
        <div className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#ECE6DA] bg-[#FAF8F5] flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#310064]">
              Faculty Punch In / Out Shift Records
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Live Biometric Sync
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ECE6DA] text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Clock In</th>
                  <th className="py-3 px-4">Clock Out</th>
                  <th className="py-3 px-4">Shift Duration</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DA]">
                {sampleTeacherLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-heading font-bold text-slate-900">
                      {log.name}
                    </td>
                    <td className="py-3 px-4 text-[#5A5A65]">{log.date}</td>
                    <td className="py-3 px-4 text-[#5A5A65]">{log.in}</td>
                    <td className="py-3 px-4 text-[#5A5A65]">{log.out}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#310064]">{log.hours}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Sessions Table */}
      {tab === 'student' && (
        <div className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#ECE6DA] bg-[#FAF8F5] flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#310064]">
              Student 1-on-1 Class Attendance
            </h3>
            <span className="text-[11px] font-bold text-[#310064] bg-[#F2ECFC] px-2.5 py-0.5 rounded-full">
              Session-Wise Tracking
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[#5A5A65]">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
              <span>Loading student attendance...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#ECE6DA] text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Session</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Teacher</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE6DA]">
                  {classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-heading font-bold text-slate-900">
                        Session #{cls.session_number}: {cls.subject_name}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{cls.student_name}</td>
                      <td className="py-3 px-4 text-[#5A5A65]">{cls.teacher_name}</td>
                      <td className="py-3 px-4 text-[#5A5A65]">
                        {cls.session_date} ({cls.start_time})
                      </td>
                      <td className="py-3 px-4">
                        {cls.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Attended (Present)
                          </span>
                        ) : cls.status === 'carried_forward' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            Excused Leave
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                            Upcoming
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
