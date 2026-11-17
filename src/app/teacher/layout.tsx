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

  // If not logged in, redirect to login
  if (!session) {
    redirect('/login');
  }

  // Student should not access teacher portal
  if (session.role === 'student') {
    redirect('/student/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-slate-800">
      <TeacherTopBar userName={session.name} userEmail={session.email} />
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        <TeacherSidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
