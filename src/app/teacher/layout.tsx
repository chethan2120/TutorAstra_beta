import React from 'react';
import { TeacherTopBar, TeacherSidebar } from '@/components/TeacherNav';
import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Faculty Portal | TutorAstra',
  description: 'TutorAstra Teacher Management, 1-on-1 Classes, and Teacher Box.',
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = getCurrentSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role === 'student') {
    redirect('/student/dashboard');
  }

  return (
    <div className="h-[100dvh] w-full max-w-[100vw] overflow-hidden flex flex-col bg-[#FAF8F5] font-sans text-slate-800">
      <div className="shrink-0 z-40">
        <TeacherTopBar userName={session.name} userEmail={session.email} />
      </div>
      <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
        <div className="h-full overflow-y-auto shrink-0 hidden lg:block custom-scrollbar">
          <TeacherSidebar />
        </div>
        <main className="flex-1 h-full min-w-0 overflow-y-auto p-3 sm:p-5 lg:p-7 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
