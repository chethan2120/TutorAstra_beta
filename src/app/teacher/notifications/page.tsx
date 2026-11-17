'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
  Loader2,
  CheckCheck
} from 'lucide-react';

export default function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const d = await res.json();
          setNotifications(d.notifications || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const toggleRead = (id: number) => {
    if (readIds.includes(id)) {
      setReadIds(readIds.filter((i) => i !== id));
    } else {
      setReadIds([...readIds, id]);
    }
  };

  const markAllAsRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black uppercase tracking-wider bg-[#F2ECFC] text-[#310064]">
              Official Faculty Bulletins
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
            Faculty Notices & Announcements
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
            Official announcements, timetable circulars, and policy updates from TutorAstra Administration.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECFC] text-[#310064] text-xs font-heading font-bold border border-[#ECE6DA] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-[#310064]" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-[#5A5A65]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
          <span>Retrieving faculty notices...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ECE6DA] p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-heading font-bold text-[#1E1E24]">No Unread Announcements</h3>
          <p className="text-xs text-[#5A5A65]">
            You are fully up-to-date with all departmental schedules and policies.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isRead = readIds.includes(notif.id);
            const isUrgent = notif.priority === 'urgent' || notif.priority === 'high';

            return (
              <div
                key={notif.id}
                onClick={() => toggleRead(notif.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isRead
                    ? 'bg-white/60 border-[#ECE6DA] opacity-75'
                    : isUrgent
                    ? 'bg-rose-50/50 border-rose-200 shadow-xs'
                    : 'bg-white border-[#ECE6DA] shadow-xs hover:border-[#310064]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-[#F2ECFC] text-[#310064]'
                      }`}
                    >
                      {isUrgent ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${
                            isUrgent
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {notif.priority}
                        </span>
                        <span className="text-xs text-[#5A5A65]">
                          From: <strong>{notif.sender_name || 'Super Admin'}</strong>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : 'Today'}
                        </span>
                      </div>

                      <h3
                        className={`text-sm font-heading font-bold ${
                          isRead ? 'text-[#5A5A65]' : 'text-[#1E1E24]'
                        }`}
                      >
                        {notif.title}
                      </h3>
                      <p className="text-xs text-[#5A5A65] leading-relaxed max-w-3xl">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(notif.id);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-[#310064] text-xs font-semibold shrink-0"
                  >
                    {isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
