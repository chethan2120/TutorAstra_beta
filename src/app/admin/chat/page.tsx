'use client';

import React, { useState, useEffect } from 'react';
import TutorAstraChatBox, { ChatPartner } from '@/components/TutorAstraChatBox';
import { Loader2, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminChatPage() {
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

        const chatRes = await fetch('/api/admin/chat');
        if (chatRes.ok) {
          const chatData = await chatRes.json();
          const teacherList: ChatPartner[] = (chatData.contacts || []).map((t: any) => ({
            id: t.user_id,
            name: t.name,
            email: t.email,
            role: 'teacher' as const,
            subjectName: `${t.qualification || 'Faculty Specialization'}`
          }));

          if (teacherList.length === 0) {
            teacherList.push({
              id: 3,
              name: 'Dr. Sarah Mitchell',
              email: 'teacher@gmail.com',
              role: 'teacher' as const,
              subjectName: 'Senior Science Faculty (Ph.D. Cambridge)'
            });
          }

          setPartners(teacherList);
          setActivePartner(teacherList[0]);
        }
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
        <span>Loading WhatsApp-style Admin Communications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#310064] text-[#F4CC45]">
              ADMIN CHAT
            </span>
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              WhatsApp Interface • Permanent Data Persistence
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Faculty & Staff Communications
          </h1>
          <p className="text-xs text-[#5A5A65] mt-0.5">
            Real-time chat with teachers, send documents, audio memos, and videos. All message history is permanently archived.
          </p>
        </div>

        <div className="text-[11px] font-bold text-[#310064] bg-[#F2ECFC] px-3 py-1 rounded-full">
          Auto-saved to Cloud & Database
        </div>
      </div>

      {/* WhatsApp Style Chat Box */}
      <TutorAstraChatBox
        currentUserId={currentUser.id}
        currentRole="admin"
        activePartner={activePartner}
        availablePartners={partners}
        onSelectPartner={(partner) => setActivePartner(partner)}
      />
    </div>
  );
}
