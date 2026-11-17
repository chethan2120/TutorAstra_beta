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
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#FAF8F5] font-sans text-slate-800">
      <TeacherTopBar userName={session.name} userEmail={session.email} />
      <div className="flex-1 flex overflow-hidden">
        <div className="h-full overflow-y-auto shrink-0 hidden lg:block">
          <TeacherSidebar />
        </div>
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
