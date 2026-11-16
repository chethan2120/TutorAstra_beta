'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUp, Sparkles } from 'lucide-react';

export default function ScrollAction() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const showScrollTopRef = useRef(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && progressBarRef.current) {
          const ratio = Math.min(1, Math.max(0, window.scrollY / totalHeight));
          progressBarRef.current.style.transform = `scaleX(${ratio})`;
        }

        const isOver300 = window.scrollY > 300;
        if (isOver300 !== showScrollTopRef.current) {
          showScrollTopRef.current = isOver300;
          setShowScrollTop(isOver300);
        }

        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* 1. Top Reading Scroll Progress Bar - High-performance GPU scaleX transform, 0 reflows */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-slate-200/20"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
      >
        <div
          ref={progressBarRef}
          className="h-full w-full bg-gradient-to-r from-brand-blue via-brand-lime to-brand-blue origin-left will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* 2. Floating Back To Top Button (Positioned Bottom-Left to Avoid Floating Chatbot Clashes) */}
      <div
        className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="w-10 h-10 rounded-lg bg-white text-[#310064] border border-[#E5E5EB] shadow-md hover:bg-[#310064] hover:text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 group"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </>
  );
}
