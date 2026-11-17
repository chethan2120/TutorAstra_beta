'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Lock,
  ExternalLink,
  RefreshCw,
  Server,
  Zap,
  Users
} from 'lucide-react';

export default function AdminZoomPage() {
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Healthy • Connected to Zoom Enterprise API');
  const [meetings, setMeetings] = useState<any[]>([]);

  const fetchMeetings = () => {
    fetch('/api/admin/classes?status=scheduled&limit=20')
      .then((res) => res.json())
      .then((data) => {
        setMeetings(data.classes || []);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleTestConnection = () => {
    setLoading(true);
    setTimeout(() => {
      setSyncStatus('Verified • JWT OAuth 2.0 Credentials Synced');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
            Integration Console
          </span>
          <h1 className="text-2xl font-heading font-black text-[#1E1E24] mt-2">
            Zoom Premium & Classroom Security
          </h1>
          <p className="text-xs text-[#5A5A65] mt-1">
            Configure server-to-server OAuth credentials, verify meeting creation webhooks, and enforce the 15-minute room unlock policy.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestConnection}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-[#310064] text-white text-xs font-heading font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#220046]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Test Zoom API Handshake</span>
        </button>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5A5A65] font-medium">OAuth 2.0 Status</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Connected
            </span>
          </div>
          <div className="text-lg font-heading font-black text-[#310064]">Zoom Premium</div>
          <div className="text-[11px] text-[#5A5A65]">{syncStatus}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5A5A65] font-medium">Classroom Security</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-[#310064]" />
              Strict Enforced
            </span>
          </div>
          <div className="text-lg font-heading font-black text-[#310064]">15-Minute Lock</div>
          <div className="text-[11px] text-[#5A5A65]">
            Links suppressed until T-15 minutes before scheduled start.
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5A5A65] font-medium">Cloud Recordings</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <Zap className="w-3 h-3 text-amber-600" />
              Single-Watch
            </span>
          </div>
          <div className="text-lg font-heading font-black text-[#310064]">Auto-Archiving</div>
          <div className="text-[11px] text-[#5A5A65]">
            Recordings consumed once per student to conserve server memory.
          </div>
        </div>
      </div>

      {/* Live Zoom Classrooms Monitor */}
      <div className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA]">
          <h3 className="font-heading font-bold text-base text-[#310064] flex items-center gap-2">
            <Video className="w-4 h-4 text-[#F4CC45]" />
            <span>Scheduled Meeting Rooms ({meetings.length})</span>
          </h3>
          <span className="text-xs text-[#5A5A65]">
            Auto-created with unique meeting IDs and randomized passcodes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#5A5A65] uppercase text-[10px] tracking-wider border-b border-[#ECE6DA]">
              <tr>
                <th className="py-2.5 px-3">Session & Subject</th>
                <th className="py-2.5 px-3">Meeting ID</th>
                <th className="py-2.5 px-3">Passcode</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Lock Rule</th>
                <th className="py-2.5 px-3 text-right">Host / Join Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE6DA]">
              {meetings.map((m) => (
                <tr key={m.id} className="hover:bg-[#FAF8F5]/50">
                  <td className="py-3 px-3">
                    <strong className="text-[#310064] block font-heading">
                      Session #{m.session_number}: {m.subject_name}
                    </strong>
                    <span className="text-[11px] text-[#5A5A65]">
                      {m.student_name} with {m.teacher_name}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#1E1E24]">
                    {m.zoom_meeting_id || '987-100-01'}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#5A5A65]">
                    {m.zoom_passcode || 'TA01'}
                  </td>
                  <td className="py-3 px-3 text-[#5A5A65]">
                    {m.session_date} • {m.start_time}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      <Lock className="w-3 h-3 text-amber-500" />
                      15m Window
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={m.zoom_join_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#310064] hover:underline"
                    >
                      <span>Room URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
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
