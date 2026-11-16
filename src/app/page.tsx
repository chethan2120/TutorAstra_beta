import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import LearningBenefitsSection from '@/components/LearningBenefitsSection';
import SubjectMarquee from '@/components/SubjectMarquee';
import SubjectsCoursesSection from '@/components/SubjectsCoursesSection';
import ComparisonMatrixSection from '@/components/ComparisonMatrixSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CurriculumPathwaySection from '@/components/CurriculumPathwaySection';
import StudentDashboardShowcaseSection from '@/components/StudentDashboardShowcaseSection';
import WhyTutorAstraSection from '@/components/WhyTutorAstraSection';
import OurTutorsSection from '@/components/OurTutorsSection';
import MsVioletAITutorSection from '@/components/MsVioletAITutorSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import ConsultationSection from '@/components/ConsultationSection';
import Footer from '@/components/Footer';
import LeadPopupModal from '@/components/LeadPopupModal';

export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1E1E24]">
      {/* Dark Sticky Navigation */}
      <Navbar />

      <main className="flex-grow">
        {/* 1. Hero Screen (White #FFFFFF) */}
        <HeroSection />

        {/* 2. Core Learning Benefits & Academic Guidance Banner (Warm Cream #FFFDF7) */}
        <LearningBenefitsSection />

        {/* 3. Horizontal Continuous Right-to-Left Subject Marquee (Lavender Mist #F6EEFD) */}
        <SubjectMarquee />

        {/* 4. 7 Subject Cards (4 Top, 3 Below) with Curriculum Filters (Soft Lavender #F7F2FE) */}
        <SubjectsCoursesSection />

        {/* 5. 1-on-1 vs Group Batches vs Recorded Videos Comparison Matrix (Crisp White #FFFFFF) */}
        <ComparisonMatrixSection />

        {/* 6. Transparent 3-Step Student Pathway (Warm Pearl #FAF8F5) */}
        <HowItWorksSection />

        {/* 7. Grade-Specific Academic Pathways (Grades 6–12 across CBSE, ICSE, Cambridge, IB) (Soft Purple #F8F4FE) */}
        <CurriculumPathwaySection />

        {/* 8. Dedicated Student & Parent Portal Walkthrough (Warm Cream #FFFDF6) */}
        <StudentDashboardShowcaseSection />

        {/* 9. Why TutorAstra 4-Pillar Advantage (Crisp White #FFFFFF) */}
        <WhyTutorAstraSection />

        {/* 10. Verified Top 2% Faculty & 4-Stage Selection Rigor (Warm Ivory #FFFDF8) */}
        <OurTutorsSection />

        {/* 11. Astra AI Diagnostic Studio Interactive Problem Solver (Soft Lilac #F9F7FE) */}
        <MsVioletAITutorSection />

        {/* 12. Verified Parent & Student Reviews (Vanilla Cream #FFFBF3) */}
        <TestimonialsSection />

        {/* 13. Parent & Student FAQ Accordion with Topic Filters (Warm Pearl #FAF8F5) */}
        <FAQSection />

        {/* 14. Free Academic Consultation Request with Instant Lead Submission (Soft Lilac/Pearl #FAF7FD) */}
        <ConsultationSection />
      </main>

      {/* Dark Deep Purple Footer */}
      <Footer />

      {/* 4-Second Lead Demo Booking Popup Modal */}
      <LeadPopupModal />
    </div>
  );
}
