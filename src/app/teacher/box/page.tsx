'use client';

import React, { useState, useEffect } from 'react';
import TutorAstraChatBox, { ChatPartner } from '@/components/TutorAstraChatBox';
import { Loader2 } from 'lucide-react';

export default function TeacherBoxPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [activePartner, setActivePartner] = useState<ChatPartner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChatContext() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
        }

        const partnersList: ChatPartner[] = [
          {
            id: 4, // Student Ethan Jenkins user id
            name: 'Ethan Jenkins',
            email: 'student@gmail.com',
            role: 'student',
            subjectName: 'Grade 10 CBSE (Science, Math, Physics)'
          },
          {
            id: 2, // Admin Super Admin user id
            name: 'Super Admin (Head Office)',
            email: 'admin@gmail.com',
            role: 'admin',
            subjectName: 'Administration & Timetable Support'
          }
        ];

        setPartners(partnersList);
        setActivePartner(partnersList[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadChatContext();
  }, []);

  if (loading || !activePartner || !currentUser) {
    return (
      <div className="p-16 text-center text-xs text-[#5A5A65]">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#310064] mb-2" />
        <span>Initializing Teacher Box communication...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto w-full">
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs">
        <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1E24] tracking-tight">
          Teacher Box – Academic Doubt & File Exchange
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5A65] mt-1">
          Communicate directly with assigned students (share worksheets, voice notes, PDFs, videos) and connect with administration.
        </p>
      </div>

      <TutorAstraChatBox
        currentUserId={currentUser.id}
        currentRole="teacher"
        activePartner={activePartner}
        availablePartners={partners}
        onSelectPartner={(partner) => setActivePartner(partner)}
      />
    </div>
  );
}
