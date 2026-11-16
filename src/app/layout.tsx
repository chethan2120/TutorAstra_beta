import type { Metadata } from 'next';
import './globals.css';
import ScrollAction from '@/components/ScrollAction';
import AcademicAdvisorChatbot from '@/components/AcademicAdvisorChatbot';
import FloatingBackgroundElements from '@/components/FloatingBackgroundElements';
import ScrollAnimations from '@/components/ScrollAnimations';

export const metadata: Metadata = {
  metadataBase: new URL('https://tutorastra.com'),
  title: 'TutorAstra | Personalised One-to-One Learning – Your Ambition. Our Mission.',
  description:
    'Discover the power of one-to-one learning with dedicated tutors, personalised study plans and a learning experience designed around your ambitions. Mathematics, Physics, Chemistry, Biology, Science, English and AI Tutor.',
  keywords: [
    'TutorAstra',
    'One-to-One Learning',
    'Personalised Tutoring',
    'Online Tutors',
    'Maths Tuition',
    'Physics Tuition',
    'Chemistry Tuition',
    'Biology Tuition',
    'AI Tutor Ms Violet',
    'Private Tutoring'
  ],
  openGraph: {
    title: 'TutorAstra | Personalised One-to-One Learning',
    description:
      'Your Ambition. Our Mission. Discover premier one-to-one tutoring with dedicated educators and AI-powered assessments.',
    url: 'https://tutorastra.com',
    siteName: 'TutorAstra',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/tutorastra-logo.png',
        width: 800,
        height: 800,
        alt: 'TutorAstra - Your Ambition. Our Mission.'
      }
    ]
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/tutorastra-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-[#1E1E24] antialiased selection:bg-[#F4CC45] selection:text-[#310064] relative font-sans">
        <FloatingBackgroundElements />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
        <ScrollAction />
        <AcademicAdvisorChatbot />
        <ScrollAnimations />
      </body>
    </html>
  );
}