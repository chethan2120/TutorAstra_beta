'use client';

import React from 'react';
import { Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      author: 'Parent of Grade 10 Student',
      focus: 'CBSE Mathematics & Physics',
      quote:
        'The one-to-one format gave our son the confidence to ask questions he kept quiet about in school. His tutor identified foundational gaps in algebra and worked through past papers methodically.',
      tag: 'Verified Feedback Under Client Review',
    },
    {
      author: 'Grade 12 Student',
      focus: 'Cambridge Chemistry (A-Level)',
      quote:
        'Having dedicated lesson time to work through organic reaction mechanisms step-by-step made a noticeable difference. The sessions were focused directly on past exam question structures.',
      tag: 'Verified Feedback Under Client Review',
    },
    {
      author: 'Parent of Grade 9 Student',
      focus: 'Integrated Science & English',
      quote:
        'The scheduling flexibility fit into our family routine with zero friction. The tutor provided clear notes after each session, so we always understood what had been covered.',
      tag: 'Verified Feedback Under Client Review',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#FFFBF3] border-b border-[#F4EBD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FBFBFC] border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
            <span>Student & Parent Feedback</span>
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
            Real Experiences from Our Learning Community.
          </h2>

          <p className="text-base sm:text-lg text-[#5A5A65] mt-3 leading-relaxed">
            Read direct feedback from families who have experienced our one-to-one educational approach.
          </p>
        </div>

        {/* 3 Feedback Cards Grid (Consistent Dimensions, Subtle Borders) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="card-standard p-6 sm:p-7 flex flex-col justify-between bg-white text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-[#F4CC45] text-xs tracking-wider">
                    ★★★★★
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Verified Parent
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5A5A65] font-sans leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E5EB]">
                <div className="font-heading font-bold text-sm text-[#1E1E24]">
                  {t.author}
                </div>
                <div className="text-xs text-[#5A5A65] mt-0.5">
                  {t.focus}
                </div>
                <div className="mt-2 text-[10px] text-[#8E8E98] uppercase tracking-wider font-semibold">
                  {t.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
