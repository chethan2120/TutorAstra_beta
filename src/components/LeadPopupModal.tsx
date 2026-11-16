'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ArrowRight, Loader2, Phone, User } from 'lucide-react';

export default function LeadPopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if popup was already closed or submitted during this session
    const alreadySeen = typeof window !== 'undefined' ? sessionStorage.getItem('tutorastra_demo_popup_shown') : null;
    if (alreadySeen) return;

    // Trigger popup exactly 4 seconds after page load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tutorastra_demo_popup_shown', 'true');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
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
          parent_name: name.trim(),
          student_name: name.trim(),
          email: `${name.trim().toLowerCase().replace(/\s+/g, '')}@lead.tutorastra.com`,
          phone: phone.trim(),
          grade: 'Secondary Grade',
          curriculum: 'CBSE / British',
          subjects: 'Free 1-on-1 Demo Session',
          notes: 'Captured via 4-second instant demo popup modal',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit demo request. Please try again.');
      }

      setSubmitted(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tutorastra_demo_popup_shown', 'true');
      }

      // Auto close after 3.5 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E5EB] overflow-hidden p-6 sm:p-7">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close demo booking popup"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#F5F0FF] text-[#310064] flex items-center justify-center mx-auto border border-[#DDD6FE]">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#1E1E24]">
              Free Demo Requested!
            </h3>
            <p className="text-xs sm:text-sm text-[#5A5A65] font-sans max-w-xs mx-auto leading-relaxed">
              Thank you, <strong>{name}</strong>! Our academic counselor will WhatsApp/call you on <strong>{phone}</strong> shortly to confirm your time slot.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FFF9E6] border border-[#FDE68A] text-[11px] font-heading font-bold text-[#B8860B]">
              <Sparkles className="w-3.5 h-3.5 text-[#F4CC45]" />
              <span>Complimentary 20-Min Session</span>
            </div>

            {/* Header */}
            <div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#1E1E24] tracking-tight">
                Book a Free <span className="text-[#310064]">1-on-1 Demo</span>
              </h3>
              <p className="text-xs text-[#5A5A65] font-sans mt-1 leading-relaxed">
                Connect directly with a dedicated tutor. We evaluate your child’s learning needs and share a tailored study roadmap.
              </p>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            {/* Field 1: Name */}
            <div>
              <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. David Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-standard pl-9 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Field 2: Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-[#1E1E24] mb-1">
                Phone Number / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-standard pl-9 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-11 text-xs sm:text-sm font-heading font-semibold shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#F4CC45]" />
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <span>Book Your Free Demo</span>
                    <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-[#8E8E98] text-center mt-2 font-sans">
                🔒 Zero obligation • We respect parent privacy
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
