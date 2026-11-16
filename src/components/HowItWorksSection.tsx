'use client';

import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Book a Consultation',
      description:
        'Tell us about your student’s current grade, school curriculum, upcoming examinations, and specific learning priorities.',
      detail: 'Free 20-minute discovery call with an academic advisor.',
    },
    {
      number: '02',
      title: 'Diagnostic Review & Tutor Match',
      description:
        'We review current understanding, identify foundational concept gaps, and match your student with a verified subject specialist.',
      detail: 'Handpicked mentor matched to learning rhythm and board syllabus.',
    },
    {
      number: '03',
      title: 'Begin One-to-One Learning',
      description:
        'Start regular live sessions with customised study plans, interactive problem-solving, and continuous progress updates.',
      detail: 'Flexible scheduling with ongoing parent transparency.',
    },
  ];

  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#ECE6DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
            <span>Process</span>
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
            A Transparent Three-Step Pathway to Better Grades.
          </h2>

          <p className="text-base sm:text-lg text-[#5A5A65] mt-3 leading-relaxed">
            From initial consultation to regular classes, every step is structured to ensure your child receives the right support.
          </p>
        </div>

        {/* 3-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="card-standard p-6 sm:p-7 flex flex-col justify-between bg-white"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading font-bold text-2xl text-[#310064]">
                    {step.number}
                  </span>
                  <span className="text-xs font-heading font-semibold text-[#5A5A65] bg-[#F5F5F7] px-2.5 py-1 rounded">
                    Step {step.number}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-[#1E1E24] leading-snug mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-[#5A5A65] leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E5EB] flex items-center gap-2 text-xs text-[#1E1E24] font-medium">
                <Check className="w-4 h-4 text-[#310064] shrink-0" />
                <span>{step.detail}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center sm:text-left">
          <a
            href="#consultation"
            onClick={scrollToConsultation}
            className="btn-primary text-sm font-heading font-semibold inline-flex"
          >
            <span>Begin Step 1: Book Your Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
