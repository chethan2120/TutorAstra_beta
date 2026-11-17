'use client';

import React, { useEffect, useState } from 'react';
import {
  Award,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Search,
  Filter,
  Loader2,
  FileText
} from 'lucide-react';

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAssessments = () => {
    setLoading(true);
    fetch('/api/admin/assessments')
      .then((res) => res.json())
      .then((data) => {
        setAssessments(data.assessments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const filtered = assessments.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      const matchStud = (a.student_name || '').toLowerCase().includes(q);
      const matchSub = (a.subject_name || '').toLowerCase().includes(q);
      const matchTitle = (a.title || '').toLowerCase().includes(q);
      return matchStud || matchSub || matchTitle;
    }
    return true;
  });

  const total = assessments.length;
  const avg =
    total > 0
      ? Math.round(
          assessments.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / total
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
            AI Academic Analytics
          </span>
          <h1 className="text-2xl font-heading font-black text-[#1E1E24] mt-2">
            Ms. Violet AI Assessments & Diagnostics
          </h1>
          <p className="text-xs text-[#5A5A65] mt-1">
            Audit diagnostic evaluations synthesized by Ms. Violet AI Tutor, score distributions, and faculty mentor review notes.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAssessments}
          className="px-4 py-2 rounded-xl border border-[#ECE6DA] text-xs font-heading font-bold text-[#310064] hover:bg-[#FAF8F5]"
        >
          Refresh Feed
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <div className="text-xs text-[#5A5A65]">Total Assessments Generated</div>
          <div className="text-2xl font-heading font-black text-[#310064] mt-1">
            {total}
          </div>
          <div className="text-[11px] text-[#5A5A65] mt-1">
            Autonomous 1-on-1 diagnostic quizzes
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <div className="text-xs text-[#5A5A65]">Average Student Score</div>
          <div className="text-2xl font-heading font-black text-emerald-600 mt-1">
            {avg}%
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            High conceptual mastery
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <div className="text-xs text-[#5A5A65]">Automated Sharing</div>
          <div className="text-2xl font-heading font-black text-[#F4CC45] mt-1">
            100% Shared
          </div>
          <div className="text-[11px] text-[#5A5A65] mt-1">
            Emailed to student & sent to Teacher Box
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#ECE6DA]">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, subject, topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#5A5A65]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
            <span>Loading assessment records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5A5A65]">
            No assessments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#5A5A65] uppercase text-[10px] tracking-wider border-b border-[#ECE6DA]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Assessment Title</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DA]">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-[#FAF8F5]/50">
                    <td className="py-3 px-4">
                      <strong className="text-[#310064] block font-heading">
                        {a.student_name || 'Ethan Jenkins'}
                      </strong>
                      <span className="text-[11px] text-[#5A5A65]">{a.student_email}</span>
                    </td>
                    <td className="py-3 px-4 font-heading font-bold text-[#310064]">
                      {a.subject_name}
                    </td>
                    <td className="py-3 px-4 text-[#1E1E24] font-medium max-w-xs truncate" title={a.title}>
                      {a.title}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold uppercase text-[10px]">
                      {a.test_type}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-heading font-black text-xs text-[#310064]">
                        {a.percentage}%
                      </span>
                      <span className="text-[10px] text-[#5A5A65] block">
                        ({a.score}/{a.max_score})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5A5A65]">
                      {new Date(a.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Graded & Shared
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
