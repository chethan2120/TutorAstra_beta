'use client';

import React, { useState } from 'react';
import { BookOpen, GraduationCap, ArrowRight, Award, Compass, CheckCircle2, ChevronRight } from 'lucide-react';

interface StagePathway {
  id: string;
  stageName: string;
  grades: string;
  focus: string;
  description: string;
  subjects: string[];
  milestones: string[];
  scheduleFormat: string;
  boardsSupported: string;
}

const PATHWAYS: StagePathway[] = [
  {
    id: 'middle-school',
    stageName: 'Middle School Foundations',
    grades: 'Grades 6 – 8 (British Years 7 – 9)',
    focus: 'Conceptual Stamina & Curiosity',
    description:
      'We eliminate rote memorization early by building deep conceptual fluency in Mathematics and Science, preparing students for upper-school academic intensity.',
    subjects: ['Mathematics & Logic', 'Integrated Science (Bio/Chem/Phys)', 'English Comprehension', 'AI Literacy & Coding Basics'],
    milestones: [
      'Diagnostic baseline test to eliminate elementary knowledge gaps',
      'Hands-on problem solving rather than repetitive textbook drills',
      'Term capstone investigations to foster active independent thinking',
      'Confidence building ahead of secondary board transitions'
    ],
    scheduleFormat: '2 to 3 Live 1-on-1 Sessions Weekly + Dedicated Doubt Slot',
    boardsSupported: 'CBSE (NCERT), Cambridge Lower Secondary (KS3), ICSE, IB MYP'
  },
  {
    id: 'secondary',
    stageName: 'Secondary Board Examination Prep',
    grades: 'Grades 9 – 10 (British Years 10 – 11)',
    focus: 'Exam Precision & Analytical Depth',
    description:
      'Master the exact marking rubrics, structured step-by-step derivations, and high-yield question patterns required for 95%+ board examination results.',
    subjects: ['Advanced Mathematics', 'Physics & Numerical Mechanics', 'Chemistry & Reaction Stoichiometry', 'Biology & Genetics', 'English Literature'],
    milestones: [
      'Chapter-by-chapter past-paper dissection under timed conditions',
      'Step-by-step presentation training to eliminate minor calculation slips',
      'Full-syllabus mock examinations aligned with real board timetables',
      'Personalized formula cheat-sheets and review roadmaps'
    ],
    scheduleFormat: '3 to 4 Live 1-on-1 Sessions Weekly + Weekly Marked Past Papers',
    boardsSupported: 'CBSE Class 10 Board, Cambridge IGCSE, ICSE Class 10'
  },
  {
    id: 'senior-secondary',
    stageName: 'Senior Secondary & Pre-University',
    grades: 'Grades 11 – 12 (British Years 12 – 13)',
    focus: 'Advanced Specialization & Higher Education',
    description:
      'Rigorous subject-specialist tutoring for senior high school students tackling differential calculus, physical chemistry, electrodynamics, and competitive entrance fundamentals.',
    subjects: ['Pure & Applied Mathematics', 'Classical & Modern Physics', 'Organic & Physical Chemistry', 'Cellular & Molecular Biology', 'Computer Science (Python)'],
    milestones: [
      'Complex multi-concept problem solving spanning multiple chapters',
      'Rigorous preparation for school finals, Board exams & entrance basics',
      'Personal mentorship from subject authorities with master’s credentials',
      'Comprehensive term reporting shared with parents and college counselors'
    ],
    scheduleFormat: '4 Live 1-on-1 Sessions Weekly + On-Demand Mentor Doubt Access',
    boardsSupported: 'CBSE Class 12 Boards, Cambridge A-Levels, IB Diploma Programme (HL/SL)'
  }
];

export default function CurriculumPathwaySection() {
  const [selectedStage, setSelectedStage] = useState<string>('secondary');
  const activePathway = PATHWAYS.find((p) => p.id === selectedStage) || PATHWAYS[1];

  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F8F4FE] border-b border-[#ECE3FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
            <span>Academic Pathways</span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
            Tailored Roadmaps for Every <br className="hidden sm:inline" />
            <span className="text-[#310064]">Stage of Your Child's Education.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#5A5A65] font-sans leading-relaxed">
            Whether building fundamental curiosity in middle school or aiming for top marks in secondary board examinations, our tutors adapt directly to your child's curriculum requirements.
          </p>
        </div>

        {/* 3 Stage Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PATHWAYS.map((p) => {
            const isSelected = selectedStage === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedStage(p.id)}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#310064] text-white border-[#310064] shadow-md scale-[1.02]'
                    : 'bg-white text-[#1E1E24] border-[#E5E5EB] hover:border-[#310064]/30 hover:bg-[#FAF8FD]'
                }`}
              >
                <div>
                  <span
                    className={`text-[11px] font-heading font-bold uppercase tracking-wider block mb-1.5 ${
                      isSelected ? 'text-[#F4CC45]' : 'text-[#310064]'
                    }`}
                  >
                    {p.grades}
                  </span>
                  <h3 className="font-heading font-bold text-lg leading-snug">
                    {p.stageName}
                  </h3>
                </div>

                <div
                  className={`mt-4 pt-3 border-t text-xs font-medium flex items-center justify-between ${
                    isSelected ? 'border-white/20 text-neutral-200' : 'border-[#E5E5EB] text-[#5A5A65]'
                  }`}
                >
                  <span>{p.focus}</span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#F4CC45]' : 'text-[#310064]'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="bg-white rounded-2xl p-6 sm:p-9 border border-[#ECE3FA] shadow-sm space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E5E5EB]">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-xs font-heading font-bold text-[#310064] uppercase tracking-wider bg-[#F5F0FF] px-2.5 py-1 rounded">
                {activePathway.grades} • Roadmap Overview
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-[#1E1E24] pt-1">
                {activePathway.stageName}
              </h3>
              <p className="text-xs sm:text-sm text-[#5A5A65] font-sans leading-relaxed">
                {activePathway.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#FDE68A] text-xs space-y-1 shrink-0">
              <span className="font-bold text-[#92400E] block uppercase tracking-wider text-[10px]">
                Boards & Syllabi Supported
              </span>
              <p className="font-semibold text-[#1E1E24]">
                {activePathway.boardsSupported}
              </p>
            </div>
          </div>

          {/* Subjects & Milestones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Subjects Covered */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-[#1E1E24] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#310064]" />
                <span>Primary Focus Subjects</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activePathway.subjects.map((subj, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#FAF8FD] border border-[#EBE4F6] text-xs font-semibold text-[#1E1E24] flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
                    <span>{subj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Academic Milestones */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-[#1E1E24] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#310064]" />
                <span>Core Academic Milestones</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#5A5A65] font-sans">
                {activePathway.milestones.map((milestone, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
                    <span>{milestone}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Cadence & CTA */}
          <div className="pt-6 border-t border-[#E5E5EB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#5A5A65] font-sans">
              <strong className="text-[#1E1E24]">Standard Cadence:</strong> {activePathway.scheduleFormat}
            </div>

            <a
              href="#consultation"
              onClick={scrollToConsultation}
              className="btn-primary text-xs sm:text-sm font-heading font-semibold"
            >
              <span>Book Consultation for this Grade</span>
              <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
