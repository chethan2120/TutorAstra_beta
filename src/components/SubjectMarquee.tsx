'use client';

import React from 'react';

export default function SubjectMarquee() {
  const marqueeItems = [
    { label: 'MATHEMATICS', highlight: false },
    { label: 'PHYSICS', highlight: false },
    { label: 'CHEMISTRY', highlight: false },
    { label: 'BIOLOGY', highlight: false },
    { label: 'INTEGRATED SCIENCE', highlight: false },
    { label: 'ENGLISH & LITERATURE', highlight: false },
    { label: '1-ON-1 DEDICATED TUTORS', highlight: true },
    { label: 'GRADES 9TH – 12TH EXCELLENCE', highlight: false },
    { label: 'PERSONALISED STUDY ROADMAPS', highlight: false },
    { label: 'MS. VIOLET AI TUTOR', highlight: true },
    { label: 'YOUR AMBITION. OUR MISSION.', highlight: true },
  ];

  return (
    <div className="relative w-full bg-[#F6EEFD] py-3.5 border-y border-[#EADBFA] overflow-hidden select-none z-20">
      {/* Side fades for smooth appearance */}
      <div className="absolute left-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-r from-[#F6EEFD] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-l from-[#F6EEFD] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center">
        {/* Loop 1 */}
        <div className="flex items-center gap-6 sm:gap-10 shrink-0">
          {marqueeItems.map((item, idx) => (
            <div key={`m1-${idx}`} className="flex items-center gap-6 sm:gap-10">
              <span
                className={`text-xs sm:text-[13px] font-heading tracking-wider uppercase flex items-center gap-2 ${
                  item.highlight
                    ? 'text-[#310064] font-extrabold'
                    : 'text-[#5A5A65] font-semibold'
                }`}
              >
                {item.label}
              </span>
              <span className="text-[#F4CC45] text-xs">✦</span>
            </div>
          ))}
        </div>

        {/* Loop 2 */}
        <div className="flex items-center gap-6 sm:gap-10 shrink-0 ml-6 sm:ml-10">
          {marqueeItems.map((item, idx) => (
            <div key={`m2-${idx}`} className="flex items-center gap-6 sm:gap-10">
              <span
                className={`text-xs sm:text-[13px] font-heading tracking-wider uppercase flex items-center gap-2 ${
                  item.highlight
                    ? 'text-[#310064] font-extrabold'
                    : 'text-[#5A5A65] font-semibold'
                }`}
              >
                {item.label}
              </span>
              <span className="text-[#F4CC45] text-xs">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
