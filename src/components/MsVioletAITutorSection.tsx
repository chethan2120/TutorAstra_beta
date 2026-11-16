'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Brain,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Check,
  Layers,
  Award,
  ChevronRight,
  Compass,
  Cpu,
  GraduationCap
} from 'lucide-react';

interface InteractiveModule {
  id: string;
  subject: string;
  chipLabel: string;
  icon: string;
  query: string;
  intuition: string;
  formula: string;
  steps: { num: string; title: string; desc: string }[];
  trap: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  tutorRoadmap: string;
}

const MODULES: Record<string, InteractiveModule> = {
  math: {
    id: 'math',
    subject: 'Mathematics',
    chipLabel: '⚡ Derive Quadratic Formula',
    icon: '📐',
    query: 'How do we derive the quadratic formula by completing the square?',
    intuition: 'Think of completing the square like physically completing an incomplete rectangle into a perfect geometric square.',
    formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad (\\Delta = b^2 - 4ac)',
    steps: [
      {
        num: '01',
        title: 'Normalize Coefficient',
        desc: 'Divide ax² + bx + c = 0 by a so the leading term is x²: x² + (b/a)x = -c/a.'
      },
      {
        num: '02',
        title: 'Add the Geometric Corner',
        desc: 'Add (b / 2a)² to both sides. This completes the perfect square: (x + b/2a)² = (b² - 4ac) / 4a².'
      },
      {
        num: '03',
        title: 'Extract Roots with ±',
        desc: 'Take the square root of both sides and isolate x to get the universal formula.'
      }
    ],
    trap: 'Exam Trap: Forgetting the (±) root when taking square roots, or making sign errors when c is negative!',
    quiz: {
      question: 'If the discriminant b² - 4ac = 0 in a quadratic equation, what does this tell you about the roots?',
      options: [
        'Two distinct real roots',
        'One repeated real root (Real and Equal)',
        'Two complex imaginary roots',
        'Zero solutions exist'
      ],
      correctIndex: 1,
      explanation: 'When Δ = 0, the ± term vanishes, leaving exactly one unique real root: x = -b / (2a).'
    },
    tutorRoadmap: 'Your 1-on-1 tutor will guide you through polynomial transformations and tricky word-problem applications.'
  },
  physics: {
    id: 'physics',
    subject: 'Physics',
    chipLabel: "🔭 Snell's Law & Refraction",
    icon: '⚡',
    query: 'Why does light bend when entering water, and how do we calculate the angle?',
    intuition: 'Like a car steering onto sand from pavement—the wheels that hit the slow medium first cause the vehicle to pivot towards the normal.',
    formula: 'n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2) \\implies \\theta_c = \\arcsin(n_2 / n_1)',
    steps: [
      {
        num: '01',
        title: 'Speed Reduction in Dense Media',
        desc: 'Light slows down in optically denser mediums: v = c / n. Wavelength shortens while frequency remains constant.'
      },
      {
        num: '02',
        title: 'Wavefront Alignment (Snell)',
        desc: 'Apply n₁ sin θ₁ = n₂ sin θ₂ measured strictly from the perpendicular normal line.'
      },
      {
        num: '03',
        title: 'Critical Angle & Total Internal Reflection',
        desc: 'When light moves from dense to rare (glass to air) past θc, 100% of the light reflects back inside.'
      }
    ],
    trap: 'Exam Trap: Measuring angles from the glass surface rather than the 90° normal line!',
    quiz: {
      question: 'Light travels from air (n = 1.0) into glass (n = 1.5). How does the ray behave?',
      options: [
        'Bends towards the normal line because light slows down',
        'Bends away from the normal line because speed increases',
        'Reflects entirely with zero refraction',
        'Passes straight through with zero angle change'
      ],
      correctIndex: 0,
      explanation: 'Because glass is optically denser (n = 1.5 > 1.0), light slows down and bends towards the perpendicular normal.'
    },
    tutorRoadmap: 'Your tutor uses interactive 2D ray diagrams to demonstrate prism dispersion and fiber optic communication.'
  },
  chemistry: {
    id: 'chemistry',
    subject: 'Chemistry',
    chipLabel: '🧪 Balance Redox: Half-Reactions',
    icon: '🔬',
    query: 'How do you balance complex ionic redox equations in an acidic solution?',
    intuition: 'Every electron lost by the reducing agent must be physically captured by the oxidizing agent—mass AND charge must balance.',
    formula: '\\text{Net Charge} = \\sum (\\text{Reactant Charges}) = \\sum (\\text{Product Charges})',
    steps: [
      {
        num: '01',
        title: 'Split into Half-Reactions',
        desc: 'Identify which element increases oxidation number (oxidation) and which decreases (reduction).'
      },
      {
        num: '02',
        title: 'Balance O with H₂O & H with H⁺',
        desc: 'Add H₂O molecules to balance Oxygen, then add H⁺ ions to balance Hydrogen in acidic media.'
      },
      {
        num: '03',
        title: 'Equalize Electron Count',
        desc: 'Multiply half-reactions so electrons cancel out before adding the equations together.'
      }
    ],
    trap: 'Exam Trap: Balancing all the atoms but forgetting to balance net electrical charges!',
    quiz: {
      question: 'In the redox reaction Zn + Cu²⁺ → Zn²⁺ + Cu, what is the oxidizing agent?',
      options: [
        'Cu²⁺ (it causes Zn to oxidize by accepting electrons)',
        'Zn (it donates electrons)',
        'Zn²⁺',
        'Metallic Cu'
      ],
      correctIndex: 0,
      explanation: 'Cu²⁺ gains 2 electrons to become Cu. Because it gets reduced, it acts as the oxidizing agent for Zinc.'
    },
    tutorRoadmap: 'Your chemistry tutor reinforces transition metal oxidation states and electrochemistry cells.'
  },
  biology: {
    id: 'biology',
    subject: 'Biology',
    chipLabel: '🧬 Light vs Dark Photosynthesis',
    icon: '🌿',
    query: 'What really happens during the Calvin Cycle vs Light-Dependent reactions?',
    intuition: 'The thylakoid is the solar battery charger (producing ATP and NADPH); the stroma is the sugar factory using that battery power.',
    formula: '6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Photons} \\rightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2',
    steps: [
      {
        num: '01',
        title: 'Photolysis of Water',
        desc: 'Chlorophyll absorbs sunlight, splitting H₂O to release Oxygen gas (O₂) and generate high-energy ATP.'
      },
      {
        num: '02',
        title: 'Carbon Fixation (RuBisCO)',
        desc: 'The enzyme RuBisCO captures CO₂ from the atmosphere and attaches it to a 5-carbon sugar (RuBP).'
      },
      {
        num: '03',
        title: 'Sugar Synthesis in Stroma',
        desc: 'ATP and NADPH reduce 3-PGA into G3P triose sugars, which assemble into glucose.'
      }
    ],
    trap: 'Exam Trap: Assuming "dark reactions" only occur at night! The Calvin cycle happens during daytime because it relies on fresh ATP.',
    quiz: {
      question: 'Where do the light-dependent reactions of photosynthesis occur inside a plant cell?',
      options: [
        'Thylakoid membranes of chloroplasts',
        'Liquid stroma of chloroplasts',
        'Mitochondrial inner matrix',
        'Cell wall and cytoplasm'
      ],
      correctIndex: 0,
      explanation: 'Light absorption and photolysis take place in the thylakoid membranes where Photosystems I and II are embedded.'
    },
    tutorRoadmap: 'Your 1-on-1 mentor walks you through electron transport chains and environmental limiting factors.'
  },
  english: {
    id: 'english',
    subject: 'English & Rhetoric',
    chipLabel: '✍️ Level-Up Essay from B to A+',
    icon: '📝',
    query: 'How do you structure an argument that examiners award full marks for?',
    intuition: 'Move from superficial summary to philosophical consequence using the Assertion-Reasoning-Evidence-Impact (AREI) model.',
    formula: '\\text{A+ Argument} = \\text{Bold Thesis} + \\text{Logical Reason} + \\text{Concrete Proof} + \\text{Broader Impact}',
    steps: [
      {
        num: '01',
        title: 'Unapologetic Assertion',
        desc: 'State an active, debatable claim rather than a safe descriptive summary.'
      },
      {
        num: '02',
        title: 'The Psychological / Social "Why"',
        desc: 'Explain the deeper human motivation or systemic cause behind the author’s technique.'
      },
      {
        num: '03',
        title: 'Impact on Examiner / Reader',
        desc: 'Show why this argument matters for the overarching theme of human nature or society.'
      }
    ],
    trap: 'Exam Trap: Dumping quotes without analyzing word-level connotations or authorial intent!',
    quiz: {
      question: 'Which element transforms a good analytical paragraph into an outstanding (A+) argument?',
      options: [
        'Explaining the broader philosophical impact and author intent',
        'Adding three more quotes in a row',
        'Using extremely obscure dictionary words',
        'Writing five pages of plot summary'
      ],
      correctIndex: 0,
      explanation: 'Top grade bands specifically reward candidates who analyze thematic consequence, authorial purpose, and reader impact.'
    },
    tutorRoadmap: 'Your English tutor marks your essays line-by-line, providing live rubric feedback on diction and structure.'
  }
};

