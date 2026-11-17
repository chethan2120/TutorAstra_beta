'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  UserPlus,
  Search,
  BookOpen,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  X,
  Loader2,
  Video,
  KeyRound,
  Trash2
} from 'lucide-react';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('Ph.D. Applied Physics • 10+ Yrs Exp');
  const [bio, setBio] = useState('Senior faculty specialist in secondary board mastery.');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Science', 'Physics']);
  const [password, setPassword] = useState('demo123');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const [subRes, uRes] = await Promise.all([
          fetch('/api/admin/subjects'),
          fetch('/api/admin/users?role=teacher')
        ]);

        if (subRes.ok) {
          const sData = await subRes.json();
          setSubjects(sData.subjects || []);
        }

        if (uRes.ok) {
          const uData = await uRes.json();
          setTeachers(uData.users || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [search]);

  const toggleSubject = (subName: string) => {
    if (selectedSubjects.includes(subName)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subName));
    } else {
      setSelectedSubjects([...selectedSubjects, subName]);
    }
  };

  const handleCreateTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountType: 'teacher',
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim(),
          qualification: qualification.trim(),
          bio: bio.trim(),
          subjects: selectedSubjects
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create teacher account.');
      }

      setFormSuccess('Faculty account created successfully! Branded invitation email has been queued.');

      // Refresh teachers
      const uRes = await fetch('/api/admin/users?role=teacher');
      if (uRes.ok) {
        const uData = await uRes.json();
        setTeachers(uData.users || []);
      }

      setTimeout(() => {
        setShowCreateModal(false);
        setFormSuccess(null);
        setName('');
        setEmail('');
        setPhone('');
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EBE4F6] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 tracking-tight">
            Teacher & Faculty Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Top 2% vetted educators, subject permissions, live schedules, and communication channels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-lg text-xs font-heading font-bold text-white bg-[#310064] hover:bg-[#430080] shadow-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <GraduationCap className="w-4 h-4 text-[#F4CC45]" />
          <span>[ Teacher ] Add New Faculty</span>
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teachers.map((tch: any) => (
          <div key={tch.id} className="bg-white rounded-2xl border border-[#EBE4F6] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#310064]/30 transition-all">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F2ECFC] text-[#310064] font-heading font-bold text-base flex items-center justify-center shrink-0 border border-[#E5DAF7]">
                  {tch.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-heading font-bold bg-[#FAF8F5] border border-[#ECE6DA] text-[#310064]">
                  Top 2% Vetted Faculty
                </span>
              </div>

              <h3 className="font-heading font-bold text-base text-slate-900 mt-3">{tch.name}</h3>
              <p className="text-xs text-[#310064] font-semibold">Lead Academic Faculty</p>
              <div className="text-xs text-slate-500 mt-2 space-y-1">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tch.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+971 50 234 5678</span>
                </div>
              </div>

              {/* Permitted Subjects */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-heading font-bold text-slate-400 block mb-1.5">
                  Permitted Subjects:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F2ECFC] text-[#310064]">
                    Science
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
                    Physics
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3E8FF] text-[#7C3AED]">
                    Mathematics
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active Faculty</span>
              </span>

              <Link
                href="/admin/classes"
                className="font-heading font-bold text-[#310064] hover:underline"
              >
                View Timetable →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE TEACHER MODAL (Requirement Stage 3) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 border border-[#EBE4F6] shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90dvh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2 py-0.5 rounded">
                  Faculty Account Provisioning
                </span>
                <h2 className="text-lg font-heading font-bold text-slate-900 mt-1">
                  Add Verified Teacher Account
                </h2>
                <p className="text-xs text-slate-500">
                  Provision teacher portal credentials, permitted subjects, and queue secure invitation email.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateTeacherSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">Teacher Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                  />
                </div>
                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">Teacher Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. teacher@tutorastra.com"
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 234 5678"
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                  />
                </div>
                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">Initial Password</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">Academic Credentials & Qualification</label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. Ph.D. Applied Physics (Cambridge Alum) • 12+ Years Teaching"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#310064]"
                />
              </div>

              {/* Permitted Subjects */}
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1.5">
                  Permitted Teaching Subjects *
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English & Literature', 'Computer Science'].map((sub) => {
                    const isSelected = selectedSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors ${
                          isSelected
                            ? 'bg-[#310064] text-white shadow-xs'
                            : 'bg-[#FAF8F5] text-slate-600 border border-slate-200 hover:bg-[#F2ECFC]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs font-heading font-bold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Faculty Account...</span>
                    </>
                  ) : (
                    <span>Create Teacher Account & Queue Invite</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
