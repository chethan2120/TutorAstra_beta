'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  CalendarDays,
  FileCheck2,
  Video,
  Sparkles,
  Inbox,
  Mail,
  History,
  Settings,
  ChevronDown,
  ChevronRight,
  Search,
  LogOut,
  Menu,
  X,
  BookOpen
} from 'lucide-react';

interface AdminNavProps {
  userEmail?: string;
  userName?: string;
}

export function AdminTopBar({ userEmail = 'admin@gmail.com', userName = 'Super Admin' }: AdminNavProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'SA';

  return (
    <header className="sticky top-0 z-40 bg-[#220046] border-b border-[#36006E] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-sm text-white">
      {/* Left: TutorAstra Logo & Title */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#F4CC45] shadow-xs flex items-center justify-center bg-[#310064]">
            <img src="/tutorastra-logo.jpg" alt="TutorAstra" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-sm font-heading font-black tracking-tight text-[#F4CC45]">TutorAstra</span>
            <span className="text-xs font-heading font-semibold text-purple-200 ml-1.5 hidden sm:inline">Admin Console</span>
          </div>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-purple-300 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, faculty, schedules, or sessions..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-purple-800 bg-[#310064]/60 text-xs text-white placeholder:text-purple-300 focus:outline-none focus:border-[#F4CC45]"
          />
        </div>
      </div>

      {/* Right: Date Pill & Profile Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-800 bg-[#310064]/60 text-xs font-medium text-purple-200">
          <Calendar className="w-3.5 h-3.5 text-[#F4CC45]" />
          <span>Academic Portal Active</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-lg bg-[#F4CC45] text-[#220046] flex items-center justify-center text-xs font-heading font-bold shadow-xs hover:bg-[#F6D55E]"
            title={`${userName} (${userEmail})`}
          >
            {initials}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-slate-200 p-2 z-50 text-slate-800 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-heading font-bold text-slate-900">{userName}</div>
                <div className="text-[10px] text-slate-400 truncate">{userEmail}</div>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F2ECFC] text-[#310064] mt-1 uppercase">
                  Administrator
                </span>
              </div>
              <Link
                href="/admin/settings"
                className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg mt-1"
                onClick={() => setShowProfileMenu(false)}
              >
                Settings & API Keys
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-lg flex items-center gap-2 mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function AdminSidebar({ userEmail = 'admin@gmail.com', userName = 'Super Admin' }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    TUTORING: true,
    ACADEMICS: true,
    SYSTEM: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-white text-slate-700 border-r border-[#EBE4F6] flex-shrink-0 flex flex-col justify-between p-3 z-30 overflow-y-auto">
      <div className="space-y-4">
        {/* Overview Tab */}
        <Link
          href="/admin/dashboard"
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg font-heading font-semibold text-xs transition-colors ${
            pathname === '/admin/dashboard'
              ? 'bg-[#310064] text-white shadow-xs'
              : 'text-slate-700 hover:bg-[#F2ECFC] hover:text-[#310064]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-[#F4CC45]" />
          <span>Dashboard Overview</span>
        </Link>

        {/* SECTION: 1-ON-1 OPERATIONS */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('TUTORING')}
            className="w-full flex items-center justify-between text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider px-2 py-1 hover:text-slate-600"
          >
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#310064]" />
              <span>1-ON-1 OPERATIONS</span>
            </div>
            {expandedSections['TUTORING'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {expandedSections['TUTORING'] && (
            <div className="space-y-0.5 mt-1 ml-2">
              <Link
                href="/admin/students"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/students'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Students & Enrolments
              </Link>
              <Link
                href="/admin/teachers"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/teachers'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Teachers & Faculty
              </Link>
              <Link
                href="/admin/schedule"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/schedule'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Batch Schedule Generator
              </Link>
              <Link
                href="/admin/classes"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/classes'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Classes & Calendar
              </Link>
              <Link
                href="/admin/leaves"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/leaves'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Leave Management
              </Link>
              <Link
                href="/admin/zoom"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/zoom'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Zoom Console & Links
              </Link>
            </div>
          )}
        </div>

        {/* SECTION: ACADEMICS & ASSESSMENTS */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('ACADEMICS')}
            className="w-full flex items-center justify-between text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider px-2 py-1 hover:text-slate-600"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#310064]" />
              <span>ACADEMICS & AI</span>
            </div>
            {expandedSections['ACADEMICS'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {expandedSections['ACADEMICS'] && (
            <div className="space-y-0.5 mt-1 ml-2">
              <Link
                href="/admin/assessments"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/assessments'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Ms. Violet AI Reports
              </Link>
              <Link
                href="/admin/curriculum"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/curriculum'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Curriculum Pathways
              </Link>
              <Link
                href="/admin/courses"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/courses'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Subject Offerings
              </Link>
            </div>
          )}
        </div>

        {/* SECTION: COMMUNICATIONS & SYSTEM */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('SYSTEM')}
            className="w-full flex items-center justify-between text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider px-2 py-1 hover:text-slate-600"
          >
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#310064]" />
              <span>SYSTEM & AUDIT</span>
            </div>
            {expandedSections['SYSTEM'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {expandedSections['SYSTEM'] && (
            <div className="space-y-0.5 mt-1 ml-2">
              <Link
                href="/admin/enquiries"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/enquiries'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Admissions & Leads
              </Link>
              <Link
                href="/admin/notifications"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/notifications'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Email Logs & Delivery
              </Link>
              <Link
                href="/admin/activity"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/activity'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Activity Audit Trail
              </Link>
              <Link
                href="/admin/settings"
                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/admin/settings'
                    ? 'bg-[#F2ECFC] text-[#310064] font-bold'
                    : 'text-slate-600 hover:text-[#310064] hover:bg-slate-50'
                }`}
              >
                Platform Settings
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Switch Portal & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] text-[11px] text-slate-600">
          <strong className="block text-[#310064] font-heading font-bold">Quick Portal Jump:</strong>
          <div className="flex gap-2 mt-1">
            <Link href="/teacher/dashboard" className="text-purple-700 hover:underline">
              Teacher →
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/student/dashboard" className="text-purple-700 hover:underline">
              Student →
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
