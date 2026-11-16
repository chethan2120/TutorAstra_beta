'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function FreeTrialForm() {
  const searchParams = useSearchParams();
  const initialStream = searchParams.get('stream') || '';
  const initialBundle = searchParams.get('bundle') || '';

  const [formData, setFormData] = useState({
    parent_name: '',
    email: '',
    phone: '',
    student_name: '',
    grade: 'Grade 9',
    curriculum: 'CBSE',
    interested_stream: initialStream || (initialBundle ? initialBundle.replace(/-/g, ' ') : 'Science'),
    preferred_contact_method: 'WhatsApp',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.parent_name.trim()) errors.parent_name = 'Parent name is required';
    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      errors.email = 'Please provide a valid email address';
    }
    if (!formData.student_name.trim()) errors.student_name = 'Student name is required';
    if (!formData.grade) errors.grade = 'Please select your child’s grade';
    if (!formData.curriculum) errors.curriculum = 'Please select a curriculum';
    if (!formData.interested_stream) errors.interested_stream = 'Please choose a subject for the consultation';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/free-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setSuccessMessage(data.message || 'Free consultation successfully booked!');
      setFormData({
        parent_name: '',
        email: '',
        phone: '',
        student_name: '',
        grade: 'Grade 9',
        curriculum: 'CBSE',
        interested_stream: 'Science',
        preferred_contact_method: 'WhatsApp',
        message: ''
      });
      setFieldErrors({});
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 sm:p-8 border border-[#E5E5EB] shadow-xs">
      {successMessage ? (
        <div className="text-center py-10 space-y-3">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 text-[#310064] flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-[#1E1E24]">Consultation Confirmed</h3>
          <p className="text-xs sm:text-sm font-sans text-neutral-600 max-w-md mx-auto leading-relaxed">
            {successMessage}
          </p>
          <div className="p-3.5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] max-w-md mx-auto text-xs text-neutral-500 font-sans">
            Our academic coordinator will contact you via {formData.preferred_contact_method || 'WhatsApp'} to confirm your consultation schedule.
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="btn-secondary px-5 py-2 text-xs font-semibold mt-4"
          >
            Book Another Consultation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Parent Details */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              1. Parent / Guardian Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                  Parent Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-sans text-[#1E1E24] placeholder:text-neutral-400 focus:outline-none focus:border-[#310064] transition-all ${
                    fieldErrors.parent_name ? 'border-rose-400 bg-rose-50/30' : 'border-[#E5E5EB]'
                  }`}
                />
                {fieldErrors.parent_name && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.parent_name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-sans text-[#1E1E24] placeholder:text-neutral-400 focus:outline-none focus:border-[#310064] transition-all ${
                    fieldErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-[#E5E5EB]'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5EB] text-xs sm:text-sm font-sans text-[#1E1E24] placeholder:text-neutral-400 focus:outline-none focus:border-[#310064]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                  Preferred Contact Channel
                </label>
                <select
                  value={formData.preferred_contact_method}
                  onChange={(e) => setFormData({ ...formData, preferred_contact_method: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5EB] text-xs sm:text-sm font-sans text-[#1E1E24] bg-white focus:outline-none focus:border-[#310064]"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Email">Email</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Student Information */}
          <div className="pt-3 border-t border-[#E5E5EB]">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              2. Student & Subject Selection
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ethan Jenkins"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-sans text-[#1E1E24] placeholder:text-neutral-400 focus:outline-none focus:border-[#310064] transition-all ${
                    fieldErrors.student_name ? 'border-rose-400 bg-rose-50/30' : 'border-[#E5E5EB]'
                  }`}
                />
                {fieldErrors.student_name && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.student_name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                  Student Grade / Year <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5EB] text-xs sm:text-sm font-sans text-[#1E1E24] bg-white focus:outline-none focus:border-[#310064]"
                >
                  <option value="Grade 9">Grade 9 (British Year 10)</option>
                  <option value="Grade 10">Grade 10 (British Year 11)</option>
                  <option value="Grade 11">Grade 11 (British Year 12 / AS)</option>
                  <option value="Grade 12">Grade 12 (British Year 13 / A-Level)</option>
                  <option value="Grade 6">Grade 6 (British Year 7)</option>
                  <option value="Grade 7">Grade 7 (British Year 8)</option>
                  <option value="Grade 8">Grade 8 (British Year 9)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                  Curriculum <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.curriculum}
                  onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5EB] text-xs sm:text-sm font-sans text-[#1E1E24] bg-white focus:outline-none focus:border-[#310064]"
                >
                  <option value="CBSE">CBSE (NCERT Aligned)</option>
                  <option value="British">British (IGCSE / GCSE / A-Level)</option>
                  <option value="IB">International Baccalaureate (IB)</option>
                  <option value="ICSE">ICSE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                  Subject of Focus <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.interested_stream}
                  onChange={(e) => setFormData({ ...formData, interested_stream: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5EB] text-xs sm:text-sm font-sans text-[#1E1E24] bg-white focus:outline-none focus:border-[#310064]"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="AI for Students">AI & Future Tech</option>
                  <option value="Public Speaking">Public Speaking & Debate</option>
                  <option value="Multiple Subjects">Multiple Subjects</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Additional Notes */}
          <div className="pt-3 border-t border-[#E5E5EB]">
            <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
              Learning Goals or Academic Concerns (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Tell us about your child's current challenges, specific exam boards, or preferred schedule..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5EB] text-xs sm:text-sm font-sans text-[#1E1E24] placeholder:text-neutral-400 focus:outline-none focus:border-[#310064]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-xs sm:text-sm font-heading font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F4CC45]" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F4CC45]" />
                  <span>Book Free Consultation</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-neutral-400 font-sans mt-2">
              We respect your privacy. Your information is never shared with third parties.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
