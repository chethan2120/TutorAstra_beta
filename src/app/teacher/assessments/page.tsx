'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  MessageSquare,
  Loader2,
  Save,
  Award
} from 'lucide-react';

export default function TeacherAssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [teacherNotes, setTeacherNotes] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadAssessments() {
      try {
        const res = await fetch('/api/teacher/assessments');
        if (res.ok) {
          const d = await res.json();
          setAssessments(d.assessments || []);
          if (d.assessments?.length > 0) {
            setSelectedAssessment(d.assessments[0]);
            setTeacherNotes(d.assessments[0].teacher_notes || '');
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAssessments();
  }, []);

  const handleSelectAssessment = (a: any) => {
    setSelectedAssessment(a);
    setTeacherNotes(a.teacher_notes || '');
    setSaveSuccess(false);
  };

  const handleSaveReview = async () => {
    if (!selectedAssessment || !teacherNotes.trim()) return;
    setSavingNote(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/teacher/assessments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: selectedAssessment.id,
          teacherNotes: teacherNotes.trim()
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        // Update local list
        setAssessments((prev) =>
          prev.map((item) =>
            item.id === selectedAssessment.id
              ? { ...item, teacher_reviewed: 1, teacher_notes: teacherNotes.trim() }
              : item
          )
        );
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs">
        <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
          Ms. Violet AI Assessment Reviews
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
          Review practice test submissions from your assigned students, inspect automated rubric scoring, and add mentor feedback.
        </p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-[#5A5A65]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
          <span>Loading assessment records...</span>
        </div>
      ) : assessments.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#ECE6DA] text-xs text-[#5A5A65]">
          No AI assessments have been submitted by your assigned students yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Assessment Submissions List (5 cols) */}
          <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-[#ECE6DA] shadow-xs space-y-2">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#5A5A65] px-2 py-1">
              Student Submissions ({assessments.length})
            </h3>

            {assessments.map((a) => {
              const isSelected = selectedAssessment?.id === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleSelectAssessment(a)}
                  className={`w-full p-3.5 text-left rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#FAF8F5] border-[#310064] shadow-xs'
                      : 'bg-white border-[#ECE6DA] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#310064]">
                      {a.subject_name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Score: {a.score}/{a.max_score}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-[#1E1E24] mt-1 line-clamp-1">
                    {a.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-[#5A5A65] mt-2 pt-2 border-t border-[#ECE6DA]/60">
                    <span>Student: {a.student_name}</span>
                    <span>{a.teacher_reviewed ? '✓ Reviewed' : 'Pending Review'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Scorecard & Mentor Feedback (7 cols) */}
          {selectedAssessment && (
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#ECE6DA] shadow-xs space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-[#ECE6DA]">
                <div>
                  <span className="text-[10px] font-bold text-[#310064] bg-[#F2ECFC] px-2 py-0.5 rounded uppercase">
                    Ms. Violet AI Assessment Report
                  </span>
                  <h2 className="text-lg font-heading font-extrabold text-[#1E1E24] mt-1">
                    {selectedAssessment.title}
                  </h2>
                  <p className="text-xs text-[#5A5A65]">
                    Student: <strong>{selectedAssessment.student_name}</strong> • Test Format: {selectedAssessment.test_type?.toUpperCase()}
                  </p>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DA] text-center">
                  <div className="text-[10px] text-[#5A5A65]">Calculated Score</div>
                  <div className="text-xl font-heading font-black text-[#310064]">
                    {selectedAssessment.score} / {selectedAssessment.max_score}
                  </div>
                </div>
              </div>

              {/* AI Feedback Banner */}
              <div className="p-4 rounded-xl bg-[#F2ECFC] border border-[#E0D3F5] text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-heading font-bold text-[#310064]">
                  <Sparkles className="w-4 h-4 text-[#F4CC45]" />
                  <span>Ms. Violet Automated Evaluation:</span>
                </div>
                <p className="text-purple-900 leading-relaxed">
                  {selectedAssessment.ai_feedback || 'Solid conceptual mastery demonstrated.'}
                </p>
              </div>

              {/* Mentor Written Feedback Form */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-heading font-bold text-[#1E1E24]">
                  Faculty Review & Notes for Student / Parent:
                </label>
                <textarea
                  rows={4}
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="Add feedback to guide the student's next 1-on-1 session..."
                  className="w-full p-3 rounded-xl border border-[#ECE6DA] text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                />

                {saveSuccess && (
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mentor feedback saved and synced to Student Dashboard & Teacher Box!</span>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={savingNote || !teacherNotes.trim()}
                    onClick={handleSaveReview}
                    className="btn-primary text-xs font-heading font-bold flex items-center gap-1.5"
                  >
                    {savingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Record Mentor Review</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
