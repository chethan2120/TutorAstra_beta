'use client';

import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function WhyTutorAstraSection() {
  const advantages = [
    {
      title: 'Targeted Gap Remediation',
      description: 'We pinpoint exact concept bottlenecks and resolve them before they affect upcoming school tests.',
    },
    {
      title: 'Carefully Vetted Educators',
      description: 'Mentors are selected for deep subject expertise, clear explanations, and patient teaching styles.',
    },
    {
      title: 'Time-Efficient Learning',
      description: 'One hour of focused 1-on-1 instruction accomplishes more than hours of passive video watching.',
    },
    {
      title: 'Transparent Parent Updates',
      description: 'Parents receive regular written updates covering topics mastered, homework progress, and next steps.',
    },
  ];

  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-16 lg:py-24 bg-[#FFFFFF] border-b border-[#E5E5EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Narrative & Core Philosophy (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FBFBFC] border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
              <span>Why TutorAstra</span>
            </div>

            <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
              Personalised Support Where Classrooms Fall Short.
            </h2>

            <p className="text-base text-[#5A5A65] leading-relaxed">
              In a crowded classroom, teachers must pace lessons to the median. Students with specific doubt areas often hesitate to ask questions and fall behind.
            </p>

            <p className="text-base text-[#5A5A65] leading-relaxed">
              TutorAstra places your student in direct partnership with an experienced mentor. Every lesson is customized to their exact school syllabus and learning speed.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm font-medium text-[#1E1E24]">
                <Check className="w-4 h-4 text-[#310064] shrink-0" />
                <span>One teacher dedicated entirely to one student</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-[#1E1E24]">
                <Check className="w-4 h-4 text-[#310064] shrink-0" />
                <span>Paced to school test schedules and board requirements</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-[#1E1E24]">
                <Check className="w-4 h-4 text-[#310064] shrink-0" />
                <span>Convenient online scheduling with zero commute</span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#consultation"
                onClick={scrollToConsultation}
                className="btn-primary text-sm font-heading font-semibold inline-flex"
              >
                <span>Book a Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: 4 Key Advantages (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {advantages.map((item, idx) => (
              <div
                key={item.title}
                className="card-standard p-6 bg-white flex flex-col justify-between"
              >
                <div>
                  <span className="font-heading font-bold text-xs text-[#310064] bg-[#F5F5F7] px-2 py-0.5 rounded">
                    Benefit 0{idx + 1}
                  </span>

                  <h3 className="font-heading font-bold text-lg text-[#1E1E24] leading-snug mt-3 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#5A5A65] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064]">
                  Verified Benefit
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
