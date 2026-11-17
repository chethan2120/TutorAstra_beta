'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Clock,
  Search,
  Filter,
  Loader2,
  Send,
  Sparkles
} from 'lucide-react';

export default function AdminNotificationsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [retryingId, setRetryingId] = useState<number | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/admin/notifications')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRetry = async (logId: number) => {
    setRetryingId(logId);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId })
      });
      if (res.ok) {
        fetchLogs();
      } else {
        alert('Failed to retry email.');
      }
    } catch (e) {
      console.error(e);
      alert('Error triggering retry.');
    } finally {
      setRetryingId(null);
    }
  };

  const filtered = logs.filter((l) => {
    if (search) {
      const q = search.toLowerCase();
      const matchEmail = (l.recipient_email || '').toLowerCase().includes(q);
      const matchName = (l.recipient_name || '').toLowerCase().includes(q);
      const matchSubj = (l.subject || '').toLowerCase().includes(q);
      const matchTmpl = (l.template_type || '').toLowerCase().includes(q);
      return matchEmail || matchName || matchSubj || matchTmpl;
    }
    return true;
  });

  const deliveredCount = logs.filter((l) => l.status === 'delivered').length;
  const totalCount = logs.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
            Communication Audit
          </span>
          <h1 className="text-2xl font-heading font-black text-[#1E1E24] mt-2">
            Transactional Email Delivery Logs
          </h1>
          <p className="text-xs text-[#5A5A65] mt-1">
            Real-time audit trail of all student, parent, and faculty notifications with automated delivery retry.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="px-4 py-2 rounded-xl border border-[#ECE6DA] text-xs font-heading font-bold text-[#310064] hover:bg-[#FAF8F5]"
        >
          Refresh Delivery Feed
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <div className="text-xs text-[#5A5A65]">Total Emails Dispatched</div>
          <div className="text-2xl font-heading font-black text-[#310064] mt-1">
            {totalCount}
          </div>
          <div className="text-[11px] text-[#5A5A65] mt-1">
            SMTP & Supabase Resend gateway
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <div className="text-xs text-[#5A5A65]">Successful Delivery Rate</div>
          <div className="text-2xl font-heading font-black text-emerald-600 mt-1">
            {totalCount > 0 ? Math.round((deliveredCount / totalCount) * 100) : 100}%
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            {deliveredCount} delivered cleanly
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <div className="text-xs text-[#5A5A65]">Email Security & Headers</div>
          <div className="text-2xl font-heading font-black text-[#F4CC45] mt-1">
            SPF • DKIM
          </div>
          <div className="text-[11px] text-[#5A5A65] mt-1">
            Branded HTML Responsive Templates
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#ECE6DA]">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipient email, template, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#5A5A65]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
            <span>Loading email delivery audit logs...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5A5A65]">
            No email logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#5A5A65] uppercase text-[10px] tracking-wider border-b border-[#ECE6DA]">
                <tr>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Dispatched At</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Retry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DA]">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8F5]/50">
                    <td className="py-3 px-4">
                      <strong className="text-[#310064] block font-heading">
                        {log.recipient_name || 'User'}
                      </strong>
                      <span className="text-[11px] text-[#5A5A65]">{log.recipient_email}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#1E1E24]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {log.template_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5A5A65] max-w-xs truncate" title={log.subject}>
                      {log.subject}
                    </td>
                    <td className="py-3 px-4 text-[#5A5A65]">
                      {new Date(log.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Delivered
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRetry(log.id)}
                        disabled={retryingId === log.id}
                        className="px-2.5 py-1 rounded-lg border border-[#ECE6DA] hover:bg-[#FAF8F5] text-[#310064] text-[11px] font-heading font-semibold inline-flex items-center gap-1"
                        title="Retry email dispatch"
                      >
                        <RotateCcw className={`w-3 h-3 ${retryingId === log.id ? 'animate-spin' : ''}`} />
                        <span>Retry</span>
                      </button>
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
