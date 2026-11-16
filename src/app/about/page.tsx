import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhyTutorAstraSection from '@/components/WhyTutorAstraSection';
import Link from 'next/link';
import { Target, ArrowRight, Check } from 'lucide-react';

export const metadata = {
  title: 'About Us | TutorAstra – Your Ambition. Our Mission.',
  description:
    'Learn about TutorAstra’s one-to-one educational model: verified subject specialists, tailored study plans, and dedicated academic mentorship.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1E1E24]">
      <Navbar />

      <main className="flex-grow">
        {/* Header Hero */}
        <section className="py-16 lg:py-24 bg-[#FBFBFC] border-b border-[#E5E5EB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
              <span>About TutorAstra</span>
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1E1E24] tracking-tight leading-tight">
              Personalised Mentorship Built for Academic Excellence.
            </h1>

            <p className="text-base sm:text-lg text-[#5A5A65] max-w-2xl mx-auto leading-relaxed">
              We connect students in Grades 9 through 12 directly with vetted subject specialists for focused, one-to-one learning.
            </p>
          </div>
        </section>

        {/* Core Philosophy Section */}
        <section className="py-16 lg:py-24 bg-white border-b border-[#E5E5EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-heading font-semibold text-[#310064] uppercase tracking-wider">
                  <Target className="w-4 h-4 text-[#310064]" />
                  <span>Educational Mission</span>
                </div>

                <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] leading-tight">
                  Focusing on the Individual Student.
                </h2>

                <p className="text-base text-[#5A5A65] leading-relaxed">
                  Traditional schooling forces groups of thirty students along a single rigid schedule. Doubts often remain unasked, and knowledge gaps grow larger over time.
                </p>

                <p className="text-base text-[#5A5A65] leading-relaxed">
                  TutorAstra changes this model. By pairing each student with an experienced subject mentor, lessons adapt to their individual rhythm and syllabus requirements.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-[#1E1E24]">
                    <Check className="w-4 h-4 text-[#310064] shrink-0" />
                    <span>Dedicated one-to-one teaching with real-time doubt resolution</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-medium text-[#1E1E24]">
                    <Check className="w-4 h-4 text-[#310064] shrink-0" />
                    <span>Rigorous educator vetting and subject-matter testing</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-medium text-[#1E1E24]">
                    <Check className="w-4 h-4 text-[#310064] shrink-0" />
                    <span>Curriculum alignment with CBSE, Cambridge, and IB frameworks</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/#consultation" className="btn-primary text-sm font-heading font-semibold inline-flex">
                    <span>Book a Free Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Side Visual / Stats Card */}
              <div className="card-standard p-8 bg-[#FBFBFC] space-y-6">
                <h3 className="font-heading font-bold text-xl text-[#1E1E24]">
                  Key Principles of Our Learning Model
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <span className="font-heading font-bold text-sm text-[#310064] block mb-1">
                      1. Individualised Pacing
                    </span>
                    <p className="text-xs text-[#5A5A65] leading-relaxed">
                      Lessons move as fast or as thoroughly as the student requires, ensuring foundational clarity before advancing.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <span className="font-heading font-bold text-sm text-[#310064] block mb-1">
                      2. Active Problem Solving
                    </span>
                    <p className="text-xs text-[#5A5A65] leading-relaxed">
                      Students work through problems actively during sessions rather than passively watching video explanations.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <span className="font-heading font-bold text-sm text-[#310064] block mb-1">
                      3. Transparent Feedback
                    </span>
                    <p className="text-xs text-[#5A5A65] leading-relaxed">
                      Parents receive regular written updates covering concepts mastered, practice scores, and upcoming milestones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why TutorAstra Component */}
        <WhyTutorAstraSection />
      </main>

      <Footer />
    </div>
  );
}
