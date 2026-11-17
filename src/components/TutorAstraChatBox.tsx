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
  Search,
  MoreVertical,
  Phone,
  VideoIcon,
  Trash2,
  Check,
  ChevronLeft
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
  const [searchContact, setSearchContact] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [mobileView, setMobileView] = useState<'contacts' | 'chat'>('chat');

  // Attachments State
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: 'pdf' | 'image' | 'audio' | 'video';
    url: string;
    size: number;
  } | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Audio Playback simulation
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileInputType, setFileInputType] = useState<'pdf' | 'image' | 'video'>('pdf');

  // Filter contacts by role:
  // - Student can ONLY text Teacher (cannot text Admin)
  // - Teacher can text Student AND Admin
  // - Admin can text Teacher
  const permittedPartners = availablePartners.filter((p) => {
    if (currentRole === 'student') return p.role === 'teacher';
    if (currentRole === 'teacher') return p.role === 'student' || p.role === 'admin';
    if (currentRole === 'admin') return p.role === 'teacher';
    return true;
  });

  const filteredPartners = permittedPartners.filter((p) =>
    p.name.toLowerCase().includes(searchContact.toLowerCase()) ||
    (p.subjectName || '').toLowerCase().includes(searchContact.toLowerCase())
  );

  // Load message history from database
  const fetchMessages = async () => {
    if (!activePartner?.id) return;
    try {
      let endpoint = '';
      if (currentRole === 'teacher') {
        endpoint = `/api/teacher/box?student_user_id=${activePartner.id}`;
      } else if (currentRole === 'student') {
        endpoint = `/api/student/box?teacher_user_id=${activePartner.id}`;
      } else if (currentRole === 'admin') {
        endpoint = `/api/admin/chat?partner_user_id=${activePartner.id}`;
      }

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Error loading chat:', e);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    setLoadingMessages(true);
    fetchMessages();
  }, [activePartner?.id, currentRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, attachedFile]);

  // Voice recording ticker
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
      name: `Voice_Note_${new Date().toLocaleTimeString().replace(/:/g, '-')}.mp3`,
      type: 'audio',
      url: 'https://storage.googleapis.com/tutorastra-voice/voice-note-demo.mp3',
      size: recordingSeconds * 16 * 1024
    });
  };

  const handleTriggerFileInput = (type: 'pdf' | 'image' | 'video') => {
    setFileInputType(type);
    setShowAttachMenu(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFile({
      name: file.name,
      type: fileInputType,
      url: URL.createObjectURL(file),
      size: file.size
    });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    setSending(true);

    const payload = {
      receiver_user_id: activePartner.id,
      message: inputText.trim(),
      attachment_name: attachedFile?.name,
      attachment_url: attachedFile?.url,
      attachment_type: attachedFile?.type,
      attachment_size: attachedFile?.size
    };

    // Optimistic UI update
    const optimisticMessage: ChatMessage = {
      id: Date.now(),
      sender_user_id: currentUserId,
      receiver_user_id: activePartner.id,
      message: inputText.trim(),
      attachment_name: attachedFile?.name,
      attachment_url: attachedFile?.url,
      attachment_type: attachedFile?.type,
      attachment_size: attachedFile?.size,
      is_read: 0,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText('');
    setAttachedFile(null);

    try {
      let endpoint = '';
      let body: any = {};

      if (currentRole === 'teacher') {
        endpoint = '/api/teacher/box';
        body = { studentUserId: activePartner.id, ...payload };
      } else if (currentRole === 'student') {
        endpoint = '/api/student/box';
        body = { teacherUserId: activePartner.id, ...payload };
      } else if (currentRole === 'admin') {
        endpoint = '/api/admin/chat';
        body = { partnerUserId: activePartner.id, ...payload };
      }

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      // Refetch to ensure synced DB IDs
      fetchMessages();
    } catch (e) {
      console.error('Failed to send message:', e);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#ECE6DA] shadow-md overflow-hidden flex flex-col md:flex-row h-full min-h-0 max-h-full w-full">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={
          fileInputType === 'pdf'
            ? '.pdf,application/pdf'
            : fileInputType === 'image'
            ? 'image/*'
            : 'video/*'
        }
        onChange={handleFileChange}
      />

      {/* ======================================================== */}
      {/* LEFT PANEL: WHATSAPP-STYLE CONTACTS LIST */}
      {/* ======================================================== */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-[#ECE6DA] flex-col bg-[#FFFFFF] shrink-0 h-full ${mobileView === 'contacts' ? 'flex' : 'hidden md:flex'}`}>
        {/* Left Header */}
        <div className="bg-[#F0F2F5] px-4 py-3 flex items-center justify-between border-b border-[#E9EDEF] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#310064] text-[#F4CC45] flex items-center justify-center font-heading font-black text-sm shadow-xs">
              {currentRole === 'admin' ? 'AD' : currentRole === 'teacher' ? 'TC' : 'ST'}
            </div>
            <div>
              <div className="font-heading font-black text-xs text-[#111B21]">
                {currentRole === 'admin'
                  ? 'Admin Workspace'
                  : currentRole === 'teacher'
                  ? 'Teacher Box'
                  : 'Student Doubt Box'}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2.5 bg-[#FFFFFF] border-b border-[#F0F2F5] shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[#54656F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#F0F2F5] text-[#111B21] placeholder:text-[#8696A0] focus:outline-hidden focus:bg-[#FFFFFF] focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Contact Threads List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F0F2F5] custom-scrollbar">
          {filteredPartners.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8696A0]">
              No contacts found.
            </div>
          ) : (
            filteredPartners.map((partner) => {
              const isActive = activePartner?.id === partner.id;
              const initials = partner.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase() || 'TA';

              return (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => {
                    onSelectPartner(partner);
                    setMobileView('chat');
                  }}
                  className={`w-full p-3 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    isActive ? 'bg-[#F0F2F5]' : 'hover:bg-[#F5F6F6] bg-white'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-[#E9EDEF] border border-[#ECE6DA] text-[#310064] flex items-center justify-center font-heading font-black text-xs shrink-0 shadow-xs">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-[#111B21] truncate">
                        {partner.name}
                      </span>
                      <span className="text-[10px] text-[#667781] shrink-0">
                        Today
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[11px] text-[#667781] truncate">
                        {partner.subjectName || `${partner.role.toUpperCase()} • TutorAstra`}
                      </p>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-1.5" />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT PANEL: WHATSAPP-STYLE ACTIVE CHAT SCREEN */}
      {/* ======================================================== */}
      <div className={`flex-1 flex-col bg-[#EFEAE2] min-w-0 h-full ${mobileView === 'chat' ? 'flex' : 'hidden md:flex'}`}>
        {/* Right Active Header */}
        <div className="bg-[#F0F2F5] px-3 sm:px-4 py-2 flex items-center justify-between border-b border-[#E9EDEF] shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileView('contacts')}
              className="md:hidden p-1.5 -ml-1 text-[#54656F] hover:text-[#111B21] hover:bg-[#E9EDEF] rounded-lg transition-colors cursor-pointer"
              title="Back to Contacts"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-heading font-black text-xs shadow-xs shrink-0">
              {activePartner?.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase() || 'TA'}
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-xs sm:text-sm text-[#111B21] truncate">
                {activePartner?.name}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium truncate">
                Online • {activePartner?.subjectName || `${activePartner?.role} Account`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[#54656F] shrink-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#310064] bg-[#F2ECFC] px-2 sm:px-2.5 py-0.5 rounded-full">
              Permanent Sync
            </span>
          </div>
        </div>

        {/* Message Thread Body with WhatsApp Wallpaper Pattern */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar"
          style={{
            backgroundColor: '#EFEAE2',
            backgroundImage: `radial-gradient(#00000008 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        >
          {/* Top Date Separator */}
          <div className="text-center my-2">
            <span className="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-[#54656F] shadow-xs">
              TODAY
            </span>
          </div>

          {loadingMessages ? (
            <div className="p-12 text-center text-xs text-[#54656F]">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#25D366] mb-2" />
              <span>Loading saved chat history...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#54656F] max-w-sm mx-auto bg-white/70 backdrop-blur-xs rounded-2xl shadow-xs">
              <CheckCheck className="w-8 h-8 text-[#25D366] mx-auto mb-2" />
              <strong className="block text-[#111B21] font-heading font-bold">
                End-to-End Saved Conversation
              </strong>
              <p className="mt-1">
                Ask your doubts, share homework files, or record voice memos. All messages are securely saved and will remain here.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_user_id === currentUserId;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-2xl px-3.5 py-2 shadow-xs text-xs relative ${
                      isMine
                        ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-none'
                        : 'bg-white text-[#111B21] rounded-tl-none'
                    }`}
                  >
                    {/* Media Attachments */}
                    {msg.attachment_type === 'pdf' && (
                      <div className="mb-2 p-2.5 rounded-xl bg-black/5 flex items-center justify-between gap-3 border border-black/5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-[11px] truncate block text-[#111B21]">
                              {msg.attachment_name || 'Homework_Document.pdf'}
                            </span>
                            <span className="text-[10px] text-[#667781]">
                              {msg.attachment_size ? `${Math.round(msg.attachment_size / 1024)} KB` : 'PDF Document'}
                            </span>
                          </div>
                        </div>
                        <a
                          href={msg.attachment_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full bg-white hover:bg-slate-100 text-[#111B21] shadow-xs"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {msg.attachment_type === 'image' && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-black/5">
                        <img
                          src={msg.attachment_url || '/hero-one-on-one.jpg'}
                          alt={msg.attachment_name || 'Shared Image'}
                          className="w-full max-h-60 object-cover rounded-xl"
                        />
                      </div>
                    )}

                    {msg.attachment_type === 'audio' && (
                      <div className="mb-2 p-2.5 rounded-xl bg-black/5 flex items-center gap-3 min-w-[220px]">
                        <button
                          type="button"
                          onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                          className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs cursor-pointer"
                        >
                          {playingAudioId === msg.id ? (
                            <Pause className="w-4 h-4 fill-white" />
                          ) : (
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="h-1.5 bg-[#667781]/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#25D366] rounded-full transition-all duration-300"
                              style={{ width: playingAudioId === msg.id ? '75%' : '0%' }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#667781] mt-1">
                            <span>{msg.attachment_name || 'Voice Note'}</span>
                            <span>{playingAudioId === msg.id ? '0:14' : '0:24'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {msg.attachment_type === 'video' && (
                      <div className="mb-2 rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                        <Video className="w-8 h-8 text-white/70" />
                      </div>
                    )}

                    {/* Text Message */}
                    {msg.message && (
                      <p className="leading-relaxed whitespace-pre-wrap break-words pr-12">
                        {msg.message}
                      </p>
                    )}

                    {/* Timestamp & Double Blue Tick */}
                    <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] mt-1 float-right -mb-1 ml-2">
                      <span>{formatTime(msg.created_at)}</span>
                      {isMine && (
                        <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment Preview Banner before send */}
        {attachedFile && (
          <div className="p-3 bg-[#F0F2F5] border-t border-[#E9EDEF] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#111B21]">Attached:</span>
              <span className="text-[#54656F] truncate max-w-xs">{attachedFile.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                {attachedFile.type}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className="text-rose-500 hover:text-rose-700 p-1"
              title="Remove attachment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOTTOM INPUT BAR: WHATSAPP-STYLE */}
        {/* ======================================================== */}
        <div className="bg-[#F0F2F5] p-3 border-t border-[#E9EDEF] flex items-center gap-2 shrink-0 relative">
          {/* Attachment Popup Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-16 left-12 bg-white rounded-2xl shadow-xl border border-[#ECE6DA] p-2 space-y-1 z-30 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => handleTriggerFileInput('pdf')}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#111B21] hover:bg-[#F0F2F5] rounded-xl text-left"
              >
                <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span>Document (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerFileInput('image')}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#111B21] hover:bg-[#F0F2F5] rounded-xl text-left"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span>Photos & Notes</span>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerFileInput('video')}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#111B21] hover:bg-[#F0F2F5] rounded-xl text-left"
              >
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <span>Video Clip</span>
              </button>
            </div>
          )}

          {/* Attachment Paperclip Button */}
          <button
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2 text-[#54656F] hover:text-[#111B21] hover:bg-[#E9EDEF] rounded-full transition-colors cursor-pointer"
            title="Attach Document, Photo or Video"
          >
            <Paperclip className="w-5 h-5 rotate-45" />
          </button>

          {/* Text Input or Active Voice Recording Bar */}
          {isRecording ? (
            <div className="flex-1 bg-white rounded-xl px-4 py-2 flex items-center justify-between text-xs border border-rose-300">
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>Recording Voice Memo: {recordingSeconds}s</span>
              </div>
              <button
                type="button"
                onClick={handleStopRecordingAndAttach}
                className="px-3 py-1 rounded-lg bg-[#25D366] text-white font-heading font-bold text-xs shadow-xs"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex-1 flex items-center">
              <input
                type="text"
                placeholder="Type a message"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm sm:text-xs rounded-xl bg-white text-[#111B21] placeholder:text-[#8696A0] focus:outline-hidden border-none shadow-xs"
              />
            </form>
          )}

          {/* Mic Button (Voice Recording) */}
          {!inputText.trim() && !attachedFile && !isRecording ? (
            <button
              type="button"
              onClick={handleStartRecording}
              className="p-2.5 text-[#54656F] hover:text-[#111B21] hover:bg-[#E9EDEF] rounded-full transition-colors cursor-pointer"
              title="Record Voice Note"
            >
              <Mic className="w-5 h-5" />
            </button>
          ) : (
            /* Send Button */
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={sending}
              className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
              title="Send Message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
