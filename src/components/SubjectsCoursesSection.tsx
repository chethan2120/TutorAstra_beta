'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Microscope,
  BookOpen,
  Laptop,
  ArrowRight,
  Check,
  X
} from 'lucide-react';

interface SubjectItem {
  id: string;
  name: string;
  grades: string;
  description: string;
  icon: any;
  keyTopics: string[];
  curricula: string;
}

export default function SubjectsCoursesSection() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);

  const subjects: SubjectItem[] = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      grades: 'Grades 9–12',
      description: 'Master algebra, coordinate geometry, calculus, and probability through structured problem-solving.',
      icon: Calculator,
      keyTopics: ['Algebra & Polynomials', 'Trigonometry & Geometry', 'Differential Calculus', 'Applied Probability'],
      curricula: 'CBSE, Cambridge IGCSE / A-Levels, IB DP',
    },
    {
      id: 'physics',
      name: 'Physics',
      grades: 'Grades 9–12',
      description: 'Build intuition for mechanics, thermodynamics, electromagnetism, and optics through visual proofs.',
      icon: Atom,
      keyTopics: ['Kinematics & Dynamics', 'Work, Energy & Power', 'Electromagnetism', 'Wave Motion & Optics'],
      curricula: 'CBSE, Cambridge IGCSE / A-Levels, IB DP',
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      grades: 'Grades 9–12',
      description: 'Understand reaction pathways, chemical bonding, stoichiometry, and organic reaction mechanisms.',
      icon: FlaskConical,
      keyTopics: ['Atomic Structure & Periodic Trends', 'Stoichiometry & Solutions', 'Chemical Thermodynamics', 'Organic Mechanisms'],
      curricula: 'CBSE, Cambridge IGCSE / A-Levels, IB DP',
    },
    {
      id: 'biology',
      name: 'Biology',
      grades: 'Grades 9–12',
      description: 'Explore molecular genetics, human organ physiology, cellular biology, and ecological systems.',
      icon: Dna,
      keyTopics: ['Cellular Structure & Transport', 'Molecular Genetics', 'Human Body Systems', 'Evolutionary Ecology'],
      curricula: 'CBSE, Cambridge IGCSE / A-Levels, IB DP',
    },
    {
      id: 'science',
      name: 'Integrated Science',
      grades: 'Grades 9–10',
      description: 'Establish foundational scientific analytical skills combining physics, chemistry, and biology principles.',
      icon: Microscope,
      keyTopics: ['Matter & Energy Dynamics', 'Living Organisms & Processes', 'Earth & Environmental Systems', 'Scientific Inquiry Methods'],
      curricula: 'Middle School & Early Secondary Frameworks',
    },
    {
      id: 'english',
      name: 'English & Literature',
      grades: 'Grades 9–12',
      description: 'Develop structured essay arguments, advanced textual analysis, reading comprehension, and rhetoric.',
      icon: BookOpen,
      keyTopics: ['Persuasive Essay Writing', 'Literary Textual Criticism', 'Reading Comprehension', 'Grammar & Syntax Precision'],
      curricula: 'CBSE English, Cambridge First Language, IB Literature',
    },
    {
      id: 'computer-science',
      name: 'Computer Science',
      grades: 'Grades 9–12',
      description: 'Learn foundational programming, algorithmic problem-solving, and computational thinking using Python.',
      icon: Laptop,
      keyTopics: ['Python Syntax & Structures', 'Algorithms & Flow Control', 'Data Representation', 'Object-Oriented Basics'],
      curricula: 'Secondary Computer Science Syllabi',
    },
  ];

  const handleConsultationClick = () => {
    setSelectedSubject(null);
    const el = document.getElementById('consultation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="subjects" className="py-16 lg:py-24 bg-[#F7F2FE] border-b border-[#EDE3FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FBFBFC] border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
            <span>Academic Curriculum</span>
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
            Comprehensive Subject Coverage for Grades 9 to 12.
          </h2>

          <p className="text-base sm:text-lg text-[#5A5A65] mt-3 leading-relaxed">
            Every course is delivered one-to-one by an experienced mentor matched to your curriculum and exam schedule.
          </p>
        </div>

        {/* Subjects Layout: 4 Cards on Top Row, 3 Cards Centered on Bottom Row (User Requirement) */}
        <div className="space-y-6">
          {/* Top Row: 4 Core Subjects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.slice(0, 4).map((subj) => {
              const Icon = subj.icon;
              return (
                <div
                  key={subj.id}
                  className="card-standard p-6 flex flex-col justify-between bg-white text-left hover:border-[#310064]/30 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#F5F5F7] border border-[#E5E5EB] text-[#310064] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <span className="text-xs font-heading font-semibold text-[#5A5A65] bg-[#F5F5F7] px-2.5 py-1 rounded">
                        {subj.grades}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-[#1E1E24] leading-snug mb-2">
                      {subj.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5A5A65] font-sans leading-relaxed mb-4">
                      {subj.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5EB]">
                    <button
                      type="button"
                      onClick={() => setSelectedSubject(subj)}
                      className="text-xs font-heading font-semibold text-[#310064] hover:underline flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Syllabus Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Row: 3 Subjects Centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {subjects.slice(4, 7).map((subj) => {
              const Icon = subj.icon;
              return (
                <div
                  key={subj.id}
                  className="card-standard p-6 flex flex-col justify-between bg-white text-left hover:border-[#310064]/30 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#F5F5F7] border border-[#E5E5EB] text-[#310064] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <span className="text-xs font-heading font-semibold text-[#5A5A65] bg-[#F5F5F7] px-2.5 py-1 rounded">
                        {subj.grades}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-[#1E1E24] leading-snug mb-2">
                      {subj.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5A5A65] font-sans leading-relaxed mb-4">
                      {subj.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5EB]">
                    <button
                      type="button"
                      onClick={() => setSelectedSubject(subj)}
                      className="text-xs font-heading font-semibold text-[#310064] hover:underline flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Syllabus Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-xl border border-[#E5E5EB] p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedSubject(null)}
              className="absolute top-5 right-5 p-2 rounded-md text-[#5A5A65] hover:text-[#1E1E24] hover:bg-[#F5F5F7]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-lg bg-[#F5F5F7] border border-[#E5E5EB] text-[#310064] flex items-center justify-center">
                <selectedSubject.icon className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div>
                <span className="text-xs font-heading font-semibold text-[#5A5A65]">
                  {selectedSubject.grades}
                </span>
                <h3 className="font-heading font-bold text-xl text-[#1E1E24]">
                  {selectedSubject.name}
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#5A5A65] leading-relaxed mb-6">
              {selectedSubject.description}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#1E1E24] mb-3">
                Key Topics Covered:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedSubject.keyTopics.map((topic) => (
                  <div
                    key={topic}
                    className="p-2.5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] text-xs font-medium text-[#1E1E24] flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-[#310064] shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 text-xs text-[#5A5A65]">
              Curriculum Support: <strong className="text-[#1E1E24]">{selectedSubject.curricula}</strong>
            </div>

            <div className="pt-4 border-t border-[#E5E5EB] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedSubject(null)}
                className="btn-secondary w-full sm:w-auto text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleConsultationClick}
                className="btn-primary w-full sm:w-auto text-xs"
              >
                <span>Book a Free Consultation in {selectedSubject.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
