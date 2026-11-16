'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowRight, HelpCircle, PhoneCall } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Tutoring' | 'Curriculum' | 'Scheduling' | 'Platform'>('All');

  const faqs = [
    {
      category: 'Tutoring',
      question: 'How is TutorAstra different from conventional group tuition or coaching institutes?',
      answer:
        'In traditional 30-to-60 student coaching batches, lessons are delivered at an average pace. Students who get stuck on foundational concepts often stay silent and fall behind. At TutorAstra, instruction is strictly 1-on-1: your child receives 100% of the tutor’s dedicated attention. The curriculum, pace, practice questions, and doubt resolution are customized specifically to their exact learning needs.',
    },
    {
      category: 'Tutoring',
      question: 'Who are your tutors and how are they selected?',
      answer:
        'Our educators are top 2% vetted subject specialists, including experienced board examiners, gold medalists, and university scholars. Every tutor goes through a rigorous four-stage screening process: thorough subject mastery testing, live one-on-one pedagogical demonstrations, board syllabus certification, and continuous parent-rated accountability checks.',
    },
    {
      category: 'Curriculum',
      question: 'Which educational boards and grades do you support?',
      answer:
        'We support students from Grades 6 to 12 across CBSE, ICSE / ISC, Cambridge (IGCSE, O-Level, AS & A-Levels), and the International Baccalaureate (IB MYP & IB DP). Tutors specifically align with each board’s current marking criteria, syllabus weightage, and past examiner question patterns.',
    },
    {
      category: 'Scheduling',
      question: 'How flexible is the class scheduling?',
      answer:
        'Completely flexible. You choose the days of the week, timeslots (after-school, weekends, or evenings), and frequency that fit your family’s routine. If your child has an unexpected school test or family event, sessions can be rescheduled seamlessly with 12 hours advance notice.',
    },
    {
      category: 'Tutoring',
      question: 'What happens during the complimentary 20-minute Consultation Session?',
      answer:
        'You and your student will meet with a senior academic advisor. We review your student’s past report cards, identify exact problem chapters (e.g., Organic Reaction Mechanisms or Trigonometric Proofs), establish term score targets, and recommend a personalized study roadmap with a verified tutor match.',
    },
    {
      category: 'Curriculum',
      question: 'Can my child focus only on specific weak chapters or board exam revision?',
      answer:
        'Yes. Our study plans are not rigid pre-packaged courses. If your child already understands Algebra but struggles with Geometry and Coordinate Geometry, 100% of the lesson hours will be dedicated exclusively to mastering Geometry, past-year question paper drills, and examiner tips.',
    },
    {
      category: 'Platform',
      question: 'How do parents stay informed about their child’s progress?',
      answer:
        'We believe in absolute transparency. After every session, your dedicated tutor submits a detailed diagnostic summary detailing topics completed, homework status, and conceptual strengths/weaknesses. In addition, parents receive bi-weekly milestone reports and direct access to our academic team.',
    },
    {
      category: 'Platform',
      question: 'What is the Astra AI Diagnostic Studio and how is it used?',
      answer:
        'The Astra AI Diagnostic Studio is our student practice companion. Between live 1-on-1 classes, students can explore visual derivations, tackle checkpoint quizzes, and test their logic with instant step-by-step breakdown and "Examiner Trap" warnings—reinforcing what they learned in their live sessions.',
    },
  ];

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter((faq) => faq.category === activeCategory);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#ECE6DA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
            <span>Parent & Student FAQ</span>
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
            Frequently Asked Questions.
          </h2>

          <p className="text-base text-[#5A5A65] mt-2 leading-relaxed">
            Everything you need to know about our dedicated 1-on-1 tutoring model, faculty vetting, and curriculum coverage.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'All', label: 'All Questions' },
            { id: 'Tutoring', label: '1-on-1 Tutoring' },
            { id: 'Curriculum', label: 'Curriculum & Boards' },
            { id: 'Scheduling', label: 'Scheduling & Flexibility' },
            { id: 'Platform', label: 'Parent Portal & AI Studio' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id as any);
                setOpenIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'bg-white text-[#5A5A65] border border-[#E5E5EB] hover:bg-[#F2ECFC] hover:text-[#310064]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="card-standard overflow-hidden bg-white transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-semibold text-sm sm:text-base text-[#1E1E24]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#5A5A65] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#310064]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-sm text-[#5A5A65] leading-relaxed border-t border-[#E5E5EB] pt-3 bg-[#FAF8F5]/50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Help Card */}
        <div className="mt-10 p-5 rounded-xl bg-white border border-[#E5E5EB] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F2ECFC] text-[#310064] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-[#310064]" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-[#1E1E24]">
                Have a question specific to your child's syllabus?
              </h4>
              <p className="text-xs text-[#5A5A65]">
                Our academic counseling team is available 7 days a week to guide you.
              </p>
            </div>
          </div>
          <a
            href="#consultation"
            onClick={scrollToConsultation}
            className="btn-primary text-xs font-heading font-semibold shrink-0 w-full sm:w-auto"
          >
            Speak with an Advisor
          </a>
        </div>
      </div>
    </section>
  );
}
