'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New subject state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('#2563EB');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/admin/subjects');
      if (res.ok) {
        const data = await res.json();
        setSubjects(data.subjects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setAdding(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim() || name.substring(0, 4).toUpperCase(),
          color,
          description: description.trim()
        })
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: `Subject "${name}" added successfully.` });
        setName('');
        setCode('');
        setDescription('');
        fetchSubjects();
      } else {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.error || 'Failed to add subject.' });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Error creating subject.' });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSubject = async (id: number, subName: string) => {
    if (!confirm(`Are you sure you want to delete "${subName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/subjects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubjects((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs">
        <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
          Curriculum Offerings
        </span>
        <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-2">
          Academic Subject Catalogue
        </h1>
        <p className="text-xs text-[#5A5A65] mt-0.5">
          Add new subjects, configure theme colors, and assign subject codes for 1-on-1 tutoring.
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

      {/* Add Subject Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs">
        <h3 className="font-heading font-bold text-sm text-[#310064] pb-3 border-b border-[#ECE6DA] flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#F4CC45]" />
          <span>Add New Subject</span>
        </h3>

        <form onSubmit={handleAddSubject} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science or Biology"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
                Subject Code
              </label>
              <input
                type="text"
                placeholder="e.g. CS10 or BIO"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
                Badge Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-[#ECE6DA] cursor-pointer"
                />
                <span className="text-xs font-mono text-[#5A5A65]">{color}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-[#310064] mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. CBSE & Cambridge secondary board syllabus"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-2.5 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin text-[#F4CC45]" /> : <Plus className="w-4 h-4 text-[#F4CC45]" />}
              <span>Add Subject</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl p-5 border border-[#ECE6DA] shadow-xs flex flex-col justify-between"
            style={{ borderTop: `4px solid ${sub.color || '#310064'}` }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                  style={{
                    backgroundColor: `${sub.color || '#310064'}15`,
                    color: sub.color || '#310064'
                  }}
                >
                  {sub.code || 'SUBJ'}
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteSubject(sub.id, sub.name)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Delete subject"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-heading font-black text-base text-slate-900">{sub.name}</h4>
              <p className="text-xs text-[#5A5A65] mt-1 line-clamp-2">
                {sub.description || '1-on-1 Personalized Coaching Track'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ECE6DA] flex items-center justify-between text-[11px] text-[#5A5A65]">
              <span>Active in Portal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
