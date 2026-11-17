'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Video,
  Edit2,
  Loader2,
  CalendarX2
} from 'lucide-react';

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Reschedule Modal
  const [rescheduleModal, setRescheduleModal] = useState<any | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('17:00');
  const [newEndTime, setNewEndTime] = useState('18:00');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClasses = () => {
    setLoading(true);
    fetch('/api/admin/classes?limit=100')
      .then((res) => res.json())
      .then((data) => {
        setClasses(data.classes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenReschedule = (cls: any) => {
    setRescheduleModal(cls);
    setNewDate(cls.session_date);
    setNewStartTime(cls.start_time);
    setNewEndTime(cls.end_time);
    setRescheduleReason('');
  };

  const handleSaveReschedule = async () => {
    if (!rescheduleModal || !newDate || !newStartTime || !newEndTime) return;
    setActionLoading(true);

    try {
      const res = await fetch('/api/admin/classes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rescheduleModal.id,
          newDate,
          newStartTime,
          newEndTime,
          reason: rescheduleReason || 'Administrative timetable adjustment'
        })
      });

      if (res.ok) {
        setRescheduleModal(null);
        fetchClasses();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to reschedule.');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating schedule.');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = classes.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchSub = (c.subject_name || '').toLowerCase().includes(q);
      const matchStud = (c.student_name || '').toLowerCase().includes(q);
      const matchTeach = (c.teacher_name || '').toLowerCase().includes(q);
      const matchTopic = (c.session_title || '').toLowerCase().includes(q);
      return matchSub || matchStud || matchTeach || matchTopic;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
            Master Timetable
          </span>
          <h1 className="text-2xl font-heading font-black text-[#1E1E24] mt-2">
            Class Sessions Management
          </h1>
          <p className="text-xs text-[#5A5A65] mt-1">
            Audit, reschedule, and monitor all individual 1-on-1 tutoring sessions across all enrolled subjects.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchClasses}
          className="px-4 py-2 rounded-xl border border-[#ECE6DA] text-xs font-heading font-bold text-[#310064] hover:bg-[#FAF8F5]"
        >
          Refresh Schedule
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, teacher, topic, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'scheduled', 'completed', 'carried_forward', 'cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#5A5A65] hover:bg-[#F2ECFC]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#5A5A65]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
            <span>Loading master schedule records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5A5A65]">
            No class sessions found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#5A5A65] uppercase text-[10px] tracking-wider border-b border-[#ECE6DA]">
                <tr>
                  <th className="py-3 px-4">Session</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Faculty</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DA]">
                {filtered.map((cls) => (
                  <tr key={cls.id} className="hover:bg-[#FAF8F5]/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#310064]">
                      #{String(cls.session_number).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4 font-heading font-bold text-[#310064]">
                      {cls.subject_name}
                    </td>
                    <td className="py-3 px-4 text-[#1E1E24] font-medium">
                      {cls.student_name || 'Ethan Jenkins'}
                    </td>
                    <td className="py-3 px-4 text-[#5A5A65]">
                      {cls.teacher_name || 'Dr. Sarah Mitchell'}
                    </td>
                    <td className="py-3 px-4 text-[#5A5A65]">
                      <div className="font-semibold text-[#1E1E24]">{cls.session_date}</div>
                      <div className="text-[11px] text-slate-400">
                        {cls.start_time} – {cls.end_time}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {cls.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Completed
                        </span>
                      ) : cls.status === 'carried_forward' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Carried Forward
                        </span>
                      ) : cls.status === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          <Clock className="w-3 h-3 text-blue-500" />
                          Scheduled
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {cls.status === 'scheduled' && (
                        <button
                          type="button"
                          onClick={() => handleOpenReschedule(cls)}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] hover:bg-[#F2ECFC] text-[#310064] font-heading font-semibold text-[11px] inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Reschedule</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ECE6DA] space-y-4">
            <h3 className="text-base font-heading font-black text-[#310064]">
              Reschedule Class #{rescheduleModal.session_number}: {rescheduleModal.session_title}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">New Date *</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5A5A65] font-bold mb-1">Start Time *</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                  />
                </div>
                <div>
                  <label className="block text-[#5A5A65] font-bold mb-1">End Time *</label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">Reason for Adjustment</label>
                <input
                  type="text"
                  placeholder="e.g. Faculty timetable conflict or student request"
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
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleSaveReschedule}
                className="flex-1 py-2 rounded-xl bg-[#310064] text-white text-xs font-heading font-bold"
              >
                {actionLoading ? 'Saving...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
