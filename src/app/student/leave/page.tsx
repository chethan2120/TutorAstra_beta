'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CalendarX2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Send,
  Loader2,
  Calendar,
  Sparkles,
  ShieldCheck,
  User,
  History
} from 'lucide-react';

export default function StudentLeavePage() {
  const searchParams = useSearchParams();
  const preselectedClassId = searchParams.get('classId') || '';

  const [leaves, setLeaves] = useState<any[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedClassId, setSelectedClassId] = useState<string>(preselectedClassId);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchData = async () => {
    try {
      const [leavesRes, classesRes, subjectsRes] = await Promise.all([
        fetch('/api/student/leave'),
        fetch('/api/student/classes?status=scheduled'),
        fetch('/api/student/subjects')
      ]);

      if (leavesRes.ok) {
        const data = await leavesRes.json();
        setLeaves(data.leaves || []);
      }

      if (classesRes.ok) {
        const data = await classesRes.json();
        setUpcomingClasses(data.classes || []);
      }

      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        setEnrollments(data.enrollments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (preselectedClassId) {
      setSelectedClassId(preselectedClassId);
    }
  }, [preselectedClassId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !reason.trim()) {
      setFeedback({ type: 'error', message: 'Please select a class and provide a reason.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/student/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: Number(selectedClassId),
          reason: reason.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: data.message || 'Leave auto-approved! 1 replacement class has been credited to your subject quota.'
        });
        setSelectedClassId('');
        setReason('');
        fetchData();
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to submit leave request.'
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Network error submitting leave.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate monthly leaves used per subject
  const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
  const subjectQuotas = enrollments.map((enr) => {
    const usedThisMonth = leaves.filter((l) => {
      const isSameSubject = l.subject_id === enr.subject_id || l.subject_name === enr.subject_name;
      const isSameMonth = (l.created_at || '').startsWith(currentMonthStr);
      return isSameSubject && isSameMonth && l.status === 'approved';
    }).length;

    const remaining = Math.max(0, 2 - usedThisMonth);

    return {
      ...enr,
      usedThisMonth,
      remaining
    };
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#310064] via-[#4A0D88] to-[#1E003D] p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4CC45] text-[#310064]">
              POLICY COMPLIANT
            </span>
            <span className="text-xs text-purple-200">12h Advance Notice • Max 2/Month/Subject</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
            Student Leave & Replacement Portal
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-1.5 leading-relaxed">
            Need to reschedule a class? TutorAstra allows up to <strong>2 approved leaves per subject per month</strong> when submitted at least <strong>12 hours in advance</strong>. Approved leaves automatically credit a replacement session to your enrolled quota.
          </p>
        </div>
      </div>

      {/* Subject Quota Cards */}
      <div>
        <h2 className="text-sm font-heading font-bold text-[#310064] mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#F4CC45]" />
          <span>Monthly Leave Allowance (This Month)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectQuotas.map((sq) => (
            <div
              key={sq.id}
              className="bg-white rounded-xl p-4 border border-[#ECE6DA] shadow-xs flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#310064] border border-[#ECE6DA]">
                  {sq.subject_code || 'SUBJ'}
                </span>
                <h4 className="font-heading font-black text-sm text-[#310064] mt-1">
                  {sq.subject_name}
                </h4>
                <p className="text-xs text-[#5A5A65] mt-0.5">
                  Used: <strong className="text-[#310064]">{sq.usedThisMonth} / 2</strong> this month
                </p>
              </div>

              <div className="text-right">
                <div
                  className={`text-2xl font-heading font-black ${
                    sq.remaining > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {sq.remaining}
                </div>
                <div className="text-[10px] font-bold text-[#5A5A65] uppercase">
                  Available
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Application Form */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#ECE6DA]">
          <CalendarX2 className="w-5 h-5 text-[#310064]" />
          <div>
            <h3 className="font-heading font-bold text-base text-[#310064]">
              Apply for Class Leave
            </h3>
            <p className="text-xs text-[#5A5A65]">
              Session must be at least 12 hours in the future to qualify for automated replacement.
            </p>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs mb-5 flex items-start gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          {/* Select Session */}
          <div>
            <label className="block text-xs font-heading font-bold text-[#310064] mb-1.5">
              Select Scheduled Class Session *
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064] bg-[#FAF8F5]"
              required
            >
              <option value="">-- Choose an upcoming class --</option>
              {upcomingClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.subject_name} • Session #{cls.session_number}: {cls.session_title} ({cls.session_date} at {cls.start_time})
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-heading font-bold text-[#310064] mb-1.5">
              Reason for Absence *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. School mid-term practical examination, unwell, or family function."
              className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
              required
            />
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DA] text-[11px] text-[#5A5A65] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Once submitted, your assigned teacher is automatically notified in Teacher Box and <strong>+1 replacement session</strong> is credited.
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#F4CC45]" />
                <span>Validating Notice & Applying...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#F4CC45]" />
                <span>Submit Leave Application</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Leave Application History */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs">
        <h3 className="font-heading font-bold text-base text-[#310064] mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-[#F4CC45]" />
          <span>Leave Request History</span>
        </h3>

        {leaves.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#5A5A65]">
            No leave requests recorded. Your attendance record is 100%!
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs min-w-[620px]">
              <thead className="bg-[#FAF8F5] text-[#5A5A65] font-heading uppercase text-[10px] tracking-wider border-b border-[#ECE6DA]">
                <tr>
                  <th className="py-2.5 px-3">Subject / Session</th>
                  <th className="py-2.5 px-3">Class Date & Time</th>
                  <th className="py-2.5 px-3">Applied At</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Replacement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DA]">
                {leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-[#FAF8F5]/50">
                    <td className="py-3 px-3">
                      <strong className="text-[#310064] font-heading block">{l.subject_name || 'Subject'}</strong>
                      <span className="text-[11px] text-[#5A5A65]">{l.session_title || 'Session'}</span>
                    </td>
                    <td className="py-3 px-3 text-[#5A5A65]">
                      <div>{l.class_date || 'Upcoming'}</div>
                      <div className="text-[11px] text-slate-400">{l.start_time || '17:00'}</div>
                    </td>
                    <td className="py-3 px-3 text-[#5A5A65]">
                      {new Date(l.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-3 text-[#5A5A65] max-w-xs truncate" title={l.reason}>
                      {l.reason}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Approved
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded bg-[#F4CC45]/20 text-[#310064] border border-[#F4CC45]/40">
                        +1 Carried Forward
                      </span>
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
