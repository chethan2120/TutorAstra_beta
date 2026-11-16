'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClosingCTA from '@/components/ClosingCTA';
import Link from 'next/link';
import { ALL_CURRICULA, ACADEMIC_FRAMEWORK, GRADE_MAPPINGS } from '@/lib/curriculumData';
import {
  BookOpen,
  Calendar,
  Layers,
  FlaskConical,
  Compass,
  Search,
  ChevronDown,
  ChevronUp,
  Award,
  Check,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function CBSECurriculumView() {
  const [selectedGrade, setSelectedGrade] = useState<'Grade 6' | 'Grade 7' | 'Grade 8'>('Grade 6');
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3>(1);
  const [subjectFilter, setSubjectFilter] = useState<'All' | 'Science' | 'Mathematics'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  const gradeIndex = selectedGrade === 'Grade 6' ? 0 : selectedGrade === 'Grade 7' ? 1 : 2;
  const gradeMapping = GRADE_MAPPINGS[gradeIndex];

  const cbseTopics = ALL_CURRICULA.filter((t) => {
    const isCBSE = t.curriculum === 'CBSE';
    const isGrade = t.grade === selectedGrade;
    const isTerm = t.term === selectedTerm;
    const isSubject = subjectFilter === 'All' || t.subject === subjectFilter;

    const matchesSearch =
      searchQuery === '' ||
      t.termTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.topics.some(
        (sub) =>
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return isCBSE && isGrade && isTerm && isSubject && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedTopicId(expandedTopicId === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Header Hero */}
        <section className="py-14 sm:py-20 bg-[#FBFBFC] border-b border-[#E5E5EB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#E5E5EB] text-[#310064] text-xs font-semibold uppercase tracking-wider">
              <span>National Council of Educational Research and Training (NCERT)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#1E1E24] tracking-tight leading-tight">
              CBSE Curriculum: <span className="text-[#310064]">Grades 6–8</span>
            </h1>

            <p className="text-sm sm:text-base font-sans text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Complete term-by-term syllabus for Science and Mathematics. Structured around 3 terms, 12 weeks each (36 weeks total), aligned with school academic calendars.
            </p>

            {/* Quick switcher to British */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="text-xs text-neutral-500 font-sans">Equivalent Mapping:</span>
              <span className="px-3 py-1 rounded-lg bg-white border border-[#E5E5EB] text-xs font-semibold text-[#1E1E24]">
                {gradeMapping.cbseGrade} ⟷ British {gradeMapping.britishYear} ({gradeMapping.ageGroup})
              </span>
              <Link
                href="/curriculum/british"
                className="text-xs font-semibold text-[#310064] hover:underline flex items-center gap-1"
              >
                <span>Switch to British KS3 Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* NCERT Disclaimer */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="p-3.5 sm:p-4 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] text-xs font-sans text-neutral-700 flex items-start gap-3 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-[#1E1E24]">Important Syllabus Disclaimer:</strong> {ACADEMIC_FRAMEWORK.ncertDisclaimer}
            </div>
          </div>
        </section>

        {/* Interactive Explorer Bar */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="bg-[#FBFBFC] rounded-lg p-5 border border-[#E5E5EB] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Grade Switcher */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-neutral-500 uppercase mr-1">Grade:</span>
                  {(['Grade 6', 'Grade 7', 'Grade 8'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGrade(g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedGrade === g
                          ? 'bg-[#310064] text-white'
                          : 'bg-white border border-[#E5E5EB] text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {/* Term Switcher */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-neutral-500 uppercase mr-1">Term:</span>
                  {[1, 2, 3].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTerm(t as 1 | 2 | 3)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedTerm === t
                          ? 'bg-[#310064] text-white'
                          : 'bg-white border border-[#E5E5EB] text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      Term {t}
                    </button>
                  ))}
                </div>

                {/* Subject Filter */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-neutral-500 uppercase mr-1">Subject:</span>
                  {(['All', 'Science', 'Mathematics'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubjectFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        subjectFilter === s
                          ? 'bg-[#1E1E24] text-white'
                          : 'bg-white border border-[#E5E5EB] text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search CBSE topics..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E5E5EB] text-xs placeholder:text-neutral-400 focus:outline-none focus:border-[#310064]"
                  />
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cbseTopics.map((module) => (
                <div
                  key={module.id}
                  className="bg-[#FBFBFC] rounded-lg p-6 border border-[#E5E5EB] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EB]">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-xs text-[#310064]">
                          {module.subject === 'Science' ? (
                            <FlaskConical className="w-3.5 h-3.5" />
                          ) : (
                            <Compass className="w-3.5 h-3.5" />
                          )}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-[#1E1E24]">{module.subject}</span>
                          <span className="text-[11px] text-neutral-500 block">{module.grade} • {module.duration}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-lg bg-white border border-[#E5E5EB] text-neutral-600 text-[11px] font-semibold">
                        Term {module.term}
                      </span>
                    </div>

                    <h3 className="text-base font-heading font-bold text-[#1E1E24]">{module.termTitle}</h3>

                    {/* Topics List with Drawer */}
                    <div className="space-y-2.5">
                      {module.topics.map((t, idx) => {
                        const topicKey = `${module.id}-${idx}`;
                        const isExpanded = expandedTopicId === topicKey;

                        return (
                          <div
                            key={idx}
                            onClick={() => toggleExpand(topicKey)}
                            className="p-3 rounded-lg border border-[#E5E5EB] bg-white transition-all cursor-pointer hover:border-[#310064]/30"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-bold text-[#1E1E24]">
                                {idx + 1}. {t.title}
                              </div>
                              <button type="button" className="text-neutral-400">
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>

                            <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-sans">
                              {t.description}
                            </p>

                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-[#E5E5EB] space-y-2">
                                <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                                  Subtopics Covered:
                                </div>
                                <ul className="space-y-1">
                                  {t.subtopics.map((st, sidx) => (
                                    <li
                                      key={sidx}
                                      className="text-xs text-neutral-700 flex items-start gap-1.5"
                                    >
                                      <Check className="w-3.5 h-3.5 text-[#310064] shrink-0 mt-0.5" />
                                      <span>{st}</span>
                                    </li>
                                  ))}
                                </ul>

                                {t.practicalActivity && (
                                  <div className="p-2 rounded-lg bg-neutral-50 border border-[#E5E5EB] text-[11px] text-[#310064] font-medium flex items-center gap-1.5 mt-2">
                                    <span>Practical Application:</span>
                                    <span>{t.practicalActivity}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {module.capstone && (
                      <div className="p-3 rounded-lg bg-white border border-[#E5E5EB] text-xs">
                        <strong className="text-[#1E1E24] font-bold block mb-0.5 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-[#310064]" />
                          Term Capstone Project:
                        </strong>
                        <span className="text-neutral-600 text-xs leading-relaxed font-sans">
                          {module.capstone}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#E5E5EB] flex items-center justify-between">
                    <Link
                      href={module.subject === 'Science' ? '/courses/science' : '/courses/mathematics'}
                      className="text-xs font-semibold text-[#310064] hover:underline flex items-center gap-1"
                    >
                      <span>Explore Course Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href="/#consultation"
                      className="btn-primary px-3 py-1.5 text-xs font-semibold"
                    >
                      Book Consultation
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ClosingCTA />
      </main>

      <Footer />
    </div>
  );
}
