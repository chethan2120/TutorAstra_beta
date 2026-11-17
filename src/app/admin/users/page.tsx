'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  UserCheck,
  Shield,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Loader2,
  ArrowRight
} from 'lucide-react';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (user: any) => {
    const newStatus = user.is_active ? 0 : 1;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: newStatus })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = (u.name || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchPhone = (u.phone || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
            Directory & Roster
          </span>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-2">
            User Management Directory
          </h1>
          <p className="text-xs text-[#5A5A65] mt-0.5">
            Master roster of all students, faculty members, and administrators across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/students"
            className="px-3.5 py-2 rounded-xl bg-[#310064] text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#F4CC45]" />
            <span>Manage Students</span>
          </Link>
          <Link
            href="/admin/teachers"
            className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] text-[#310064] font-heading font-bold text-xs flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Manage Staff</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'student', 'teacher', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold capitalize transition-all ${
                roleFilter === r
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#5A5A65] hover:bg-[#F2ECFC]'
              }`}
            >
              {r === 'all' ? 'All Roles' : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#ECE6DA] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#5A5A65]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
            <span>Loading user directory...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No users found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-[#ECE6DA] bg-[#FAF8F5] text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Academic Info</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Toggle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DA]">
                {filtered.map((u) => {
                  const isActive = Boolean(u.is_active);
                  const initials = u.name
                    ? u.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'TA';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#F2ECFC] text-[#310064] flex items-center justify-center font-heading font-black text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <strong className="text-slate-900 font-heading block">{u.name}</strong>
                            <span className="text-[11px] text-[#5A5A65]">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'teacher'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role === 'admin' && <Shield className="w-3 h-3" />}
                          {u.role === 'teacher' && <UserCheck className="w-3 h-3" />}
                          {u.role === 'student' && <GraduationCap className="w-3 h-3" />}
                          <span>{u.role}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#5A5A65]">
                        <div>{u.phone || '—'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {u.role === 'student' ? (
                          <span>{u.grade || 'Grade 10'} • {u.curriculum || 'CBSE'}</span>
                        ) : u.role === 'teacher' ? (
                          <span className="truncate max-w-xs block" title={u.qualification}>
                            {u.qualification || 'Cambridge Faculty'}
                          </span>
                        ) : (
                          <span>Platform Administrator</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(u)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold border cursor-pointer transition-colors ${
                            isActive
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
