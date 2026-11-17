'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Play,
  Square,
  ArrowUpRight,
  TrendingUp,
  History,
  ShieldCheck
} from 'lucide-react';

export default function TeacherAttendancePage() {
  const [punchedIn, setPunchedIn] = useState(true);
  const [punchInTime, setPunchInTime] = useState<Date>(new Date(Date.now() - 4 * 60 * 60 * 1000)); // 4 hours ago
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsedMs = currentTime.getTime() - punchInTime.getTime();
  const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
  const elapsedSeconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);

  const handleTogglePunch = () => {
    if (punchedIn) {
      setPunchedIn(false);
    } else {
      setPunchedIn(true);
      setPunchInTime(new Date());
    }
  };

  const sampleLogs = [
    { date: 'Today, 17 Nov 2026', in: '11:21 AM', out: 'In Progress', hours: `${elapsedHours}h ${elapsedMinutes}m`, status: 'Present' },
    { date: 'Mon, 16 Nov 2026', in: '09:00 AM', out: '05:30 PM', hours: '8h 30m', status: 'Completed' },
    { date: 'Sun, 15 Nov 2026', in: '10:00 AM', out: '04:00 PM', hours: '6h 00m', status: 'Completed' },
    { date: 'Sat, 14 Nov 2026', in: '09:15 AM', out: '05:15 PM', hours: '8h 00m', status: 'Completed' },
    { date: 'Fri, 13 Nov 2026', in: '09:00 AM', out: '05:00 PM', hours: '8h 00m', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#310064] to-[#171746] p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4CC45] text-[#310064]">
              FACULTY ATTENDANCE
            </span>
            <span className="text-xs text-purple-200">Biometric & Portal Punch Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
            Staff Time & Attendance Register
          </h1>
          <p className="text-xs text-purple-100/90 mt-1 max-w-xl">
            Live attendance tracking for 1-on-1 tutoring sessions, parent consultations, and syllabus planning shifts.
          </p>
        </div>

        {/* Punch In / Out Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[200px]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-200 mb-1">
            Current Shift Status
          </div>
          <div className="text-xl font-heading font-black text-[#F4CC45]">
            {punchedIn ? 'PRESENT / ACTIVE' : 'CLOCKED OUT'}
          </div>
          <button
            type="button"
            onClick={handleTogglePunch}
            className={`mt-3 w-full py-2 px-4 rounded-xl text-xs font-heading font-black transition-all shadow-md flex items-center justify-center gap-2 ${
              punchedIn
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {punchedIn ? (
              <>
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Punch Out</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Punch In</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Timer Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#310064] text-[#F4CC45] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#5A5A65]">Active Shift Duration Today</div>
            <div className="text-2xl font-mono font-black text-[#310064]">
              {String(elapsedHours).padStart(2, '0')}:{String(elapsedMinutes).padStart(2, '0')}:{String(elapsedSeconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#5A5A65]">
          <div>
            <span>Punch In Timestamp:</span>
            <strong className="block text-[#310064]">
              {punchInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </strong>
          </div>
          <div>
            <span>Scheduled Today:</span>
            <strong className="block text-[#310064]">6 Sessions (6h)</strong>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs">
        <h3 className="font-heading font-bold text-base text-[#310064] mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-[#F4CC45]" />
          <span>Recent Shift Logs (November 2026)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#5A5A65] uppercase text-[10px] tracking-wider border-b border-[#ECE6DA]">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Clock In</th>
                <th className="py-2.5 px-3">Clock Out</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE6DA]">
              {sampleLogs.map((log, i) => (
                <tr key={i} className="hover:bg-[#FAF8F5]/50">
                  <td className="py-3 px-3 font-heading font-bold text-[#310064]">{log.date}</td>
                  <td className="py-3 px-3 text-[#5A5A65]">{log.in}</td>
                  <td className="py-3 px-3 text-[#5A5A65]">{log.out}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#310064]">{log.hours}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
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
    </div>
  );
}
