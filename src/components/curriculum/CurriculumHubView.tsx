'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClosingCTA from '@/components/ClosingCTA';
import Link from 'next/link';
import {
  ALL_CURRICULA,
  ACADEMIC_FRAMEWORK,
  GRADE_MAPPINGS
} from '@/lib/curriculumData';
import {
  Calendar,
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

export default function CurriculumHubView() {
  const [selectedCurriculum, setSelectedCurriculum] = useState<'CBSE' | 'British'>('CBSE');
  const [selectedGradeIndex, setSelectedGradeIndex] = useState<number>(0);
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3>(1);
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Science' | 'Mathematics'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  const currentGradeMapping = GRADE_MAPPINGS[selectedGradeIndex];
  const currentGradeLabel =
    selectedCurriculum === 'CBSE'
      ? currentGradeMapping.cbseGrade
      : currentGradeMapping.britishYear;

  const filteredTopics = ALL_CURRICULA.filter((t) => {
    const matchCurr = t.curriculum === selectedCurriculum;
    const matchGrade = t.grade.toLowerCase().includes(currentGradeLabel.toLowerCase());
    const matchTerm = t.term === selectedTerm;
    const matchSubject = selectedSubject === 'All' || t.subject === selectedSubject;

    const matchesSearch =
      searchQuery === '' ||
      t.termTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.topics.some(
        (sub) =>
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchCurr && matchGrade && matchTerm && matchSubject && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedTopicId(expandedTopicId === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-14 sm:py-20 bg-[#FBFBFC] border-b border-[#E5E5EB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#E5E5EB] text-[#310064] text-xs font-semibold uppercase tracking-wider">
              <span>Curriculum Gateway • CBSE & British KS3</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#1E1E24] tracking-tight leading-tight">
              Academic Curricula: <span className="text-[#310064]">Grades 6–8</span>
            </h1>

            <p className="text-sm sm:text-base font-sans text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Explore our structured 36-week dual-pathway curriculum for CBSE (NCERT-aligned) and British Key Stage 3. Built for deep conceptual understanding and examination confidence.
            </p>

            {/* Equivalent Grade Mapping Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-2">
              {GRADE_MAPPINGS.map((gm, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedGradeIndex(idx)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedGradeIndex === idx
                      ? 'bg-[#310064] text-white border-[#310064]'
                      : 'bg-white hover:bg-neutral-50 text-neutral-700 border-[#E5E5EB]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className={selectedGradeIndex === idx ? 'text-[#F4CC45]' : 'text-[#310064]'}>
                      {gm.stage}
                    </span>
                    <span className={selectedGradeIndex === idx ? 'text-neutral-300' : 'text-neutral-400'}>
                      {gm.ageGroup}
                    </span>
                  </div>
                  <div className="text-xs font-bold mt-1">
                    {gm.cbseGrade} ↔ {gm.britishYear}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 36-Week Framework Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#FBFBFC] rounded-lg p-6 border border-[#E5E5EB] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5EB]">
              <div>
                <h3 className="text-base font-heading font-bold text-[#1E1E24] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#310064]" />
                  <span>The 36-Week Academic Framework (3 Terms per Year)</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  12 weeks per term with continuous progress tracking and parent updates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-white border border-[#E5E5EB] text-[#310064] text-xs font-semibold">
                  Dedicated 1-on-1 Sessions
                </span>
              </div>
            </div>

            {/* Assessment Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg bg-white border border-[#E5E5EB] space-y-1">
                <span className="text-[10px] font-bold text-[#310064] uppercase tracking-wider block">
                  Week 0
                </span>
                <h4 className="text-xs font-bold text-[#1E1E24]">Diagnostic Baseline</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  Identifies specific knowledge strengths and gaps before lessons begin.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-[#E5E5EB] space-y-1">
                <span className="text-[10px] font-bold text-[#310064] uppercase tracking-wider block">
                  Week 6
                </span>
                <h4 className="text-xs font-bold text-[#1E1E24]">Mid-Term Checkpoint</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  Concept mastery review and problem-solving evaluation.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-[#E5E5EB] space-y-1">
                <span className="text-[10px] font-bold text-[#310064] uppercase tracking-wider block">
                  Week 12
                </span>
                <h4 className="text-xs font-bold text-[#1E1E24]">Summative Assessment</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  Comprehensive topic evaluation and practical capstone assignment.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-[#E5E5EB] space-y-1">
                <span className="text-[10px] font-bold text-[#310064] uppercase tracking-wider block">
                  Post-Term
                </span>
                <h4 className="text-xs font-bold text-[#1E1E24]">Parent Review Session</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  Detailed progress card and customized roadmap for the next term.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NCERT Disclaimer */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="p-3.5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] text-xs font-sans text-neutral-700 flex items-start gap-3 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-[#310064] shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-[#1E1E24]">Important Syllabus Disclaimer:</strong> {ACADEMIC_FRAMEWORK.ncertDisclaimer}
            </div>
          </div>
        </section>

        {/* Interactive Explorer */}
        <section className="py-6 pb-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Control Deck */}
            <div className="bg-[#FBFBFC] rounded-lg p-5 border border-[#E5E5EB] space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Curriculum Toggle */}
                <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E5E5EB] rounded-lg w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedCurriculum('CBSE')}
                    className={`flex-1 md:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      selectedCurriculum === 'CBSE'
                        ? 'bg-[#310064] text-white'
                        : 'text-neutral-600 hover:text-[#1E1E24]'
                    }`}
                  >
                    CBSE (NCERT Aligned)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCurriculum('British')}
                    className={`flex-1 md:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      selectedCurriculum === 'British'
                        ? 'bg-[#310064] text-white'
                        : 'text-neutral-600 hover:text-[#1E1E24]'
                    }`}
                  >
                    British Curriculum (KS3)
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics, chapters, labs..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E5E5EB] text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#310064]"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5E5EB]">
                {/* Grade Selector */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-neutral-500 uppercase mr-1">Grade:</span>
                  {GRADE_MAPPINGS.map((gm, idx) => {
                    const label = selectedCurriculum === 'CBSE' ? gm.cbseGrade : gm.britishYear;
                    const isActive = selectedGradeIndex === idx;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedGradeIndex(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#310064] text-white'
                            : 'bg-white border border-[#E5E5EB] text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Term Selector */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-neutral-500 uppercase mr-1">Term:</span>
                  {[1, 2, 3].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTerm(t as 1 | 2 | 3)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
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
                  {(['All', 'Science', 'Mathematics'] as const).map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubject(sub)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedSubject === sub
                          ? 'bg-[#1E1E24] text-white'
                          : 'bg-white border border-[#E5E5EB] text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTopics.map((module) => (
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
                          <span className="text-[11px] text-neutral-500 block">{module.duration}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-lg bg-white border border-[#E5E5EB] text-neutral-600 text-[11px] font-semibold">
                        Term {module.term}
                      </span>
                    </div>

                    <h3 className="text-base font-heading font-bold text-[#1E1E24]">
                      {module.termTitle}
                    </h3>

                    {/* Topics Accordion */}
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
                      <span>View {module.subject} Stream</span>
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
