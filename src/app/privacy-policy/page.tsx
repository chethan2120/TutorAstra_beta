import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | TutorAstra',
  description: 'How TutorAstra collects, uses, and safeguards parent and student information with strict child privacy and security standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1E1E24]">
      <Navbar />

      <main className="flex-grow py-16 bg-[#FBFBFC] border-b border-[#E5E5EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 card-standard p-8 sm:p-12 bg-white">
          <div className="space-y-2 pb-6 border-b border-[#E5E5EB]">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#1E1E24]">
              Privacy Policy
            </h1>
            <p className="text-xs text-[#5A5A65]">Last updated: November 2026</p>
          </div>

          <div className="space-y-6 text-sm text-[#5A5A65] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1E1E24]">1. Overview & Commitment</h2>
              <p>
                TutorAstra is committed to protecting the privacy of parents, guardians, and students who engage with our educational services. We treat safeguarding and student data privacy with strict confidentiality.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1E1E24]">2. Information We Collect</h2>
              <p>We collect information provided directly by parents during consultation requests and enrolments, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Parent/Guardian name, email address, and telephone number.</li>
                <li>Student name, current grade/year, curriculum, and subject interests.</li>
                <li>Academic diagnostic feedback and homework submissions during active enrolments.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1E1E24]">3. How Information is Used</h2>
              <p>Your information is used solely to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Schedule and deliver one-to-one tutoring sessions.</li>
                <li>Calibrate student learning roadmaps and prepare progress reports.</li>
                <li>Communicate class updates and feedback with parents.</li>
              </ul>
              <p className="font-semibold text-[#1E1E24] mt-2">
                We do not sell, rent, or share personal student data with third-party advertisers under any circumstances.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1E1E24]">4. Data Security</h2>
              <p>
                We implement industry-standard encryption, access controls, and secure database hosting to prevent unauthorized access. Personal data is retained only as long as necessary to provide educational instruction and fulfill legal obligations.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1E1E24]">5. Contact Regarding Privacy</h2>
              <p>
                For privacy inquiries or data requests, contact our compliance team at{' '}
                <a href="mailto:privacy@tutorastra.com" className="text-[#310064] font-semibold underline">
                  privacy@tutorastra.com
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
