'use client';

import React, { useState, useEffect } from 'react';
import {
  BookMarked,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Trash2,
  Edit3,
  Loader2,
  Award,
  Sparkles
} from 'lucide-react';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [submitting, setSubmitting] = useState(false);

  // Grade Modal State
  const [gradingAssignment, setGradingAssignment] = useState<any | null>(null);
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadAssignments = async () => {
    try {
      const res = await fetch('/api/teacher/assignments');
      if (res.ok) {
        const d = await res.json();
        setAssignments(d.assignments || []);
        setStudents(d.students || []);
        setSubjects(d.subjects || []);
        if (d.students?.length > 0 && !studentId) setStudentId(String(d.students[0].id));
        if (d.subjects?.length > 0 && !subjectId) setSubjectId(String(d.subjects[0].id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/teacher/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: Number(studentId),
          subject_id: Number(subjectId),
          title,
          description,
          due_date: dueDate,
          max_marks: Number(maxMarks)
        })
      });
      if (res.ok) {
        await loadAssignments();
        setShowModal(false);
        setTitle('');
        setDescription('');
        setDueDate('');
      } else {
        alert('Failed to assign course or homework.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignment) return;
    try {
      const res = await fetch('/api/teacher/assignments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: gradingAssignment.id,
          status: 'graded',
          obtained_marks: Number(obtainedMarks),
          feedback
        })
      });
      if (res.ok) {
        await loadAssignments();
        setGradingAssignment(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coursework assignment?')) return;
    try {
      const res = await fetch(`/api/teacher/assignments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadAssignments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black uppercase tracking-wider bg-[#F2ECFC] text-[#310064]">
              Curriculum & Coursework Manager
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
            Assign Class or Coursework
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
            Dispatch tailored 1-on-1 homework, problem sets, and syllabus modules directly to your students.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#310064] text-white font-heading font-bold text-xs hover:bg-[#430080] shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#F4CC45]" />
          <span>Assign New Coursework</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-[#5A5A65]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
          <span>Loading course assignments and syllabus trackers...</span>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ECE6DA] p-12 text-center space-y-3">
          <BookMarked className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-heading font-bold text-[#1E1E24]">No Coursework Assigned Yet</h3>
          <p className="text-xs text-[#5A5A65] max-w-sm mx-auto">
            Get started by assigning chapter homework or a diagnostic practice module to Ethan Jenkins.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-[#310064] text-white text-xs font-bold hover:bg-[#430080]"
          >
            Create First Assignment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assignments.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#ECE6DA] p-6 shadow-xs hover:border-[#310064]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="px-2.5 py-1 rounded-md text-[10px] font-heading font-extrabold"
                    style={{
                      backgroundColor: `${item.subject_color || '#310064'}15`,
                      color: item.subject_color || '#310064'
                    }}
                  >
                    {item.subject_name} • {item.subject_code}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${
                      item.status === 'graded'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'submitted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-base text-[#1E1E24] mt-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5A5A65] mt-1.5 leading-relaxed line-clamp-3">
                  {item.description || 'No additional instructions.'}
                </p>

                <div className="mt-4 pt-4 border-t border-[#ECE6DA]/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#5A5A65] block">Student</span>
                    <span className="font-semibold text-[#1E1E24] flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5 text-[#310064]" />
                      {item.student_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5A5A65] block">Submission Due</span>
                    <span className="font-semibold text-[#1E1E24] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      {item.due_date}
                    </span>
                  </div>
                </div>

                {item.status === 'graded' && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center justify-between">
                      <span>Awarded Marks:</span>
                      <span className="font-mono text-sm">{item.obtained_marks} / {item.max_marks}</span>
                    </div>
                    {item.feedback && (
                      <p className="text-[11px] text-emerald-700 italic">"{item.feedback}"</p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#ECE6DA] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setGradingAssignment(item);
                    setObtainedMarks(String(item.obtained_marks || item.max_marks));
                    setFeedback(item.feedback || '');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECFC] text-[#310064] text-xs font-bold flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{item.status === 'graded' ? 'Update Grade' : 'Grade Submission'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove coursework"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ASSIGN NEW COURSEWORK */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#ECE6DA] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA]">
              <h3 className="font-heading font-extrabold text-base text-[#1E1E24]">
                Assign Class or Coursework
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                    Select Student
                  </label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs font-bold text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grade || 'Grade 10'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                    Subject / Course
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs font-bold text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. CBSE Grade 10 Light & Reflection Ray Diagrams"
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                  Detailed Instructions & Topics Covered
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Mention problem numbers from NCERT textbook or reference sheets..."
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs font-bold text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs font-bold text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ECE6DA]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A5A65] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#310064] text-white font-heading font-bold text-xs hover:bg-[#430080] disabled:opacity-50"
                >
                  {submitting ? 'Assigning...' : 'Dispatch Coursework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GRADE ASSIGNMENT */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#ECE6DA] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA]">
              <h3 className="font-heading font-extrabold text-base text-[#1E1E24]">
                Grade Submission: {gradingAssignment.title}
              </h3>
              <button
                type="button"
                onClick={() => setGradingAssignment(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                  Marks Obtained (Max: {gradingAssignment.max_marks})
                </label>
                <input
                  type="number"
                  max={gradingAssignment.max_marks}
                  min={0}
                  value={obtainedMarks}
                  onChange={(e) => setObtainedMarks(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs font-bold text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                  Faculty Feedback & Qualitative Remarks
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  placeholder="e.g. Excellent ray diagrams. Needs slight revision on sign convention formulas."
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ECE6DA]">
                <button
                  type="button"
                  onClick={() => setGradingAssignment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A5A65] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-heading font-bold text-xs hover:bg-emerald-700"
                >
                  Save Grade & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
