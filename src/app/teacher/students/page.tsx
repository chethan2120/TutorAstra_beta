'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch('/api/teacher/students');
        if (res.ok) {
          const d = await res.json();
          setStudents(d.students || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
            Assigned 1-on-1 Students
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
            Click any student to view their enrolled subjects, all upcoming classes with dates & timings, and past session history.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#ECE6DA] text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064]"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#5A5A65]">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#310064] mb-2" />
          <span>Loading assigned student registers...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#ECE6DA] text-xs text-[#5A5A65]">
          No assigned students matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((st) => (
            <Link
              key={st.id}
              href={`/teacher/students/${st.id}`}
              className="bg-white rounded-2xl border border-[#ECE6DA] p-6 shadow-xs hover:border-[#310064] hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F2ECFC] text-[#310064] font-heading font-bold text-base flex items-center justify-center shrink-0 border border-[#E0D3F5]">
                      {st.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-base text-[#1E1E24] group-hover:text-[#310064] transition-colors">
                        {st.name}
                      </h3>
                      <div className="text-xs text-[#5A5A65]">
                        {st.grade || 'Grade 10'} • {st.curriculum || 'CBSE'}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#FAF8F5] border border-[#ECE6DA] text-[#310064]">
                    Dedicated 1:1
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#ECE6DA]/60 space-y-1.5 text-xs text-[#5A5A65]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{st.email}</span>
                  </div>
                  {st.parent_name && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Parent: {st.parent_name} ({st.parent_phone || 'WhatsApp Verified'})</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs mt-4 pt-3 border-t border-[#ECE6DA]/60">
                  <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA]">
                    <span className="text-[10px] text-[#5A5A65] block">Total Classes</span>
                    <strong className="text-sm font-heading font-bold text-[#1E1E24]">
                      {st.total_classes_with_me || 50}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA]">
                    <span className="text-[10px] text-[#5A5A65] block">Completed</span>
                    <strong className="text-sm font-heading font-bold text-emerald-700">
                      {st.completed_with_me || 4}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-heading font-bold text-[#310064]">
                <span>View All Upcoming Classes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
