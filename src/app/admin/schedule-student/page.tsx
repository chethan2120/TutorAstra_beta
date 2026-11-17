'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Calendar,
  Clock,
  User,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Sparkles,
  Edit2,
  XCircle,
  Mail,
  RotateCcw
} from 'lucide-react';

export default function AdminScheduleStudentPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [existingClasses, setExistingClasses] = useState<any[]>([]);

  // Generation form
  const [studentId, setStudentId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [totalClasses, setTotalClasses] = useState('50');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3]); // Mon & Wed default
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('17:00');
  const [durationMinutes, setDurationMinutes] = useState('60');

  // Preview & Confirm State
  const [previewSessions, setPreviewSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Reschedule Modal
  const [rescheduleModal, setRescheduleModal] = useState<any | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('17:00');
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Cancel Modal
  const [cancelModal, setCancelModal] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('Administrative rescheduling');

  const loadData = async () => {
    try {
      const [sRes, tRes, subRes, cRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/teachers'),
        fetch('/api/admin/subjects'),
        fetch('/api/admin/classes?limit=50')
      ]);

      if (sRes.ok) {
        const sData = await sRes.json();
        setStudents(sData.students || []);
        if (sData.students?.length > 0) setStudentId(sData.students[0].id);
      }
      if (tRes.ok) {
        const tData = await tRes.json();
        setTeachers(tData.teachers || []);
        if (tData.teachers?.length > 0) setTeacherId(tData.teachers[0].id);
      }
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubjects(subData.subjects || []);
        if (subData.subjects?.length > 0) setSubjectId(subData.subjects[0].id);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setExistingClasses(cData.classes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const dayNames = [
    { num: 1, name: 'Mon' },
    { num: 2, name: 'Tue' },
    { num: 3, name: 'Wed' },
    { num: 4, name: 'Thu' },
    { num: 5, name: 'Fri' },
    { num: 6, name: 'Sat' },
    { num: 0, name: 'Sun' },
  ];

  // Calculate preview sessions
  const handleGeneratePreview = () => {
    if (!studentId || !teacherId || !subjectId || !totalClasses || selectedDays.length === 0) {
      setFeedback({ type: 'error', message: 'Please select all schedule parameters.' });
      return;
    }

    setFeedback(null);
    const count = parseInt(totalClasses, 10);
    const sessions: any[] = [];
    let curDate = new Date(startDate);
    const [h, m] = startTime.split(':').map(Number);
    const endMinutes = h * 60 + m + parseInt(durationMinutes, 10);
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const studentObj = students.find((s) => s.id === Number(studentId));
    const teacherObj = teachers.find((t) => t.id === Number(teacherId));
    const subjectObj = subjects.find((s) => s.id === Number(subjectId));

    while (sessions.length < count) {
      if (selectedDays.includes(curDate.getDay())) {
        const dateStr = curDate.toISOString().split('T')[0];
        const sessionNum: number = sessions.length + 1;
        sessions.push({
          student_id: Number(studentId),
          teacher_id: Number(teacherId),
          subject_id: Number(subjectId),
          student_name: studentObj?.name || 'Student',
          teacher_name: teacherObj?.name || 'Teacher',
          subject_name: subjectObj?.name || 'Subject',
          session_number: sessionNum,
          title: `${subjectObj?.name || 'Class'} Session ${String(sessionNum).padStart(2, '0')}`,
          session_date: dateStr,
          start_time: startTime,
          end_time: endTime,
          duration_minutes: parseInt(durationMinutes, 10),
          timezone: 'Asia/Dubai'
        });
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    setPreviewSessions(sessions);
  };

  // Confirm schedule: Saves all classes, updates portals, sends confirmation email to student
  const handleConfirmSchedule = async () => {
    if (previewSessions.length === 0) return;
    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm',
          sessions: previewSessions
        })
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: `Successfully scheduled all ${previewSessions.length} classes! Automatically synced to Teacher and Student portals, and schedule notification has been dispatched to student's email.`
        });
        setPreviewSessions([]);
        loadData();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to confirm schedule.' });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Error saving schedule.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Reschedule handler
  const handleExecuteReschedule = async () => {
    if (!rescheduleModal || !rescheduleDate || !rescheduleTime) return;
    setActionLoading(true);

    const [h, m] = rescheduleTime.split(':').map(Number);
    const endMinutes = h * 60 + m + (rescheduleModal.duration_minutes || 60);
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    try {
      const res = await fetch('/api/admin/classes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rescheduleModal.id,
          newDate: rescheduleDate,
          newStartTime: rescheduleTime,
          newEndTime: endTime,
          reason: rescheduleReason || 'Administrative reschedule'
        })
      });

      if (res.ok) {
        setRescheduleModal(null);
        setFeedback({
          type: 'success',
          message: 'Class session successfully rescheduled. Portals synchronized and notification sent.'
        });
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to reschedule.');
      }
    } catch (e) {
      alert('Error updating schedule.');
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel handler
  const handleExecuteCancel = async () => {
    if (!cancelModal) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/admin/classes?id=${cancelModal.id}&reason=${encodeURIComponent(cancelReason)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setCancelModal(null);
        setFeedback({
          type: 'success',
          message: 'Class cancelled. Balance preserved and replacement session allowed.'
        });
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to cancel class.');
      }
    } catch (e) {
      alert('Error cancelling class.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs">
        <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
          Master Student Scheduler
        </span>
        <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-2">
          Schedule Student Classes & Recurrence
        </h1>
        <p className="text-xs text-[#5A5A65] mt-0.5">
          Generate complete 30, 40, or 50 class packages for students with days and timings. Automatically sends confirmation email and synchronizes both portals.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
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

      {/* Scheduler Configuration Form */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-sm text-[#310064] pb-2 border-b border-[#ECE6DA] flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#F4CC45]" />
          <span>Define Recurrence Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Select Student */}
          <div>
            <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
              Select Student *
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5]"
              required
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade || 'Grade 10'})
                </option>
              ))}
            </select>
          </div>

          {/* Select Subject */}
          <div>
            <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
              Academic Subject *
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5]"
              required
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          {/* Select Tutor */}
          <div>
            <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
              Assigned Tutor / Faculty *
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5]"
              required
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.qualification || 'Specialist'})
                </option>
              ))}
            </select>
          </div>

          {/* Number of Classes */}
          <div>
            <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
              Number of Classes *
            </label>
            <select
              value={totalClasses}
              onChange={(e) => setTotalClasses(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5]"
            >
              <option value="50">50 Classes (Annual Curriculum)</option>
              <option value="40">40 Classes (Term 2 Intensive)</option>
              <option value="30">30 Classes (Board Exam Crash)</option>
              <option value="20">20 Classes (Diagnostic Track)</option>
              <option value="10">10 Classes (Foundational)</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
              Start Date *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DA]"
              required
            />
          </div>

          {/* Time & Duration */}
          <div>
            <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
              Time Slot & Duration *
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-1/2 text-xs p-2.5 rounded-xl border border-[#ECE6DA]"
                required
              />
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-1/2 text-xs p-2.5 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5]"
              >
                <option value="60">60 Min</option>
                <option value="90">90 Min</option>
                <option value="45">45 Min</option>
              </select>
            </div>
          </div>
        </div>

        {/* Days of Week Selection */}
        <div>
          <label className="block text-xs font-heading font-bold text-[#310064] mb-1.5">
            Days of Week (Mon, Tue, Wed, etc.) *
          </label>
          <div className="flex flex-wrap gap-2">
            {dayNames.map((d) => {
              const isSelected = selectedDays.includes(d.num);
              return (
                <button
                  key={d.num}
                  type="button"
                  onClick={() => toggleDay(d.num)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#310064] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#5A5A65] border border-[#ECE6DA] hover:bg-[#F2ECFC]'
                  }`}
                >
                  {d.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-[#ECE6DA] flex justify-end">
          <button
            type="button"
            onClick={handleGeneratePreview}
            className="px-6 py-2.5 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4CC45]" />
            <span>Generate & Preview All {totalClasses} Classes</span>
          </button>
        </div>
      </div>

      {/* Preview Sessions Table */}
      {previewSessions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ECE6DA]">
            <div>
              <h3 className="font-heading font-bold text-base text-[#310064]">
                Schedule Preview ({previewSessions.length} Sessions)
              </h3>
              <p className="text-xs text-[#5A5A65]">
                Review the dates before confirming. Confirming will generate all {previewSessions.length} sessions, update portals, and email the student.
              </p>
            </div>

            <button
              type="button"
              disabled={actionLoading}
              onClick={handleConfirmSchedule}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming & Syncing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Dispatch Schedule</span>
                </>
              )}
            </button>
          </div>

          <div className="max-h-72 overflow-x-auto overflow-y-auto border border-[#ECE6DA] rounded-xl custom-scrollbar">
            <table className="w-full text-left text-xs min-w-[480px]">
              <thead className="bg-[#FAF8F5] text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider sticky top-0 border-b border-[#ECE6DA]">
                <tr>
                  <th className="py-2.5 px-3">Session</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DA]">
                {previewSessions.map((ps, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-[#310064]">
                      #{String(ps.session_number).padStart(2, '0')}
                    </td>
                    <td className="py-2 px-3 text-slate-900 font-medium">{ps.session_date}</td>
                    <td className="py-2 px-3 text-[#5A5A65]">{ps.start_time} - {ps.end_time}</td>
                    <td className="py-2 px-3 text-slate-700">{ps.student_name}</td>
                    <td className="py-2 px-3 text-slate-700">{ps.teacher_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Scheduled Classes with Reschedule & Cancel Actions */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA]">
          <div>
            <h3 className="font-heading font-bold text-base text-[#310064]">
              Active Scheduled Classes (Timetable Management)
            </h3>
            <p className="text-xs text-[#5A5A65]">
              Admin can manually cancel the class of a particular day or reschedule to another day/time.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-[#ECE6DA] bg-[#FAF8F5] text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Session</th>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Teacher</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE6DA]">
              {existingClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3">
                    <strong className="text-slate-900 block font-heading">
                      Session #{String(cls.session_number).padStart(2, '0')}: {cls.subject_name}
                    </strong>
                    <span className="text-[10px] text-slate-400">{cls.title}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">{cls.student_name}</td>
                  <td className="py-2.5 px-3 text-[#5A5A65]">{cls.teacher_name}</td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <div>{cls.session_date}</div>
                    <div className="text-[10px] text-slate-400">{cls.start_time} - {cls.end_time}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-heading font-bold capitalize bg-[#F2ECFC] text-[#310064]">
                      {cls.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setRescheduleModal(cls);
                          setRescheduleDate(cls.session_date);
                          setRescheduleTime(cls.start_time);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-[#ECE6DA] hover:bg-[#F2ECFC] text-[#310064] text-[11px] font-heading font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Reschedule</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancelModal(cls)}
                        className="px-2 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-heading font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ECE6DA] space-y-4">
            <h3 className="text-base font-heading font-black text-[#310064]">
              Reschedule Class #{rescheduleModal.session_number}: {rescheduleModal.subject_name}
            </h3>
            <p className="text-xs text-[#5A5A65]">
              Select a new date and start time for {rescheduleModal.student_name} with {rescheduleModal.teacher_name}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">New Date *</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                />
              </div>

              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">New Start Time *</label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                />
              </div>

              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">Reason for Rescheduling</label>
                <input
                  type="text"
                  placeholder="e.g. Student request or timetable adjustment"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#ECE6DA]">
              <button
                type="button"
                onClick={() => setRescheduleModal(null)}
                className="flex-1 py-2 rounded-xl border border-[#ECE6DA] text-xs font-heading font-bold text-[#5A5A65]"
              >
                Close
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleExecuteReschedule}
                className="flex-1 py-2 rounded-xl bg-[#310064] text-white text-xs font-heading font-bold"
              >
                {actionLoading ? 'Updating...' : 'Save Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ECE6DA] space-y-4">
            <h3 className="text-base font-heading font-black text-rose-600">
              Cancel Class #{cancelModal.session_number}: {cancelModal.subject_name}?
            </h3>
            <p className="text-xs text-[#5A5A65]">
              Cancelling this class will preserve the student's class balance and allow a replacement session.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#5A5A65] mb-1">Cancellation Reason</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DA]"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#ECE6DA]">
              <button
                type="button"
                onClick={() => setCancelModal(null)}
                className="flex-1 py-2 rounded-xl border border-[#ECE6DA] text-xs font-heading font-bold text-[#5A5A65]"
              >
                Keep Class
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleExecuteCancel}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-heading font-bold"
              >
                {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
