'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

interface HeroSlide {
  id: number;
  stage: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryCtaText: string;
  primaryCtaTarget: string;
  secondaryCtaText: string;
  secondaryCtaTarget: string;
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides: HeroSlide[] = [
    {
      id: 1,
      stage: 'Step 1 of 3 • Dedicated Mentorship',
      headline: 'Personalised One-to-One Tutoring for Real Academic Growth.',
      description:
        'Connect directly with vetted subject authorities who identify concept gaps, adapt to your pace, and build genuine understanding.',
      image: '/hero-slide-1.jpg',
      imageAlt: 'Female academic tutor teaching a high school student in a navy hoodie with an open laptop',
      primaryCtaText: 'Book a Free Consultation',
      primaryCtaTarget: '#consultation',
      secondaryCtaText: 'How It Works',
      secondaryCtaTarget: '#how-it-works',
    },
    {
      id: 2,
      stage: 'Step 2 of 3 • Independent Mastery',
      headline: 'Build Confident Study Habits with Targeted Guidance.',
      description:
        'Structured weekly practice and diagnostic checkpoints help students master difficult topics before exams approach.',
      image: '/hero-slide-2.jpg',
      imageAlt: 'High school student in navy hoodie studying independently at a clean desk with books and laptop',
      primaryCtaText: 'Explore Subjects',
      primaryCtaTarget: '#subjects',
      secondaryCtaText: 'Try AI Tutor Tool',
      secondaryCtaTarget: '#ai-tutor',
    },
    {
      id: 3,
      stage: 'Step 3 of 3 • Measurable Success',
      headline: 'Achieve Exam Excellence and Reach Your Full Potential.',
      description:
        'Celebrate clear milestones and top grades with personalised study roadmaps crafted specifically for your ambitions.',
      image: '/hero-slide-3.jpg',
      imageAlt: 'Student holding marked exam paper stamped A-plus with a confident smile',
      primaryCtaText: 'Start Your Learning Journey',
      primaryCtaTarget: '#consultation',
      secondaryCtaText: 'View Parent Reviews',
      secondaryCtaTarget: '#testimonials',
    },
  ];

  // Auto-advance carousel every 6 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const active = slides[currentSlide];

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    const id = target.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stats data requested by user
  const stats = [
    {
      number: '10K+',
      label: 'Happy Students',
      detail: 'Across Grades 6–12 & British Syllabi',
      icon: GraduationCap,
      color: '#310064',
      bg: '#F5F0FF',
    },
    {
      number: '100K+',
      label: 'Learning Classes',
      detail: 'Live 1-on-1 Sessions Conducted',
      icon: BookOpen,
      color: '#310064',
      bg: '#FBFBFC',
    },
    {
      number: '300+',
      label: 'Expert Tutors',
      detail: 'Top 2% Vetted Subject Authorities',
      icon: Award,
      color: '#B8860B',
      bg: '#FFF9E6',
    },
    {
      number: '98%',
      label: 'Success Rate',
      detail: 'Concept Mastery & Score Improvement',
      icon: TrendingUp,
      color: '#166534',
      bg: '#F0FDF4',
    },
  ];

