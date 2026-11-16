import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'auto';
}

export default function BrandLogo({
  className = '',
  showTagline = true,
  size = 'md',
  variant = 'auto',
}: BrandLogoProps) {
  const isDarkBg = variant === 'light'; // Light text for dark backgrounds

  const sizeClasses = {
    sm: {
      img: 'w-8 h-8',
      text: 'text-lg',
      sub: 'text-[8px] tracking-[0.14em]',
    },
    md: {
      img: 'w-9 h-9 sm:w-10 sm:h-10',
      text: 'text-xl sm:text-2xl',
      sub: 'text-[9px] sm:text-[10px] tracking-[0.16em]',
    },
    lg: {
      img: 'w-11 h-11 sm:w-12 sm:h-12',
      text: 'text-2xl sm:text-3xl',
      sub: 'text-[10px] sm:text-[11px] tracking-[0.18em]',
    },
  }[size];

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 ${className}`}
      aria-label="TutorAstra - Return to Homepage"
    >
      {/* Official TutorAstra Emblem */}
      <div className={`relative ${sizeClasses.img} rounded-full overflow-hidden border border-[#F4CC45] bg-[#310064] shrink-0 shadow-xs`}>
        <img
          src="/tutorastra-logo.jpg"
          alt="TutorAstra Official Emblem"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span
          className={`font-heading font-bold tracking-tight leading-none ${sizeClasses.text} ${
            isDarkBg ? 'text-white' : 'text-[#310064]'
          }`}
        >
          Tutor<span className="text-[#F4CC45]">Astra</span>
        </span>
        {showTagline && (
          <span
            className={`font-sans font-bold uppercase mt-1 leading-none ${sizeClasses.sub} ${
              isDarkBg ? 'text-neutral-300' : 'text-[#5A5A65]'
            }`}
          >
            Your Ambition. Our Mission.
          </span>
        )}
      </div>
    </Link>
  );
}
