'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  CheckCheck,
  Search,
  User,
} from 'lucide-react';

const CHAT_CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Super Bazar DOHS (Seller)',
    role: 'Merchant',
    avatar: '🛍️',
    unread: 1,
    lastMsg: 'Your Basmati Rice order is out for delivery with rider Tariqul!',
    lastTime: '10:45 AM',
    messages: [
      { sender: 'customer', text: 'Hello, is Order #ORD-9945 shipped yet?', time: '10:30 AM', status: 'read' },
      { sender: 'seller', text: 'Hello Lt. Col. Rahman! Yes, your Basmati Rice order is packed and assigned to rider Tariqul.', time: '10:35 AM', status: 'read' },
      { sender: 'seller', text: 'Your Basmati Rice order is out for delivery with rider Tariqul!', time: '10:45 AM', status: 'delivered' },
    ],
  },
  {
    id: 'c2',
    name: 'DOHS Resident Support Admin',
    role: 'Support Agent',
    avatar: '🛡️',
    unread: 0,
    lastMsg: 'Your refund claim #RFD-4410 has been approved.',
    lastTime: 'Yesterday',
    messages: [
      { sender: 'customer', text: 'I submitted a return request for damaged packaging.', time: 'Jul 24, 10:00 AM', status: 'read' },
      { sender: 'seller', text: 'Your refund claim #RFD-4410 has been approved.', time: 'Jul 24, 11:30 AM', status: 'read' },
    ],
  },
];

export default function MessagesPage() {
  const [activeConvId, setActiveConvId] = useState('c1');
  const [inputText, setInputText] = useState('');

  const activeConv = CHAT_CONVERSATIONS.find((c) => c.id === activeConvId) || CHAT_CONVERSATIONS[0];

  const sendMessage = () => {
    if (!inputText.trim()) return;
    activeConv.messages.push({
      sender: 'customer',
      text: inputText,
      time: 'Just now',
      status: 'delivered',
    });
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 bg-[#1e1f32] rounded-2xl border border-white/10 overflow-hidden">
      {/* Sidebar Conversations List */}
      <div className="w-full md:w-80 border-r border-white/10 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10 space-y-3">
          <h2 className="font-black text-white text-base flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" /> Inbox Messages
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {CHAT_CONVERSATIONS.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 ${
                activeConvId === conv.id ? 'bg-indigo-500/10 border-l-4 border-indigo-500' : 'hover:bg-white/5'
              }`}
            >
              <span className="text-2xl p-2 rounded-xl bg-white/5 shrink-0">{conv.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white truncate">{conv.name}</h4>
                  <span className="text-[10px] text-slate-400">{conv.lastTime}</span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Conversation View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Active Chat Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-1.5 rounded-xl bg-white/5">{activeConv.avatar}</span>
            <div>
              <h3 className="font-bold text-sm text-white">{activeConv.name}</h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Now
              </p>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {activeConv.messages.map((msg, index) => {
            const isMe = msg.sender === 'customer';
            return (
              <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-xs space-y-1 ${
                    isMe
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                      : 'bg-white/10 text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className={`flex items-center gap-1 text-[9px] ${isMe ? 'text-indigo-200 justify-end' : 'text-slate-400'}`}>
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-cyan-300" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-white/10 flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300">
            <Paperclip className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300">
            <ImageIcon className="w-4 h-4" />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