export default function MsVioletAITutorSection() {
  const [activeModuleKey, setActiveModuleKey] = useState<string>('math');
  const [activeTab, setActiveTab] = useState<'visual' | 'quiz' | 'radar'>('visual');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const activeModule = MODULES[activeModuleKey] || MODULES.math;

  const handleSelectModule = (key: string) => {
    setActiveModuleKey(key);
    setSelectedQuizIndex(null);
    setShowFeedback(false);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 350);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setCustomPrompt('');
    }, 600);
  };

  const handleOptionSelect = (idx: number) => {
    setSelectedQuizIndex(idx);
    setShowFeedback(true);
  };

  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="ai-tutor" className="py-16 lg:py-24 bg-[#F9F7FE] border-b border-[#EBE4F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#F4CC45] animate-ping" />
              <span>Interactive AI Diagnostic Studio</span>
            </div>

            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
              Test Concepts with Ms. Violet. <br className="hidden sm:inline" />
              <span className="text-[#310064]">Our 24/7 AI Diagnostic Lab.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#5A5A65] font-sans leading-relaxed">
              Explore step-by-step conceptual logic, practice tricky exam questions, and discover concept gaps before your live 1-on-1 tutoring sessions.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href="#consultation"
              onClick={scrollToConsultation}
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-heading font-bold bg-[#310064] text-white hover:bg-[#25004c] transition-all shadow-sm inline-flex items-center gap-2"
            >
              <span>Sync With a Human Tutor</span>
              <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
            </a>
          </div>
        </div>

        {/* Quick Clickable Concept Chips */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-heading font-bold text-[#310064] shrink-0 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Zap className="w-3.5 h-3.5 text-[#F4CC45]" />
            <span>Try A Concept:</span>
          </span>
          {Object.entries(MODULES).map(([key, mod]) => {
            const isActive = activeModuleKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectModule(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#310064] text-white border-[#310064] shadow-sm scale-105'
                    : 'bg-white text-[#1E1E24] border-[#E5E5EB] hover:border-[#310064]/40 hover:bg-[#FAF8FD]'
                }`}
              >
                <span>{mod.icon}</span>
                <span>{mod.chipLabel}</span>
              </button>
            );
          })}
        </div>

        {/* ================= THE MAIN INTERACTIVE STUDIO CANVAS ================= */}
        <div className="bg-white rounded-2xl border border-[#EBE4F6] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Ms. Violet Live Avatar & Doubt Input (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-7 bg-[#FCFAFF] border-b lg:border-b-0 lg:border-r border-[#EBE4F6] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Avatar Header with 2D Live Glow */}
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#310064] shadow-md bg-white">
                    <img
                      src="/ms-violet.png"
                      alt="Ms. Violet AI Mentor Portrait"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#1E1E24]">Ms. Violet AI</h3>
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#310064] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#F4CC45]" />
                    <span>Academic Diagnostic Lab</span>
                  </div>
                  <p className="text-[11px] text-[#5A5A65]">Active for Grades 9–12</p>
                </div>
              </div>

              {/* Chat Speech Bubble */}
              <div className="p-4 rounded-xl bg-white border border-[#EBE4F6] text-xs font-sans text-[#1E1E24] shadow-xs relative leading-relaxed">
                <div className="font-heading font-semibold text-[#310064] mb-1 flex items-center gap-1.5">
                  <span>Assistant Observation:</span>
                </div>
                "I analyze board examination patterns and break down tough {activeModule.subject} questions step-by-step before your tutor steps in."
              </div>

              {/* Ask Question Bar */}
              <form onSubmit={handleCustomSubmit} className="space-y-2">
                <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-[#310064]">
                  Ask Ms. Violet Any Specific Problem
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`e.g. Help me understand ${activeModule.subject} step 2...`}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full h-11 px-3.5 pr-10 rounded-xl border border-[#E5E5EB] bg-white text-xs text-[#1E1E24] placeholder:text-neutral-400 focus:outline-none focus:border-[#310064]"
                  />
                  <button
                    type="submit"
                    aria-label="Submit question to Ms. Violet"
                    className="absolute right-2 top-2 w-7 h-7 rounded-lg bg-[#310064] text-white flex items-center justify-center hover:bg-[#25004c] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Live 1-on-1 Bridge Card */}
            <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#FDE68A] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
                <Award className="w-4 h-4 text-[#D97706]" />
                <span>Synchronized with Live Tutors</span>
              </div>
              <p className="text-[11px] text-[#78350F] font-sans leading-relaxed">
                {activeModule.tutorRoadmap}
              </p>
              <a
                href="#consultation"
                onClick={scrollToConsultation}
                className="text-xs font-heading font-bold text-[#310064] hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>Request 1-on-1 Lesson</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right Column: Visual Learning Studio Canvas (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            {/* Top Toolbar Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EBE4F6]">
              <div className="flex items-center gap-2 p-1 bg-[#F5F2FA] rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('visual')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                    activeTab === 'visual'
                      ? 'bg-white text-[#310064] shadow-xs'
                      : 'text-[#5A5A65] hover:text-[#1E1E24]'
                  }`}
                >
                  Step-by-Step Breakdown
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-white text-[#310064] shadow-xs'
                      : 'text-[#5A5A65] hover:text-[#1E1E24]'
                  }`}
                >
                  Interactive Checkpoint
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('radar')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                    activeTab === 'radar'
                      ? 'bg-white text-[#310064] shadow-xs'
                      : 'text-[#5A5A65] hover:text-[#1E1E24]'
                  }`}
                >
                  Tutor Sync Radar
                </button>
              </div>

              <span className="text-xs font-heading font-bold text-[#310064] bg-[#F5F0FF] border border-[#DDD6FE] px-2.5 py-1 rounded-lg">
                {activeModule.subject} Lab
              </span>
            </div>

            {/* TAB CONTENT */}
            {isScanning ? (
              <div className="py-20 text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F0FF] text-[#310064] flex items-center justify-center mx-auto animate-spin">
                  <Brain className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-base text-[#1E1E24]">
                  Deconstructing {activeModule.subject} Problem...
                </h4>
                <p className="text-xs text-[#5A5A65] max-w-sm mx-auto font-sans">
                  Formulating step-by-step logic, extracting examiner traps, and assembling targeted practice.
                </p>
              </div>
            ) : activeTab === 'visual' ? (
              /* TAB 1: VISUAL BREAKDOWN */
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <span className="text-[11px] font-bold text-[#310064] uppercase tracking-wider block mb-1">
                    Concept Breakdown
                  </span>
                  <h4 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1E1E24] leading-snug">
                    {activeModule.query}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5A5A65] font-sans mt-1.5 leading-relaxed">
                    <strong>The Real-Life Intuition:</strong> {activeModule.intuition}
                  </p>
                </div>

                {/* Formula Box */}
                <div className="p-4 rounded-xl bg-[#F6EEFD] border border-[#EADBFA] space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#310064]">
                    Master Formula / Working Model
                  </span>
                  <div className="font-mono text-sm sm:text-base font-bold text-[#310064] py-1">
                    {activeModule.formula}
                  </div>
                </div>

                {/* 3 Step-by-Step Logic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {activeModule.steps.map((st) => (
                    <div
                      key={st.num}
                      className="p-4 rounded-xl bg-white border border-[#EBE4F6] space-y-1.5 shadow-xs hover:border-[#310064]/30 transition-colors"
                    >
                      <span className="text-xs font-heading font-extrabold text-[#310064] bg-[#F5F0FF] px-2 py-0.5 rounded">
                        Step {st.num}
                      </span>
                      <h5 className="font-heading font-bold text-xs text-[#1E1E24] pt-1">
                        {st.title}
                      </h5>
                      <p className="text-[11px] text-[#5A5A65] font-sans leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Examiner Trap Alert */}
                <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <span className="font-sans leading-relaxed">{activeModule.trap}</span>
                </div>
              </div>
            ) : activeTab === 'quiz' ? (
              /* TAB 2: INTERACTIVE CHECKPOINT QUIZ */
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#310064] uppercase tracking-wider block">
                    Instant Self-Check
                  </span>
                  <h4 className="font-heading font-bold text-base sm:text-lg text-[#1E1E24]">
                    {activeModule.quiz.question}
                  </h4>
                  <p className="text-xs text-[#5A5A65] font-sans">
                    Click an option below to test your instant comprehension:
                  </p>
                </div>

                <div className="space-y-2.5">
                  {activeModule.quiz.options.map((opt, idx) => {
                    const isSelected = selectedQuizIndex === idx;
                    const isCorrect = idx === activeModule.quiz.correctIndex;

                    let btnClasses = 'bg-white border-[#E5E5EB] text-[#1E1E24] hover:bg-[#FAF8FD]';
                    if (showFeedback) {
                      if (isCorrect) {
                        btnClasses = 'bg-[#F0FDF4] border-emerald-500 text-emerald-950 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnClasses = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
                      } else {
                        btnClasses = 'opacity-50 bg-white border-[#E5E5EB] text-[#5A5A65]';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleOptionSelect(idx)}
                        disabled={showFeedback}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-sans transition-all flex items-center justify-between gap-3 ${btnClasses}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-[#F5F2FA] text-[#310064] text-xs font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {showFeedback && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {showFeedback && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {showFeedback && (
                  <div
                    className={`p-4 rounded-xl border animate-in zoom-in-95 duration-200 space-y-2 ${
                      selectedQuizIndex === activeModule.quiz.correctIndex
                        ? 'bg-[#F0FDF4] border-emerald-200'
                        : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-heading font-bold text-xs sm:text-sm">
                        {selectedQuizIndex === activeModule.quiz.correctIndex ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-900">Correct! Concept Solidified.</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span className="text-rose-900">Good Attempt! Review the working below:</span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedQuizIndex(null);
                          setShowFeedback(false);
                        }}
                        className="text-xs font-bold text-[#310064] hover:underline flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#1E1E24] font-sans leading-relaxed">
                      {activeModule.quiz.explanation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* TAB 3: TUTOR SYNC RADAR */
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <span className="text-[11px] font-bold text-[#310064] uppercase tracking-wider block">
                    Diagnostic Report Card
                  </span>
                  <h4 className="font-heading font-extrabold text-xl text-[#1E1E24]">
                    Concept Readiness Radar for {activeModule.subject}
                  </h4>
                  <p className="text-xs text-[#5A5A65] font-sans mt-1">
                    Simulated benchmark for Grades 9–12 CBSE and British curriculums.
                  </p>
                </div>

                {/* Progress bars */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>Formula Derivations & Algebraic Rigour</span>
                      <span className="text-[#310064] font-bold">94% (Mastered)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#F5F2FA] overflow-hidden">
                      <div className="h-full bg-[#310064] rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>Application in Unfamiliar Past-Paper Questions</span>
                      <span className="text-[#310064] font-bold">88% (Proficient)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#F5F2FA] overflow-hidden">
                      <div className="h-full bg-[#310064] rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>Exam Time Pacing (Target Area for 1-on-1 Mentor)</span>
                      <span className="text-[#B8860B] font-bold">72% (Requires Practice)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#F5F2FA] overflow-hidden">
                      <div className="h-full bg-[#F4CC45] rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="pt-4 border-t border-[#EBE4F6] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-[#5A5A65] font-sans">
                    Want your child’s diagnostic report generated by an academic specialist?
                  </p>
                  <a
                    href="#consultation"
                    onClick={scrollToConsultation}
                    className="btn-primary text-xs font-heading font-semibold whitespace-nowrap"
                  >
                    <span>Book Diagnostic Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
