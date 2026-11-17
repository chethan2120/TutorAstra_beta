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
  Clock,
  Sparkles,
  Phone,
  MapPin,
  Lock
} from 'lucide-react';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>({
    name: 'Ethan Jenkins',
    email: 'student@gmail.com',
    grade: 'Grade 10',
    curriculum: 'CBSE',
    parentName: 'Robert Jenkins',
    parentEmail: 'robert.jenkins@example.com',
    parentPhone: '+91 98450 12345',
    school: 'National Public School',
    enrolledSubjects: ['CBSE Class 10 Science (Physics, Chemistry, Biology)', 'Mathematics Higher Track'],
    assignedTutor: 'Dr. Sarah Mitchell (Ph.D. Cambridge)',
    attendanceRate: '100%',
    completedSessions: 8,
    totalBookedSessions: 50
  });

  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback('Password updated successfully! Your account credentials have been synchronized.');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Profile Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#310064] to-[#171746] p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-[#F4CC45] text-[#310064] font-heading font-black text-2xl flex items-center justify-center border-4 border-white/20 shadow-lg shrink-0">
          EJ
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F4CC45] text-[#310064]">
              ENROLLED STUDENT
            </span>
            <span className="text-xs text-emerald-300 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              1-on-1 Academic Track Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">{profile.name}</h1>
          <p className="text-xs text-purple-200">
            {profile.grade} • {profile.curriculum} Curriculum • {profile.school}
          </p>
        </div>
      </div>

      {/* Progress & Attendance Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#5A5A65] block">
            Attendance Rate
          </span>
          <div className="text-2xl font-heading font-black text-emerald-600 mt-1">{profile.attendanceRate}</div>
          <span className="text-[11px] text-[#5A5A65] mt-0.5 block">Perfect session attendance</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#5A5A65] block">
            Completed Sessions
          </span>
          <div className="text-2xl font-heading font-black text-[#310064] mt-1">{profile.completedSessions} Classes</div>
          <span className="text-[11px] text-[#5A5A65] mt-0.5 block">Of {profile.totalBookedSessions} allocated package classes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DA] shadow-xs">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#5A5A65] block">
            Lead Dedicated Faculty
          </span>
          <div className="text-sm font-heading font-bold text-[#1E1E24] mt-1 truncate">{profile.assignedTutor}</div>
          <span className="text-[11px] text-purple-600 font-semibold mt-0.5 block">1-on-1 Science & Physics</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Details */}
        <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#310064] flex items-center gap-2 pb-2 border-b border-[#ECE6DA]">
            <BookOpen className="w-4 h-4 text-[#F4CC45]" />
            <span>Academic Profile & Enrolment</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#5A5A65]">Student Email Address</span>
              <div className="font-bold text-[#1E1E24]">{profile.email}</div>
            </div>
            <div>
              <span className="text-[#5A5A65]">Target Examination</span>
              <div className="font-bold text-[#1E1E24]">CBSE Board Examination (Grade 10)</div>
            </div>
            <div>
              <span className="text-[#5A5A65]">Enrolled Subjects</span>
              <div className="space-y-1 mt-1">
                {profile.enrolledSubjects.map((sub: string, i: number) => (
                  <div key={i} className="font-bold text-[#310064] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6425C5]" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Parent & Contact Details */}
        <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#310064] flex items-center gap-2 pb-2 border-b border-[#ECE6DA]">
            <User className="w-4 h-4 text-[#F4CC45]" />
            <span>Parent / Guardian Information</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#5A5A65]">Parent Name</span>
              <div className="font-bold text-[#1E1E24]">{profile.parentName}</div>
            </div>
            <div>
              <span className="text-[#5A5A65]">Parent Email</span>
              <div className="font-bold text-[#1E1E24]">{profile.parentEmail}</div>
            </div>
            <div>
              <span className="text-[#5A5A65]">Contact Phone</span>
              <div className="font-bold text-[#1E1E24]">{profile.parentPhone}</div>
            </div>
            <div>
              <span className="text-[#5A5A65]">Class Session Notifications</span>
              <div className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auto-dispatched via Email & WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Security / Change Password */}
      <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-sm text-[#1E1E24] flex items-center gap-2 pb-2 border-b border-[#ECE6DA]">
          <Lock className="w-4 h-4 text-[#310064]" />
          <span>Security & Portal Access</span>
        </h3>

        {passwordFeedback && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
            {passwordFeedback}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-[#ECE6DA] text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064]"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-[#5A5A65] mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-[#ECE6DA] text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064]"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#310064] text-white font-heading font-bold text-xs hover:bg-[#430080] transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
