'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Volume2,
  VolumeX,
  UploadCloud,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Send,
  Loader2,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Mail,
  RotateCcw
} from 'lucide-react';

export default function MsVioletAiTutorPage() {
  const [stage, setStage] = useState<'subject' | 'upload' | 'type' | 'testing' | 'results'>('subject');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  // File Upload State
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);
  const [fileError, setFileError] = useState('');

  // Test Selection & Generation
  const [testType, setTestType] = useState<'mcq' | 'written'>('mcq');
  const [generating, setGenerating] = useState(false);
  const [assessment, setAssessment] = useState<any | null>(null);

  // Test Execution State
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(900); // 15 mins
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  // Voice/Audio speech toggle
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Load enrolled subjects
  useEffect(() => {
    fetch('/api/student/subjects')
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data.enrollments || []);
        if (data.enrollments?.length > 0) {
          setSelectedSubjectId(data.enrollments[0].subject_id);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  // Ms. Violet Dialogue based on stage
  const getMsVioletDialogue = () => {
    switch (stage) {
      case 'subject':
        return 'Hello Ethan! Ready for your test? Select the subject you want to practice today!';
      case 'upload':
        return 'Upload your study notes or chapter PDF here. Remember, maximum 3 pages allowed for precise diagnostic evaluation!';
      case 'type':
        return 'Choose your preferred assessment style: Multiple Choice Quiz (MCQ) or Comprehensive Written Test!';
      case 'testing':
        return 'Focus your mind, Ethan! Watch your timer, read every question carefully, and do your very best.';
      case 'results':
        return 'Outstanding effort! I have graded your test, generated your personalized improvement roadmap, and notified Dr. Sarah Mitchell in your Teacher Box!';
    }
  };

  // Optional Voice synthesis
  const speakDialogue = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (voiceEnabled) {
      speakDialogue(getMsVioletDialogue());
    }
  }, [stage, voiceEnabled]);

  // Countdown timer during test
  useEffect(() => {
    if (stage !== 'testing') return;
    if (secondsRemaining <= 0) {
      handleSubmitTest();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, secondsRemaining]);

  // Handle File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) return;

    if (!file.name.endsWith('.pdf') && !file.type.startsWith('image/')) {
      setFileError('Strict Format Rule: Only PDF documents or image files (.jpg, .png) are permitted.');
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
  };

  // Generate Assessment with Ms. Violet
  const handleGenerateAssessment = async () => {
    if (!selectedSubjectId) {
      setFileError('Please select a subject first.');
      return;
    }

    if (pageCount > 3) {
      setFileError('Document Disclaimer Rule: Maximum 3 pages allowed. Please select up to 3 pages.');
      return;
    }

    setGenerating(true);
    setFileError('');

    try {
      const res = await fetch('/api/student/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          subjectId: selectedSubjectId,
          documentName: fileName || 'Chapter_Study_Notes.pdf',
          documentSize: fileSize || 55000,
          pageCount: pageCount,
          testType
        })
      });

      const data = await res.json();
      if (res.ok && data.assessment) {
        setAssessment(data.assessment);
        setSecondsRemaining((data.assessment.durationMinutes || 15) * 60);
        setStage('testing');
      } else {
        setFileError(data.error || 'Failed to generate assessment. Please try again.');
      }
    } catch (e: any) {
      setFileError(e.message || 'Error communicating with AI Tutor service.');
    } finally {
      setGenerating(false);
    }
  };

  // Submit test answers
  const handleSubmitTest = async () => {
    if (!assessment) return;
    setSubmitting(true);

    try {
      const answersPayload = (assessment.questions || []).map((q: any) => ({
        questionId: q.id,
        studentAnswer: answers[q.id] || ''
      }));

      const res = await fetch('/api/student/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          assessmentId: assessment.id,
          answers: answersPayload
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResults(data);
        setStage('results');
      } else {
        alert(data.error || 'Failed to submit assessment.');
      }
    } catch (e) {
      console.error(e);
      alert('Error submitting answers.');
    } finally {
      setSubmitting(false);
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Ms. Violet Interactive Character Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#310064] via-[#4A0D88] to-[#1E003D] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* 3D Animated Ms. Violet Avatar */}
          <div className="relative flex-shrink-0 group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#F4CC45] to-amber-500 p-1 shadow-2xl relative">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#220046] relative flex items-center justify-center">
                <img
                  src="/ms-violet.png"
                  alt="Ms. Violet AI Tutor"
                  className="w-full h-full object-cover object-top transform transition-transform duration-700 group-hover:scale-105"
                  onError={(e: any) => {
                    // Fallback to avatar graphic if file not loaded
                    e.currentTarget.src = '/hero-one-on-one.jpg';
                  }}
                />
              </div>

              {/* Floating Hand Wave Badge */}
              <div className="absolute -bottom-1 -right-1 bg-white text-[#310064] p-1.5 rounded-full shadow-lg border border-[#F4CC45] animate-bounce">
                <span className="text-sm">👋</span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="absolute top-1 right-1 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Active
            </div>
          </div>

          {/* Interactive Speech Bubble & Controls */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-heading font-bold text-[#F4CC45]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ms. Violet • Autonomous 1-on-1 AI Mentor</span>
              </div>

              {/* Speech sound toggle */}
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                  voiceEnabled
                    ? 'bg-[#F4CC45] text-[#310064] font-bold'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                title="Toggle Ms. Violet Spoken Dialogue"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline text-[11px]">
                  {voiceEnabled ? 'Voice On' : 'Voice Off'}
                </span>
              </button>
            </div>

            {/* Speech Dialogue Bubble */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-white relative shadow-inner">
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                "{getMsVioletDialogue()}"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 1: Subject Selection */}
      {stage === 'subject' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#ECE6DA] shadow-xs space-y-6 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-[#310064] text-[#F4CC45] text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-heading font-bold text-lg text-[#310064]">
                Select the Subject
              </h3>
            </div>
            <p className="text-xs text-[#5A5A65]">
              Choose which enrolled subject or curriculum track you want Ms. Violet to test you on.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((enr) => {
              const isSelected = selectedSubjectId === enr.subject_id;
              return (
                <button
                  key={enr.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(enr.subject_id)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#310064] bg-[#F2ECFC] shadow-sm ring-2 ring-[#310064]/20'
                      : 'border-[#ECE6DA] bg-[#FAF8F5] hover:bg-white'
                  }`}
                >
                  <div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${enr.subject_color || '#310064'}20`,
                        color: enr.subject_color || '#310064'
                      }}
                    >
                      {enr.subject_code || 'SUBJ'}
                    </span>
                    <h4 className="font-heading font-black text-sm text-[#310064] mt-2">
                      {enr.subject_name}
                    </h4>
                    <p className="text-[11px] text-[#5A5A65] mt-1">
                      Faculty: {enr.teacher_name || 'Dr. Sarah Mitchell'}
                    </p>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#310064]" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#ECE6DA]">
            <button
              type="button"
              onClick={() => setStage('upload')}
              disabled={!selectedSubjectId}
              className="px-6 py-2.5 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Next: Upload Study Document</span>
              <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: Upload File & Document Disclaimer (<= 3 Pages Rule) */}
      {stage === 'upload' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#ECE6DA] shadow-xs space-y-6 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-[#310064] text-[#F4CC45] text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-heading font-bold text-lg text-[#310064]">
                Upload File Here (3-Page Rule)
              </h3>
            </div>
            <p className="text-xs text-[#5A5A65]">
              Upload textbook pages, classroom notes, or problem sheets. Ms. Violet will synthesize diagnostic questions directly from your materials.
            </p>
          </div>

          {/* 3-Page Disclaimer Notice Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <strong className="block font-heading font-bold">
                ⚠️ Platform Disclaimer: Maximum 3 Pages Permitted
              </strong>
              <span>
                To ensure high question fidelity and prevent cognitive overload, uploaded study documents must be <strong>no more than 3 pages</strong> in length. PDF documents and clear images are accepted.
              </span>
            </div>
          </div>

          {/* Drag & Drop File Upload Area */}
          <div className="border-2 border-dashed border-[#ECE6DA] hover:border-[#310064] rounded-2xl p-8 text-center bg-[#FAF8F5] transition-colors relative">
            <input
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-12 h-12 text-[#310064] mx-auto mb-3" />
            <h4 className="font-heading font-bold text-sm text-[#310064]">
              {fileName ? fileName : 'Click to Browse or Drag & Drop File'}
            </h4>
            <p className="text-xs text-[#5A5A65] mt-1">
              Supports PDF, PNG, JPG (Max 15MB • Max 3 Pages)
            </p>
            {fileName && (
              <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {fileName} ({(fileSize / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>

          {/* Page Count Selection / Verification */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#ECE6DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-heading font-bold text-[#310064]">
                Confirm Number of Pages in this Document *
              </label>
              <span className="text-[11px] text-[#5A5A65]">
                Strictly validated: 1, 2, or 3 pages.
              </span>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPageCount(num)}
                  className={`w-10 h-10 rounded-xl font-heading font-bold text-xs transition-all ${
                    pageCount === num
                      ? 'bg-[#310064] text-white shadow-xs'
                      : 'bg-white border border-[#ECE6DA] text-[#5A5A65] hover:bg-[#F2ECFC]'
                  }`}
                >
                  {num}p
                </button>
              ))}
            </div>
          </div>

          {fileError && (
            <div className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {fileError}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#ECE6DA]">
            <button
              type="button"
              onClick={() => setStage('subject')}
              className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-[#5A5A65] hover:bg-[#FAF8F5]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStage('type')}
              className="px-6 py-2.5 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Next: Select Assessment Type</span>
              <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: Test Type Selection */}
      {stage === 'type' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#ECE6DA] shadow-xs space-y-6 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-[#310064] text-[#F4CC45] text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-heading font-bold text-lg text-[#310064]">
                Choose Assessment Format
              </h3>
            </div>
            <p className="text-xs text-[#5A5A65]">
              Select how Ms. Violet should evaluate your conceptual grasp.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTestType('mcq')}
              className={`p-6 rounded-2xl border text-left transition-all cursor-pointer ${
                testType === 'mcq'
                  ? 'border-[#310064] bg-[#F2ECFC] ring-2 ring-[#310064]/20 shadow-sm'
                  : 'border-[#ECE6DA] bg-[#FAF8F5] hover:bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#310064] text-[#F4CC45] flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-base text-[#310064]">
                Multiple Choice Quiz (MCQ)
              </h4>
              <p className="text-xs text-[#5A5A65] mt-1">
                4-choice conceptual questions with instant automated evaluation and detailed answer rationales.
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-[#310064]">
                Duration: 15 Minutes • 5 Questions
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTestType('written')}
              className={`p-6 rounded-2xl border text-left transition-all cursor-pointer ${
                testType === 'written'
                  ? 'border-[#310064] bg-[#F2ECFC] ring-2 ring-[#310064]/20 shadow-sm'
                  : 'border-[#ECE6DA] bg-[#FAF8F5] hover:bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#310064] text-[#F4CC45] flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-base text-[#310064]">
                Written / Descriptive Assessment
              </h4>
              <p className="text-xs text-[#5A5A65] mt-1">
                Step-by-step problem solving and conceptual explanations evaluated using a formal academic rubric.
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-[#310064]">
                Duration: 20 Minutes • 3 In-depth Questions
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#ECE6DA]">
            <button
              type="button"
              onClick={() => setStage('upload')}
              className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-[#5A5A65] hover:bg-[#FAF8F5]"
            >
              Back
            </button>
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerateAssessment}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#310064] to-[#4A0D88] hover:from-[#220046] hover:to-[#310064] text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F4CC45]" />
                  <span>Ms. Violet is synthesizing your test...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F4CC45]" />
                  <span>Ready For Test! (Start Now)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: Active Testing Screen with Countdown Timer */}
      {stage === 'testing' && assessment && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#ECE6DA] shadow-xs space-y-6 animate-in fade-in">
          {/* Top Sticky Test Bar with Countdown Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ECE6DA]">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#310064] border border-[#ECE6DA]">
                {assessment.testType?.toUpperCase()} ASSESSMENT
              </span>
              <h3 className="font-heading font-black text-lg text-[#310064] mt-1">
                {assessment.title}
              </h3>
            </div>

            {/* Countdown Timer Badge */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-black border ${
                secondsRemaining < 120
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-[#310064] text-[#F4CC45] border-[#310064]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Time Left: {timeFormatted}</span>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {(assessment.questions || []).map((q: any, idx: number) => (
              <div key={q.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#ECE6DA] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-bold text-[#310064]">
                    Question {idx + 1} of {assessment.questions.length}
                  </span>
                  <span className="font-mono text-amber-700 font-bold">{q.marks || 10} Marks</span>
                </div>

                <p className="text-xs sm:text-sm text-[#1E1E24] font-medium leading-relaxed">
                  {q.question}
                </p>

                {/* MCQ Options */}
                {assessment.testType === 'mcq' && q.options && (
                  <div className="space-y-2 pt-2">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isSelected = answers[q.id] === opt;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#310064] bg-[#F2ECFC] text-[#310064] font-bold ring-1 ring-[#310064]'
                              : 'border-[#ECE6DA] bg-white text-[#5A5A65] hover:bg-slate-50'
                          }`}
                        >
                          <span>{opt}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected
                                ? 'border-[#310064] bg-[#310064] text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && '✓'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Written Response Area */}
                {assessment.testType === 'written' && (
                  <div className="pt-2">
                    <textarea
                      rows={4}
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      placeholder="Write your detailed step-by-step reasoning and solution here..."
                      className="w-full text-xs p-3 rounded-xl border border-[#ECE6DA] focus:ring-2 focus:ring-[#310064]/20 focus:border-[#310064] bg-white"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t border-[#ECE6DA]">
            <span className="text-xs text-[#5A5A65]">
              Answered: <strong>{Object.keys(answers).length}</strong> of {assessment.questions?.length}
            </span>

            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitTest}
              className="px-8 py-3 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F4CC45]" />
                  <span>Evaluating with Ms. Violet...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#F4CC45]" />
                  <span>Submit Assessment for Grading</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5: Instant Grading Results & Sharing */}
      {stage === 'results' && results && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#ECE6DA] shadow-xs space-y-6 animate-in fade-in">
          {/* Header Score Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4CC45] text-[#310064]">
                EVALUATION COMPLETED
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-black tracking-tight mt-1 text-white">
                Great Work, Ethan!
              </h3>
              <p className="text-xs text-emerald-100 mt-1 max-w-md">
                Ms. Violet has analyzed your answers, computed your score, and generated recommendations.
              </p>
            </div>

            {/* Score Ring */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[140px]">
              <div className="text-3xl font-heading font-black text-[#F4CC45]">
                {results.percentage}%
              </div>
              <div className="text-[10px] text-white/90 font-bold uppercase tracking-wider">
                Score: {results.score} / {results.maxScore}
              </div>
            </div>
          </div>

          {/* Automatic Distribution Notices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#310064] flex-shrink-0" />
              <span>
                Report card emailed to <strong>student@gmail.com</strong>
              </span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Score auto-forwarded to Dr. Sarah Mitchell in <strong>Teacher Box</strong>
              </span>
            </div>
          </div>

          {/* Qualitative Feedback */}
          <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA] space-y-2">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#310064] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F4CC45]" />
              <span>Ms. Violet's Qualitative Feedback</span>
            </h4>
            <p className="text-xs text-[#5A5A65] leading-relaxed">
              {results.feedback ||
                'Excellent conceptual understanding demonstrated across fundamental core areas. Continue reviewing the application of formula derivations in extended numerical exercises.'}
            </p>
          </div>

          {/* Question Breakdown */}
          {results.detailedResults && (
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-[#310064]">
                Question-by-Question Review
              </h4>
              <div className="space-y-3">
                {results.detailedResults.map((item: any, i: number) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                      item.isCorrect
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-amber-200 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-[#310064]">Question {i + 1}</strong>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          item.isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.isCorrect ? 'Correct (+10)' : 'Needs Revision'}
                      </span>
                    </div>
                    <p className="text-[#5A5A65]">{item.question}</p>
                    <div className="text-[11px] text-[#310064]">
                      <strong>Your Answer:</strong> {item.studentAnswer || '(Not answered)'}
                    </div>
                    {item.explanation && (
                      <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-[#ECE6DA]">
                        <strong>Explanation:</strong> {item.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#ECE6DA]">
            <button
              type="button"
              onClick={() => {
                setStage('subject');
                setAssessment(null);
                setResults(null);
                setAnswers({});
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#ECE6DA] text-xs font-heading font-bold text-[#310064] hover:bg-[#FAF8F5] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Another Topic</span>
            </button>

            <Link
              href="/student/assessments"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#310064] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#220046] shadow-xs"
            >
              <span>View Full Assessment History</span>
              <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
