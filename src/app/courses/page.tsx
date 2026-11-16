import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubjectsCoursesSection from '@/components/SubjectsCoursesSection';
import ConsultationSection from '@/components/ConsultationSection';

export const metadata = {
  title: 'Subjects & Academic Programs | TutorAstra One-to-One Tutoring',
  description:
    'Explore TutorAstra’s comprehensive subject offerings: Mathematics, Physics, Chemistry, Biology, Integrated Science, English, and Electives.',
};

export default function AllCoursesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1E1E24]">
      <Navbar />

      <main className="flex-grow">
        <section className="py-16 lg:py-20 bg-[#FBFBFC] border-b border-[#E5E5EB] text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E5E5EB] text-xs font-heading font-semibold text-[#310064] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#F4CC45]" />
              <span>Curriculum Offerings</span>
            </div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1E1E24] tracking-tight">
              Academic Subjects and Courses.
            </h1>
            <p className="text-base sm:text-lg text-[#5A5A65] max-w-xl mx-auto leading-relaxed">
              One-to-one instruction tailored to Grades 9 through 12 across major examination boards.
            </p>
          </div>
        </section>

        <SubjectsCoursesSection />
        <ConsultationSection />
      </main>

      <Footer />
    </div>
  );
}
