'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  Clock,
  CalendarPlus,
  CalendarDays,
  BookOpen,
  CalendarX2,
  Bell,
  MessageSquare,
  Calendar,
  UserCog,
  LogOut,
  Search,
  CheckCircle2
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
            <span className="text-xs font-heading font-semibold text-purple-200 ml-1.5 hidden sm:inline">Admin Management Console</span>
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
            placeholder="Search students, teachers, schedules, classes..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-purple-800 bg-[#310064]/60 text-xs text-white placeholder:text-purple-300 focus:outline-hidden focus:border-[#F4CC45]"
          />
        </div>
      </div>

      {/* Right: Date Pill & Profile Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-800 bg-[#310064]/60 text-xs font-medium text-purple-200">
          <Calendar className="w-3.5 h-3.5 text-[#F4CC45]" />
          <span>Academic Year 2026–27</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-lg bg-[#F4CC45] text-[#220046] flex items-center justify-center text-xs font-heading font-bold shadow-xs hover:bg-[#F6D55E] cursor-pointer"
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
                href="/admin/profile"
                className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg mt-1"
                onClick={() => setShowProfileMenu(false)}
              >
                Profile & Access Controls
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-lg flex items-center gap-2 mt-1 cursor-pointer"
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Strictly configured matching client's exact specification:
  // "just keep: Dashboard, user management, student, staff, attendace,
  // Schedule teacher, Schedule student, subject, leave, notification, chat, calendar, profile, logout"
  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', href: '/admin/users', icon: Users },
    { label: 'Student', href: '/admin/students', icon: GraduationCap },
    { label: 'Staff', href: '/admin/teachers', icon: UserCheck },
    { label: 'Attendance', href: '/admin/attendance', icon: Clock },
    { label: 'Schedule Teacher', href: '/admin/schedule-teacher', icon: CalendarPlus },
    { label: 'Schedule Student', href: '/admin/schedule-student', icon: CalendarDays },
    { label: 'Subject', href: '/admin/subjects', icon: BookOpen },
    { label: 'Leave', href: '/admin/leaves', icon: CalendarX2 },
    { label: 'Notification', href: '/admin/notifications', icon: Bell },
    { label: 'Chat', href: '/admin/chat', icon: MessageSquare },
    { label: 'Calendar', href: '/admin/calendar', icon: Calendar },
    { label: 'Profile', href: '/admin/profile', icon: UserCog },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white text-slate-700 flex flex-col justify-between p-3.5 shrink-0 min-h-full">
      <div className="space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] mb-1">
          Management Controls
        </div>

        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href + '/'));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-heading font-semibold text-xs transition-colors ${
                isActive
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-[#F2ECFC] hover:text-[#310064]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4CC45]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Switch Portal & Logout */}
      <div className="pt-4 border-t border-[#ECE6DA] space-y-2 mt-4">
        <div className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] text-[11px] text-slate-600">
          <strong className="block text-[#310064] font-heading font-bold">Quick Switch:</strong>
          <div className="flex gap-2 mt-1">
            <Link href="/teacher/dashboard" className="text-purple-700 font-bold hover:underline">
              Teacher →
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/student/dashboard" className="text-purple-700 font-bold hover:underline">
              Student →
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