  return (
    <section
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-12 sm:py-16 lg:py-20 bg-white border-b border-[#E5E5EB] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ================= Left Column: Headline, Copy & Actions (6 cols) ================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Stage Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FBFBFC] border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
              <span>{active.stage}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1E1E24] tracking-tight leading-[1.18] min-h-[3.6em] sm:min-h-[2.4em] flex items-center">
              {active.headline}
            </h1>

            {/* Concise Supporting Description (2 sentences or fewer) */}
            <p className="text-base sm:text-lg text-[#5A5A65] font-normal leading-relaxed max-w-xl">
              {active.description}
            </p>

            {/* Actions (Consistent Button System) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={active.primaryCtaTarget}
                onClick={(e) => scrollTo(e, active.primaryCtaTarget)}
                className="btn-primary text-sm font-heading font-semibold"
              >
                <span>{active.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={active.secondaryCtaTarget}
                onClick={(e) => scrollTo(e, active.secondaryCtaTarget)}
                className="btn-secondary text-sm font-heading font-semibold"
              >
                <span>{active.secondaryCtaText}</span>
              </a>
            </div>

            {/* Carousel Navigation Bar */}
            <div className="pt-6 border-t border-[#E5E5EB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Jump to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      currentSlide === idx
                        ? 'w-8 bg-[#310064]'
                        : 'w-2.5 bg-[#E5E5EB] hover:bg-[#D1D1DB]'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous slide"
                  className="w-9 h-9 rounded-md border border-[#E5E5EB] bg-white hover:bg-[#F5F5F7] text-[#1E1E24] flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next slide"
                  className="w-9 h-9 rounded-md border border-[#E5E5EB] bg-white hover:bg-[#F5F5F7] text-[#1E1E24] flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ================= Right Column: High Quality Photography with Floating 2D Badges (6 cols) ================= */}
          <div className="lg:col-span-6 relative">
            {/* 2D Floating Badge: 1-on-1 Tutoring (Top-Left) */}
            <div className="hidden sm:flex absolute -top-4 -left-4 z-20 items-center gap-2.5 px-3.5 py-2 rounded-lg bg-white/95 backdrop-blur-md border border-[#E5E5EB] shadow-md animate-float-slow">
              <div className="w-8 h-8 rounded-md bg-[#F5F0FF] text-[#310064] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#F4CC45]" />
              </div>
              <div>
                <p className="text-xs font-heading font-bold text-[#1E1E24]">One Teacher, One Student</p>
                <p className="text-[11px] text-[#5A5A65]">100% Dedicated Attention</p>
              </div>
            </div>

            {/* 2D Floating Badge: Top 2% Tutors (Bottom-Right) */}
            <div className="hidden sm:flex absolute -bottom-4 -right-4 z-20 items-center gap-2.5 px-3.5 py-2 rounded-lg bg-white/95 backdrop-blur-md border border-[#E5E5EB] shadow-md animate-float-reverse">
              <div className="w-8 h-8 rounded-md bg-[#FFF9E6] text-[#B8860B] flex items-center justify-center font-bold text-xs">
                ⭐
              </div>
              <div>
                <p className="text-xs font-heading font-bold text-[#1E1E24]">Top 2% Vetted Tutors</p>
                <p className="text-[11px] text-[#5A5A65]">Subject-Matter Authorities</p>
              </div>
            </div>

            {/* 2D Floating Chip: Diagnostic (Bottom-Left) */}
            <div className="hidden lg:flex absolute bottom-8 -left-5 z-20 items-center gap-2 px-3 py-1.5 rounded-md bg-white/95 backdrop-blur-md border border-[#E5E5EB] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-sans font-semibold text-[#1E1E24]">Customised Study Plans</span>
            </div>

            {/* Main Photographic Frame */}
            <div className="relative rounded-xl overflow-hidden border border-[#E5E5EB] bg-[#FBFBFC] shadow-card aspect-[16/10] sm:aspect-[16/10]">
              <img
                key={active.image}
                src={active.image}
                alt={active.imageAlt}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>
        </div>

        {/* ================= Stats Counter Bar below Hero Section ================= */}
        <div className="mt-14 pt-10 border-t border-[#E5E5EB]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="card-standard p-5 sm:p-6 bg-white hover:border-[#310064]/30 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#E5E5EB]"
                      style={{ backgroundColor: stat.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#6A6A76] bg-[#F5F5F7] px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#310064] tracking-tight group-hover:scale-105 transition-transform duration-200 origin-left">
                      {stat.number}
                    </div>
                    <h3 className="text-sm font-heading font-bold text-[#1E1E24] mt-1">
                      {stat.label}
                    </h3>
                    <p className="text-xs text-[#5A5A65] font-sans mt-0.5 leading-relaxed">
                      {stat.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
