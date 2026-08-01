'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchApi } from '@/lib/api-client';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useSocket } from '@/hooks/useSocket';
import {
  MessageSquare, Mail, Send, Search, Users, ShieldCheck,
  CheckCircle2, Clock, Filter, User, Sparkles, Loader2,
  AlertCircle, RefreshCw, Paperclip, ChevronRight, Megaphone, Inbox
} from 'lucide-react';

export default function AdminEmailChatPage() {
  const { language } = useLanguageStore();
  const { socket } = useSocket();
  const isBn = language === 'BN';

  const [activeTab, setActiveTab] = useState<'chat' | 'email'>('chat');
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  // Email Broadcast State
  const [targetRole, setTargetRole] = useState<'ALL' | 'CUSTOMER' | 'SELLER' | 'PROVIDER' | 'RIDER'>('ALL');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await fetchApi<any>('/admin/chat/conversations').catch(() => null);
      if (res && res.success && Array.isArray(res.data)) {
        setConversations(res.data);
        if (res.data.length > 0 && !selectedConv) {
          setSelectedConv(res.data[0]);
          initMockMessages(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const initMockMessages = (conv: any) => {
    setChatMessages([
      {
        id: 'm1',
        sender: conv.user?.name || 'Resident',
        isUser: false,
        text: `Hello Admin, I have a query regarding my ${conv.user?.role?.toLowerCase() || 'platform'} account status in DOHS Sheba.`,
        time: '10:14 AM',
      },
      {
        id: 'm2',
        sender: 'DOHS Sheba Support',
        isUser: true,
        text: `Greetings ${conv.user?.name || 'Resident'}! Thank you for reaching out to DOHS Sheba Admin Command Center. How may we assist you today?`,
        time: '10:16 AM',
      },
    ]);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Socket listener for incoming chat messages
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (data: any) => {
      if (selectedConv && data.conversationId === selectedConv.id) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `m_${Date.now()}`,
            sender: data.sender || 'User',
            isUser: false,
            text: data.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    };

    socket.on('NEW_CHAT_MESSAGE', handleNewMessage);
    return () => {
      socket.off('NEW_CHAT_MESSAGE', handleNewMessage);
    };
  }, [socket, selectedConv]);

  const handleSelectConv = (conv: any) => {
    setSelectedConv(conv);
    initMockMessages(conv);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConv) return;

    const newMsgText = messageInput.trim();
    setMessageInput('');
    setSendingMsg(true);

    const newMsgObj = {
      id: `m_${Date.now()}`,
      sender: 'DOHS Sheba Admin',
      isUser: true,
      text: newMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsgObj]);

    try {
      await fetchApi('/admin/chat/send', {
        method: 'POST',
        body: JSON.stringify({
          conversationId: selectedConv.id,
          recipientId: selectedConv.user?.id,
          message: newMsgText,
        }),
      }).catch(() => null);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSendEmailBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;

    setSendingEmail(true);
    try {
      const res = await fetchApi<any>('/admin/email/broadcast', {
        method: 'POST',
        body: JSON.stringify({
          targetRole,
          subject: emailSubject.trim(),
          message: emailBody.trim(),
        }),
      });

      if (res && res.success) {
        setActionMsg(
          isBn
            ? `ইমেইল ব্রডকাস্ট সফলভাবে ${res.data?.recipientCount || 'লক্ষ্যভুক্ত'} গ্রাহক/পার্টনারদের নিকট প্রেরিত হয়েছে!`
            : `Email broadcast successfully dispatched to ${res.data?.recipientCount || 'all target'} users!`
        );
        setEmailSubject('');
        setEmailBody('');
        setTimeout(() => setActionMsg(''), 5000);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to send email broadcast.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-indigo-400 font-semibold mb-0.5">Admin / Communication Suite</p>
          <h1 className="font-black text-white text-2xl flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-400" />
            <span>{isBn ? 'ইমেইল ও চ্যাট কাস্টমার সাপোর্ট সেন্টার' : 'Email & Live Chat Command Center'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn
              ? 'নিবাসিক বাসিন্দা, দোকানদার ও সার্ভিস পার্টনারদের লাইভ চ্যাট মেসেজিং এবং সিস্টেম ইমেইল ব্রডকাস্ট সংকেত'
              : 'Real-time resident & partner live chat messaging and bulk email broadcasts'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[#1e1f32] border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isBn ? 'লাইভ চ্যাট মেসেঞ্জার' : 'Live Chat Support'}</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'email' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{isBn ? 'ইমেইল ব্রডকাস্ট প্রেরক' : 'Email Broadcast'}</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* ── TAB 1: LIVE CHAT MESSENGER ── */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[620px] rounded-3xl overflow-hidden bg-[#1e1f32] border border-white/10 shadow-2xl">
          {/* Conversation Sidebar (Cols 4) */}
          <div className="lg:col-span-4 border-r border-white/10 flex flex-col bg-[#181928]">
            <div className="p-4 border-b border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-300 flex items-center gap-1.5">
                  <Inbox className="w-4 h-4 text-indigo-400" />
                  <span>{isBn ? 'সক্রিয় মেসেজ ইনবক্স' : 'Active Inbox'}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                  {conversations.length} Threads
                </span>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> Loading Conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No active chat threads available.</div>
              ) : (
                conversations.map((conv) => {
                  const isSelected = selectedConv?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConv(conv)}
                      className={`w-full p-4 text-left transition-all flex items-start gap-3 relative ${
                        isSelected ? 'bg-indigo-600/20 border-l-4 border-indigo-500' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center border border-indigo-500/30 text-sm">
                          {conv.user?.avatar ? (
                            <img src={conv.user.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            conv.user?.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#181928] absolute -bottom-0.5 -right-0.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-bold text-xs text-white truncate">{conv.user?.name || 'User'}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">10:14 AM</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mb-1">{conv.lastMessage}</p>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[9px] font-semibold uppercase">
                          {conv.user?.role || 'CUSTOMER'}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Thread Box (Cols 8) */}
          <div className="lg:col-span-8 flex flex-col bg-[#1e1f32]">
            {selectedConv ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1f2136]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/30">
                      {selectedConv.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{selectedConv.user?.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          Online
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">{selectedConv.user?.email}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/20">
                    Role: {selectedConv.user?.role}
                  </span>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-[#1a1b2d]/50">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-500 font-semibold mb-1 px-1">{msg.sender}</span>
                      <div
                        className={`max-w-[75%] p-4 rounded-3xl text-xs leading-relaxed ${
                          msg.isUser
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20'
                            : 'bg-[#282a44] text-slate-200 border border-white/10 rounded-bl-none shadow-md'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">{msg.time}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendChatMessage} className="p-4 border-t border-white/10 bg-[#1f2136] flex items-center gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={isBn ? 'একটি বার্তা লিখুন...' : 'Type a reply to the resident or provider...'}
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !messageInput.trim()}
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {sendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isBn ? 'প্রেরণ' : 'Send'}</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-12 h-12 text-slate-500 opacity-40" />
                <p className="font-bold text-sm">Select a conversation thread</p>
                <p className="text-xs text-slate-500">Pick any thread from the sidebar to inspect or reply to messages.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: SYSTEM EMAIL BROADCAST SENDER ── */}
      {activeTab === 'email' && (
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#1e1f32] border border-white/10 shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-black text-white text-lg flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-400" />
                <span>{isBn ? 'সিস্টেম ইমেইল ব্রডকাস্ট অ্যান্ড নোটিফিকেশন সেন্টার' : 'System Email & Notification Broadcast'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isBn
                  ? 'প্ল্যাটফর্মের সকল ব্যবহারকারী বা নির্দিষ্ট ক্যাটাগরির ইউজারদের অফিশিয়াল ঘোষণা পাঠাও'
                  : 'Send mass email bulletins or urgent notifications to targeted resident roles'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/20">
              Bulk Broadcast Mode
            </span>
          </div>

          <form onSubmit={handleSendEmailBroadcast} className="space-y-5 text-xs">
            {/* Target Audience Selector */}
            <div>
              <label className="text-slate-300 font-semibold block mb-2">
                {isBn ? '১. উদ্দেশ্যভিত্তিক গ্রাহকশ্রেণী (Target Audience Role)' : '1. Target Audience Group'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { role: 'ALL', label: 'All Users', icon: Users },
                  { role: 'CUSTOMER', label: 'Customers', icon: User },
                  { role: 'SELLER', label: 'Store Sellers', icon: ShieldCheck },
                  { role: 'PROVIDER', label: 'Service Pros', icon: Sparkles },
                  { role: 'RIDER', label: 'Delivery Riders', icon: ChevronRight },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setTargetRole(item.role as any)}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                      targetRole === item.role
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30'
                        : 'bg-[#181928] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Subject Line */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                {isBn ? '২. ইমেইলের বিষয়বস্তু (Subject Line)' : '2. Email Subject Line'}
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="e.g. Important Announcement: DOHS Sheba Service Update"
                className="w-full px-4 py-3 rounded-2xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                required
              />
            </div>

            {/* Email Body */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                {isBn ? '৩. বার্তা ও বার্তা বিবরণী (Email Content / Message Body)' : '3. Email Announcement Message'}
              </label>
              <textarea
                rows={6}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Type your official broadcast message here..."
                className="w-full p-4 rounded-2xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-500 leading-relaxed resize-none"
                required
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}
                className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-indigo-600/30"
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Broadcast...</span>
                  </>
                ) : (
                  <>
                    <Megaphone className="w-4 h-4" />
                    <span>{isBn ? 'ব্রডকাস্ট প্রেরণ করুন' : 'Dispatch Email Broadcast'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
