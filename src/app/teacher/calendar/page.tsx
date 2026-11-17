'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  Video,
  CheckCircle2,
  Users,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  Calendar as CalendarIcon,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function TeacherCalendarPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [freeHours, setFreeHours] = useState<any[]>([]);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [teacherName, setTeacherName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [activeTab, setActiveTab] = useState<'schedule' | 'free_hours'>('schedule');

  // Modal State for Adding Free Hours
  const [showAddFreeModal, setShowAddFreeModal] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [note, setNote] = useState('Dedicated 1-on-1 Doubt Clearing Slot');
  const [submitting, setSubmitting] = useState(false);

  const loadCalendar = async () => {
    try {
      const res = await fetch('/api/calendar');
      if (res.ok) {
        const d = await res.json();
        setClasses(d.classes || []);
        setFreeHours(d.freeHours || []);
        setTeacherId(d.teacherId || null);
        setTeacherName(d.teacherName || 'Faculty');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const handleAddFreeHour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: teacherId,
          day_of_week: Number(dayOfWeek),
          start_time: startTime,
          end_time: endTime,
          note
        })
      });
      if (res.ok) {
        await loadCalendar();
        setShowAddFreeModal(false);
        setNote('Dedicated 1-on-1 Doubt Clearing Slot');
      } else {
        alert('Failed to save free hour slot.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFreeHour = async (id: number) => {
    if (!confirm('Remove this free hour slot from your public availability?')) return;
    try {
      const res = await fetch(`/api/calendar?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadCalendar();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Compute 7 days of the current week (Monday to Sunday)
  const getWeekDates = (offsetWeeks: number) => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) + offsetWeeks * 7;
    const monday = new Date(now.setDate(diff));

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push(d);
    }
    return weekDays;
  };

  const weekDays = getWeekDates(currentWeekOffset);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getDayNameFromNumber = (n: number) => {
    const names = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return names[n] || 'Day';
  };

  // Today's classes
  const todayStr = new Date().toISOString().split('T')[0];
  const todayClasses = classes.filter((c) => c.session_date === todayStr);

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black uppercase tracking-wider bg-[#F2ECFC] text-[#310064]">
              {teacherName} • Private Schedule
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
            Faculty Teaching Calendar & Free Hours
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
            Role-isolated view of your scheduled 1-on-1 tutoring sessions, daily student timings, and designated free hours.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#ECE6DA]">
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                activeTab === 'schedule'
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'text-[#5A5A65] hover:text-[#310064]'
              }`}
            >
              Classes Timetable
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('free_hours')}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                activeTab === 'free_hours'
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'text-[#5A5A65] hover:text-[#310064]'
              }`}
            >
              My Free Hours ({freeHours.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddFreeModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#F4CC45] text-[#310064] font-heading font-black text-xs hover:bg-[#e6be39] shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Free Hours</span>
          </button>
        </div>
      </div>

      {/* TODAY'S CLASS BANNER WITH 15-MIN ZOOM UNLOCK */}
      <div className="bg-gradient-to-r from-[#310064] to-[#171746] text-white rounded-2xl p-6 shadow-md border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4CC45] text-[#310064]">
                TODAY'S CLASSES
              </span>
              <span className="text-xs text-purple-200">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-lg font-heading font-bold text-white mt-1">
              {todayClasses.length} Scheduled 1-on-1 Session{todayClasses.length === 1 ? '' : 's'} Today
            </h2>
          </div>

          <div className="text-xs text-purple-200 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F4CC45]" />
            <span>Zoom Premium link unlocks <strong>15 minutes</strong> before class start</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {todayClasses.length === 0 ? (
            <div className="col-span-2 py-4 text-center text-xs text-purple-200">
              No classes scheduled for today. Enjoy your research and planning hours!
            </div>
          ) : (
            todayClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#F4CC45]">
                      {cls.subject_name || 'Science'}
                    </span>
                    <h3 className="text-sm font-heading font-bold text-white">
                      Student: {cls.student_name}
                    </h3>
                    <p className="text-xs text-purple-200 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#F4CC45]" />
                      <span>{cls.start_time} - {cls.end_time}</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-white">
                    1-on-1 Live
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-purple-200">
                    {cls.isUnlocked ? 'Room is Open' : cls.meetingMessage || 'Unlocks 15m prior'}
                  </span>

                  {cls.isUnlocked ? (
                    <a
                      href={cls.hostUrl || cls.joinUrl || `https://zoom.us/j/${cls.zoom_meeting_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Start Class (Zoom)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-white/50 text-xs font-semibold cursor-not-allowed flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Locked (Awaiting 15m)</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-[#5A5A65]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
          <span>Synchronizing weekly schedule and free hours...</span>
        </div>
      ) : activeTab === 'schedule' ? (
        /* WEEKLY CALENDAR GRID */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-base text-[#1E1E24]">
              Weekly Calendar (Monday – Sunday)
            </h3>

            {/* Week Switcher Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
                className="p-1.5 rounded-xl border border-[#ECE6DA] bg-white hover:bg-[#F2ECFC] text-[#310064] text-xs font-bold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentWeekOffset(0)}
                className="px-2.5 py-1.5 rounded-xl border border-[#ECE6DA] bg-white hover:bg-[#F2ECFC] text-[#310064] text-xs font-heading font-bold"
              >
                Current Week
              </button>
              <button
                type="button"
                onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
                className="p-1.5 rounded-xl border border-[#ECE6DA] bg-white hover:bg-[#F2ECFC] text-[#310064] text-xs font-bold flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((d, idx) => {
              const dateStr = d.toISOString().split('T')[0];
              const isToday = dateStr === todayStr;
              const dayClasses = classes.filter((c) => c.session_date === dateStr);

              // Map day of week (Monday=1 ... Sunday=7)
              const jsDay = d.getDay();
              const dow = jsDay === 0 ? 7 : jsDay;
              const dayFreeHours = freeHours.filter((fh) => fh.day_of_week === dow);

              return (
                <div
                  key={dateStr}
                  className={`rounded-2xl border p-3.5 flex flex-col justify-between min-h-[340px] transition-all ${
                    isToday
                      ? 'bg-[#FFFDF8] border-[#310064] ring-2 ring-[#310064]/20 shadow-sm'
                      : 'bg-white border-[#ECE6DA]'
                  }`}
                >
                  <div>
                    {/* Day Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DA]/60 mb-3">
                      <div>
                        <span className="font-heading font-bold text-xs text-[#1E1E24] block">
                          {dayNames[idx]}
                        </span>
                        <span className="text-[10px] text-[#5A5A65]">
                          {d.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      {isToday && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Today" />
                      )}
                    </div>

                    {/* Classes List */}
                    <div className="space-y-2">
                      {dayClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] space-y-1 hover:border-[#310064]/40 transition-all text-left"
                        >
                          <div className="flex items-center gap-1.5 font-heading font-bold text-[11px] text-[#310064]">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cls.subject_color || '#310064' }} />
                            <span className="truncate">{cls.subject_name || 'Science'}</span>
                          </div>
                          <div className="text-[11px] font-semibold text-[#1E1E24] truncate">
                            Student: {cls.student_name}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-[#5A5A65]">
                            <Clock className="w-3 h-3 text-[#310064]" />
                            <span>{cls.start_time} - {cls.end_time}</span>
                          </div>
                          {cls.isUnlocked && (
                            <a
                              href={cls.hostUrl || cls.joinUrl || `https://zoom.us/j/${cls.zoom_meeting_id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 block text-center py-1 rounded bg-[#310064] text-white font-heading font-bold text-[10px] hover:bg-[#430080]"
                            >
                              Join Class (Zoom)
                            </a>
                          )}
                        </div>
                      ))}

                      {/* Display Free Hours Badges */}
                      {dayFreeHours.map((fh) => (
                        <div
                          key={`fh-${fh.id}`}
                          className="p-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[10px] text-emerald-800 space-y-0.5"
                          title={fh.note}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Free Slot
                            </span>
                            <span>{fh.start_time} - {fh.end_time}</span>
                          </div>
                          <p className="text-[9px] text-emerald-600 truncate">{fh.note}</p>
                        </div>
                      ))}

                      {dayClasses.length === 0 && dayFreeHours.length === 0 && (
                        <div className="py-8 text-center text-[10px] text-slate-300">
                          No sessions or free slots
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#ECE6DA]/40 text-center text-[10px] text-[#5A5A65]">
                    {dayClasses.length} class{dayClasses.length === 1 ? '' : 'es'} • {dayFreeHours.length} free slot{dayFreeHours.length === 1 ? '' : 's'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MY FREE HOURS MANAGER */
        <div className="bg-white rounded-2xl border border-[#ECE6DA] p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ECE6DA]">
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#1E1E24]">
                My Designated Free Hours & Availability Slots
              </h3>
              <p className="text-xs text-[#5A5A65] mt-0.5">
                These hours indicate to the administration when you are free to accept new 1-on-1 students or hold doubt sessions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddFreeModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#310064] text-white font-heading font-bold text-xs hover:bg-[#430080] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#F4CC45]" />
              <span>Add New Slot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {freeHours.map((fh) => (
              <div
                key={fh.id}
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-heading font-bold text-xs">
                      {getDayNameFromNumber(fh.day_of_week)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteFreeHour(fh.id)}
                      className="p-1 rounded-md text-rose-500 hover:bg-rose-100 transition-colors"
                      title="Delete slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#1E1E24]">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{fh.start_time} to {fh.end_time}</span>
                  </div>

                  <p className="mt-1 text-xs text-[#5A5A65]">
                    {fh.note || 'Available for 1-on-1 & doubt clearing'}
                  </p>
                </div>

                <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Visible to Administration</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD FREE HOUR SLOT */}
      {showAddFreeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#ECE6DA] space-y-4 max-h-[90dvh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA]">
              <h3 className="font-heading font-extrabold text-base text-[#1E1E24]">
                Add Free Hour Availability Slot
              </h3>
              <button
                type="button"
                onClick={() => setShowAddFreeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFreeHour} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                  Day of the Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs font-bold text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                >
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                  <option value={7}>Sunday</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs font-bold text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs font-bold text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
                  Note / Focus Area
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Science Doubt Clearing Slot"
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DA] text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ECE6DA]">
                <button
                  type="button"
                  onClick={() => setShowAddFreeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A5A65] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#310064] text-white font-heading font-bold text-xs hover:bg-[#430080] disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Add Availability Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
