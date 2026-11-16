import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Home } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found | TutorAstra',
  description: 'The page you were looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1E1E24]">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-[#FBFBFC] border-b border-[#E5E5EB]">
        <div className="max-w-md w-full card-standard p-8 text-center space-y-5 bg-white">
          <div className="w-16 h-16 rounded-xl bg-[#F5F5F7] border border-[#E5E5EB] text-[#310064] font-heading font-extrabold text-2xl flex items-center justify-center mx-auto">
            404
          </div>

          <div>
            <h1 className="font-heading font-bold text-2xl text-[#1E1E24] leading-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-[#5A5A65] mt-2 leading-relaxed">
              The page you are looking for does not exist or may have been relocated.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="btn-primary w-full sm:w-auto text-xs font-heading font-semibold">
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>
            <Link href="/#subjects" className="btn-secondary w-full sm:w-auto text-xs font-heading font-semibold">
              <span>View Subjects</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
