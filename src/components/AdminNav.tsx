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
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

interface AdminNavProps {
  userEmail?: string;
  userName?: string;
}

export const adminMenuItems = [
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

export function AdminTopBar({ userEmail = 'admin@gmail.com', userName = 'Super Admin' }: AdminNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-40 bg-[#220046] border-b border-[#36006E] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-sm text-white">
        {/* Left: Hamburger (Mobile) + Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-purple-200 hover:bg-[#310064] transition-colors"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#F4CC45]" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#F4CC45] shadow-xs flex items-center justify-center bg-[#310064] shrink-0">
              <img src="/tutorastra-logo.jpg" alt="TutorAstra" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-sm font-heading font-black tracking-tight text-[#F4CC45]">TutorAstra</span>
              <span className="text-xs font-heading font-semibold text-purple-200 ml-1.5 hidden sm:inline">Admin Console</span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6 hidden sm:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-purple-300 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students, faculty, schedules..."
              className="w-full pl-8 pr-4 py-1.5 rounded-lg border border-purple-800 bg-[#310064]/60 text-xs text-white placeholder:text-purple-300 focus:outline-hidden focus:border-[#F4CC45]"
            />
          </div>
        </div>

        {/* Right: Quick Switch & Profile Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-800 bg-[#310064]/60 text-xs font-medium text-purple-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Academic Portal Active</span>
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

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] bg-white h-[100dvh] max-h-[100dvh] shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#310064] text-white flex items-center justify-center font-bold text-xs">
                  {initials}
                </div>
                <div>
                  <div className="text-xs font-heading font-bold text-[#310064]">{userName}</div>
                  <div className="text-[10px] text-purple-600 font-bold">Admin Console</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Nav Items */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-1 py-3 pr-1">
              {adminMenuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href + '/'));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-heading font-bold text-xs transition-all ${
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

            {/* Pinned Bottom Logout */}
            <div className="pt-3 border-t border-[#ECE6DA] shrink-0 space-y-2">
              <div className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] text-[10px] text-slate-600 flex items-center justify-between">
                <span className="text-[#310064] font-bold">Switch:</span>
                <div className="flex gap-2">
                  <Link href="/teacher/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-purple-700 font-bold hover:underline">
                    Teacher
                  </Link>
                  <span className="text-slate-300">|</span>
                  <Link href="/student/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-purple-700 font-bold hover:underline">
                    Student
                  </Link>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-heading font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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

  return (
    <aside className="w-60 bg-white text-slate-700 flex flex-col justify-between p-3 shrink-0 h-full select-none border-r border-[#ECE6DA]">
      <div className="flex-1 overflow-y-auto space-y-1 pr-0.5">
        <div className="px-3 py-1 text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] mb-1">
          Management Controls
        </div>

        {adminMenuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href + '/'));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-heading font-bold text-xs transition-colors ${
                isActive
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-[#F2ECFC] hover:text-[#310064]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4CC45]' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Quick Switch & Logout anchored cleanly in view */}
      <div className="pt-2 border-t border-[#ECE6DA] space-y-1.5 shrink-0 mt-2">
        <div className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] text-[11px] text-slate-600 flex items-center justify-between">
          <span className="text-[#310064] font-bold text-[10px]">Portal Switch:</span>
          <div className="flex gap-2">
            <Link href="/teacher/dashboard" className="text-purple-700 font-bold hover:underline text-[10px]">
              Teacher
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/student/dashboard" className="text-purple-700 font-bold hover:underline text-[10px]">
              Student
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
