'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  GraduationCap,
  BookOpen,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  options?: {
    label: string;
    value: string;
    action?: 'grade' | 'curriculum' | 'stream' | 'redirect' | 'trial' | 'reset';
    payload?: string;
  }[];
  recommendation?: {
    title: string;
    gradeText: string;
    curriculumText: string;
    streamText: string;
    highlights: string[];
    termFocus: string;
    targetUrl: string;
    targetButtonLabel: string;
  };
}

const FAQ_KNOWLEDGE_BASE = [
  {
    keywords: ['price', 'fee', 'cost', 'aed', 'tuition', 'expensive', 'package', 'bundle'],
    answer:
      'Our programmes are structured per 12-week academic term:\n• Core Bundle (Science + Maths): AED 2,999/term\n• Future-Skills Bundle (AI + Public Speaking): AED 2,999/term\n• Full Bundle (All 4 streams): AED 4,999/term.\nAll packages include weekly live classes, homework grading, and doubt clinics.'
  },
  {
    keywords: ['trial', 'free trial', 'demo', 'test class', 'sample'],
    answer:
      'Yes! We offer a 100% complimentary 1-on-1 diagnostic trial class. Your child meets a master mentor for a diagnostic evaluation and parents receive a baseline academic roadmap. No credit card required!'
  },
  {
    keywords: ['time', 'timing', 'schedule', 'when', 'days', 'calendar', 'sessions'],
    answer:
      'We run 3 terms per year (12 weeks each, 36 weeks total), aligned with UAE school terms.\n• Science & Maths: Two 60-min live sessions weekly + 1 doubt clinic.\n• AI & Public Speaking: One 60–75 min studio session weekly.\nBatches are scheduled after school hours and on weekends.'
  },
  {
    keywords: ['ncert', 'disclaimer', 'cbse', 'syllabus', 'textbook', 'revision'],
    answer:
      'Important Note: NCERT has been actively revising textbooks. Our chapter lists are structured at topic level. The actual syllabus is customized and paced based on mutual agreement between the student and mentor.'
  },
  {
    keywords: ['teacher', 'faculty', 'mentor', 'tutor', 'qualifications'],
    answer:
      'All TutorAstra mentors are vetted subject-matter specialists with proven experience in 1-on-1 personalised pedagogy. We maintain an honest, high-retention teaching environment tailored around your child’s goals.'
  },
  {
    keywords: ['online', 'offline', 'zoom', 'in-person', 'platform'],
    answer:
      'All classes are conducted live online in high-definition interactive small cohorts with virtual lab simulations, shared whiteboard canvases, and live debate breakouts.'
  }
];

