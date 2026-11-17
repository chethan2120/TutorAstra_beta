'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  BookOpen,
  ArrowRight,
  Loader2,
  CalendarDays,
  Sparkles,
  Info
} from 'lucide-react';

export default function AdminSchedulePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  // Selection
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(1);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number>(1);

  // Form Parameters
  const [totalSessions, setTotalSessions] = useState<number>(50);
  const [classDuration, setClassDuration] = useState<number>(60);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3]); // Mon & Wed
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:00');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [timezone, setTimezone] = useState('Asia/Dubai');

  // Preview & Confirm State
  const [previewSessions, setPreviewSessions] = useState<any[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [uRes, subRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/subjects')
        ]);

        if (uRes.ok) {
          const uData = await uRes.json();
          const allUsers = uData.users || [];
          setStudents(allUsers.filter((u: any) => u.role === 'student'));
          setTeachers(allUsers.filter((u: any) => u.role === 'teacher'));
        }

        if (subRes.ok) {
          const sData = await subRes.json();
          setSubjects(sData.subjects || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const toggleDay = (dayNum: number) => {
    if (selectedDays.includes(dayNum)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayNum));
      }
    } else {
      setSelectedDays([...selectedDays, dayNum].sort());
    }
  };

  const handleGeneratePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoadingPreview(true);

    try {
      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'preview',
          enrollment_id: 1, // linked to primary enrollment
          student_id: selectedStudentId,
          teacher_id: selectedTeacherId,
          subject_id: selectedSubjectId,
          total_sessions: totalSessions,
          days_of_week: selectedDays,
          start_time: startTime,
          end_time: endTime,
          start_date: startDate,
          timezone
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate schedule preview.');
      }

      setPreviewSessions(data.previewSessions || []);
      if (data.conflictsCount > 0) {
        setFeedback({
          type: 'error',
          message: `Notice: ${data.conflictsCount} conflict(s) detected with existing bookings. Please review the highlighted sessions before confirming.`
        });
      } else {
        setFeedback({
          type: 'success',
          message: `Generated schedule preview for ${data.totalGenerated} sessions with zero conflicts detected.`
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred during preview generation.' });
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleConfirmBatch = async () => {
    if (!previewSessions.length) return;
    setConfirming(true);
    setFeedback(null);

    try {
      const payload = previewSessions.map((s) => ({
        enrollment_id: 1,
        student_id: selectedStudentId,
        teacher_id: selectedTeacherId,
        subject_id: selectedSubjectId,
        session_number: s.session_number,
        title: s.title,
        session_date: s.session_date,
        start_time: s.start_time,
        end_time: s.end_time,
        duration_minutes: s.duration_minutes || classDuration,
        timezone
      }));

      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm',
          sessions: payload
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to confirm schedule batch.');
      }

      setFeedback({
        type: 'success',
        message: data.message || 'Batch confirmed! All sessions are now live and synchronized across Student and Teacher portals.'
      });
      setPreviewSessions([]);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Confirmation failed.' });
    } finally {
      setConfirming(false);
    }
  };

  const daysLabel = [
    { num: 1, label: 'Mon' },
    { num: 2, label: 'Tue' },
    { num: 3, label: 'Wed' },
    { num: 4, label: 'Thu' },
    { num: 5, label: 'Fri' },
    { num: 6, label: 'Sat' },
    { num: 7, label: 'Sun' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#EBE4F6] shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2ECFC] text-[#310064] text-[11px] font-heading font-bold uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
          <span>Requirement Stage 4 & 5</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 tracking-tight">
          Batch Class Scheduling & Cross-Portal Synchronization
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Generate complete 30, 40, or 50-session courses with multi-day recurrence, conflict verification, and live preview before confirmation.
        </p>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
          feedback.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {feedback.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 2-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#EBE4F6] shadow-xs space-y-4">
          <h2 className="font-heading font-bold text-base text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Schedule Parameters</span>
            <span className="text-[10px] text-slate-400 font-normal">Step 1 of 2</span>
          </h2>

          <form onSubmit={handleGeneratePreview} className="space-y-4 text-xs">
            {/* Student Picker */}
            <div>
              <label className="block font-heading font-bold text-slate-700 mb-1">
                Select Student *
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
              >
                <option value="1">Ethan Jenkins (Grade 10 CBSE)</option>
                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                ))}
              </select>
            </div>

            {/* Subject & Teacher Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Enrolled Subject *
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                >
                  {subjects.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Assigned Teacher *
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                >
                  <option value="1">Dr. Sarah Mitchell (Lead Faculty)</option>
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Total Sessions & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Total Sessions to Schedule *
                </label>
                <div className="flex gap-2">
                  {[30, 40, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTotalSessions(num)}
                      className={`flex-1 py-1.5 rounded-lg font-heading font-bold transition-colors ${
                        totalSessions === num
                          ? 'bg-[#310064] text-white'
                          : 'bg-[#FAF8F5] text-slate-600 border border-slate-200 hover:bg-[#F2ECFC]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Class Duration
                </label>
                <select
                  value={classDuration}
                  onChange={(e) => setClassDuration(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                >
                  <option value="45">45 Minutes</option>
                  <option value="60">60 Minutes (Standard)</option>
                  <option value="90">90 Minutes (Intensive)</option>
                </select>
              </div>
            </div>

            {/* Multiple Weekly Days Selection */}
            <div>
              <label className="block font-heading font-bold text-slate-700 mb-1.5">
                Weekly Class Days (Select Multiple) *
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {daysLabel.map((d) => {
                  const isSelected = selectedDays.includes(d.num);
                  return (
                    <button
                      key={d.num}
                      type="button"
                      onClick={() => toggleDay(d.num)}
                      className={`py-2 rounded-lg text-xs font-heading font-bold transition-all ${
                        isSelected
                          ? 'bg-[#310064] text-[#F4CC45] shadow-xs ring-1 ring-[#310064]'
                          : 'bg-[#FAF8F5] text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Selected: {selectedDays.map((d) => daysLabel.find((l) => l.num === d)?.label).join(' & ')}
              </p>
            </div>

            {/* Time Slot & Timezone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">Start Time (24h) *</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                />
              </div>

              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">End Time (24h) *</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                />
              </div>

              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                >
                  <option value="Asia/Dubai">Asia/Dubai (GST +4)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="Europe/London">Europe/London (GMT / BST)</option>
                  <option value="America/New_York">America/New York (EST)</option>
                </select>
              </div>
            </div>

            {/* Generate Preview Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingPreview}
                className="btn-primary w-full text-xs font-heading font-bold flex items-center justify-center gap-2"
              >
                {loadingPreview ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking Availability & Generating...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Schedule Preview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Schedule Preview Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#EBE4F6] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                Generated Schedule Preview
              </h2>
              <p className="text-xs text-slate-500">
                Verify date sequence, syllabus chapters, and conflict flags before confirming.
              </p>
            </div>

            {previewSessions.length > 0 && (
              <button
                type="button"
                disabled={confirming}
                onClick={handleConfirmBatch}
                className="px-4 py-2 rounded-lg bg-[#310064] text-[#F4CC45] font-heading font-bold text-xs hover:bg-[#430080] shadow-xs flex items-center gap-1.5 transition-all"
              >
                {confirming ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Confirming & Syncing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm & Synchronize ({previewSessions.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {previewSessions.length > 0 ? (
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#FAF8F5] z-10 border-b border-slate-200">
                  <tr className="text-[11px] font-heading font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Topic / Session Title</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3 text-right">Conflict Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewSessions.map((s, idx) => (
                    <tr
                      key={idx}
                      className={s.has_conflict ? 'bg-rose-50/70 hover:bg-rose-50' : 'hover:bg-slate-50'}
                    >
                      <td className="py-2.5 px-3 font-heading font-bold text-slate-500">
                        {String(s.session_number).padStart(2, '0')}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {s.title}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        {s.session_date}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {s.start_time} - {s.end_time}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {s.has_conflict ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Clash Detected</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Clear</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F2ECFC] text-[#310064] flex items-center justify-center mx-auto">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div className="font-heading font-bold text-slate-800 text-sm">
                No Schedule Preview Generated Yet
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Fill in the recurrence parameters on the left (e.g. 50 sessions, Mon & Wed, 5:00 PM) and click "Generate Schedule Preview".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
