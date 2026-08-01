'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchApi, uploadMultipleImagesApi } from '@/lib/api-client';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useSocket } from '@/hooks/useSocket';
import {
  MessageSquare, Send, Paperclip, Image as ImageIcon,
  CheckCheck, Search, ShieldCheck, User, Sparkles, Loader2,
  PhoneCall, Inbox, RefreshCw, ShoppingBag, Truck, CheckCircle2
} from 'lucide-react';

export default function SellerMessagesPage() {
  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  const { socket } = useSocket();
  const isBn = language === 'BN';

  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await fetchApi<any>('/admin/chat/conversations').catch(() => null);
      let threads = [
        {
          id: 'conv_cust_1',
          name: 'Lt. Col. Rahman (Savar DOHS)',
          role: 'Customer (Order #ORD-9945)',
          avatar: '👤',
          online: true,
          unread: 1,
          lastMsg: 'Hello, is my Basmati Rice and Full Cream Milk order shipped yet?',
          lastTime: '10:45 AM',
        },
        {
          id: 'conv_rider_tariq',
          name: 'Rider Tariqul Islam',
          role: 'Delivery Partner',
          avatar: '🛵',
          online: true,
          unread: 0,
          lastMsg: 'I have arrived at Fresh Bazaar store counter to pick up order #ORD-9945.',
          lastTime: '10:30 AM',
        },
        {
          id: 'conv_admin_support',
          name: 'DOHS Merchant Support Admin',
          role: 'Platform Administrator',
          avatar: '🛡️',
          online: true,
          unread: 0,
          lastMsg: 'Your seller store profile verification badge is active.',
          lastTime: 'Yesterday',
        },
      ];

      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const fetched = res.data.map((item: any, idx: number) => ({
          id: item.id || `conv_${idx}`,
          name: item.user?.name || item.name || 'DOHS Resident Customer',
          role: item.user?.role || 'Customer Inquiry',
          avatar: item.user?.avatar || '👤',
          online: true,
          unread: item.unreadCount || 0,
          lastMsg: item.lastMessage || 'Inquired about grocery product availability.',
          lastTime: 'Just now',
          recipientId: item.user?.id,
        }));
        threads = [...threads, ...fetched];
      }

      setConversations(threads);
      if (threads.length > 0 && !selectedConv) {
        setSelectedConv(threads[0]);
        loadInitialMessages(threads[0]);
      }
    } catch (err) {
      console.error('Error loading seller conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialMessages = (conv: any) => {
    setMessages([
      {
        id: 'm1',
        sender: conv.name,
        isMe: false,
        text: conv.lastMsg || 'Hello, I have an inquiry regarding product delivery.',
        time: '10:40 AM',
        status: 'read',
      },
      {
        id: 'm2',
        sender: user?.name || 'Fresh Bazaar Seller',
        isMe: true,
        text: isBn ? 'ধন্যবাদ! আপনার পণ্য প্রস্তুত রয়েছে এবং রাইডারের মাধ্যমে শীঘ্রই পাঠানো হচ্ছে।' : 'Greetings! Your items are fresh and assigned to doorstep delivery rider.',
        time: '10:42 AM',
        status: 'delivered',
      },
    ]);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time Socket message listener
  useEffect(() => {
    if (!socket) return;
    const handleNewSocketMsg = (data: any) => {
      if (selectedConv && data.conversationId === selectedConv.id) {
        setMessages((prev) => [
          ...prev,
          {
            id: `m_${Date.now()}`,
            sender: data.sender || selectedConv.name,
            isMe: false,
            text: data.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          },
        ]);
      }
    };

    socket.on('NEW_CHAT_MESSAGE', handleNewSocketMsg);
    return () => {
      socket.off('NEW_CHAT_MESSAGE', handleNewSocketMsg);
    };
  }, [socket, selectedConv]);

  const handleSelectConv = (conv: any) => {
    setSelectedConv(conv);
    loadInitialMessages(conv);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConv) return;

    const newText = inputText.trim();
    setInputText('');
    setSending(true);

    const msgObj = {
      id: `msg_${Date.now()}`,
      sender: user?.name || 'Store Seller',
      isMe: true,
      text: newText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    setMessages((prev) => [...prev, msgObj]);

    try {
      await fetchApi('/admin/chat/send', {
        method: 'POST',
        body: JSON.stringify({
          conversationId: selectedConv.id,
          recipientId: selectedConv.recipientId,
          message: newText,
        }),
      }).catch(() => null);
    } catch (err) {
      console.error('Error sending chat msg:', err);
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const urls = await uploadMultipleImagesApi(files);
      if (urls.length > 0) {
        const imageMsg = {
          id: `msg_img_${Date.now()}`,
          sender: user?.name || 'Store Seller',
          isMe: true,
          imageUrl: urls[0],
          text: 'Attachment Image',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
        };
        setMessages((prev) => [...prev, imageMsg]);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const sendQuickReply = (text: string) => {
    setInputText(text);
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 bg-[#1e1f32] rounded-3xl border border-white/10 overflow-hidden shadow-2xl text-white">
      {/* ── Left Sidebar: Customer & Rider Chat Threads (Cols 4) ── */}
      <div className="w-full md:w-80 border-r border-white/10 flex flex-col shrink-0 bg-[#181928]">
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-white text-base flex items-center gap-2">
              <Inbox className="w-5 h-5 text-emerald-400" />
              <span>{isBn ? 'গ্রাহক ও রাইডার মেসেজ' : 'Customer & Rider Messages'}</span>
            </h2>
            <button
              onClick={loadConversations}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Refresh Inbox"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'গ্রাহক বা অর্ডার নম্বর খুঁজুন...' : 'Search customer or order #...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Loading Messages...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No customer threads found.</div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={`w-full p-4 text-left transition-all flex items-start gap-3 relative ${
                    isSelected ? 'bg-emerald-600/20 border-l-4 border-emerald-500' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center border border-emerald-500/30 text-base">
                      {conv.avatar?.startsWith('http') ? (
                        <img src={conv.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        conv.avatar || '👤'
                      )}
                    </div>
                    {conv.online && (
                      <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#181928] absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-xs text-white truncate">{conv.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{conv.lastTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mb-1">{conv.lastMsg}</p>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[9px] font-semibold">
                      {conv.role}
                    </span>
                  </div>

                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Panel: Active Chat Thread (Cols 8) ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1f32]">
        {selectedConv ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1f2136]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center border border-emerald-500/30 text-lg">
                  {selectedConv.avatar?.startsWith('http') ? (
                    <img src={selectedConv.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    selectedConv.avatar || '👤'
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{selectedConv.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Now · {selectedConv.role}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:01306031982"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Hotline</span>
                </a>
              </div>
            </div>

            {/* Quick Template Replies Bar */}
            <div className="px-4 py-2 bg-[#181928] border-b border-white/5 flex items-center gap-2 overflow-x-auto text-[11px] font-semibold text-slate-300 custom-scrollbar">
              <span className="text-slate-500 text-[10px] uppercase font-bold shrink-0">Quick Replies:</span>
              {[
                'Your order is packed and ready for pickup.',
                'Product is in stock and available.',
                'Rider is currently on the way to your door.',
              ].map((reply, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendQuickReply(reply)}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 whitespace-nowrap transition-all"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-[#1a1b2d]/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 font-semibold mb-1 px-1">{msg.sender}</span>
                  
                  <div
                    className={`max-w-[75%] p-4 rounded-3xl text-xs leading-relaxed space-y-2 ${
                      msg.isMe
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-lg shadow-emerald-600/20'
                        : 'bg-[#282a44] text-slate-200 border border-white/10 rounded-bl-none shadow-md'
                    }`}
                  >
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="" className="w-full max-h-56 object-cover rounded-2xl border border-white/10" />
                    )}
                    <p>{msg.text}</p>
                    <div className={`flex items-center gap-1 text-[9px] ${msg.isMe ? 'text-emerald-100 justify-end' : 'text-slate-400'}`}>
                      <span>{msg.time}</span>
                      {msg.isMe && <CheckCheck className="w-3 h-3 text-cyan-300" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-[#1f2136] flex items-center gap-3">
              <label className="p-2.5 rounded-2xl bg-[#181928] hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer">
                {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <ImageIcon className="w-4 h-4" />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isBn ? 'গ্রাহককে উত্তর টাইপ করুন...' : 'Type message reply to resident customer...'}
                className="flex-1 px-4 py-3 rounded-2xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500 transition-all"
              />

              <button
                type="submit"
                disabled={sending || !inputText.trim()}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 shadow-emerald-600/30"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isBn ? 'উত্তর দিন' : 'Reply'}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
            <MessageSquare className="w-12 h-12 text-slate-500 opacity-40" />
            <p className="font-bold text-sm">Select a customer thread</p>
            <p className="text-xs text-slate-500">Pick any customer or rider inquiry from the sidebar to inspect or send replies.</p>
          </div>
        )}
      </div>
    </div>
  );
}
