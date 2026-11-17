'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Video,
  Play,
  CheckCircle2,
  Lock,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  Sparkles,
  X,
  Volume2,
  Maximize2,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';

export default function StudentRecordingsPage() {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activePlayback, setActivePlayback] = useState<any | null>(null);
  const [confirmModal, setConfirmModal] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRecordings = () => {
    fetch('/api/student/recordings')
      .then((res) => res.json())
      .then((data) => {
        setRecordings(data.recordings || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  // Filter list by selected subject
  const subjectsList = ['all', ...Array.from(new Set(recordings.map((r) => r.subject_name)))];
  const filteredRecordings = recordings.filter((r) => {
    if (selectedSubject !== 'all' && r.subject_name !== selectedSubject) return false;
    return true;
  });

  // Handler to start watching
  const handleWatchClick = (rec: any) => {
    if (rec.is_consumed) return;
    setConfirmModal(rec);
  };

  // Confirm start
  const handleConfirmStart = () => {
    if (!confirmModal) return;
    setActivePlayback(confirmModal);
    setConfirmModal(null);
  };

  // Consume and finish recording
  const handleFinishRecording = async (recId: number) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/student/recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordingId: recId })
      });
      if (res.ok) {
        setActivePlayback(null);
        fetchRecordings();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#310064] via-[#4A0D88] to-[#1E003D] p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4CC45] text-[#310064]">
              SINGLE-WATCH POLICY
            </span>
            <span className="text-xs text-purple-200">Storage Optimization Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
            Class Recordings Archive
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-1.5 leading-relaxed">
            Recordings are organized subject-wise according to your enrolled subjects. To encourage attentive learning and conserve server memory, <strong>each recording can be watched only once</strong>. Once finished, the session is marked consumed and archived.
          </p>
        </div>
      </div>

      {/* Policy Reminder Card */}
      <div className="bg-[#FAF8F5] border border-[#ECE6DA] rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#5A5A65]">
          <strong className="text-[#310064] block font-heading font-bold text-sm mb-0.5">
            Important Note on Single-Watch Access
          </strong>
          <span>
            Please only start playback when you have your notebook, pen, and uninterrupted focus ready. Once the recording finishes or you exit the player, it cannot be replayed.
          </span>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {subjectsList.map((subj) => (
          <button
            key={subj}
            type="button"
            onClick={() => setSelectedSubject(subj)}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold capitalize whitespace-nowrap transition-all ${
              selectedSubject === subj
                ? 'bg-[#310064] text-white shadow-xs'
                : 'bg-white border border-[#ECE6DA] text-[#5A5A65] hover:bg-[#FAF8F5] hover:text-[#310064]'
            }`}
          >
            {subj === 'all' ? 'All Subjects' : subj}
          </button>
        ))}
      </div>

      {/* Recordings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-[#ECE6DA] animate-pulse space-y-3">
              <div className="h-40 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredRecordings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#ECE6DA]">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-heading font-bold text-[#310064]">No Recordings Available</h3>
          <p className="text-xs text-[#5A5A65] mt-1">
            Recorded sessions appear automatically after your live 1-on-1 Zoom classes are completed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map((rec) => {
            const isConsumed = Boolean(rec.is_consumed);

            return (
              <div
                key={rec.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isConsumed ? 'border-slate-200 opacity-80' : 'border-[#ECE6DA]'
                }`}
              >
                {/* Video Thumbnail Preview */}
                <div className="relative aspect-video bg-[#171746] flex items-center justify-center overflow-hidden group">
                  {/* Subtle poster background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                  {/* Play Trigger or Consumed Lock Overlay */}
                  <div className="relative z-10 text-center">
                    {isConsumed ? (
                      <div className="inline-flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-xs text-slate-300 border border-white/10">
                        <Lock className="w-6 h-6 text-slate-400" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Watched & Archived</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleWatchClick(rec)}
                        className="w-14 h-14 rounded-full bg-[#F4CC45] hover:bg-amber-400 text-[#310064] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform cursor-pointer"
                        title="Watch 1-Time Recording"
                      >
                        <Play className="w-6 h-6 ml-0.5 fill-[#310064]" />
                      </button>
                    )}
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                    <span
                      className="px-2.5 py-0.5 rounded-md font-bold text-[11px] backdrop-blur-md"
                      style={{
                        backgroundColor: `${rec.subject_color || '#310064'}dd`,
                        color: '#FFFFFF'
                      }}
                    >
                      {rec.subject_name}
                    </span>

                    <span className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-black/70 text-white backdrop-blur-md">
                      {rec.duration_minutes || 60}m
                    </span>
                  </div>

                  {/* Bottom Strip: Single Watch Status */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 z-10">
                    <span className="font-mono">Session #{rec.session_number || '01'}</span>
                    {isConsumed ? (
                      <span className="text-slate-400 font-medium">Consumed</span>
                    ) : (
                      <span className="text-[#F4CC45] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        1 View Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-black text-sm text-[#310064] line-clamp-2">
                      {rec.title}
                    </h3>

                    <div className="mt-2.5 space-y-1 text-xs text-[#5A5A65]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#310064]" />
                        <span>Teacher: <strong className="text-[#310064]">{rec.teacher_name || 'Dr. Sarah Mitchell'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>Recorded on: {rec.session_date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-3 border-t border-[#ECE6DA] mt-3">
                    {isConsumed ? (
                      <div className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-500 font-heading font-semibold text-xs text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Archived (Single-Watch Finished)</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleWatchClick(rec)}
                        className="w-full py-2 px-3 rounded-xl bg-[#310064] hover:bg-[#220046] text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#F4CC45] text-[#F4CC45]" />
                        <span>Watch 1-Time Recording</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal before starting Single-Watch */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ECE6DA] animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-heading font-black text-center text-[#310064]">
              Start 1-Time Class Playback?
            </h3>

            <p className="text-xs text-[#5A5A65] text-center mt-2 leading-relaxed">
              In accordance with TutorAstra policy, you are about to use your <strong>single allowed viewing</strong> for <strong>{confirmModal.title}</strong>.
            </p>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
              <strong>Checklist before watching:</strong>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Quiet study environment ready</li>
                <li>Notebook and pen for taking revision notes</li>
                <li>Approximately {confirmModal.duration_minutes || 60} minutes available</li>
              </ul>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#ECE6DA] text-xs font-heading font-bold text-[#5A5A65] hover:bg-[#FAF8F5]"
              >
                Cancel / Watch Later
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                className="flex-1 py-2.5 rounded-xl bg-[#310064] hover:bg-[#220046] text-white text-xs font-heading font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-[#F4CC45] text-[#F4CC45]" />
                <span>Start Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Video Player Modal */}
      {activePlayback && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#171746] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/20 flex flex-col">
            {/* Player Top Bar */}
            <div className="p-4 bg-black/40 flex items-center justify-between text-white border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-heading font-bold tracking-wide">
                  NOW PLAYING: {activePlayback.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleFinishRecording(activePlayback.id)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                title="Finish & Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport */}
            <div className="aspect-video bg-black relative flex items-center justify-center group">
              {/* Simulated class video stream */}
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-[#F4CC45] text-[#F4CC45] flex items-center justify-center mx-auto">
                  <Play className="w-8 h-8 ml-1 fill-[#F4CC45]" />
                </div>
                <h4 className="text-white font-heading font-bold text-base">
                  {activePlayback.title}
                </h4>
                <p className="text-xs text-purple-200">
                  Faculty: {activePlayback.teacher_name} • Duration: {activePlayback.duration_minutes || 60}m
                </p>
                <p className="text-[11px] text-amber-300">
                  Single-Watch Session in progress. Please do not close until you have finished your notes.
                </p>
              </div>

              {/* Player Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-3">
                  <Play className="w-4 h-4 fill-white" />
                  <Volume2 className="w-4 h-4" />
                  <span className="font-mono text-[11px]">14:28 / {activePlayback.duration_minutes || 60}:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Player Bottom Bar with Consumption Action */}
            <div className="p-4 bg-[#1E003D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-200 border-t border-white/10">
              <span className="text-[11px]">
                When finished, click the button below to register completion and safely archive this class.
              </span>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleFinishRecording(activePlayback.id)}
                className="px-5 py-2.5 rounded-xl bg-[#F4CC45] hover:bg-amber-400 text-[#310064] font-heading font-black text-xs transition-colors flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{actionLoading ? 'Archiving...' : 'Mark as Consumed & Finish Playback'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
