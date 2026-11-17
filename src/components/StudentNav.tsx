'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  CalendarDays,
  Bell,
  MessageSquare,
  Video,
  CalendarX2,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';

interface StudentNavProps {
  userName?: string;
  userEmail?: string;
  grade?: string;
}

export function StudentTopBar({
  userName = 'Ethan Jenkins',
  userEmail = 'student@gmail.com',
  grade = 'Grade 10 CBSE'
}: StudentNavProps) {
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
    .toUpperCase() || 'EJ';

  return (
    <header className="bg-white border-b border-[#ECE6DA] px-6 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-40">
      {/* Left: TutorAstra Brand & Student Info */}
      <div className="flex items-center gap-3">
        <Link href="/student/dashboard" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#F4CC45] shadow-xs flex items-center justify-center bg-[#310064]">
            <img src="/tutorastra-logo.jpg" alt="TutorAstra" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-heading font-extrabold text-[#310064] tracking-tight">
                {userName}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#F2ECFC] text-[#310064]">
                {grade}
              </span>
            </div>
            <p className="text-xs text-[#5A5A65]">
              Personalised 1-on-1 Student Learning Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Right: Quick Links & Avatar */}
      <div className="flex items-center gap-3">
        <Link
          href="/student/calendar"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] text-xs font-heading font-bold text-[#310064] hover:bg-[#F2ECFC] transition-colors"
        >
          <CalendarDays className="w-3.5 h-3.5 text-[#F4CC45]" />
          <span>My Calendar</span>
        </Link>

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

export function StudentSidebar() {
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
  // "now student: teacher (who is the teacher and which and all subject they handle),
  // subject, calendar (details on today class), notification, chat, leave, profile, logout"
  const menuItems = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Teachers', href: '/student/teachers', icon: UserCheck },
    { label: 'Enrolled Subjects', href: '/student/subjects', icon: BookOpen },
    { label: 'Calendar / Today Class', href: '/student/calendar', icon: CalendarDays },
    { label: 'Notification', href: '/student/notifications', icon: Bell },
    { label: 'Chat (Teacher Box)', href: '/student/box', icon: MessageSquare },
    { label: 'Class Recordings', href: '/student/recordings', icon: Video },
    { label: 'Leave', href: '/student/leave', icon: CalendarX2 },
    { label: 'AI Tutor – Ms. Violet', href: '/student/ai-tutor', icon: Sparkles },
    { label: 'Profile', href: '/student/profile', icon: User },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-[#ECE6DA] shrink-0 flex flex-col justify-between p-3.5 z-30 min-h-full">
      <div className="space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] mb-1">
          Student Portal
        </div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/student/dashboard' && pathname?.startsWith(item.href + '/'));
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
