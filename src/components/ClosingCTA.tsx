'use client';

import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ClosingCTA() {
  return (
    <section className="relative overflow-hidden py-20 bg-[#FBFBFC] border-t border-[#E5E5EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#E5E5EB] text-[#310064] text-xs font-heading font-semibold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#310064]" />
          <span>Your Ambition. Our Mission.</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#1E1E24] tracking-tight leading-tight">
          Your Ambition Deserves the{' '}
          <span className="text-[#310064]">
            Right Guidance.
          </span>
        </h2>

        {/* Supporting Text */}
        <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed font-sans">
          Take the first step towards a focused learning journey. Connect with our academic advisors and discover the advantages of dedicated one-to-one education.
        </p>

        {/* CTA Button */}
        <div className="pt-2">
          <a
            href="/#consultation"
            className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-sm font-heading font-semibold"
          >
            <span>Book Your Free Consultation</span>
            <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
          </a>
        </div>

        {/* Reassurance Features */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-sans text-neutral-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#310064]" />
            <span>Complimentary 20-min consultation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#310064]" />
            <span>Dedicated 1-on-1 tutor matching</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#310064]" />
            <span>Tailored pacing & school syllabus</span>
          </div>
        </div>
      </div>
    </section>
  );
}
