'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  User,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Loader2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchActivities = () => {
    setLoading(true);
    fetch('/api/admin/activity')
      .then((res) => res.json())
      .then((data) => {
        setActivities(data.activities || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filtered = activities.filter((act) => {
    if (search) {
      const q = search.toLowerCase();
      const matchActor = (act.actor_email || '').toLowerCase().includes(q);
      const matchAction = (act.action || '').toLowerCase().includes(q);
      const matchDetails = (act.details || '').toLowerCase().includes(q);
      return matchActor || matchAction || matchDetails;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
            Security & Compliance
          </span>
          <h1 className="text-2xl font-heading font-black text-[#1E1E24] mt-2">
            System Activity Audit Trail
          </h1>
          <p className="text-xs text-[#5A5A65] mt-1">
            Immutable log of all user authentication events, role escalations, timetable edits, and system actions.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchActivities}
          className="px-4 py-2 rounded-xl border border-[#ECE6DA] text-xs font-heading font-bold text-[#310064] hover:bg-[#FAF8F5]"
        >
          Refresh Feed
        </button>
      </div>

      {/* Audit Log Card */}
      <div className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#ECE6DA]">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by actor email, action, details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#5A5A65]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
            <span>Loading system audit feed...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5A5A65]">
            No activity records found.
          </div>
        ) : (
          <div className="divide-y divide-[#ECE6DA]">
            {filtered.map((act) => (
              <div key={act.id} className="p-4 hover:bg-[#FAF8F5]/60 transition-colors flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#310064] text-[#F4CC45] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-xs font-bold text-[#310064]">
                      {act.action}
                    </span>
                    <span className="text-[11px] text-[#5A5A65]">
                      {new Date(act.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-[#1E1E24] font-medium">
                    {act.details || `Performed ${act.action} on ${act.target_type || 'record'}`}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#5A5A65]">
                    <User className="w-3 h-3 text-[#310064]" />
                    <span>Actor: <strong className="text-[#310064]">{act.actor_email}</strong></span>
                    {act.target_id && (
                      <span className="text-slate-400">• Ref #{act.target_id}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
