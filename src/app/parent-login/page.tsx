'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [studentView, setStudentView] = useState<any | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check credentials.');
      }

      if (data.user.role === 'admin' || data.user.role === 'teacher') {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        // Student / Parent Portal View
        setStudentView({
          studentName: 'Aryan Sharma',
          parentName: data.user.name,
          grade: 'Grade 10 (Secondary Board)',
          activeTerm: 'Term 2 (Week 8)',
          attendance: '100% Attendance',
          nextSession: 'Tomorrow at 5:00 PM (Physics: Electromagnetism)',
          homeworkStatus: 'Submitted & Graded A',
          latestTeacherNote:
            'Aryan continues to excel in coordinate geometry proofs and mechanics derivations. Next live doubt-clearing session confirmed for Thursday 5:00 PM.',
        });
      }
    } catch (err: any) {
      setMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (em: string, pass: string) => {
    setEmail(em);
    setPassword(pass);
    setMessage(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1E1E24]">
      <Navbar />

      <main className="flex-grow py-16 bg-[#FBFBFC] border-b border-[#E5E5EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {studentView ? (
            /* Student & Parent Portal Active Session */
            <div className="card-standard p-8 sm:p-10 bg-white space-y-6">
              <div className="flex items-center justify-between pb-5 border-b border-[#E5E5EB]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#310064] text-white flex items-center justify-center font-heading font-bold text-base">
                    AS
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-xl text-[#1E1E24]">Welcome, {studentView.parentName}</h2>
                    <p className="text-xs text-[#5A5A65]">Student: {studentView.studentName} • {studentView.grade}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStudentView(null)}
                  className="btn-secondary text-xs h-9"
                >
                  Log Out
                </button>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB]">
                  <span className="text-xs text-[#5A5A65] font-semibold">Current Schedule</span>
                  <div className="font-heading font-bold text-base text-[#1E1E24] mt-1">{studentView.activeTerm}</div>
                  <div className="text-xs text-[#310064] font-medium mt-1">{studentView.nextSession}</div>
                </div>

                <div className="p-4 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB]">
                  <span className="text-xs text-[#5A5A65] font-semibold">Homework & Evaluation</span>
                  <div className="font-heading font-bold text-base text-[#1E1E24] mt-1">{studentView.homeworkStatus}</div>
                  <div className="text-xs text-emerald-700 font-medium mt-1">{studentView.attendance}</div>
                </div>

                <div className="p-4 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB]">
                  <span className="text-xs text-[#5A5A65] font-semibold">Next Milestone</span>
                  <div className="font-heading font-bold text-base text-[#1E1E24] mt-1">Diagnostic Review</div>
                  <div className="text-xs text-[#310064] font-medium mt-1">Calculus & Vector Kinematics</div>
                </div>
              </div>

              {/* Recent Notes */}
              <div className="p-5 rounded-lg bg-[#FBFBFC] border border-[#E5E5EB] space-y-2">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#310064]">
                  Latest Academic Notes from Tutor
                </h4>
                <p className="text-xs text-[#5A5A65] leading-relaxed">
                  "{studentView.latestTeacherNote}"
                </p>
              </div>
            </div>
          ) : (
            /* Unified Login Form */
            <div className="max-w-md mx-auto card-standard p-8 bg-white space-y-6">
              <div className="text-center space-y-1.5">
                <div className="w-11 h-11 rounded-lg bg-[#F5F5F7] border border-[#E5E5EB] text-[#310064] flex items-center justify-center mx-auto mb-3">
                  <User className="w-5 h-5 stroke-[1.75]" />
                </div>
                <h1 className="font-heading font-bold text-2xl text-[#1E1E24]">Sign In</h1>
                <p className="text-xs text-[#5A5A65]">
                  Access your administrative dashboard or student learning portal.
                </p>
              </div>

              {message && (
                <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-[#1E1E24] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-standard"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-heading font-semibold uppercase tracking-wider text-[#1E1E24]">
                      Password
                    </label>
                    <Link
                      href="/admin/reset-password"
                      className="text-xs text-[#310064] hover:underline font-semibold"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-standard"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-sm font-heading font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Logins */}
              <div className="pt-4 border-t border-[#E5E5EB] space-y-2">
                <div className="text-[11px] font-heading font-semibold text-[#8E8E98] uppercase tracking-wider text-center">
                  Demo Portals (Click to autofill):
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => fillCredentials('admin@gmail.com', 'demo123')}
                    className="w-full p-2.5 rounded-md border border-[#E5E5EB] hover:bg-[#FBFBFC] text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-heading font-bold text-[#1E1E24]">Super Admin Portal</div>
                      <div className="text-[11px] text-[#5A5A65]">admin@gmail.com / demo123</div>
                    </div>
                    <span className="text-[10px] font-heading font-semibold bg-[#F5F5F7] px-2 py-0.5 rounded text-[#310064]">
                      Admin
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials('student@gmail.com', 'demo123')}
                    className="w-full p-2.5 rounded-md border border-[#E5E5EB] hover:bg-[#FBFBFC] text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-heading font-bold text-[#1E1E24]">Student / Parent Portal</div>
                      <div className="text-[11px] text-[#5A5A65]">student@gmail.com / demo123</div>
                    </div>
                    <span className="text-[10px] font-heading font-semibold bg-[#F5F5F7] px-2 py-0.5 rounded text-[#310064]">
                      Student
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
