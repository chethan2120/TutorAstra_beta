import React from 'react';
import { AdminTopBar, AdminSidebar } from '@/components/AdminNav';
import { getCurrentSession } from '@/lib/auth';

export const metadata = {
  title: 'TutorAstra Management Console | TutorAstra',
  description: 'TutorAstra operations, learning programs, and student admissions console.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getCurrentSession();

  if (!session) {
    return <div className="min-h-screen bg-slate-50 font-sans">{children}</div>;
  }

  return (
    <div className="h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-[#FAF8F5] flex flex-col font-sans text-slate-800">
      {/* Top Header - Fixed / Shrink-0 */}
      <div className="shrink-0 z-40">
        <AdminTopBar userEmail={session.email} userName={session.name} />
      </div>

      {/* Main Dual-Scroll Workspace with Independent Scrollbars */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 min-w-0 overflow-hidden">
        {/* Sidebar Container with its own independent scrollbar */}
        <div className="h-full shrink-0 overflow-y-auto border-r border-[#ECE6DA] bg-white custom-scrollbar hidden lg:block">
          <AdminSidebar userEmail={session.email} userName={session.name} />
        </div>

        {/* Main Content Area with its own separate independent scrollbar */}
        <main className="flex-1 h-full min-w-0 p-3 sm:p-5 lg:p-7 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
