import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClosingCTA from '@/components/ClosingCTA';
import Link from 'next/link';
import { PUBLIC_SPEAKING_RUBRIC } from '@/lib/curriculumData';
import { Mic, Award, Clock, ArrowRight, Video, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Public Speaking & Leadership | Grades 6–12 | TutorAstra',
  description: 'Conquer stage fright, develop argumentation, and master confident presentation skills with 1-on-1 speech coaching.',
};

export default function PublicSpeakingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-14 sm:py-20 bg-[#FBFBFC] border-b border-[#E5E5EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#E5E5EB] text-[#310064] text-xs font-semibold uppercase tracking-wider">
                  Leadership Stream • One-to-One Speech Coaching
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#1E1E24] leading-tight tracking-tight">
                  Public Speaking & <span className="text-[#310064]">Leadership Presence</span>
                </h1>

                <p className="text-sm sm:text-base font-sans text-neutral-600 leading-relaxed max-w-2xl">
                  Turn hesitation into commanding communication. We coach students through vocal projection, structured debate argumentation, and confident keynote delivery.
                </p>

                {/* Session Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <Clock className="w-4 h-4 text-[#310064] mb-1.5" />
                    <div className="text-xs font-bold text-[#1E1E24]">Live Speech Practice</div>
                    <div className="text-xs text-neutral-500">Dedicated coaching weekly</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <Video className="w-4 h-4 text-[#310064] mb-1.5" />
                    <div className="text-xs font-bold text-[#1E1E24]">Recorded Feedback</div>
                    <div className="text-xs text-neutral-500">Detailed rubric reviews</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <Award className="w-4 h-4 text-[#310064] mb-1.5" />
                    <div className="text-xs font-bold text-[#1E1E24]">Summit Capstone</div>
                    <div className="text-xs text-neutral-500">Live audience presentation</div>
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
                <div className="rounded-lg border border-[#E5E5EB] bg-neutral-100 overflow-hidden shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80"
                    alt="Student delivering a speech"
                    className="w-full h-72 sm:h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Progressive Levels Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E1E24]">
                Progressive Speaking Levels
              </h2>
              <p className="text-xs sm:text-sm font-sans text-neutral-600">
                Structured to build poise, logical persuasion, and authoritative presentation stage presence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level 1 Card */}
              <div className="rounded-lg p-6 bg-[#FBFBFC] border border-[#E5E5EB] flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="pb-3 border-b border-[#E5E5EB]">
                    <span className="text-xs font-semibold text-[#310064] uppercase tracking-wider">
                      Level 1
                    </span>
                    <h3 className="text-lg font-heading font-bold text-[#1E1E24] mt-1">Confident Voice</h3>
                    <p className="text-xs text-neutral-600 mt-1">Overcoming anxiety and vocal control</p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-neutral-700 font-sans">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Diaphragmatic breathwork and composure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Posture and deliberate eye contact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Modulation and filler-word reduction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Foundational narrative structure</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#E5E5EB]">
                  <div className="text-[11px] font-semibold text-[#310064] uppercase tracking-wider mb-1">
                    Level 1 Milestone:
                  </div>
                  <div className="text-xs font-medium text-[#1E1E24]">
                    3-minute live presentation before a mentor panel.
                  </div>
                </div>
              </div>

              {/* Level 2 Card */}
              <div className="rounded-lg p-6 bg-[#FBFBFC] border border-[#E5E5EB] flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="pb-3 border-b border-[#E5E5EB]">
                    <span className="text-xs font-semibold text-[#310064] uppercase tracking-wider">
                      Level 2
                    </span>
                    <h3 className="text-lg font-heading font-bold text-[#1E1E24] mt-1">Persuasive Speaker</h3>
                    <p className="text-xs text-neutral-600 mt-1">Argumentation and debate logic</p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-neutral-700 font-sans">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Ethos, Pathos, and Logos foundations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Assertion, Reasoning, Evidence, Impact framework</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Impromptu speaking and quick rebuttal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Identifying logical fallacies</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#E5E5EB]">
                  <div className="text-[11px] font-semibold text-[#310064] uppercase tracking-wider mb-1">
                    Level 2 Milestone:
                  </div>
                  <div className="text-xs font-medium text-[#1E1E24]">
                    Structured debate with cross-examination.
                  </div>
                </div>
              </div>

              {/* Level 3 Card */}
              <div className="rounded-lg p-6 bg-[#FBFBFC] border border-[#E5E5EB] flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="pb-3 border-b border-[#E5E5EB]">
                    <span className="text-xs font-semibold text-[#310064] uppercase tracking-wider">
                      Level 3
                    </span>
                    <h3 className="text-lg font-heading font-bold text-[#1E1E24] mt-1">Leader & Orator</h3>
                    <p className="text-xs text-neutral-600 mt-1">Executive presence and keynotes</p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-neutral-700 font-sans">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Inspiring and vision-casting delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Executive Q&A handling technique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Panel moderation and questioning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                      <span>Keynote architecture and visual storytelling</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#E5E5EB]">
                  <div className="text-[11px] font-semibold text-[#310064] uppercase tracking-wider mb-1">
                    Level 3 Milestone:
                  </div>
                  <div className="text-xs font-medium text-[#1E1E24]">
                    5-Minute keynote speech before a live audience.
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Rubric Table */}
            <div className="bg-[#FBFBFC] rounded-lg p-6 sm:p-8 border border-[#E5E5EB]">
              <h3 className="text-base font-heading font-bold text-[#1E1E24] mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#310064]" />
                <span>Our 4-Part Evaluation Rubric</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PUBLIC_SPEAKING_RUBRIC.map((rubric, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <strong className="text-[#1E1E24] font-bold">{rubric.criterion}</strong>
                      <span className="text-[#310064] font-semibold bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                        {rubric.weight}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed mt-2">{rubric.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ClosingCTA />
      </main>

      <Footer />
    </div>
  );
}
