import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms and Conditions | TutorAstra',
  description: 'Terms of service and enrollment policies governing TutorAstra one-to-one educational instruction.',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1E1E24]">
      <Navbar />

      <main className="flex-grow py-16 bg-[#FBFBFC] border-b border-[#E5E5EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 card-standard p-8 sm:p-12 bg-white">
          <div className="space-y-2 pb-6 border-b border-[#E5E5EB]">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#1E1E24]">
              Terms and Conditions
            </h1>
            <p className="text-xs text-[#5A5A65]">Last updated: November 2026</p>
          </div>

          <div className="space-y-6 text-sm text-[#5A5A65] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1E1E24]">1. Educational Services</h2>
              <p>
                TutorAstra provides one-to-one tutoring and educational support services. By submitting a consultation request or enrolling in sessions, you agree to these Terms and Conditions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1E1E24]">2. Session Scheduling & Rescheduling</h2>
              <p>
                Session schedules are established collaboratively with parents. If a scheduled lesson must be rescheduled, parents should provide reasonable advance notice so that educators can adjust timetables without disruption.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1E1E24]">3. Student Conduct & Respect</h2>
              <p>
                We foster an encouraging and respectful learning environment. Students and educators are expected to maintain courteous, focused engagement during all live video and whiteboard lessons.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1E1E24]">4. Intellectual Property</h2>
              <p>
                Course outlines, diagnostic rubrics, and platform materials provided by TutorAstra remain the intellectual property of TutorAstra. Materials are provided solely for personal educational use.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1E1E24]">5. Inquiries</h2>
              <p>
                For questions regarding enrollment terms, contact admissions at{' '}
                <a href="mailto:admissions@tutorastra.com" className="text-[#310064] font-semibold underline">
                  admissions@tutorastra.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
