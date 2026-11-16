'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Star,
  Sparkles,
  Award,
  AlertTriangle
} from 'lucide-react';

export default function StudentDashboardShowcaseSection() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'mastery' | 'feedback'>('schedule');

  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="student-dashboard" className="py-16 lg:py-24 bg-[#FFFDF6] border-b border-[#ECE7DA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
            <span>Dedicated Parent & Student Portal</span>
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
            Total Transparency Into Every Lesson, Mastery Score & Homework.
          </h2>

          <p className="text-base sm:text-lg text-[#5A5A65] leading-relaxed">
            Never wonder how your child is performing. Every 1-on-1 session is backed by real-time attendance, concept mastery trackers, homework evaluations, and actionable tutor feedback.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: 4 Key Portal Capabilities (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="card-standard p-5 bg-white hover:border-[#310064]/30 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#F2ECFC] text-[#310064] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#310064]" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-[#1E1E24]">
                    Live 1-on-1 Class Schedule & 1-Click Reschedule
                  </h4>
                  <p className="text-xs text-[#5A5A65] mt-1 leading-relaxed">
                    View upcoming sessions, tutor details, class notes, and past session recordings available 24/7 for easy revision before school exams.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-standard p-5 bg-white hover:border-[#310064]/30 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9E6] text-[#8C6D00] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#8C6D00]" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-[#1E1E24]">
                    Chapter-by-Chapter Concept Mastery Radar
                  </h4>
                  <p className="text-xs text-[#5A5A65] mt-1 leading-relaxed">
                    Know exact progress: Green for Exam-Ready (90%+), Amber for Developing, and Red for Focus Needed. No surprises on report card day.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-standard p-5 bg-white hover:border-[#310064]/30 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#F2ECFC] text-[#310064] flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5 text-[#310064]" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-[#1E1E24]">
                    Weekly Written Tutor Notes for Parents
                  </h4>
                  <p className="text-xs text-[#5A5A65] mt-1 leading-relaxed">
                    Your dedicated educator records specific problem-solving speed, attention to detail, homework completion, and targeted next steps.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#consultation"
                onClick={scrollToConsultation}
                className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-semibold"
              >
                <span>Experience the Student Portal with a Free Session</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Sleek Phone & Tablet Dashboard Mockup (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-2 mb-6 p-1.5 rounded-lg bg-white border border-[#E5E5EB] shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-heading font-semibold transition-all ${
                  activeTab === 'schedule'
                    ? 'bg-[#310064] text-white shadow-xs'
                    : 'text-[#5A5A65] hover:text-[#310064]'
                }`}
              >
                Live Schedule
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mastery')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-heading font-semibold transition-all ${
                  activeTab === 'mastery'
                    ? 'bg-[#310064] text-white shadow-xs'
                    : 'text-[#5A5A65] hover:text-[#310064]'
                }`}
              >
                Mastery Radar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('feedback')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-heading font-semibold transition-all ${
                  activeTab === 'feedback'
                    ? 'bg-[#310064] text-white shadow-xs'
                    : 'text-[#5A5A65] hover:text-[#310064]'
                }`}
              >
                Tutor Notes
              </button>
            </div>

            {/* Mobile Device Frame with 2D Floating Accents */}
            <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
              {/* 2D Floating Badge 1 (Left Top) */}
              <div className="absolute -top-4 -left-4 sm:-left-8 px-3 py-1.5 rounded-lg bg-white border border-[#E5E5EB] shadow-md z-20 flex items-center gap-2 animate-float-slow">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-heading font-bold text-[#1E1E24]">Live Tutor Sync</span>
              </div>

              {/* 2D Floating Badge 2 (Right Bottom) */}
              <div className="absolute -bottom-4 -right-4 sm:-right-8 px-3 py-1.5 rounded-lg bg-white border border-[#E5E5EB] shadow-md z-20 flex items-center gap-1.5 animate-float-reverse">
                <Star className="w-3.5 h-3.5 fill-[#F4CC45] text-[#F4CC45]" />
                <span className="text-[11px] font-heading font-bold text-[#310064]">98% Success Rate</span>
              </div>

              {/* Phone Body */}
              <div className="w-full bg-[#1A1A24] rounded-[36px] p-3 shadow-2xl border-4 border-[#2E2E3E]">
                {/* Dynamic Island / Speaker */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#2E2E3E] mr-1" />
                  <div className="w-8 h-1 bg-[#2E2E3E] rounded-full" />
                </div>

                {/* Inner Screen */}
                <div className="bg-[#FAF8F5] rounded-[28px] p-4 text-[#1E1E24] min-h-[460px] flex flex-col justify-between overflow-hidden">
                  {/* Dashboard Header */}
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EB]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#310064] text-white flex items-center justify-center font-heading font-bold text-xs">
                          AS
                        </div>
                        <div>
                          <div className="text-xs font-heading font-bold text-[#1E1E24]">Aarav Sharma</div>
                          <div className="text-[10px] text-[#5A5A65]">Grade 10 • CBSE Board Prep</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-heading font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Active 1:1
                      </span>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-3 gap-2 my-3">
                      <div className="p-2 bg-white rounded-lg border border-[#E5E5EB] text-center">
                        <div className="text-xs font-heading font-bold text-[#310064]">32 hrs</div>
                        <div className="text-[9px] text-[#5A5A65]">Completed</div>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E5E5EB] text-center">
                        <div className="text-xs font-heading font-bold text-emerald-600">96%</div>
                        <div className="text-[9px] text-[#5A5A65]">Mastery</div>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E5E5EB] text-center">
                        <div className="text-xs font-heading font-bold text-[#8C6D00]">14/14</div>
                        <div className="text-[9px] text-[#5A5A65]">Homework</div>
                      </div>
                    </div>

                    {/* Dynamic View based on Active Tab */}
                    {activeTab === 'schedule' && (
                      <div className="space-y-2.5">
                        <div className="text-[11px] font-heading font-bold text-[#1E1E24]">Next Confirmed Session</div>
                        <div className="p-3 rounded-xl bg-white border-2 border-[#310064]/20 shadow-xs">
                          <div className="flex items-center justify-between text-[11px] font-heading font-bold text-[#310064] mb-1">
                            <span>Physics: Electromagnetic Induction</span>
                            <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px]">Live in 2h</span>
                          </div>
                          <div className="text-[10px] text-[#5A5A65] flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-[#310064]" />
                            <span>Today at 6:30 PM (60 mins)</span>
                          </div>
                          <div className="text-[10px] text-[#5A5A65] mt-1 flex items-center justify-between pt-2 border-t border-[#F0EBF8]">
                            <span>Tutor: Dr. Rajesh Sharma</span>
                            <span className="text-[#310064] font-semibold">Join Class →</span>
                          </div>
                        </div>

                        <div className="text-[11px] font-heading font-bold text-[#1E1E24] pt-1">Upcoming This Week</div>
                        <div className="p-2.5 rounded-lg bg-white border border-[#E5E5EB] text-[10px] space-y-1">
                          <div className="flex justify-between font-medium text-[#1E1E24]">
                            <span>Wednesday • Mathematics (Calculus Drills)</span>
                            <span className="text-[#5A5A65]">5:00 PM</span>
                          </div>
                          <div className="flex justify-between font-medium text-[#1E1E24]">
                            <span>Friday • Chemistry (Redox Reaction Titration)</span>
                            <span className="text-[#5A5A65]">6:30 PM</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'mastery' && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-heading font-bold text-[#1E1E24]">Board Syllabus Mastery Breakdown</div>
                        
                        <div className="p-2.5 rounded-lg bg-white border border-[#E5E5EB] space-y-2 text-[10px]">
                          <div>
                            <div className="flex justify-between font-semibold mb-0.5">
                              <span>Magnetic Effects of Electric Current</span>
                              <span className="text-emerald-700">95% (Exam-Ready)</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#E5E5EB] rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between font-semibold mb-0.5">
                              <span>Electromagnetic Induction & Lenz's Law</span>
                              <span className="text-emerald-700">88% (Proficient)</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#E5E5EB] rounded-full overflow-hidden">
                              <div className="h-full bg-[#310064] rounded-full" style={{ width: '88%' }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between font-semibold mb-0.5">
                              <span>AC Generator & Transformer Mechanics</span>
                              <span className="text-[#8C6D00]">72% (Target Area)</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#E5E5EB] rounded-full overflow-hidden">
                              <div className="h-full bg-[#F4CC45] rounded-full" style={{ width: '72%' }} />
                            </div>
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-[#FFF9E6] border border-[#F4CC45]/40 text-[9px] text-[#7A621C] leading-snug">
                          <strong>Tutor Diagnostic Note:</strong> Transformer formulas require one extra revision cycle before upcoming pre-board exam.
                        </div>
                      </div>
                    )}

                    {activeTab === 'feedback' && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-heading font-bold text-[#1E1E24]">Latest Session Evaluation</div>
                        <div className="p-3 rounded-xl bg-white border border-[#E5E5EB] text-[10px] space-y-1.5 leading-relaxed">
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-bold text-[#310064]">Dr. Rajesh Sharma</span>
                            <span className="text-[#5A5A65]">Yesterday, 7:35 PM</span>
                          </div>
                          <p className="text-[#5A5A65]">
                            "Aarav solved 8 out of 9 challenging 5-mark board numericals independently. His understanding of Fleming’s Right-Hand rule is now rock-solid. Assigned 3 past-paper questions for Thursday."
                          </p>
                          <div className="flex items-center gap-2 pt-1 border-t border-[#E5E5EB] text-[9px] text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Homework Verified: Grade A+ (100% correct)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Phone Navigation */}
                  <div className="pt-3 border-t border-[#E5E5EB] flex items-center justify-around text-[9px] font-heading font-semibold text-[#5A5A65]">
                    <span className="text-[#310064]">● Dashboard</span>
                    <span>Schedule</span>
                    <span>Resources</span>
                    <span>Help</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
