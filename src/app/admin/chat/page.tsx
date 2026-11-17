'use client';

import React, { useState, useEffect } from 'react';
import TutorAstraChatBox, { ChatPartner } from '@/components/TutorAstraChatBox';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AdminChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [activePartner, setActivePartner] = useState<ChatPartner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChatContext() {
      try {
        let currentU = { id: 2, name: 'Super Admin', role: 'admin', email: 'admin@gmail.com' };
        try {
          const meRes = await fetch('/api/auth/me');
          if (meRes.ok) {
            const meData = await meRes.json();
            if (meData.user) {
              currentU = meData.user;
            }
          }
        } catch (e) {
          console.error(e);
        }
        setCurrentUser(currentU);

        let teacherList: ChatPartner[] = [
          {
            id: 3,
            name: 'Dr. Sarah Mitchell',
            email: 'teacher@gmail.com',
            role: 'teacher' as const,
            subjectName: 'Senior Science Faculty (Ph.D. Cambridge)'
          }
        ];

        try {
          const chatRes = await fetch('/api/admin/chat');
          if (chatRes.ok) {
            const chatData = await chatRes.json();
            if (chatData.contacts && chatData.contacts.length > 0) {
              teacherList = chatData.contacts.map((t: any) => ({
                id: t.user_id,
                name: t.name,
                email: t.email,
                role: 'teacher' as const,
                subjectName: `${t.qualification || 'Faculty Specialization'}`
              }));
            }
          }
        } catch (e) {
          console.error('Error fetching admin chat contacts:', e);
        }

        setPartners(teacherList);
        setActivePartner(teacherList[0]);
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
    <div className="h-full flex flex-col space-y-2.5 max-w-6xl mx-auto w-full">
      {/* Compact Header */}
      <div className="bg-white px-4 py-2.5 rounded-xl border border-[#ECE6DA] shadow-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black bg-[#310064] text-[#F4CC45]">
            ADMIN CHAT
          </span>
          <h1 className="text-xs sm:text-sm font-heading font-extrabold text-[#1E1E24]">
            Faculty & Staff Communications
          </h1>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#5A5A65]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">WhatsApp UI • Permanent Database Archival</span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <TutorAstraChatBox
          currentUserId={currentUser.id}
          currentRole="admin"
          activePartner={activePartner}
          availablePartners={partners}
          onSelectPartner={(partner) => setActivePartner(partner)}
        />
      </div>
    </div>
  );
}
