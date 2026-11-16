'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, User } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  // Maximum five primary navigation links (Strict Requirement)
  const navLinks = [
    { label: 'Home', href: '/#home', id: 'home' },
    { label: 'About Us', href: '/#about', id: 'about' },
    { label: 'Subjects', href: '/#subjects', id: 'subjects' },
    { label: 'AI Tutor', href: '/#ai-tutor', id: 'ai-tutor' },
    { label: 'Contact', href: '/#contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
      const scrollPosition = window.scrollY + 140;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const item = navLinks[i];
        const el = document.getElementById(item.id);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      setMobileMenuOpen(false);
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Dark Theme Header (User Requirement: Keep header and footer a dark color only) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-[#220046]/95 backdrop-blur-md border-b border-[#36006E] ${
          isScrolled ? 'shadow-lg py-0' : 'shadow-md py-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo on the left (Light variant on dark background) */}
            <div className="shrink-0">
              <BrandLogo size="md" variant="light" />
            </div>

            {/* Navigation in the centre (Max 5 links) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
                      isActive
                        ? 'text-[#F4CC45] font-bold bg-white/10'
                        : 'text-neutral-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Right Action Controls: Login + Consultation Button */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-white text-xs sm:text-sm font-heading font-semibold transition-colors flex items-center gap-1.5"
                title="Portal Login"
              >
                <User className="w-4 h-4 text-[#F4CC45]" />
                <span>Login</span>
              </Link>

              <a
                href="#consultation"
                onClick={(e) => handleNavClick(e, 'consultation')}
                className="px-5 py-2.5 rounded-lg bg-[#F4CC45] text-[#220046] hover:bg-[#F6D55E] text-xs sm:text-sm font-heading font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span>Book a Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/login"
                className="px-3 h-9 rounded-lg border border-white/20 bg-white/10 text-xs font-heading font-semibold text-white flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#F4CC45]" />
                <span>Login</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="p-2 rounded-lg text-white hover:bg-white/10 border border-white/20"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#36006E] bg-[#220046] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors ${
                    isActive
                      ? 'text-[#F4CC45] font-bold bg-white/10'
                      : 'text-neutral-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <a
                href="#consultation"
                onClick={(e) => handleNavClick(e, 'consultation')}
                className="w-full h-11 rounded-lg bg-[#F4CC45] text-[#220046] font-bold text-center text-sm font-heading flex items-center justify-center gap-2 shadow-md"
              >
                <span>Book a Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 rounded-lg border border-white/20 bg-white/5 text-white text-xs font-heading font-semibold flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-[#F4CC45]" />
                <span>Portal Login</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent page content from being hidden behind fixed header */}
      <div className="h-20 w-full shrink-0" aria-hidden="true" />
    </>
  );
}
