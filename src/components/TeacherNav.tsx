'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Bell,
  BookMarked,
  MessageSquare,
  CalendarX2,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface TeacherNavProps {
  userName?: string;
  userEmail?: string;
}

export const teacherMenuItems = [
  { label: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'My Students', href: '/teacher/students', icon: Users },
  { label: 'Attendance', href: '/teacher/attendance', icon: Clock },
  { label: 'Calendar / Today Class', href: '/teacher/calendar', icon: CalendarDays },
  { label: 'Notification', href: '/teacher/notifications', icon: Bell },
  { label: 'Assign Class or Course', href: '/teacher/assignments', icon: BookMarked },
  { label: 'Chat (Teacher Box)', href: '/teacher/box', icon: MessageSquare },
  { label: 'Leave', href: '/teacher/leave', icon: CalendarX2 },
  { label: 'Profile', href: '/teacher/profile', icon: User },
];

export function TeacherTopBar({ userName = 'Dr. Sarah Mitchell', userEmail = 'teacher@gmail.com' }: TeacherNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'SM';

  return (
    <>
      <header className="bg-white border-b border-[#ECE6DA] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs sticky top-0 z-40">
        {/* Left: Hamburger (Mobile) + Medallion & Greeting */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-[#310064] hover:bg-[#F2ECFC] transition-colors"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/teacher/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#F4CC45] shadow-xs flex items-center justify-center bg-[#310064] shrink-0">
              <img src="/tutorastra-logo.jpg" alt="TutorAstra" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-heading font-extrabold text-[#310064] tracking-tight">
                Good day, {userName}
              </h1>
              <p className="text-[11px] text-[#5A5A65] hidden xs:block">
                1-on-1 Faculty Management, Schedule & Attendance
              </p>
            </div>
          </Link>
        </div>

        {/* Right: Status Pill & Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] text-xs font-semibold text-[#310064]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Faculty Active</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-8 h-8 rounded-full bg-[#310064] text-white flex items-center justify-center font-heading font-bold text-xs shadow-xs hover:opacity-90 cursor-pointer"
            title={`Sign out (${userEmail})`}
          >
            {initials}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs lg:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-4 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DA]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#310064] text-white flex items-center justify-center font-bold text-xs">
                    {initials}
                  </div>
                  <div>
                    <div className="text-xs font-heading font-bold text-[#310064]">{userName}</div>
                    <div className="text-[10px] text-emerald-600 font-bold">Faculty Portal</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 mt-3 max-h-[60vh] overflow-y-auto pr-1">
                {teacherMenuItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/teacher/dashboard' && pathname?.startsWith(item.href + '/'));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-heading font-bold text-xs transition-all ${
                        isActive
                          ? 'bg-[#310064] text-white shadow-xs'
                          : 'text-[#5A5A65] hover:bg-[#F2ECFC] hover:text-[#310064]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4CC45]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#ECE6DA] shrink-0">
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

export function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside className="w-60 bg-white border-r border-[#ECE6DA] shrink-0 flex flex-col justify-between p-3 h-full select-none">
      <div className="flex-1 overflow-y-auto space-y-1 pr-0.5">
        <div className="px-3 py-1 text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] mb-1">
          Faculty Portal
        </div>

        {teacherMenuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/teacher/dashboard' && pathname?.startsWith(item.href + '/'));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-heading font-bold text-xs transition-all ${
                isActive
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'text-[#5A5A65] hover:bg-[#F2ECFC] hover:text-[#310064]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4CC45]' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-2 border-t border-[#ECE6DA] shrink-0 mt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-xl text-xs font-heading font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
