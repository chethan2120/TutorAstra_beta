'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  Plus,
  Trash2,
  Video,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function AdminCalendarPage() {
  const [data, setData] = useState<any>({ classes: [], freeHours: [], teachers: [] });
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  // Add Free Slot Modal State
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [slotTeacherId, setSlotTeacherId] = useState('');
  const [slotDay, setSlotDay] = useState('1'); // Monday
  const [slotStartTime, setSlotStartTime] = useState('09:00');
  const [slotEndTime, setSlotEndTime] = useState('12:00');
  const [slotNote, setSlotNote] = useState('Available for 1-on-1 Office Hours');
  const [addingSlot, setAddingSlot] = useState(false);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      let url = `/api/calendar?date=${selectedDate}`;
      if (selectedTeacherId !== 'all') {
        url += `&teacher_id=${selectedTeacherId}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const calData = await res.json();
        setData(calData);
        if (calData.teachers?.length > 0 && !slotTeacherId) {
          setSlotTeacherId(String(calData.teachers[0].id));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [selectedDate, selectedTeacherId]);

  const handleAddFreeSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTeacherId || !slotStartTime || !slotEndTime) return;

    setAddingSlot(true);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: Number(slotTeacherId),
          day_of_week: Number(slotDay),
          start_time: slotStartTime,
          end_time: slotEndTime,
          note: slotNote
        })
      });

      if (res.ok) {
        setShowAddSlotModal(false);
        fetchCalendar();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddingSlot(false);
    }
  };

  const handleDeleteSlot = async (id: number) => {
    if (!confirm('Remove this free availability slot?')) return;
    try {
      const res = await fetch(`/api/calendar?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCalendar();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Adjust date
  const changeDate = (days: number) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + days);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const dayOfWeekNumber = new Date(selectedDate).getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
            Master Faculty Calendar
          </span>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-2">
            Teacher Schedule & Availability Tracker
          </h1>
          <p className="text-xs text-[#5A5A65] mt-0.5">
            Identify which teacher is taking class and which teacher is free with available time slots.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddSlotModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#F4CC45]" />
          <span>+ Add Teacher Free Slot</span>
        </button>
      </div>

      {/* Date Navigator & Teacher Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Date Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeDate(-1)}
            className="p-2 rounded-xl border border-[#ECE6DA] hover:bg-[#FAF8F5] cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4 text-[#310064]" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs p-2 rounded-xl border border-[#ECE6DA] font-bold text-slate-900"
            />
            <span className="text-xs font-heading font-bold text-[#310064]">
              {dayNames[dayOfWeekNumber]}
            </span>
          </div>

          <button
            type="button"
            onClick={() => changeDate(1)}
            className="p-2 rounded-xl border border-[#ECE6DA] hover:bg-[#FAF8F5] cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4 text-[#310064]" />
          </button>
        </div>

        {/* Filter by Teacher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#5A5A65] font-bold whitespace-nowrap">Filter Teacher:</span>
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="text-xs p-2 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5] font-medium"
          >
            <option value="all">All Faculty Members</option>
            {(data.teachers || []).map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two Column Layout: Taking Class vs Free Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COLUMN 1: TEACHERS TAKING CLASS TODAY */}
        <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#310064]" />
              <h3 className="font-heading font-black text-sm text-[#111B21]">
                Teachers Taking Class (Busy Slots)
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#310064]">
              {data.classes?.length || 0} Classes
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#5A5A65]">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#310064] mb-2" />
              <span>Checking live schedules...</span>
            </div>
          ) : data.classes?.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No classes scheduled on this day.
            </div>
          ) : (
            <div className="space-y-3">
              {data.classes.map((cls: any) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-xl border border-purple-200 bg-[#F2ECFC]/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-xs text-[#310064]">
                      {cls.teacher_name}
                    </span>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#310064] text-white">
                      {cls.start_time} – {cls.end_time}
                    </span>
                  </div>

                  <div className="text-xs text-[#1E1E24]">
                    <strong>Teaching:</strong> {cls.subject_name} • Session #{cls.session_number}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#5A5A65] pt-1 border-t border-purple-200/60">
                    <span>Student: <strong className="text-slate-900">{cls.student_name}</strong></span>
                    {cls.joinUrl && (
                      <a
                        href={cls.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#310064] font-bold hover:underline flex items-center gap-1"
                      >
                        <Video className="w-3 h-3" />
                        <span>Zoom Room</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMN 2: TEACHERS FREE TODAY */}
        <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="font-heading font-black text-sm text-[#111B21]">
                Teachers Free (Available Slots)
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {data.freeHours?.length || 0} Slots
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#5A5A65]">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-emerald-600 mb-2" />
              <span>Checking free teacher slots...</span>
            </div>
          ) : data.freeHours?.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No free hours registered for this day. Click "+ Add Teacher Free Slot" to define one.
            </div>
          ) : (
            <div className="space-y-3">
              {data.freeHours.map((slot: any) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2 flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-xs text-emerald-950">
                        {slot.teacher_name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        Available
                      </span>
                    </div>

                    <div className="font-mono text-xs font-bold text-emerald-800">
                      {slot.start_time} – {slot.end_time}
                    </div>

                    <p className="text-[11px] text-emerald-900/80">
                      {slot.note || 'Available for 1-on-1 & doubt sessions'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Remove slot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Free Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#ECE6DA] space-y-4 max-h-[90dvh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-heading font-black text-[#310064]">
              Add Free Availability Slot for Teacher
            </h3>

            <form onSubmit={handleAddFreeSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">Select Teacher *</label>
                <select
                  value={slotTeacherId}
                  onChange={(e) => setSlotTeacherId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5]"
                  required
                >
                  {(data.teachers || []).map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">Day of Week *</label>
                <select
                  value={slotDay}
                  onChange={(e) => setSlotDay(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA] bg-[#FAF8F5]"
                >
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                  <option value="0">Sunday</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5A5A65] font-bold mb-1">Start Time *</label>
                  <input
                    type="time"
                    value={slotStartTime}
                    onChange={(e) => setSlotStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#5A5A65] font-bold mb-1">End Time *</label>
                  <input
                    type="time"
                    value={slotEndTime}
                    onChange={(e) => setSlotEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">Availability Note</label>
                <input
                  type="text"
                  value={slotNote}
                  onChange={(e) => setSlotNote(e.target.value)}
                  placeholder="e.g. Morning 1-on-1 Doubt Hours"
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#ECE6DA]">
                <button
                  type="button"
                  onClick={() => setShowAddSlotModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#ECE6DA] text-xs font-heading font-bold text-[#5A5A65]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingSlot}
                  className="flex-1 py-2 rounded-xl bg-[#310064] text-white text-xs font-heading font-bold"
                >
                  {addingSlot ? 'Saving...' : 'Add Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
