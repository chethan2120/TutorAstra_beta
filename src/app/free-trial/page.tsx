import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConsultationSection from '@/components/ConsultationSection';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Book a Free Consultation | TutorAstra',
  description:
    'Experience an interactive 1-on-1 trial consultation with TutorAstra. Zero obligation, diagnostic assessment, and personalized study roadmap.',
};

export default function FreeTrialPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <section className="py-14 bg-[#310064] text-white text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-[#F4CC45] border border-[#F4CC45]/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complimentary Academic Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
              Book Your Free <span className="text-[#F4CC45]">1-on-1 Consultation</span>
            </h1>
            <p className="text-sm font-sans text-neutral-200 max-w-xl mx-auto leading-relaxed">
              Meet our academic advisors, identify concept strengths and gaps, and experience the TutorAstra difference.
            </p>
          </div>
        </section>

        <ConsultationSection />
      </main>

      <Footer />
    </div>
  );
}