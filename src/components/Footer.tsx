'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, User, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#310064] text-neutral-300 pt-16 pb-12 border-t border-[#420085]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#420085]">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="lg" />

            <p className="text-sm text-neutral-300 max-w-sm leading-relaxed mt-2">
              TutorAstra delivers focused one-to-one tutoring, personalised study roadmaps, and continuous milestone tracking for students in Grades 9 through 12.
            </p>

            <div className="pt-2 space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#F4CC45] shrink-0" />
                <span>Dubai Knowledge Park, Dubai, United Arab Emirates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F4CC45] shrink-0" />
                <a href="mailto:admissions@tutorastra.com" className="hover:text-white transition-colors">
                  admissions@tutorastra.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F4CC45] shrink-0" />
                <a href="tel:+97142345678" className="hover:text-white transition-colors">
                  +971 4 234 5678
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 text-xs">
              <span className="font-heading font-semibold text-[#F4CC45] uppercase tracking-wider">Social:</span>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                LinkedIn
              </a>
              <span className="text-neutral-500">•</span>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
              <span className="text-neutral-500">•</span>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                YouTube
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <a href="/#home" onClick={(e) => scrollTo(e, 'home')} className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/#about" onClick={(e) => scrollTo(e, 'about')} className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#subjects" onClick={(e) => scrollTo(e, 'subjects')} className="hover:text-white transition-colors">
                  Subjects
                </a>
              </li>
              <li>
                <a href="/#how-it-works" onClick={(e) => scrollTo(e, 'how-it-works')} className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#ai-tutor" onClick={(e) => scrollTo(e, 'ai-tutor')} className="hover:text-white transition-colors">
                  AI Tutor (Ms. Violet)
                </a>
              </li>
              <li>
                <a href="/#contact" onClick={(e) => scrollTo(e, 'contact')} className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Academic Subjects */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Subjects (Grades 9–12)
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <a href="/#subjects" onClick={(e) => scrollTo(e, 'subjects')} className="hover:text-white transition-colors">
                  Mathematics
                </a>
              </li>
              <li>
                <a href="/#subjects" onClick={(e) => scrollTo(e, 'subjects')} className="hover:text-white transition-colors">
                  Physics
                </a>
              </li>
              <li>
                <a href="/#subjects" onClick={(e) => scrollTo(e, 'subjects')} className="hover:text-white transition-colors">
                  Chemistry
                </a>
              </li>
              <li>
                <a href="/#subjects" onClick={(e) => scrollTo(e, 'subjects')} className="hover:text-white transition-colors">
                  Biology
                </a>
              </li>
              <li>
                <a href="/#subjects" onClick={(e) => scrollTo(e, 'subjects')} className="hover:text-white transition-colors">
                  Integrated Science
                </a>
              </li>
              <li>
                <a href="/#subjects" onClick={(e) => scrollTo(e, 'subjects')} className="hover:text-white transition-colors">
                  English & Literature
                </a>
              </li>
            </ul>
          </div>

          {/* Portal Access & Legal */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Portals & Legal
            </h4>

            <div className="space-y-2">
              <Link
                href="/login"
                className="w-full h-10 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-heading font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#F4CC45]" />
                <span>Student / Parent Login</span>
              </Link>

              <a
                href="#consultation"
                onClick={(e) => scrollTo(e, 'consultation')}
                className="btn-gold w-full h-10 text-xs font-heading font-bold"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <ul className="pt-2 space-y-1.5 text-xs text-neutral-300">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-neutral-400 hover:text-white transition-colors">
                  Educator & Admin Portal →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} TutorAstra. All rights reserved. Your Ambition. Our Mission.</p>

          {/* Mandatory Credit: Exact text with only WebNxt clickable */}
          <p className="text-center sm:text-right">
            Designed and Maintained by{' '}
            <a
              href="https://webnxt.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#F4CC45] font-heading font-bold underline transition-colors"
            >
              WebNxt
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
