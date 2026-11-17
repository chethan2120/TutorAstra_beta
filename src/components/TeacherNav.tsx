'use client';

import React from 'react';
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
  LogOut
} from 'lucide-react';

interface TeacherNavProps {
  userName?: string;
  userEmail?: string;
}

export function TeacherTopBar({ userName = 'Dr. Sarah Mitchell', userEmail = 'teacher@gmail.com' }: TeacherNavProps) {
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

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'SM';

  return (
    <header className="bg-white border-b border-[#ECE6DA] px-6 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-40">
      {/* Left: Medallion & Greeting */}
      <div className="flex items-center gap-3">
        <Link href="/teacher/dashboard" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#F4CC45] shadow-xs flex items-center justify-center bg-[#310064]">
            <img src="/tutorastra-logo.jpg" alt="TutorAstra" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-heading font-extrabold text-[#310064] tracking-tight">
              Good day, {userName}
            </h1>
            <p className="text-xs text-[#5A5A65]">
              Here's your 1-on-1 teaching, student roster, and attendance overview.
            </p>
          </div>
        </Link>
      </div>

      {/* Right: Profile Avatar Circle */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] text-xs font-semibold text-[#310064]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Faculty Active</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-9 h-9 rounded-full bg-[#310064] text-white flex items-center justify-center font-heading font-bold text-xs shadow-xs hover:opacity-90 cursor-pointer"
          title={`Sign out (${userEmail})`}
        >
          {initials}
        </button>
      </div>
    </header>
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

  // Strictly configured matching client's exact specification:
  // "now teacher: Dashboard, student (how many students under them), attendance,
  // calendar or today class (only of that teacher which class to take), notification,
  // assign class or course, chat, leave, profile, logout"
  const menuItems = [
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

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-[#ECE6DA] shrink-0 flex flex-col justify-between p-3.5 z-30 min-h-full">
      <div className="space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] mb-1">
          Faculty Portal
        </div>

        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/teacher/dashboard' && pathname?.startsWith(item.href + '/'));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-heading font-bold text-xs transition-all ${
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

      <div className="pt-4 border-t border-[#ECE6DA] space-y-2 mt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-heading font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
