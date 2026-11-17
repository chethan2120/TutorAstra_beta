import React from 'react';
import { StudentTopBar, StudentSidebar } from '@/components/StudentNav';
import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Student Portal | TutorAstra',
  description: 'TutorAstra Student Portal: Enrolled Subjects, Today Classes, Teacher Box, and Ms. Violet AI Tutor.',
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = getCurrentSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="h-[100dvh] w-full max-w-[100vw] overflow-hidden flex flex-col bg-[#FAF8F5] font-sans text-slate-800">
      <div className="shrink-0 z-40">
        <StudentTopBar userName={session.name} userEmail={session.email} />
      </div>
      <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
        <div className="h-full overflow-y-auto shrink-0 hidden lg:block custom-scrollbar">
          <StudentSidebar />
        </div>
        <main className="flex-1 h-full min-w-0 overflow-y-auto p-3 sm:p-5 lg:p-7 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
