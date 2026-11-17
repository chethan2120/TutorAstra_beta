'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Loader2,
  UserCheck,
  GraduationCap,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('student@gmail.com');
  const [password, setPassword] = useState('demo123');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillQuickCredentials = (role: 'student' | 'teacher' | 'admin') => {
    setSelectedRole(role);
    setError(null);
    if (role === 'student') {
      setEmail('student@gmail.com');
      setPassword('demo123');
    } else if (role === 'teacher') {
      setEmail('teacher@gmail.com');
      setPassword('demo123');
    } else {
      setEmail('admin@gmail.com');
      setPassword('demo123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      // Automatically redirect based on user role returned by server
      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else if (data.user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (data.user?.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/student/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5]">
      {/* LEFT SIDE: Brand Showcase & Value Highlights */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#1C0038] via-[#2A0052] to-[#3B006E] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#430080]">
        {/* Subtle decorative glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4CC45]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#6E00B3]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <BrandLogo size="md" variant="light" />
          </Link>
          <Link
            href="/"
            className="text-xs text-purple-200 hover:text-white transition-colors underline"
          >
            ← Back to Homepage
          </Link>
        </div>

        {/* Middle Brand Value Proposition */}
        <div className="relative z-10 my-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-heading font-semibold text-[#F4CC45]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Single Connected Learning Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-tight">
            Personalised Learning.<br />
            <span className="text-[#F4CC45]">Extraordinary Possibilities.</span>
          </h1>

          <p className="text-sm sm:text-base text-purple-200 font-sans leading-relaxed max-w-lg">
            Dedicated one-to-one education connecting students, top 2% vetted educators, and administrators through a synchronized academic ecosystem.
          </p>

          {/* Core Feature Checklist */}
          <div className="space-y-3 pt-2 text-xs sm:text-sm text-purple-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F4CC45] shrink-0" />
              <span>Dedicated 1-on-1 Sessions (All 50 sessions visible individually)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F4CC45] shrink-0" />
              <span>Interactive Teacher Box with Voice, Video, Images & PDFs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F4CC45] shrink-0" />
              <span>Official Zoom Premium Integration with 15-Minute Link Unlock</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F4CC45] shrink-0" />
              <span>Ms. Violet 3D AI Tutor with timed quizzes & instant marking</span>
            </div>
          </div>
        </div>

        {/* Bottom Quick Account Presets */}
        <div className="relative z-10 pt-6 border-t border-white/15">
          <div className="text-xs font-heading font-bold text-[#F4CC45] mb-2 uppercase tracking-wider">
            Quick Demo Account Selectors:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillQuickCredentials('student')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedRole === 'student'
                  ? 'bg-white/20 border-[#F4CC45] text-white shadow-xs'
                  : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <div className="text-[11px] font-heading font-bold">Student / Parent</div>
              <div className="text-[10px] text-purple-300 truncate">student@gmail.com</div>
            </button>

            <button
              type="button"
              onClick={() => fillQuickCredentials('teacher')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedRole === 'teacher'
                  ? 'bg-white/20 border-[#F4CC45] text-white shadow-xs'
                  : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <div className="text-[11px] font-heading font-bold">Teacher (Faculty)</div>
              <div className="text-[10px] text-purple-300 truncate">teacher@gmail.com</div>
            </button>

            <button
              type="button"
              onClick={() => fillQuickCredentials('admin')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white/20 border-[#F4CC45] text-white shadow-xs'
                  : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <div className="text-[11px] font-heading font-bold">Super Admin</div>
              <div className="text-[10px] text-purple-300 truncate">admin@gmail.com</div>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-16">
        <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[#ECE5F4] shadow-xl space-y-5 sm:space-y-6">
          <div>
            <div className="inline-block px-2.5 py-1 rounded-md bg-[#F2ECFC] text-[#310064] text-[11px] font-heading font-bold uppercase tracking-wider mb-2">
              Sign In to Your Account
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-[#1E1E24]">
              Portal Authentication
            </h2>
            <p className="text-xs text-[#5A5A65] mt-1">
              Select your role or enter registered credentials to enter your dedicated dashboard.
            </p>
          </div>

          {/* Role Pill Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#ECE6DA]">
            <button
              type="button"
              onClick={() => fillQuickCredentials('student')}
              className={`py-2 text-xs font-heading font-bold rounded-lg transition-all ${
                selectedRole === 'student'
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'text-[#5A5A65] hover:text-[#310064]'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('teacher')}
              className={`py-2 text-xs font-heading font-bold rounded-lg transition-all ${
                selectedRole === 'teacher'
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'text-[#5A5A65] hover:text-[#310064]'
              }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin')}
              className={`py-2 text-xs font-heading font-bold rounded-lg transition-all ${
                selectedRole === 'admin'
                  ? 'bg-[#310064] text-white shadow-xs'
                  : 'text-[#5A5A65] hover:text-[#310064]'
              }`}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Email Field */}
            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-[#1E1E24] mb-1.5 text-[11px]">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@tutorastra.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E5E5EB] bg-white text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-heading font-bold uppercase tracking-wider text-[#1E1E24] text-[11px]">
                  Password *
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Demo password: demo123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E5E5EB] bg-white text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#310064] hover:bg-[#430080] text-white font-heading font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter {selectedRole.toUpperCase()} Portal</span>
                    <ArrowRight className="w-4 h-4 text-[#F4CC45]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="pt-4 border-t border-[#ECE5F4] text-center text-[11px] text-[#5A5A65]">
            Protected by TutorAstra Role-Based Authentication.<br />
            Need help? Contact <a href="mailto:support@tutorastra.com" className="text-[#310064] font-semibold underline">support@tutorastra.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}
