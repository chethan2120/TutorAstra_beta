'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      errors.email = 'Please provide a valid email address';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errors.message = 'Message must be at least 5 characters long';
    }

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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccessMessage(data.message || 'Thank you! Your message has been sent successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setFieldErrors({});
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while sending your message. Please try again.');
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
          <h3 className="text-xl font-heading font-bold text-[#1E1E24]">Message Received</h3>
          <p className="text-xs sm:text-sm font-sans text-neutral-600 max-w-md mx-auto leading-relaxed">
            {successMessage}
          </p>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="btn-secondary px-5 py-2 text-xs font-semibold mt-4"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. David Miller"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-sans text-[#1E1E24] placeholder:text-neutral-400 focus:outline-none focus:border-[#310064] transition-all ${
                  fieldErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-[#E5E5EB]'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.name}</p>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                Phone Number (Optional)
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
                Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Enquiry about Grade 10 Science Schedule"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-sans text-[#1E1E24] placeholder:text-neutral-400 focus:outline-none focus:border-[#310064] transition-all ${
                  fieldErrors.subject ? 'border-rose-400 bg-rose-50/30' : 'border-[#E5E5EB]'
                }`}
              />
              {fieldErrors.subject && (
                <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.subject}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="How can our academic team help you today? Ask questions about tutors, curriculum pathways, class timings, or personalized learning plans..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-sans text-[#1E1E24] placeholder:text-neutral-400 focus:outline-none focus:border-[#310064] transition-all ${
                fieldErrors.message ? 'border-rose-400 bg-rose-50/30' : 'border-[#E5E5EB]'
              }`}
            />
            {fieldErrors.message && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-xs sm:text-sm font-heading font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#F4CC45]" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#F4CC45]" />
                <span>Send Message to Academic Advisors</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
