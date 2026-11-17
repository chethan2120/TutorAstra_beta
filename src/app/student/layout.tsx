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
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#FAF8F5] font-sans text-slate-800">
      <StudentTopBar userName={session.name} userEmail={session.email} />
      <div className="flex-1 flex overflow-hidden">
        <div className="h-full overflow-y-auto shrink-0 hidden lg:block">
          <StudentSidebar />
        </div>
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
