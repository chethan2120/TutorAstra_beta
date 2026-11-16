import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { getAllPackages } from '@/lib/db';

interface PackageItem {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  streams_included: string;
  price_aed: number;
  billing_period: string;
  features: string;
  is_popular: number;
  is_published: number;
}

export default function PackagesSection({ initialPackages }: { initialPackages?: PackageItem[] }) {
  let packages: PackageItem[] = initialPackages || [];
  if (!packages || packages.length === 0) {
    try {
      packages = getAllPackages() as PackageItem[];
    } catch (e) {
      packages = [
        {
          id: 1,
          slug: 'core-bundle',
          name: 'Core Bundle',
          subtitle: 'Academic Foundations in Science & Mathematics',
          streams_included: JSON.stringify(['Science', 'Mathematics']),
          price_aed: 2999,
          billing_period: 'per term',
          features: JSON.stringify([
            'CBSE (NCERT) or British (KS3) alignment',
            'Dedicated One-to-One live instruction',
            'Weekly homework with personalized review',
            'Dedicated weekly doubt-clearing sessions',
            'Diagnostic assessment at commencement',
            'Mid-term checkpoint evaluation',
            'Comprehensive term report & parent conference'
          ]),
          is_popular: 0,
          is_published: 1
        },
        {
          id: 2,
          slug: 'future-skills-bundle',
          name: 'Future-Skills Bundle',
          subtitle: 'Applied AI & Executive Public Speaking',
          streams_included: JSON.stringify(['AI for Students', 'Public Speaking']),
          price_aed: 2999,
          billing_period: 'per term',
          features: JSON.stringify([
            'AI tools, prompting & research syntheses',
            'Public speaking, debate logic & keynote delivery',
            'Dedicated One-to-One coaching weekly',
            'Project-based capstone presentations',
            'Recorded speech reviews with rubric feedback',
            'Executive presentation coaching',
            'Official TutorAstra Capstone Certificate'
          ]),
          is_popular: 1,
          is_published: 1
        },
        {
          id: 3,
          slug: 'full-bundle',
          name: 'Full Bundle',
          subtitle: 'Complete Academic & Leadership Excellence',
          streams_included: JSON.stringify(['Science', 'Mathematics', 'AI for Students', 'Public Speaking']),
          price_aed: 4999,
          billing_period: 'per term',
          features: JSON.stringify([
            'All Four Streams: Science, Maths, AI & Speech',
            'Comprehensive One-to-One tailored schedule',
            'Complete CBSE or British KS3 coverage',
            'Priority academic and project mentorship',
            'Regular diagnostics and term assessments',
            'Capstone showcase and debate presentation',
            'Comprehensive parent reporting dashboard'
          ]),
          is_popular: 0,
          is_published: 1
        }
      ];
    }
  }

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] text-[#310064] text-xs font-semibold uppercase tracking-wider">
            Simple, Transparent Term Tuition
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E1E24] tracking-tight">
            Learning Options & <span className="text-[#310064]">Tuition Bundles</span>
          </h2>
          <p className="text-xs sm:text-sm font-sans text-neutral-600 leading-relaxed">
            Choose the right combination for your child. All bundles include live one-to-one mentoring, regular assignments, assessments, and parent consultations.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {packages.map((pkg) => {
            const isPopular = pkg.is_popular === 1;
            const features: string[] = typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features;
            const streams: string[] = typeof pkg.streams_included === 'string' ? JSON.parse(pkg.streams_included) : pkg.streams_included;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-lg p-6 flex flex-col justify-between transition-all duration-200 border ${
                  isPopular
                    ? 'bg-[#310064] text-white border-[#310064] shadow-md'
                    : 'bg-[#FBFBFC] text-[#1E1E24] border-[#E5E5EB] shadow-xs hover:border-[#310064]/30'
                }`}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F4CC45] text-[#310064] px-3 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#310064]" />
                    <span>Recommended</span>
                  </div>
                )}

                <div>
                  {/* Package Title & Subtitle */}
                  <div className="mb-5">
                    <h3 className={`text-xl font-heading font-bold ${isPopular ? 'text-white' : 'text-[#1E1E24]'}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-xs mt-1 font-sans ${isPopular ? 'text-neutral-200' : 'text-neutral-500'}`}>
                      {pkg.subtitle}
                    </p>
                  </div>

                  {/* Included Streams Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {streams.map((s, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                          isPopular
                            ? 'bg-white/15 text-[#F4CC45] border border-[#F4CC45]/30'
                            : 'bg-white text-[#310064] border border-[#E5E5EB]'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Price Tag */}
                  <div className={`mb-5 pb-5 border-b ${isPopular ? 'border-white/20' : 'border-[#E5E5EB]'}`}>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-xs font-semibold ${isPopular ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        AED
                      </span>
                      <span className={`text-3xl font-heading font-bold tracking-tight ${isPopular ? 'text-white' : 'text-[#1E1E24]'}`}>
                        {pkg.price_aed.toLocaleString()}
                      </span>
                      <span className={`text-xs ${isPopular ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        /{pkg.billing_period}
                      </span>
                    </div>
                    <div className={`text-xs mt-1 font-sans ${isPopular ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      12 Weeks per term • Dedicated 1-on-1 attention
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-6">
                    <div className={`text-xs font-semibold uppercase tracking-wider ${isPopular ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      What is Included:
                    </div>
                    <ul className="space-y-2">
                      {features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs font-sans">
                          <Check
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isPopular ? 'text-[#F4CC45]' : 'text-[#310064]'
                            }`}
                          />
                          <span className={isPopular ? 'text-neutral-100' : 'text-neutral-700'}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Enrolment / Free Trial CTA */}
                <div>
                  <Link
                    href="/#consultation"
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-heading font-semibold transition-colors ${
                      isPopular
                        ? 'bg-[#F4CC45] text-[#310064] hover:bg-[#ecd03f]'
                        : 'bg-[#310064] text-white hover:bg-[#25004c]'
                    }`}
                  >
                    <span>Book Consultation for this Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="text-center mt-2">
                    <span className={`text-[11px] font-sans ${isPopular ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Zero obligation • Complimentary diagnostic
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tuition Guarantee Banner */}
        <div className="mt-10 p-5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-neutral-600">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#310064] shrink-0" />
            <div>
              <strong className="text-[#1E1E24] font-semibold block text-xs sm:text-sm">Transparent Tuition Policy</strong>
              <span>No hidden registration fees or multi-year lock-in contracts. Term fees are invoiced term-by-term.</span>
            </div>
          </div>
          <Link
            href="/contact"
            className="font-semibold text-[#310064] hover:underline whitespace-nowrap"
          >
            Need a customised plan? Contact us →
          </Link>
        </div>
      </div>
    </section>
  );
}
