'use client';

import React, { useState } from 'react';
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
  Sparkles,
  Menu,
  X
} from 'lucide-react';

interface StudentNavProps {
  userName?: string;
  userEmail?: string;
  grade?: string;
}

export const studentMenuItems = [
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

export function StudentTopBar({
  userName = 'Ethan Jenkins',
  userEmail = 'student@gmail.com',
  grade = 'Grade 10 CBSE'
}: StudentNavProps) {
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
    .toUpperCase() || 'EJ';

  return (
    <>
      <header className="bg-white border-b border-[#ECE6DA] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs sticky top-0 z-40">
        {/* Left: Hamburger (Mobile) + Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-[#310064] hover:bg-[#F2ECFC] transition-colors"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/student/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#F4CC45] shadow-xs flex items-center justify-center bg-[#310064] shrink-0">
              <img src="/tutorastra-logo.jpg" alt="TutorAstra" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-heading font-extrabold text-[#310064] tracking-tight">
                  {userName}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#F2ECFC] text-[#310064]">
                  {grade}
                </span>
              </div>
              <p className="text-[11px] text-[#5A5A65] hidden xs:block">
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
            className="w-8 h-8 rounded-full bg-[#310064] text-white flex items-center justify-center font-heading font-bold text-xs shadow-xs hover:opacity-90 cursor-pointer"
            title={`Sign out (${userEmail})`}
          >
            {initials}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER: Single Frame Layout with High-Positioned Logout */}
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
                  <div className="text-[10px] text-[#5A5A65]">{grade}</div>
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
              {studentMenuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/student/dashboard' && pathname?.startsWith(item.href + '/'));
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

            {/* Logout button positioned conveniently inside the frame */}
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

  return (
    <aside className="w-60 bg-white border-r border-[#ECE6DA] shrink-0 flex flex-col justify-between p-3 h-full select-none">
      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-0.5">
        <div className="px-3 py-1 text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] mb-1">
          Student Portal
        </div>
        {studentMenuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/student/dashboard' && pathname?.startsWith(item.href + '/'));
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

      {/* Logout button anchored directly in view */}
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
