import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClosingCTA from '@/components/ClosingCTA';
import Link from 'next/link';
import { ALL_CURRICULA } from '@/lib/curriculumData';
import { ArrowRight, Clock, Calendar, Compass, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Mathematics Problem Solving | Grades 6–12 | TutorAstra',
  description: 'Master arithmetic, algebra, geometry, and advanced calculus with dedicated 1-on-1 tutoring. Aligned with CBSE and British curricula.',
};

export default function MathematicsCoursePage() {
  const mathTopics = ALL_CURRICULA.filter((t) => t.subject === 'Mathematics');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Course Hero */}
        <section className="py-14 sm:py-20 bg-[#FBFBFC] border-b border-[#E5E5EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#E5E5EB] text-[#310064] text-xs font-semibold uppercase tracking-wider">
                  Academic Core • One-to-One Mathematics
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#1E1E24] leading-tight tracking-tight">
                  Mathematics & <span className="text-[#310064]">Logical Fluency</span>
                </h1>

                <p className="text-sm sm:text-base font-sans text-neutral-600 leading-relaxed max-w-2xl">
                  Turn mathematical anxiety into mastery. Our tutors build conceptual confidence across numbers, algebra, geometry, and calculus for CBSE and British curricula.
                </p>

                {/* Session Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <Clock className="w-4 h-4 text-[#310064] mb-1.5" />
                    <div className="text-xs font-bold text-[#1E1E24]">Dedicated 1-on-1</div>
                    <div className="text-xs text-neutral-500">Focused individual attention</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <Calendar className="w-4 h-4 text-[#310064] mb-1.5" />
                    <div className="text-xs font-bold text-[#1E1E24]">Flexible Schedules</div>
                    <div className="text-xs text-neutral-500">Aligned with school terms</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <Compass className="w-4 h-4 text-[#310064] mb-1.5" />
                    <div className="text-xs font-bold text-[#1E1E24]">Targeted Doubt Clearing</div>
                    <div className="text-xs text-neutral-500">Real-time problem solving</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href="/#consultation"
                    className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-heading font-semibold"
                  >
                    <span>Book Free Consultation</span>
                    <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
                  </Link>
                  <Link
                    href="/courses"
                    className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-heading font-semibold"
                  >
                    <span>Explore All Subjects</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-lg overflow-hidden border border-[#E5E5EB] bg-neutral-100 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80"
                    alt="Geometry, compass, and mathematical formulas"
                    className="w-full h-72 sm:h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Mathematics Syllabus */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E1E24]">
                Mathematics Syllabus by Term
              </h2>
              <p className="text-xs sm:text-sm font-sans text-neutral-600">
                Structured topic coverage designed to develop strong foundations and exam readiness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mathTopics.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg p-6 bg-[#FBFBFC] border border-[#E5E5EB] space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EB]">
                    <div>
                      <span className="text-xs font-semibold text-[#310064] uppercase tracking-wider">
                        {item.curriculum} • {item.grade}
                      </span>
                      <h3 className="text-base font-heading font-bold text-[#1E1E24] mt-0.5">{item.termTitle}</h3>
                    </div>
                    <span className="text-xs bg-white px-2.5 py-1 rounded-lg border border-[#E5E5EB] font-medium text-neutral-600">
                      {item.duration}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {item.topics.map((ch, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-white border border-[#E5E5EB]">
                        <div className="text-xs sm:text-sm font-bold text-[#1E1E24] flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-neutral-100 text-[#310064] text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span>{ch.title}</span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1 ml-7 leading-relaxed">{ch.description}</p>
                        {ch.subtopics && (
                          <div className="mt-2 ml-7 flex flex-wrap gap-1.5">
                            {ch.subtopics.map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[11px] bg-neutral-50 text-neutral-600 px-2 py-0.5 rounded border border-[#E5E5EB]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E5E5EB] text-xs text-neutral-500">
                    <strong className="text-[#1E1E24]">Pedagogy:</strong> {item.learningApproach}
                  </div>
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
