'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarX2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Send,
  Loader2,
  ShieldCheck,
  Info
} from 'lucide-react';

export default function TeacherLeavePage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadLeaves = async () => {
    try {
      const res = await fetch('/api/teacher/leave');
      if (res.ok) {
        const d = await res.json();
        setLeaves(d.leaves || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      setFeedback({ type: 'error', message: 'Please provide start date, end date, and reason.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/teacher/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          reason: reason.trim()
        })
      });

      const d = await res.json();
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: 'Leave application submitted successfully. Academic timetable coordinator notified.'
        });
        setStartDate('');
        setEndDate('');
        setReason('');
        await loadLeaves();
      } else {
        setFeedback({ type: 'error', message: d.error || 'Failed to submit leave.' });
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black uppercase tracking-wider bg-[#F2ECFC] text-[#310064]">
              Staff Absence & Leave Register
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
            Faculty Leave Applications
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
            Request planned absence for personal, academic conference, or medical reasons. The administration will automatically reschedule impacted 1-on-1 classes.
          </p>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#5A5A65] block">
            Annual Casual Leave
          </span>
          <div className="text-2xl font-heading font-black text-[#310064] mt-1">12 Days</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">9 Days Remaining</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#5A5A65] block">
            Medical / Emergency Leave
          </span>
          <div className="text-2xl font-heading font-black text-[#310064] mt-1">8 Days</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">8 Days Available</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#5A5A65] block">
            Total Leave Logged
          </span>
          <div className="text-2xl font-heading font-black text-[#1E1E24] mt-1">{leaves.length} Applications</div>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Recorded in HR Database</span>
        </div>
      </div>

      {/* MAIN TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: APPLY FOR LEAVE FORM */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#ECE6DA] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-heading font-extrabold text-[#1E1E24]">
            Apply for Faculty Leave
          </h2>

          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                Start Date of Leave
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DA] text-xs font-bold text-[#1E1E24] focus:outline-none focus:border-[#310064]"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                End Date of Leave
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DA] text-xs font-bold text-[#1E1E24] focus:outline-none focus:border-[#310064]"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                Reason for Leave
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={4}
                placeholder="Explain the reason (e.g. CBSE Academic Valuation Workshop or Personal Emergency)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DA] text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] text-[11px] text-[#5A5A65] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
              <span>
                Applying will notify Super Admin. Sessions during this interval will be flagged for student rescheduling.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#310064] text-white font-heading font-bold text-xs hover:bg-[#430080] shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#F4CC45]" />
              <span>{submitting ? 'Submitting...' : 'Submit Leave Application'}</span>
            </button>
          </form>
        </div>

        {/* RIGHT: LEAVE HISTORY */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#ECE6DA] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-heading font-extrabold text-[#1E1E24]">
            My Leave Records & Approval Status
          </h2>

          {loading ? (
            <div className="p-12 text-center text-xs text-[#5A5A65]">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#310064] mb-2" />
              <span>Fetching leave records...</span>
            </div>
          ) : leaves.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#5A5A65] rounded-xl border border-dashed border-[#ECE6DA]">
              No leave applications submitted. Your attendance record is 100% active.
            </div>
          ) : (
            <div className="space-y-3">
              {leaves.map((l) => (
                <div
                  key={l.id}
                  className="p-4 rounded-xl border border-[#ECE6DA] hover:border-[#310064]/40 transition-all space-y-2 bg-[#FAF8F5]/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#310064]" />
                      <span className="font-heading font-bold text-xs text-[#1E1E24]">
                        {l.start_date} → {l.end_date}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${
                        l.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : l.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#5A5A65] leading-relaxed">
                    {l.reason}
                  </p>

                  {l.admin_notes && (
                    <div className="pt-2 border-t border-[#ECE6DA]/60 text-[11px] text-[#310064] flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Admin Note: {l.admin_notes}</span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400">
                    Submitted on {l.created_at ? new Date(l.created_at).toLocaleDateString() : 'Recent'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
