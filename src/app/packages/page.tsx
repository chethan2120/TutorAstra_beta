import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PackagesSection from '@/components/PackagesSection';
import ClosingCTA from '@/components/ClosingCTA';
import { getAllPackages } from '@/lib/db';
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Learning Packages & Tutoring Options | TutorAstra',
  description: 'Transparent tuition bundles: Core Academic Bundle, Future-Skills Bundle, and Full One-to-One Bundle. Aligned with CBSE and British curricula.',
};

export const revalidate = 60;

export default function PackagesPage() {
  const packages = getAllPackages();

  const faqs = [
    {
      q: 'How long does each academic term last?',
      a: 'Each academic term runs for 12 intensive weeks. An academic year has 3 terms (36 weeks total), aligned with regular school holiday breaks.'
    },
    {
      q: 'What is included in the Core Bundle?',
      a: 'The Core Bundle includes dedicated 1-on-1 classes across Science and Mathematics, weekly graded homework with personalized feedback, dedicated doubt resolution, and complete term diagnostic reports.'
    },
    {
      q: 'Can a student try a class before enrolling for the term?',
      a: 'Yes, absolutely. We offer a complimentary, zero-obligation 1-on-1 consultation and diagnostic assessment so parents and students can experience our tutoring approach first-hand.'
    },
    {
      q: 'Are class timings flexible for school schedules?',
      a: 'Yes. Classes are scheduled in after-school evening slots and weekend cohorts to prevent conflict with school and extracurricular activities.'
    },
    {
      q: 'Are the AI and Public Speaking courses suitable for beginners?',
      a: 'Yes. Our curriculum is tailored from the ground up for secondary students (Grades 6–12). No prior coding or speech tournament experience is required.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Header Hero */}
        <section className="py-14 sm:py-20 bg-[#FBFBFC] border-b border-[#E5E5EB]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#E5E5EB] text-[#310064] text-xs font-semibold uppercase tracking-wider">
              Term-by-Term Enrolment
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#1E1E24] tracking-tight leading-tight">
              Transparent <span className="text-[#310064]">Tuition Packages</span>
            </h1>

            <p className="text-sm sm:text-base font-sans text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              No hidden admission fees, no multi-year lock-in contracts. Select an academic plan that aligns with your child’s goals.
            </p>
          </div>
        </section>

        {/* Pricing Grid Component */}
        <PackagesSection initialPackages={packages as any} />

        {/* FAQs Section */}
        <section className="py-16 bg-[#FBFBFC] border-t border-[#E5E5EB]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#310064] uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E1E24]">Everything You Need to Know</h2>
              <p className="text-xs sm:text-sm font-sans text-neutral-600">
                Clear answers for parents about our terms, tuition, and session structure.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-lg bg-white border border-[#E5E5EB] shadow-xs space-y-1.5">
                  <h3 className="text-sm sm:text-base font-heading font-bold text-[#1E1E24]">{faq.q}</h3>
                  <p className="text-xs sm:text-sm font-sans text-neutral-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ClosingCTA />
      </main>

      <Footer />
    </div>
  );
}