export default function AcademicAdvisorChatbot() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Initialize conversation
  const startConversation = () => {
    setSelectedGrade(null);
    setSelectedCurriculum(null);
    setSelectedStream(null);

    setMessages([
      {
        id: 'msg-init-1',
        sender: 'bot',
        text: "Hello! 👋 I'm your **TutorAstra Academic Advisor**.",
        timestamp: formatTime()
      },
      {
        id: 'msg-init-2',
        sender: 'bot',
        text: "Let's find the exact curriculum data, term syllabus, and schedule for your child in 30 seconds. **Which grade/year is your child currently in?**",
        timestamp: formatTime(),
        options: [
          { label: '🎓 Grade 6 (British Year 7)', value: 'grade-6', action: 'grade' },
          { label: '🎓 Grade 7 (British Year 8)', value: 'grade-7', action: 'grade' },
          { label: '🎓 Grade 8 (British Year 9)', value: 'grade-8', action: 'grade' }
        ]
      }
    ]);
  };

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleOptionClick = (option: { label: string; value: string; action?: string; payload?: string }) => {
    setHasInteracted(true);

    // Add user's choice
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: option.label,
      timestamp: formatTime()
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      processNextStep(option.action || '', option.value, option.payload);
    }, 300);
  };

  const processNextStep = (action: string, value: string, payload?: string) => {
    const time = formatTime();

    if (action === 'grade') {
      const gradeMap: Record<string, string> = {
        'grade-6': 'Grade 6 / Year 7 (Ages 11–12)',
        'grade-7': 'Grade 7 / Year 8 (Ages 12–13)',
        'grade-8': 'Grade 8 / Year 9 (Ages 13–14)'
      };

      setSelectedGrade(value);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Selected: **${gradeMap[value] || value}**.\n\nA crucial middle school transition stage! Which academic curriculum does your child follow at school?`,
          timestamp: time,
          options: [
            { label: '🏛️ CBSE (NCERT Aligned)', value: 'cbse', action: 'curriculum' },
            { label: '🇬🇧 British Curriculum (KS3)', value: 'british', action: 'curriculum' },
            { label: '🌟 Both / Future-Skills Focus', value: 'future-skills', action: 'curriculum' }
          ]
        }
      ]);
    } else if (action === 'curriculum') {
      setSelectedCurriculum(value);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Got it! Now, **which field or stream are you looking to strengthen most?**`,
          timestamp: time,
          options: [
            { label: '🔬 Science (Physics, Chem, Bio & Labs)', value: 'science', action: 'stream' },
            { label: '📐 Mathematics (Algebra Leap & CRA Logic)', value: 'mathematics', action: 'stream' },
            { label: '🤖 AI for Students (Prompting & Tools)', value: 'ai', action: 'stream' },
            { label: '🎙️ Public Speaking (Poise & AREI Debate)', value: 'speaking', action: 'stream' },
            { label: '✨ All 4 Streams (Full Academy Bundle)', value: 'all', action: 'stream' }
          ]
        }
      ]);
    } else if (action === 'stream') {
      setSelectedStream(value);
      generateRecommendation(selectedGrade || 'grade-7', selectedCurriculum || 'cbse', value);
    } else if (action === 'redirect') {
      if (payload) {
        setIsOpen(false);
        router.push(payload);
      }
    } else if (action === 'reset') {
      startConversation();
    }
  };

  const generateRecommendation = (grade: string, curr: string, stream: string) => {
    const time = formatTime();
    let targetUrl = '/curriculum/cbse';
    let title = 'CBSE Science & Mathematics Programme';
    let targetButtonLabel = 'Redirect to CBSE Curriculum Page →';
    let termFocus = 'Term 1: Foundations & Matter | Term 2: Organisms & Algebra | Term 3: Optics & Geometry';
    let highlights = [
      'Two 60-min interactive live sessions weekly',
      'Virtual lab experiments & error-margin analysis',
      'Diagnostic baseline (Week 0) & Term reports'
    ];

    if (stream === 'science') {
      targetUrl = curr === 'british' ? '/curriculum/british' : '/courses/science';
      title = `${curr === 'british' ? 'British KS3' : 'CBSE'} Science Exploration`;
      targetButtonLabel = 'Redirect to Science Course Page →';
      highlights = [
        'Complete Biology, Chemistry & Physics syllabus',
        'Virtual laboratory experiments for every term',
        'NCERT revised topics & British KS3 mapping'
      ];
      termFocus = 'Empirical inquiry, hypothesis testing, and laboratory safety protocols.';
    } else if (stream === 'mathematics') {
      targetUrl = curr === 'british' ? '/curriculum/british' : '/courses/mathematics';
      title = `${curr === 'british' ? 'British KS3' : 'CBSE'} Mathematics Mastery`;
      targetButtonLabel = 'Redirect to Mathematics Page →';
      highlights = [
        'Concrete-Representational-Abstract (CRA) modeling',
        'Algebraic transition: variables, functions & geometry',
        '1 dedicated 1-on-1 doubt clearing clinic weekly'
      ];
      termFocus = 'Eliminates abstract math anxiety before high school GCSE/CBSE exams.';
    } else if (stream === 'ai') {
      targetUrl = '/courses/ai-for-students';
      title = 'AI for Students: Applied Future Skills';
      targetButtonLabel = 'Redirect to AI for Students Page →';
      highlights = [
        'Prompt architecture, tasks & context engineering',
        'Gemini Notebooks research synthesis',
        'Strict ethical AI verification & hallucination audits'
      ];
      termFocus = 'Week 12 Capstone: Original student research project utilizing ethical AI.';
    } else if (stream === 'speaking') {
      targetUrl = '/courses/public-speaking';
      title = 'Public Speaking & Leadership Rhetoric';
      targetButtonLabel = 'Redirect to Public Speaking Page →';
      highlights = [
        'Level 1: Confident Voice & Vocal Projection',
        'Level 2: Persuasive Speaker & AREI Debate Framework',
        'Level 3: Leader & Orator (3-Minute TED Capstone)'
      ];
      termFocus = 'Vocal poise forged before adolescent teenage self-consciousness sets in.';
    } else if (stream === 'all') {
      targetUrl = '/packages';
      title = 'TutorAstra Comprehensive One-to-One Programme';
      targetButtonLabel = 'Redirect to Learning Options →';
      highlights = [
        'Customised Curriculum: Mathematics, Sciences, Languages & More',
        'Personalised 1-on-1 dedicated mentor assigned to your schedule',
        'Continuous progress tracking and structured diagnostic reports'
      ];
      termFocus = 'Complete holistic development: academic excellence and confident concept mastery.';
    }

    // Build the bot recommendation response
    const recMsg: ChatMessage = {
      id: `bot-rec-${Date.now()}`,
      sender: 'bot',
      text: `🎯 **Here is the perfect learning pathway for your child:**`,
      timestamp: time,
      recommendation: {
        title,
        gradeText: grade.replace('grade-', 'Grade ').toUpperCase(),
        curriculumText: curr.toUpperCase(),
        streamText: stream.toUpperCase(),
        highlights,
        termFocus,
        targetUrl,
        targetButtonLabel
      },
      options: [
        {
          label: `🚀 ${targetButtonLabel}`,
          value: targetUrl,
          action: 'redirect',
          payload: targetUrl
        },
        {
          label: '📅 Book 1-on-1 Free Trial Class →',
          value: '/free-trial',
          action: 'redirect',
          payload: `/free-trial?grade=${grade}&curriculum=${curr}&stream=${stream}`
        },
        {
          label: '🔄 Search for Another Child / Stream',
          value: 'restart',
          action: 'reset'
        }
      ]
    };

    setMessages((prev) => [...prev, recMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    setInputText('');

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: formatTime()
    };

    setMessages((prev) => [...prev, userMsg]);

    // Match FAQ knowledge base or general fallback
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let matchedAnswer: string | null = null;

      for (const faq of FAQ_KNOWLEDGE_BASE) {
        if (faq.keywords.some((k) => lowerQuery.includes(k))) {
          matchedAnswer = faq.answer;
          break;
        }
      }

      if (matchedAnswer) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-faq-${Date.now()}`,
            sender: 'bot',
            text: matchedAnswer,
            timestamp: formatTime(),
            options: [
              { label: '📚 Explore Curriculum Syllabi', value: '/curriculum', action: 'redirect', payload: '/curriculum' },
              { label: '🎓 Start Programme Finder', value: 'finder', action: 'reset' },
              { label: '✍️ Book Free Trial Class', value: '/free-trial', action: 'redirect', payload: '/free-trial' }
            ]
          }
        ]);
      } else {
        // Fallback with helpful direction
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-fallback-${Date.now()}`,
            sender: 'bot',
            text: `Thank you for your question! TutorAstra provides dedicated one-to-one learning with personalised study plans across **Mathematics, Physics, Chemistry, Biology, Science, English, and more**.\n\nWould you like me to guide you to the right subjects or would you prefer booking a free 1-on-1 consultation?`,
            timestamp: formatTime(),
            options: [
              { label: '🧭 Guide Me By Student Grade', value: 'start', action: 'reset' },
              { label: '⭐ Book Free Consultation', value: '/free-trial', action: 'redirect', payload: '/free-trial' },
              { label: '📞 Speak with an Academic Advisor', value: '/contact', action: 'redirect', payload: '/contact' }
            ]
          }
        ]);
      }
    }, 400);
  };

  if (
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/parent-login') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/teacher') ||
    pathname?.startsWith('/student')
  ) {
    return null;
  }

  return (
    <>
      {/* ============================================================
          FLOATING LAUNCHER BUTTONS (Chatbot & WhatsApp below)
         ============================================================ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 select-none">
        {/* 1. Academic Advisor Chatbot Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Academic Advisor' : 'Open TutorAstra Academic Advisor'}
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            isOpen ? 'bg-[#1E1E24]' : 'bg-[#310064]'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F4CC45] rounded-full border-2 border-[#310064]" />
            </div>
          )}
        </button>

        {/* 2. WhatsApp Button */}
        {!isOpen && (
          <a
            href="https://wa.me/971501234567?text=Hi%20TutorAstra%2C%20I%20would%20like%20to%20inquire%20about%201-on-1%20tutoring"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with TutorAstra on WhatsApp"
            className="w-12 h-12 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 group relative"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span className="absolute right-14 px-2.5 py-1 rounded bg-[#1E1E24] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-md">
              WhatsApp
            </span>
          </a>
        )}
      </div>

      {/* ============================================================
          CHATBOT MODAL WINDOW
         ============================================================ */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-24 sm:inset-auto sm:right-6 sm:bottom-24 sm:w-[420px] max-h-[85vh] h-[600px] z-50 bg-white rounded-3xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-royal px-5 py-4 text-white flex items-center justify-between border-b border-purple-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold text-royal flex items-center justify-center font-black shadow-xs">
                <Bot className="w-5 h-5 text-royal" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight text-white">TutorAstra Advisor</h3>
                  <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold-light text-[10px] font-bold border border-gold/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-purple-200">Personalised 1-on-1 Guidance Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={startConversation}
                title="Restart Conversation"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-[#F4CC45] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[90%]">
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-[#310064] text-[#F4CC45] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#310064] text-white shadow-xs'
                        : 'bg-white text-neutral-800 shadow-xs border border-[#E5E5EB]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                    {/* Recommendation Card */}
                    {msg.recommendation && (
                      <div className="mt-3 p-3.5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-[#E5E5EB]">
                          <span className="text-[10px] font-bold text-[#310064] uppercase tracking-wider">
                            {msg.recommendation.curriculumText} • {msg.recommendation.gradeText}
                          </span>
                          <span className="text-[10px] font-bold text-[#310064] bg-neutral-100 px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        </div>

                        <h4 className="text-xs font-heading font-bold text-[#1E1E24]">{msg.recommendation.title}</h4>

                        <div className="space-y-1.5 text-[11px] text-neutral-600 font-sans">
                          {msg.recommendation.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#310064] shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-2 rounded-md bg-white border border-[#E5E5EB] text-[10px] text-neutral-500">
                          <strong className="text-[#1E1E24] font-bold">Focus:</strong> {msg.recommendation.termFocus}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Choice Buttons */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2.5 space-y-1.5 w-full pl-9">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleOptionClick(opt)}
                        className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between gap-2 border ${
                          opt.action === 'redirect'
                            ? 'bg-[#310064] text-white hover:bg-[#25004c] border-[#310064] shadow-xs'
                            : opt.action === 'reset'
                            ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-[#E5E5EB]'
                            : 'bg-white hover:bg-neutral-50 text-[#1E1E24] hover:text-[#310064] border-[#E5E5EB] shadow-xs'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {opt.action === 'redirect' ? (
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#F4CC45]" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-neutral-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-[#E5E5EB] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything (e.g. fees, schedule, trial)..."
              className="flex-1 px-3 py-2 rounded-lg border border-[#E5E5EB] text-xs text-[#1E1E24] placeholder:text-neutral-400 focus:outline-none focus:border-[#310064]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-8 h-8 rounded-lg bg-[#310064] disabled:opacity-40 text-white flex items-center justify-center shrink-0 hover:bg-[#25004c] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
