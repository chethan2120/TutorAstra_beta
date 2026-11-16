'use client';

import React, { useState } from 'react';
import { Check, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function ConsultationSection() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentGrade, setStudentGrade] = useState('Grade 10');
  const [preferredSubject, setPreferredSubject] = useState('Mathematics');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string | number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setError('Please provide a valid contact number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/free-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_name: fullName.trim(),
          student_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          grade: studentGrade,
          curriculum: 'Secondary Curriculum',
          subjects: preferredSubject,
          notes: `Preferred Date: ${preferredDate || 'Earliest available'}. Message: ${message || 'None'}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }

      setSubmitted(true);
      setReferenceId(data.id || 'CONFIRMED');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-[#FAF7FD] border-b border-[#EAE2F6]">
      <div id="consultation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Context & Expectations (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FBFBFC] border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
              <span>Book a Consultation</span>
            </div>

            <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E1E24] tracking-tight leading-tight">
              Begin with a Complimentary Academic Discovery Session.
            </h2>

            <p className="text-base text-[#5A5A65] leading-relaxed">
              Speak directly with an academic advisor. We discuss your child's curriculum goals, review current challenges, and propose a tailored tutor match.
            </p>

            {/* Consultation Feature Image with 2D Floating Badges (User Requested) */}
            <div className="relative rounded-xl overflow-hidden border border-[#E5E5EB] bg-[#FBFBFC] shadow-sm aspect-[16/10] my-4">
              <img
                src="/hero-one-on-one.jpg"
                alt="One-to-one academic consultation session with an expert tutor"
                className="w-full h-full object-cover"
              />
              {/* 2D Floating Badge 1 */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md border border-[#E5E5EB] shadow-xs flex items-center gap-2 animate-float-slow">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-heading font-bold text-[#1E1E24]">Live Diagnostic Match</span>
              </div>
              {/* 2D Floating Badge 2 */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md border border-[#E5E5EB] shadow-xs flex items-center gap-1.5 animate-float-reverse">
                <span className="text-xs">⭐</span>
                <span className="text-[11px] font-heading font-bold text-[#310064]">Dedicated 1-on-1</span>
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-sm text-[#1E1E24]">
                <div className="w-5 h-5 rounded-full bg-[#F5F5F7] text-[#310064] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  1
                </div>
                <div>
                  <strong className="block font-heading font-semibold">20-Minute Diagnostic Discussion</strong>
                  <span className="text-xs text-[#5A5A65]">An academic advisor evaluates syllabus requirements and target exam goals.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-[#1E1E24]">
                <div className="w-5 h-5 rounded-full bg-[#F5F5F7] text-[#310064] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  2
                </div>
                <div>
                  <strong className="block font-heading font-semibold">Verified Mentor Matching</strong>
                  <span className="text-xs text-[#5A5A65]">We pair your student with a vetted specialist matched to their learning speed.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-[#1E1E24]">
                <div className="w-5 h-5 rounded-full bg-[#F5F5F7] text-[#310064] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  3
                </div>
                <div>
                  <strong className="block font-heading font-semibold">Zero Obligation</strong>
                  <span className="text-xs text-[#5A5A65]">No credit card required. Parents decide after reviewing the proposed study plan.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Consultation Booking Form (7 cols) */}
          <div className="lg:col-span-7 card-standard p-6 sm:p-8 bg-white">
            {submitted ? (
              <div className="p-6 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#310064] text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#1E1E24]">
                    Consultation Request Confirmed
                  </h3>
                  <p className="text-sm text-[#5A5A65] mt-1.5 leading-relaxed">
                    Thank you, <strong>{fullName}</strong>. Our academic team has received your request and will contact you via <strong>{phone}</strong> and <strong>{email}</strong> within 24 hours to schedule your session.
                  </p>
                </div>
                <div className="p-3 bg-white rounded border border-[#E5E5EB] text-xs font-mono text-[#310064]">
                  Enquiry Reference: #TA-{referenceId}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFullName('');
                    setEmail('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="text-xs font-heading font-semibold text-[#310064] underline hover:text-[#420085]"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-[#E5E5EB] pb-3 mb-2">
                  <h3 className="font-heading font-bold text-lg text-[#1E1E24]">
                    Request Your Free Consultation
                  </h3>
                  <p className="text-xs text-[#5A5A65] mt-0.5">
                    All fields marked with an asterisk (*) are required.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#1E1E24] mb-1.5">
                    Parent or Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Meera Patel"
                    className="input-standard"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#1E1E24] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="input-standard"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#1E1E24] mb-1.5">
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="input-standard"
                    />
                  </div>
                </div>

                {/* Grade & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#1E1E24] mb-1.5">
                      Student Grade
                    </label>
                    <select
                      value={studentGrade}
                      onChange={(e) => setStudentGrade(e.target.value)}
                      className="input-standard cursor-pointer"
                    >
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10 (Board Exam)</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12 (Senior Board)</option>
                      <option value="Grade 8">Grade 8 (Middle School)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#1E1E24] mb-1.5">
                      Primary Subject
                    </label>
                    <select
                      value={preferredSubject}
                      onChange={(e) => setPreferredSubject(e.target.value)}
                      className="input-standard cursor-pointer"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Integrated Science">Integrated Science</option>
                      <option value="English & Literature">English & Literature</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#1E1E24] mb-1.5">
                    Preferred Consultation Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="input-standard"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#1E1E24] mb-1.5">
                    Notes or Specific Goals (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mention specific difficult topics or upcoming test dates..."
                    className="w-full p-2.5 rounded-lg border border-[#E5E5EB] bg-white text-sm text-[#1E1E24] focus:outline-none focus:border-[#310064]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full text-sm font-heading font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Consultation Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 text-center text-xs text-[#5A5A65]">
                  Your contact details are strictly confidential and used solely for academic counseling.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
