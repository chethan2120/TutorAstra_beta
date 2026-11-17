'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Mic,
  Video,
  Play,
  Pause,
  Download,
  CheckCheck,
  Smile,
  X,
  Loader2,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';

export interface ChatMessage {
  id: number;
  sender_user_id: number;
  receiver_user_id: number;
  message?: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_type?: 'pdf' | 'image' | 'audio' | 'video' | 'text';
  attachment_size?: number;
  is_read?: number;
  created_at: string;
}

export interface ChatPartner {
  id: number;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'admin';
  subjectName?: string;
  unreadCount?: number;
}

interface TutorAstraChatBoxProps {
  currentUserId: number;
  currentRole: 'student' | 'teacher' | 'admin';
  activePartner: ChatPartner;
  availablePartners: ChatPartner[];
  onSelectPartner: (partner: ChatPartner) => void;
}

export default function TutorAstraChatBox({
  currentUserId,
  currentRole,
  activePartner,
  availablePartners,
  onSelectPartner,
}: TutorAstraChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Simulated Media Attachments
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: 'pdf' | 'image' | 'audio' | 'video';
    url: string;
    size: number;
  } | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter partners according to role permission rule:
  // - Student can ONLY text Teacher (cannot text Admin)
  // - Teacher can text Student AND Admin
  // - Admin can text Teacher
  const permittedPartners = availablePartners.filter((p) => {
    if (currentRole === 'student') {
      return p.role === 'teacher';
    }
    if (currentRole === 'teacher') {
      return p.role === 'student' || p.role === 'admin';
    }
    if (currentRole === 'admin') {
      return p.role === 'teacher';
    }
    return true;
  });

  // Load messages whenever activePartner changes
  useEffect(() => {
    async function fetchMessages() {
      if (!activePartner?.id) return;
      setLoadingMessages(true);
      try {
        const endpoint = currentRole === 'teacher'
          ? `/api/teacher/box?student_user_id=${activePartner.id}`
          : `/api/student/box`;

        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (e) {
        console.error('Failed to load messages:', e);
      } finally {
        setLoadingMessages(false);
      }
    }
    fetchMessages();
  }, [activePartner?.id, currentRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecordingAndAttach = () => {
    setIsRecording(false);
    setAttachedFile({
      name: `Voice_Note_${new Date().toISOString().substring(11, 19).replace(/:/g, '-')}.mp3`,
      type: 'audio',
      url: 'https://storage.googleapis.com/tutorastra-voice/voice-note-demo.mp3',
      size: recordingSeconds * 16 * 1024
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'pdf' | 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFile({
      name: file.name,
      type: fileType,
      url: URL.createObjectURL(file),
      size: file.size
    });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    setSending(true);
    const newMsgPayload = {
      receiver_user_id: activePartner.id,
      message: inputText.trim(),
      attachment_name: attachedFile?.name,
      attachment_url: attachedFile?.url,
      attachment_type: attachedFile?.type,
      attachment_size: attachedFile?.size
    };

    try {
      const endpoint = currentRole === 'teacher' ? '/api/teacher/box' : '/api/student/box';
      const body = currentRole === 'teacher'
        ? { studentUserId: activePartner.id, ...newMsgPayload }
        : { teacherUserId: activePartner.id, ...newMsgPayload };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        // Optimistic append
        const newMsg: ChatMessage = {
          id: Date.now(),
          sender_user_id: currentUserId,
          receiver_user_id: activePartner.id,
          message: inputText.trim(),
          attachment_name: attachedFile?.name,
          attachment_url: attachedFile?.url,
          attachment_type: attachedFile?.type,
          attachment_size: attachedFile?.size,
          created_at: new Date().toISOString()
        };
        setMessages((prev) => [...prev, newMsg]);
        setInputText('');
        setAttachedFile(null);
      }
    } catch (err) {
      console.error('Failed to deliver message:', err);
    } finally {
      setSending(false);
    }
  };

  const sendQuickDoubt = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[680px] bg-white rounded-2xl border border-[#EBE4F6] shadow-sm overflow-hidden">
      {/* LEFT COLUMN: Conversation Threads / Contact List */}
      <div className="w-full lg:w-72 bg-[#FAF8F5] border-r border-[#ECE6DA] flex flex-col justify-between shrink-0">
        <div className="p-4 border-b border-[#ECE6DA] bg-white">
          <div className="font-heading font-bold text-xs uppercase tracking-wider text-[#310064] mb-1">
            {currentRole === 'student' ? 'Assigned Faculty' : 'Academic Channels'}
          </div>
          <div className="text-[11px] text-[#5A5A65]">
            {currentRole === 'student'
              ? 'Direct line to your dedicated subject tutors.'
              : 'Direct communication with students and admin.'}
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#ECE6DA]/60">
          {permittedPartners.map((p) => {
            const isSelected = p.id === activePartner.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPartner(p)}
                className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                  isSelected ? 'bg-white border-l-4 border-[#310064] shadow-xs' : 'hover:bg-white/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#F2ECFC] text-[#310064] font-heading font-bold text-xs flex items-center justify-center shrink-0 border border-[#E0D3F5]">
                  {p.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#1E1E24] truncate">
                      {p.name}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase bg-[#F2ECFC] text-[#310064]">
                      {p.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#5A5A65] truncate mt-0.5">
                    {p.subjectName || (p.role === 'teacher' ? 'Lead Faculty' : p.role === 'admin' ? 'Administration' : 'Student')}
                  </p>
                </div>
              </button>
            );
          })}

          {permittedPartners.length === 0 && (
            <div className="p-6 text-center text-xs text-[#5A5A65]">
              No direct communication channels active.
            </div>
          )}
        </div>

        {/* Role permission info banner */}
        <div className="p-3 bg-white border-t border-[#ECE6DA] text-[10px] text-[#5A5A65] flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#310064] shrink-0" />
          <span>
            {currentRole === 'student'
              ? 'Student messages reach your assigned teacher only.'
              : 'End-to-end institutional academic logging.'}
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Chat Thread Canvas */}
      <div className="flex-1 flex flex-col justify-between bg-white h-full min-w-0">
        {/* Chat Thread Header */}
        <div className="p-4 border-b border-[#ECE6DA] flex items-center justify-between bg-[#FFFDF8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#310064] text-white font-heading font-bold text-xs flex items-center justify-center shadow-xs">
              {activePartner.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-[#1E1E24]">
                {activePartner.name}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-[#5A5A65]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected • {activePartner.subjectName || activePartner.role.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-heading font-semibold text-[#310064] bg-[#F2ECFC] px-2 py-1 rounded-md border border-[#E0D3F5]">
              {currentRole === 'student' ? '1-on-1 Doubt Clearing' : 'Academic Channel'}
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF8F5]/30">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full text-xs text-[#5A5A65]">
              <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#310064]" />
              <span>Syncing conversation...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#F2ECFC] text-[#310064] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#1E1E24]">
                Start the conversation
              </h4>
              <p className="text-xs text-[#5A5A65] max-w-sm mx-auto">
                {currentRole === 'student'
                  ? 'Ask any doubt from your school syllabus, attach written homework, or record a voice question for your tutor.'
                  : 'Send worksheets, lecture feedback, or answers to your student.'}
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_user_id === currentUserId;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-2xl p-3.5 text-xs shadow-xs space-y-2 ${
                      isMe
                        ? 'bg-[#310064] text-white rounded-br-none'
                        : 'bg-white text-[#1E1E24] border border-[#ECE6DA] rounded-bl-none'
                    }`}
                  >
                    {/* Text Message Content */}
                    {m.message && (
                      <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                    )}

                    {/* PDF Attachment Card */}
                    {m.attachment_name && m.attachment_type === 'pdf' && (
                      <div
                        className={`p-2.5 rounded-xl flex items-center justify-between gap-3 ${
                          isMe ? 'bg-white/15 border border-white/20' : 'bg-[#FAF8F5] border border-[#ECE6DA]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-5 h-5 text-[#F4CC45] shrink-0" />
                          <div className="truncate">
                            <span className="block font-heading font-bold truncate">
                              {m.attachment_name}
                            </span>
                            <span className="text-[10px] opacity-75">PDF Document</span>
                          </div>
                        </div>
                        <a
                          href={m.attachment_url || '#'}
                          download={m.attachment_name}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white text-[#310064] hover:bg-[#F2ECFC]'
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* Image Attachment Thumbnail */}
                    {m.attachment_name && m.attachment_type === 'image' && (
                      <div className="rounded-xl overflow-hidden border border-black/10">
                        <img
                          src={m.attachment_url || '/contact-reference.jpg'}
                          alt={m.attachment_name}
                          className="max-h-56 w-full object-cover rounded-lg"
                        />
                        <div className="p-1 text-[10px] opacity-80 truncate">{m.attachment_name}</div>
                      </div>
                    )}

                    {/* Voice Recording Note Pill */}
                    {m.attachment_type === 'audio' && (
                      <div
                        className={`p-2 rounded-xl flex items-center gap-2.5 ${
                          isMe ? 'bg-white/15' : 'bg-[#F2ECFC] text-[#310064]'
                        }`}
                      >
                        <button
                          type="button"
                          className="w-7 h-7 rounded-full bg-[#F4CC45] text-[#220046] flex items-center justify-center shrink-0"
                        >
                          <Play className="w-3.5 h-3.5 ml-0.5 fill-[#220046]" />
                        </button>
                        <div className="flex-1">
                          <div className="h-1.5 bg-black/20 rounded-full w-full overflow-hidden">
                            <div className="h-full bg-[#F4CC45] w-2/3" />
                          </div>
                          <span className="text-[9px] mt-0.5 block opacity-75">
                            Voice Note ({m.attachment_name || '0:18'})
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Video Attachment Pill */}
                    {m.attachment_type === 'video' && (
                      <div
                        className={`p-2 rounded-xl flex items-center gap-2.5 ${
                          isMe ? 'bg-white/15' : 'bg-slate-100 text-[#1E1E24]'
                        }`}
                      >
                        <Video className="w-4 h-4 text-[#F4CC45]" />
                        <span className="text-[11px] font-semibold truncate flex-1">
                          {m.attachment_name || 'Class_Recording_Clip.mp4'}
                        </span>
                        <a
                          href={m.attachment_url || '#'}
                          className="text-[10px] font-bold text-[#F4CC45] hover:underline"
                        >
                          Play Video →
                        </a>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-[#5A5A65] mt-1 px-1 flex items-center gap-1">
                    <span>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck className="w-3 h-3 text-[#310064]" />}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question / Doubt Chips for Students */}
        {currentRole === 'student' && (
          <div className="px-4 py-2 border-t border-[#ECE6DA] bg-[#FFFDF8] flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-[#310064] font-bold shrink-0">Quick Doubt:</span>
            <button
              type="button"
              onClick={() => sendQuickDoubt('Could you explain step 2 of today\'s derivation?')}
              className="px-2.5 py-1 rounded-full bg-white border border-[#E0D3F5] text-[#310064] hover:bg-[#F2ECFC] whitespace-nowrap"
            >
              Explain derivation step 2
            </button>
            <button
              type="button"
              onClick={() => sendQuickDoubt('I have attached my homework worksheet for review.')}
              className="px-2.5 py-1 rounded-full bg-white border border-[#E0D3F5] text-[#310064] hover:bg-[#F2ECFC] whitespace-nowrap"
            >
              Submitted written homework
            </button>
            <button
              type="button"
              onClick={() => sendQuickDoubt('When is our next live 1-on-1 session?')}
              className="px-2.5 py-1 rounded-full bg-white border border-[#E0D3F5] text-[#310064] hover:bg-[#F2ECFC] whitespace-nowrap"
            >
              Next class timing
            </button>
          </div>
        )}

        {/* Active Attachment Preview Bar */}
        {attachedFile && (
          <div className="px-4 py-2 bg-[#F2ECFC] border-t border-[#E0D3F5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#310064] font-medium truncate">
              {attachedFile.type === 'pdf' && <FileText className="w-4 h-4 text-[#310064]" />}
              {attachedFile.type === 'image' && <ImageIcon className="w-4 h-4 text-[#310064]" />}
              {attachedFile.type === 'audio' && <Mic className="w-4 h-4 text-[#310064]" />}
              {attachedFile.type === 'video' && <Video className="w-4 h-4 text-[#310064]" />}
              <span className="font-heading font-bold truncate">{attachedFile.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className="text-slate-400 hover:text-rose-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Live Voice Recording Status */}
        {isRecording && (
          <div className="px-4 py-2.5 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-700 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Recording Voice Note... ({recordingSeconds}s)</span>
            </div>
            <button
              type="button"
              onClick={handleStopRecordingAndAttach}
              className="px-3 py-1 rounded-lg bg-rose-600 text-white font-heading font-bold text-xs"
            >
              Attach Audio Note
            </button>
          </div>
        )}

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3.5 border-t border-[#ECE6DA] bg-white flex items-center gap-2">
          {/* Attachment Action Buttons */}
          <div className="flex items-center gap-1 shrink-0 text-[#5A5A65]">
            {/* PDF Attachment Button */}
            <label
              className="w-8 h-8 rounded-lg hover:bg-[#F2ECFC] hover:text-[#310064] flex items-center justify-center cursor-pointer transition-colors"
              title="Attach PDF worksheet or document"
            >
              <FileText className="w-4 h-4" />
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'pdf')}
              />
            </label>

            {/* Image Attachment Button */}
            <label
              className="w-8 h-8 rounded-lg hover:bg-[#F2ECFC] hover:text-[#310064] flex items-center justify-center cursor-pointer transition-colors"
              title="Attach Image or photo of written work"
            >
              <ImageIcon className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'image')}
              />
            </label>

            {/* Video Attachment Button */}
            <label
              className="w-8 h-8 rounded-lg hover:bg-[#F2ECFC] hover:text-[#310064] flex items-center justify-center cursor-pointer transition-colors"
              title="Share Video file"
            >
              <Video className="w-4 h-4" />
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'video')}
              />
            </label>

            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={isRecording ? handleStopRecordingAndAttach : handleStartRecording}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isRecording ? 'bg-rose-600 text-white' : 'hover:bg-[#F2ECFC] hover:text-[#310064]'
              }`}
              title="Record voice note"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activePartner.name}...`}
            className="flex-1 p-2.5 rounded-xl border border-[#E5E5EB] text-xs text-[#1E1E24] focus:outline-none focus:border-[#310064] transition-colors"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending || (!inputText.trim() && !attachedFile)}
            className="p-2.5 rounded-xl bg-[#310064] hover:bg-[#430080] text-white disabled:opacity-50 transition-all shrink-0"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-[#F4CC45]" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
