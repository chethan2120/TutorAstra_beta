import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClosingCTA from '@/components/ClosingCTA';
import Link from 'next/link';
import { ALL_CURRICULA } from '@/lib/curriculumData';
import { Bot, Sparkles, Clock, FileText, ArrowRight, ShieldCheck, Brain, PenTool, Layout, Layers } from 'lucide-react';

export const metadata = {
  title: 'AI for Students | Grades 6–12 | TutorAstra',
  description: 'Applied AI skills: Prompt engineering, research syntheses, ethical frameworks, and presentation skills for secondary students.',
};

export default function AIForStudentsPage() {
  const aiTopics = ALL_CURRICULA.filter((t) => t.subject === 'AI for Students');

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
                  Future-Ready Skills • One-to-One Mentorship
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#1E1E24] leading-tight tracking-tight">
                  Applied <span className="text-[#310064]">AI & Academic Tools</span>
                </h1>

                <p className="text-sm sm:text-base font-sans text-neutral-600 leading-relaxed max-w-2xl">
                  Transform digital consumption into active creation. Students master the foundational literacy of artificial intelligence: prompt engineering, research synthesis, presentation design, and ethical evaluation.
                </p>

                {/* Session Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <Clock className="w-4 h-4 text-[#310064] mb-1.5" />
                    <div className="text-xs font-bold text-[#1E1E24]">Live Studio Sessions</div>
                    <div className="text-xs text-neutral-500">Hands-on practical guidance</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <FileText className="w-4 h-4 text-[#310064] mb-1.5" />
                    <div className="text-xs font-bold text-[#1E1E24]">Project-Based</div>
                    <div className="text-xs text-neutral-500">Real academic portfolios</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5EB]">
                    <Sparkles className="w-4 h-4 text-[#310064] mb-1.5" />
                    <div className="text-xs font-bold text-[#1E1E24]">Ethics & Safety</div>
                    <div className="text-xs text-neutral-500">Responsible AI principles</div>
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
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80"
                    alt="Student working with digital intelligence tools"
                    className="w-full h-72 sm:h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competencies Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E1E24]">
                Core Competencies Covered
              </h2>
              <p className="text-xs sm:text-sm font-sans text-neutral-600">
                A structured pathway helping secondary students develop analytical literacy and practical technical skills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] space-y-2">
                <Brain className="w-5 h-5 text-[#310064]" />
                <h3 className="text-sm font-heading font-bold text-[#1E1E24]">1. AI Architecture Basics</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Understand how language models, transformers, and neural algorithms process prompts and formulate responses.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] space-y-2">
                <PenTool className="w-5 h-5 text-[#310064]" />
                <h3 className="text-sm font-heading font-bold text-[#1E1E24]">2. Prompt Design Mastery</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Learn systematic prompting frameworks: persona setting, multi-step problem solving, and contextual constraints.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] space-y-2">
                <ShieldCheck className="w-5 h-5 text-[#310064]" />
                <h3 className="text-sm font-heading font-bold text-[#1E1E24]">3. Responsible AI & Ethics</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Detect algorithmic hallucinations, audit bias, protect personal data, and uphold academic integrity.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] space-y-2">
                <Layers className="w-5 h-5 text-[#310064]" />
                <h3 className="text-sm font-heading font-bold text-[#1E1E24]">4. Research Synthesiser</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Use verified research notebooks to distill complex academic literature and structure study summaries.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] space-y-2">
                <Layout className="w-5 h-5 text-[#310064]" />
                <h3 className="text-sm font-heading font-bold text-[#1E1E24]">5. Presentation Architecture</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Formulate dynamic slides, structure visual hierarchy, and present complex ideas logically.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] space-y-2">
                <Sparkles className="w-5 h-5 text-[#310064]" />
                <h3 className="text-sm font-heading font-bold text-[#1E1E24]">6. Capstone Projects</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Design and execute an end-of-term academic project incorporating research, slides, and live demonstration.
                </p>
              </div>
            </div>

            {/* Term Roadmap */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {aiTopics.map((termItem) => (
                <div
                  key={termItem.id}
                  className="rounded-lg p-6 bg-[#FBFBFC] border border-[#E5E5EB] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-[#E5E5EB]">
                      <span className="text-xs font-semibold text-[#310064] uppercase tracking-wider">
                        Term {termItem.term}
                      </span>
                      <h4 className="text-base font-heading font-bold text-[#1E1E24] mt-1">{termItem.termTitle}</h4>
                    </div>

                    <div className="space-y-3">
                      {termItem.topics.map((t, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-white border border-[#E5E5EB] text-xs">
                          <strong className="text-[#1E1E24] font-bold block mb-1">{t.title}</strong>
                          <p className="text-neutral-600 text-xs leading-relaxed">{t.description}</p>
                          {t.practicalActivity && (
                            <div className="mt-2 text-[11px] font-medium text-[#310064] bg-neutral-100 px-2 py-0.5 rounded inline-block">
                              Practical: {t.practicalActivity}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {termItem.capstone && (
                    <div className="mt-4 pt-3 border-t border-[#E5E5EB] text-xs text-neutral-600">
                      <strong className="text-[#1E1E24] font-bold block">Capstone:</strong>
                      <span>{termItem.capstone}</span>
                    </div>
                  )}
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
