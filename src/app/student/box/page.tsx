'use client';

import React, { useState, useEffect } from 'react';
import TutorAstraChatBox, { ChatPartner } from '@/components/TutorAstraChatBox';
import { Loader2, MessageSquare, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function StudentBoxPage() {
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

        const boxRes = await fetch('/api/student/box');
        if (boxRes.ok) {
          const boxData = await boxRes.json();
          const teacherList: ChatPartner[] = (boxData.teachers || []).map((t: any) => ({
            id: t.teacher_user_id,
            name: t.teacher_name,
            email: 'teacher@gmail.com',
            role: 'teacher' as const,
            subjectName: `${t.subject_name} Faculty (${t.qualification || 'Specialist'})`
          }));

          // Fallback if no teachers returned
          if (teacherList.length === 0) {
            teacherList.push({
              id: 3, // Dr. Sarah Mitchell user id
              name: 'Dr. Sarah Mitchell',
              email: 'teacher@gmail.com',
              role: 'teacher' as const,
              subjectName: 'Senior Science & Physics Faculty (Ph.D.)'
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
        <span>Loading Teacher Box communication portal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto w-full">
      {/* Informative Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#310064] text-[#F4CC45]">
              TEACHER BOX
            </span>
            <span className="text-xs text-[#5A5A65] flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Direct 1-on-1 Dedicated Faculty Channel
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#310064] tracking-tight">
            Ask Doubts & Submit Homework
          </h1>
          <p className="text-xs text-[#5A5A65] mt-1">
            Send homework questions, upload PDFs, share diagram photos, record voice notes, or share video explanations directly with your assigned subject teacher.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 p-3 rounded-xl bg-[#FCFAFF] border border-[#F2ECFC] text-[11px] text-[#310064]">
          <Sparkles className="w-4 h-4 text-[#F4CC45] flex-shrink-0" />
          <span>Need auto-practice? Visit <strong>Ms. Violet AI Tutor</strong>.</span>
        </div>
      </div>

      {/* Role Protection Banner */}
      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-amber-800">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>
          <strong>Academic Focus Rule:</strong> Students communicate exclusively with assigned faculty members. For attendance or leave requests, please use the dedicated <strong>Leave Application</strong> tab.
        </span>
      </div>

      {/* TutorAstra Universal Chat Box */}
      <TutorAstraChatBox
        currentUserId={currentUser.id}
        currentRole="student"
        activePartner={activePartner}
        availablePartners={partners}
        onSelectPartner={(partner) => setActivePartner(partner)}
      />
    </div>
  );
}
