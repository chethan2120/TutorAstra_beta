'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarPlus,
  Clock,
  UserCheck,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Sparkles
} from 'lucide-react';

export default function AdminScheduleTeacherPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  // Form State
  const [teacherId, setTeacherId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState('17:00');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [sessionTitle, setSessionTitle] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [tRes, sRes, subRes] = await Promise.all([
          fetch('/api/admin/teachers'),
          fetch('/api/admin/students'),
          fetch('/api/admin/subjects')
        ]);

        if (tRes.ok) {
          const tData = await tRes.json();
          setTeachers(tData.teachers || []);
          if (tData.teachers?.length > 0) setTeacherId(tData.teachers[0].id);
        }
        if (sRes.ok) {
          const sData = await sRes.json();
          setStudents(sData.students || []);
          if (sData.students?.length > 0) setStudentId(sData.students[0].id);
        }
        if (subRes.ok) {
          const subData = await subRes.json();
          setSubjects(subData.subjects || []);
          if (subData.subjects?.length > 0) setSubjectId(subData.subjects[0].id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleScheduleTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !studentId || !subjectId || !sessionDate || !startTime) {
      setFeedback({ type: 'error', message: 'All scheduling fields are required.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    // Compute end time based on duration
    const [h, m] = startTime.split(':').map(Number);
    const endMinutesTotal = h * 60 + m + Number(durationMinutes);
    const endH = Math.floor(endMinutesTotal / 60) % 24;
    const endM = endMinutesTotal % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    try {
      const res = await fetch('/api/admin/classes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_single',
          teacher_id: Number(teacherId),
          student_id: Number(studentId),
          subject_id: Number(subjectId),
          session_date: sessionDate,
          start_time: startTime,
          end_time: endTime,
          duration_minutes: Number(durationMinutes),
          session_title: sessionTitle || '1-on-1 Personalized Session'
        })
      });

      if (res.ok) {
        setFeedback({
          type: 'success',
          message: `Class successfully scheduled for teacher! Both Teacher Portal and Student Portal are updated automatically.`
        });
        setSessionTitle('');
      } else {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.error || 'Failed to schedule class.' });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Error communicating with server.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs">
        <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
          Faculty Timetable Allocation
        </span>
        <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-2">
          Schedule Classes to Teacher
        </h1>
        <p className="text-xs text-[#5A5A65] mt-0.5">
          Assign specific dates, time slots, student, and duration to any teacher. Automatically syncs to the teacher's calendar.
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

      {/* Scheduling Form */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs">
        <form onSubmit={handleScheduleTeacher} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Select Teacher */}
            <div>
              <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
                Select Teacher / Faculty *
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
                required
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.qualification || 'Faculty'})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Student */}
            <div>
              <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
                Select Student *
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
                required
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.grade || 'Grade 10'} • {s.curriculum || 'CBSE'})
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
                className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
                required
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
                Session Date *
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
                required
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
                Duration (How Long) *
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
              >
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes (Standard 1-on-1)</option>
                <option value="90">90 Minutes (Intensive / Mock)</option>
                <option value="120">120 Minutes (Extended Lab)</option>
              </select>
            </div>
          </div>

          {/* Session Topic */}
          <div>
            <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
              Curriculum Topic / Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Electromagnetic Induction & Problem Solving"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
            />
          </div>

          <div className="pt-3 border-t border-[#ECE6DA] flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F4CC45]" />
                  <span>Allocating Teacher Timetable...</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4 text-[#F4CC45]" />
                  <span>Schedule Class to Teacher</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
