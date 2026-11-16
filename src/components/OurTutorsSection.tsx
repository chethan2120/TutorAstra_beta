'use client';

import React from 'react';
import {
  Award,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  BookOpen,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function OurTutorsSection() {
  const tutors = [
    {
      name: 'Dr. Rajesh Sharma',
      role: 'Senior Physics & Mathematics Authority',
      education: 'Ph.D. Applied Physics • 12+ Yrs Experience',
      curriculum: 'CBSE, ICSE, Cambridge A-Levels & JEE',
      focus: 'Calculus, Electromagnetism, Kinematics & Board Problem-Solving',
      avatarBg: 'bg-[#F2ECFC] text-[#310064]',
      initials: 'RS',
      rating: '4.96',
      reviews: '142 reviews',
      sessions: '1,850+ 1-on-1 Hours',
    },
    {
      name: 'Dr. Priya Venkatesh',
      role: 'Senior Chemistry & STEM Lead',
      education: 'Ph.D. Organic Chemistry • Gold Medalist',
      curriculum: 'CBSE, ISC, Cambridge IGCSE & NEET Chemistry',
      focus: 'Organic Reaction Mechanisms, Stoichiometry & Chemical Bonding',
      avatarBg: 'bg-[#FFF7E0] text-[#8C6D00]',
      initials: 'PV',
      rating: '4.98',
      reviews: '178 reviews',
      sessions: '2,100+ 1-on-1 Hours',
    },
    {
      name: 'Ananya Sen, M.Sc.',
      role: 'Lead Biology & Pre-Med Specialist',
      education: 'M.Sc. Molecular Genetics • Cambridge Certified',
      curriculum: 'CBSE Class 10/12, IGCSE & IB HL Biology',
      focus: 'Genetics, Cellular Metabolism, Physiology & Diagram Accuracy',
      avatarBg: 'bg-[#F2ECFC] text-[#310064]',
      initials: 'AS',
      rating: '4.94',
      reviews: '124 reviews',
      sessions: '1,450+ 1-on-1 Hours',
    },
    {
      name: 'David Sterling, M.A.',
      role: 'Senior English & Critical Rhetoric Mentor',
      education: 'M.A. English (Oxford Alumni) • Former IB Examiner',
      curriculum: 'IB DP, IGCSE First Language English, ICSE Literature',
      focus: 'Analytical Essay Structuring, Rhetorical Devices & Prose Mastery',
      avatarBg: 'bg-[#F5F5F7] text-[#1E1E24]',
      initials: 'DS',
      rating: '4.95',
      reviews: '136 reviews',
      sessions: '1,600+ 1-on-1 Hours',
    },
  ];

  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="our-tutors" className="py-16 lg:py-24 bg-[#FFFDF8] border-b border-[#EFE8D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
            <span>Top 2% Vetted Faculty</span>
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
            Learn from Verified Mentors Who Inspire Real Confidence.
          </h2>

          <p className="text-base sm:text-lg text-[#5A5A65] leading-relaxed">
            More than instructors, our educators are dedicated academic mentors. Every tutor passes strict subject proficiency evaluations, pedagogy auditions, and background checks before conducting a single 1-on-1 session.
          </p>
        </div>

        {/* 4 Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tutor) => (
            <div
              key={tutor.name}
              className="card-standard p-6 flex flex-col justify-between group hover:border-[#310064]/40 transition-all bg-white"
            >
              <div>
                {/* Avatar + Rating Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-13 h-13 w-12 h-12 rounded-xl ${tutor.avatarBg} font-heading font-bold text-base flex items-center justify-center shrink-0 border border-[#E5E5EB] shadow-xs`}
                  >
                    {tutor.initials}
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFF9E6] border border-[#F4CC45]/40 text-xs font-heading font-bold text-[#8C6D00]">
                    <Star className="w-3.5 h-3.5 fill-[#F4CC45] text-[#F4CC45]" />
                    <span>{tutor.rating}</span>
                    <span className="text-[10px] text-[#7A621C] font-normal">({tutor.reviews})</span>
                  </div>
                </div>

                {/* Tutor Info */}
                <h3 className="text-lg font-heading font-bold text-[#1E1E24] group-hover:text-[#310064] transition-colors leading-snug">
                  {tutor.name}
                </h3>
                <p className="text-xs font-heading font-semibold text-[#310064] mt-0.5 mb-3">
                  {tutor.role}
                </p>

                <div className="text-xs text-[#5A5A65] space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-[#310064] shrink-0" />
                    <span>{tutor.education}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-[#310064] shrink-0" />
                    <span>{tutor.curriculum}</span>
                  </div>
                </div>

                {/* Subject Focus Area */}
                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#ECE6DA] text-xs text-[#5A5A65] leading-relaxed mb-4">
                  <strong className="text-[#1E1E24] block mb-0.5 font-heading">Core Strengths:</strong>
                  {tutor.focus}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3.5 border-t border-[#E5E5EB] flex items-center justify-between text-xs">
                <span className="text-[#5A5A65] font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#310064]" />
                  {tutor.sessions}
                </span>
                <span className="text-[10px] font-heading font-semibold text-[#310064] bg-[#F2ECFC] px-2 py-0.5 rounded border border-[#E0D3F5]">
                  Verified 1:1 Faculty
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Rigorous Vetting Process Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-xl bg-white border border-[#E5E5EB] shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#310064] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#F4CC45]" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#1E1E24]">
                  TutorAstra 4-Stage Faculty Vetting Standard
                </h4>
                <p className="text-xs text-[#5A5A65]">
                  Only 2 out of every 100 educator applicants are accepted into our 1-on-1 teaching network.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#1E1E24]">
                <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0" />
                <span>Subject Exam</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#1E1E24]">
                <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0" />
                <span>Live Audition</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#1E1E24]">
                <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0" />
                <span>Board Vetting</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#1E1E24]">
                <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0" />
                <span>Parent Feedback</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="#consultation"
            onClick={scrollToConsultation}
            className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-semibold"
          >
            <span>Match with Your Dedicated Subject Mentor</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
