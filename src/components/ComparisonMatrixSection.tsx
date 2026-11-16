'use client';

import React from 'react';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function ComparisonMatrixSection() {
  const criteria = [
    {
      feature: 'Attention & Class Size',
      tutorAstra: '100% Dedicated 1-on-1 (Strictly 1 Student, 1 Teacher)',
      tutorAstraWin: true,
      coachingBatch: '30 to 60 students per batch (Median pacing)',
      coachingWin: false,
      videoApps: '0 Human attention (Passive pre-recorded videos)',
      videoWin: false,
    },
    {
      feature: 'Doubt Resolution',
      tutorAstra: 'Immediate real-time clearance; no fear of asking questions',
      tutorAstraWin: true,
      coachingBatch: 'Queued at end of class or ignored due to peer hesitation',
      coachingWin: false,
      videoApps: 'Generic automated chatbots with no custom context',
      videoWin: false,
    },
    {
      feature: 'Syllabus & Test Pacing',
      tutorAstra: 'Customised directly to your child’s school exam calendar',
      tutorAstraWin: true,
      coachingBatch: 'Fixed institute schedule regardless of school syllabus',
      coachingWin: false,
      videoApps: 'Static playlist; self-guided with high dropout rates',
      videoWin: false,
    },
    {
      feature: 'Educator Accountability',
      tutorAstra: 'Top 2% vetted subject specialists matched to learning style',
      tutorAstraWin: true,
      coachingBatch: 'Lecturers vary widely in quality and cannot adapt',
      coachingWin: false,
      videoApps: 'No personal tutor relationship or accountability',
      videoWin: false,
    },
    {
      feature: 'Parent Visibility',
      tutorAstra: 'Weekly written mentor notes & transparent progress reports',
      tutorAstraWin: true,
      coachingBatch: 'Quarterly group parent meetings with generic marks',
      coachingWin: false,
      videoApps: 'Only app open-time statistics; zero qualitative insight',
      videoWin: false,
    },
  ];

  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-[#E5E5EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FBFBFC] border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
            <span>Format Comparison</span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
            Why Dedicated One-to-One Outperforms <br className="hidden sm:inline" />
            <span className="text-[#310064]">Crowded 30-Student Coaching Batches.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#5A5A65] font-sans leading-relaxed">
            Education is not one-size-fits-all. See how personalized 1-on-1 instruction delivers faster breakthroughs compared to traditional mass classrooms and generic video apps.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="card-standard bg-white border border-[#E5E5EB] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E5E5EB] bg-[#FAF8FD]">
                  <th className="py-4 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#1E1E24] w-1/4">
                    Learning Dimension
                  </th>
                  <th className="py-4 px-6 text-xs font-heading font-extrabold uppercase tracking-wider text-white bg-[#310064] w-1/3 relative">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#F4CC45]" />
                        <span>TutorAstra (1-on-1)</span>
                      </span>
                      <span className="text-[10px] bg-[#F4CC45] text-[#310064] px-2 py-0.5 rounded font-extrabold">
                        Recommended
                      </span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#5A5A65] w-1/4">
                    Group Coaching Batches
                  </th>
                  <th className="py-4 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#8E8E98] w-1/6">
                    Pre-Recorded Videos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5EB] text-xs sm:text-sm font-sans">
                {criteria.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FCFAFF] transition-colors">
                    <td className="py-4 px-6 font-heading font-bold text-[#1E1E24]">
                      {item.feature}
                    </td>
                    <td className="py-4 px-6 bg-[#FAF7FE] text-[#1E1E24] font-medium border-x border-[#EBE4F6]">
                      <div className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold text-[#1E1E24]">{item.tutorAstra}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#5A5A65]">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{item.coachingBatch}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#8E8E98]">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                        <span>{item.videoApps}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Summary Bar inside table */}
          <div className="p-5 sm:p-6 bg-[#FAF8FD] border-t border-[#E5E5EB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-[#5A5A65]">
              <ShieldCheck className="w-5 h-5 text-[#310064] shrink-0" />
              <span>
                <strong>TutorAstra Commitment:</strong> If your student does not connect with their tutor after the first session, we reassign immediately with zero hassle.
              </span>
            </div>
            <a
              href="#consultation"
              onClick={scrollToConsultation}
              className="btn-primary text-xs sm:text-sm font-heading font-semibold whitespace-nowrap"
            >
              <span>Experience the 1-on-1 Difference</span>
              <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
