'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Video,
  ShieldCheck,
  Edit2
} from 'lucide-react';

export default function TeacherProfilePage() {
  const [user, setUser] = useState<any>({
    name: 'Dr. Sarah Mitchell',
    email: 'teacher@gmail.com',
    role: 'Teacher',
    qualification: 'Ph.D. in Physics (Cambridge), M.Sc. Applied Mathematics',
    specialization: 'Physics, Mathematics & CBSE Advanced Sciences',
    experienceYears: 12,
    zoomStatus: 'Connected (Enterprise Premium)',
    activeStudents: 1,
    hourlyRate: '₹1,500/hr'
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#310064] to-[#171746] p-6 text-white shadow-md flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-[#F4CC45] text-[#310064] font-heading font-black text-2xl flex items-center justify-center border-4 border-white/20 shadow-lg">
          SM
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F4CC45] text-[#310064]">
              SENIOR FACULTY
            </span>
            <span className="text-xs text-emerald-300 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Educator
            </span>
          </div>
          <h1 className="text-2xl font-heading font-black text-white">{user.name}</h1>
          <p className="text-xs text-purple-200">{user.qualification}</p>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#310064] flex items-center gap-2 pb-2 border-b border-[#ECE6DA]">
            <User className="w-4 h-4 text-[#F4CC45]" />
            <span>Academic Credentials</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#5A5A65]">Email Address</span>
              <div className="font-bold text-[#310064]">{user.email}</div>
            </div>
            <div>
              <span className="text-[#5A5A65]">Specialization Disciplines</span>
              <div className="font-bold text-[#310064]">{user.specialization}</div>
            </div>
            <div>
              <span className="text-[#5A5A65]">Teaching Experience</span>
              <div className="font-bold text-[#310064]">{user.experienceYears} Years (CBSE, IB, IGCSE)</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#310064] flex items-center gap-2 pb-2 border-b border-[#ECE6DA]">
            <Video className="w-4 h-4 text-[#F4CC45]" />
            <span>Zoom & Portal Integration</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#5A5A65]">Zoom Premium Status</span>
              <div className="font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active & Synchronized</span>
              </div>
            </div>
            <div>
              <span className="text-[#5A5A65]">15-Minute Link Unlock Protocol</span>
              <div className="font-bold text-[#310064]">Enabled (Strict Room Security)</div>
            </div>
            <div>
              <span className="text-[#5A5A65]">Current 1-on-1 Students</span>
              <div className="font-bold text-[#310064]">Ethan Jenkins (Grade 10 CBSE)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
