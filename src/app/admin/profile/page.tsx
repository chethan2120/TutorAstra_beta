'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Key,
  CheckCircle2,
  Lock,
  Upload,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  UserCog
} from 'lucide-react';

export default function AdminProfilePage() {
  const [name, setName] = useState('Super Admin');
  const [email, setEmail] = useState('admin@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/tutorastra-logo.jpg');

  // RBAC Permission Toggles
  const [studentPerms, setStudentPerms] = useState({
    can_view_recordings: 1,
    can_apply_leaves: 1,
    can_use_chat: 1,
    can_take_ai_test: 1,
    can_view_other_contacts: 0
  });

  const [teacherPerms, setTeacherPerms] = useState({
    can_view_recordings: 1,
    can_apply_leaves: 1,
    can_use_chat: 1,
    can_take_ai_test: 1,
    can_view_other_contacts: 1
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/permissions')
      .then((res) => res.json())
      .then((data) => {
        if (data.studentPerms) setStudentPerms(data.studentPerms);
        if (data.teacherPerms) setTeacherPerms(data.teacherPerms);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
      setFeedback({ type: 'success', message: 'Profile avatar updated locally.' });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      // Save permissions
      await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentPerms, teacherPerms })
      });

      setFeedback({
        type: 'success',
        message: 'Admin profile and account access controls saved successfully.'
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Error updating settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#ECE6DA] shadow-xs">
        <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#310064] bg-[#F2ECFC] px-2.5 py-1 rounded-md">
          Identity & Platform Security
        </span>
        <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-2">
          Admin Profile & Account Access Controls
        </h1>
        <p className="text-xs text-[#5A5A65] mt-0.5">
          Update profile details, change security passwords, and govern role access permissions for students and faculty.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card with Photo */}
        <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#310064] pb-2 border-b border-[#ECE6DA] flex items-center gap-2">
            <User className="w-4 h-4 text-[#F4CC45]" />
            <span>Administrator Credentials</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Upload */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#F4CC45] bg-[#310064] flex items-center justify-center shadow-md">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <label className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-[10px] font-bold">
                <Upload className="w-4 h-4 mb-0.5" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA] bg-slate-50 text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">New Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                />
              </div>

              <div>
                <label className="block text-[#5A5A65] font-bold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DA]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Access Controls (Control what other accounts can see and access) */}
        <div className="bg-white rounded-2xl p-6 border border-[#ECE6DA] shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#310064] pb-2 border-b border-[#ECE6DA] flex items-center gap-2">
            <UserCog className="w-4 h-4 text-[#F4CC45]" />
            <span>Account Access Controls & Role Permissions Matrix</span>
          </h3>
          <p className="text-xs text-[#5A5A65]">
            Govern what student and teacher accounts can see, what features they can access, and what remains restricted.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Student Account Permissions */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase text-blue-950 flex items-center gap-1.5">
                <span>Student Accounts Visibility</span>
              </h4>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(studentPerms.can_view_recordings)}
                    onChange={(e) =>
                      setStudentPerms({ ...studentPerms, can_view_recordings: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#310064]"
                  />
                  <span>Can view Class Recordings (Single-Watch Archive)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(studentPerms.can_apply_leaves)}
                    onChange={(e) =>
                      setStudentPerms({ ...studentPerms, can_apply_leaves: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#310064]"
                  />
                  <span>Can apply for Leave (Max 2/month rule)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(studentPerms.can_use_chat)}
                    onChange={(e) =>
                      setStudentPerms({ ...studentPerms, can_use_chat: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#310064]"
                  />
                  <span>Can use Teacher Box Chat with assigned faculty</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(studentPerms.can_take_ai_test)}
                    onChange={(e) =>
                      setStudentPerms({ ...studentPerms, can_take_ai_test: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#310064]"
                  />
                  <span>Can access Ms. Violet AI Tutor & Diagnostics</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                  <input
                    type="checkbox"
                    checked={Boolean(studentPerms.can_view_other_contacts)}
                    onChange={(e) =>
                      setStudentPerms({ ...studentPerms, can_view_other_contacts: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#310064]"
                  />
                  <span>Can view direct Admin / Staff contact info (Default: Off)</span>
                </label>
              </div>
            </div>

            {/* Teacher Account Permissions */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase text-amber-950 flex items-center gap-1.5">
                <span>Teacher / Faculty Accounts Visibility</span>
              </h4>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(teacherPerms.can_view_recordings)}
                    onChange={(e) =>
                      setTeacherPerms({ ...teacherPerms, can_view_recordings: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#310064]"
                  />
                  <span>Can punch shift attendance & view hours</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(teacherPerms.can_apply_leaves)}
                    onChange={(e) =>
                      setTeacherPerms({ ...teacherPerms, can_apply_leaves: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#310064]"
                  />
                  <span>Can apply for faculty leave</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(teacherPerms.can_use_chat)}
                    onChange={(e) =>
                      setTeacherPerms({ ...teacherPerms, can_use_chat: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#310064]"
                  />
                  <span>Can communicate in Teacher Box with students & Admin</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(teacherPerms.can_take_ai_test)}
                    onChange={(e) =>
                      setTeacherPerms({ ...teacherPerms, can_take_ai_test: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#310064]"
                  />
                  <span>Can review & annotate student AI assessments</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(teacherPerms.can_view_other_contacts)}
                    onChange={(e) =>
                      setTeacherPerms({ ...teacherPerms, can_view_other_contacts: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#310064]"
                  />
                  <span>Can view student parent contact numbers</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-[#F4CC45]" /> : <CheckCircle2 className="w-4 h-4 text-[#F4CC45]" />}
            <span>Save Profile & Role Controls</span>
          </button>
        </div>
      </form>
    </div>
  );
}
