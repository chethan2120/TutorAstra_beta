'use client';

import React from 'react';
import { Target, Lightbulb, GraduationCap, ClipboardCheck, ArrowRight, MessageSquare } from 'lucide-react';

export default function LearningBenefitsSection() {
  const pillars = [
    {
      badge: 'Outcomes focus',
      badgeBg: '#F0FDF4',
      badgeColor: '#166534',
      icon: Target,
      iconColor: '#166534',
      iconBg: '#F0FDF4',
      iconBorder: '#BBF7D0',
      title: 'Goal-Focused Preparation',
      description:
        'Prepare students for school examinations, board examinations, and important academic milestones with structured practice.',
    },
    {
      badge: 'Depth of support',
      badgeBg: '#FFFBEB',
      badgeColor: '#92400E',
      icon: Lightbulb,
      iconColor: '#D97706',
      iconBg: '#FFFBEB',
      iconBorder: '#FDE68A',
      title: 'Conceptual Learning',
      description:
        'Focus on understanding fundamentals rather than rote memorisation, so students can confidently apply what they learn.',
    },
    {
      badge: 'Faculty credibility',
      badgeBg: '#F5F0FF',
      badgeColor: '#310064',
      icon: GraduationCap,
      iconColor: '#310064',
      iconBg: '#F5F0FF',
      iconBorder: '#DDD6FE',
      title: 'Qualified Teaching Support',
      description:
        'Learn with tutors who bring deep subject knowledge, clear explanations, and a patient, student-focused approach.',
    },
    {
      badge: 'Accountability',
      badgeBg: '#EFF6FF',
      badgeColor: '#1E40AF',
      icon: ClipboardCheck,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      iconBorder: '#BFDBFE',
      title: 'Progress Parents Can Follow',
      description:
        'Keep track of learning through regular assessments, mentor feedback, and transparent updates on academic development.',
    },
  ];

  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-16 lg:py-24 bg-[#FFFDF7] border-b border-[#EFE8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Banner: Talk to our academic team for personalised guidance (Deep Royal Purple & Gold Theme) */}
        <div className="rounded-2xl p-6 sm:p-7 bg-[#310064] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-[#430080] relative overflow-hidden">
          {/* Subtle 2D background grid texture */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 space-y-1 text-center md:text-left">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-snug">
              Talk to our academic team for{' '}
              <span className="text-[#F4CC45] italic font-serif">personalised guidance.</span>
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 font-sans max-w-xl">
              Get an honest assessment of your child’s academic goals and discover our tailored 1-on-1 tutoring roadmap.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              href="#consultation"
              onClick={scrollToConsultation}
              className="px-6 py-3 rounded-lg text-sm font-heading font-bold bg-[#F4CC45] text-[#310064] hover:bg-[#F6D55E] transition-all shadow-md inline-flex items-center gap-2 group"
            >
              <span>Talk to Our Academic Team</span>
              <ArrowRight className="w-4 h-4 text-[#310064] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* 4 Cards Grid (Exact structure with Warm Tinted Borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-[#EFE8D8] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Top Pill Badge */}
                  <div className="mb-4">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold font-sans"
                      style={{
                        backgroundColor: item.badgeBg,
                        color: item.badgeColor,
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon in Rounded Container */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: item.iconBg,
                      borderColor: item.iconBorder,
                    }}
                  >
                    <Icon className="w-6 h-6 stroke-[1.8]" style={{ color: item.iconColor }} />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg text-[#1E1E24] leading-snug mb-2.5">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#5A5A65] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
