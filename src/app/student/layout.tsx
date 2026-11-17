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
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-slate-800">
      <StudentTopBar userName={session.name} userEmail={session.email} />
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        <StudentSidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
