'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { fetchApi } from '@/lib/api-client';
import {
  Menu,
  Mail,
  MessageSquare,
  Calendar,
  Printer,
  Search,
  Maximize,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Globe,
  Home,
  User as UserIcon,
} from 'lucide-react';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
}

import { useEffect } from 'react';

import { useNotificationStore } from '@/store/useNotificationStore';

export function DashboardHeader({ title = 'DASHBOARD', subtitle = 'Morvin > Dashboard > Executive Overview', onToggleSidebar }: DashboardHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { role, user, setUser, logout } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Quick header toolbar modals
  const [showChatModal, setShowChatModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'support', text: 'Hello resident! How can DOHS Sheba support team assist you today?', time: 'Just now' },
  ]);

  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setMounted(true);
    fetchApi<any>('/users/profile')
      .then((res) => {
        if (res.success && res.data && setUser) {
          setUser(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: 'Just now' }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'support',
          text: `Thank you for your message: "${userMsg}". DOHS Sheba agent is looking into your inquiry.`,
          time: 'Just now',
        },
      ]);
    }, 1000);
  };

  const handleSignOut = async () => {
    await logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <header className="shrink-0 w-full bg-[#181928] border-b border-white/10 text-white px-4 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md z-30">
      {/* Top Left Navigation Icons & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5 text-indigo-400" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-400 border-r border-white/10 pr-3">
          {/* 1. Messages / Mail Icon */}
          <Link
            href="/dashboard/notifications"
            className="relative p-2 rounded-xl bg-white/5 hover:bg-indigo-600/20 hover:text-indigo-300 transition-all border border-white/5"
            title="Messages & Inbox Notifications"
          >
            <Mail className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
            )}
          </Link>

          {/* 2. Live Chat Icon */}
          <button
            onClick={() => setShowChatModal(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-emerald-600/20 hover:text-emerald-300 transition-all border border-white/5"
            title="Resident Live Support Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* 3. Calendar Icon */}
          <button
            onClick={() => setShowCalendarModal(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-purple-600/20 hover:text-purple-300 transition-all border border-white/5"
            title="Community Schedule & Booking Calendar"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* 4. Print Icon */}
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-white/5 hover:bg-amber-600/20 hover:text-amber-300 transition-all border border-white/5"
            title="Print Current Page / Receipt"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Breadcrumbs */}
        <div className="min-w-0">
          <h1 className="text-sm font-bold tracking-wider text-white uppercase truncate">
            {language === 'BN' ? (title === 'CUSTOMER DASHBOARD' ? 'কাস্টমার ড্যাশবোর্ড' : title) : title}
          </h1>
          <p className="text-[11px] text-indigo-300/80 font-medium truncate">
            {language === 'BN' ? 'ডিএইচএস রেসিডেন্ট › কাস্টমার ওয়ার্কস্পেস' : subtitle}
          </p>
        </div>
      </div>

      {/* Top Right Header Controls */}
      <div className="flex items-center justify-end gap-2.5">
        {/* Quick Search */}
        <div className="relative hidden lg:block w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'BN' ? 'ড্যাশবোর্ড সার্চ...' : 'Search dashboard...'}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#202237] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Language Selector (EN / BN Toggle) */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#202237] hover:bg-[#282a44] border border-white/10 text-xs text-slate-200 transition-all font-bold"
          >
            {language === 'EN' ? (
              <>
                <span className="text-sm">🇺🇸</span>
                <span className="hidden sm:inline">English</span>
              </>
            ) : (
              <>
                <span className="text-sm">🇧🇩</span>
                <span className="hidden sm:inline">বাংলা</span>
              </>
            )}
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLanguageDropdown && (
            <div className="absolute right-0 mt-2 w-36 bg-[#202237] border border-white/10 rounded-xl shadow-xl z-50 py-1 text-xs font-semibold">
              <button
                onClick={() => {
                  setLanguage('EN');
                  setShowLanguageDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-indigo-600/20 hover:text-indigo-300 flex items-center justify-between transition-colors ${
                  language === 'EN' ? 'text-indigo-400 font-bold bg-white/5' : 'text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🇺🇸</span> English
                </div>
                {language === 'EN' && <span className="text-xs">✓</span>}
              </button>
              <button
                onClick={() => {
                  setLanguage('BN');
                  setShowLanguageDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-indigo-600/20 hover:text-indigo-300 flex items-center justify-between transition-colors ${
                  language === 'BN' ? 'text-indigo-400 font-bold bg-white/5' : 'text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🇧🇩</span> বাংলা (Bangla)
                </div>
                {language === 'BN' && <span className="text-xs">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullScreen}
          className="p-2 rounded-lg bg-[#202237] hover:bg-[#282a44] border border-white/10 text-slate-300 hover:text-white transition-colors hidden sm:block"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>

        {/* Notification Dropdown Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-[#202237] hover:bg-[#282a44] border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border border-[#181928] animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#202237] border border-white/10 rounded-2xl shadow-2xl z-50 p-3.5 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-indigo-400" />
                  Notifications ({unreadCount > 0 ? `${unreadCount} unread` : notifications.length})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-[11px]">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <Link
                      key={n.id}
                      href={n.link || '/dashboard/notifications'}
                      onClick={() => {
                        markAsRead(n.id);
                        setShowNotifications(false);
                      }}
                      className={`block p-2.5 rounded-xl border transition-all ${
                        !n.read
                          ? 'bg-indigo-600/10 border-indigo-500/30'
                          : 'bg-white/5 border-white/5 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-white truncate max-w-[180px]">{n.title}</div>
                        <span className="text-[9px] text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5 line-clamp-2">{n.desc}</div>
                    </Link>
                  ))
                )}
              </div>

              <Link
                href="/dashboard/notifications"
                onClick={() => setShowNotifications(false)}
                className="block text-center text-[11px] font-bold text-indigo-400 hover:text-indigo-300 pt-2 border-t border-white/10"
              >
                View all notifications →
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Quick Info */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-indigo-400/50 flex items-center justify-center font-bold text-white text-xs overflow-hidden">
              {mounted && user?.avatar ? (
                <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
              ) : (
                <span suppressHydrationWarning>{(mounted && user?.name && user.name[0]) || 'U'}</span>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#181928]" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-white leading-tight" suppressHydrationWarning>
              {(mounted && user?.name) || 'Account Workspace'}
            </div>
            <div className="text-[10px] text-indigo-300 capitalize" suppressHydrationWarning>
              {(mounted && role && role !== 'GUEST') ? role.toLowerCase() : 'Account'}
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button onClick={handleSignOut} className="p-2 rounded-lg bg-[#202237] hover:bg-red-500/20 border border-white/10 text-slate-300 hover:text-red-400 transition-colors" title="Sign Out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Live Support Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1f32] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col h-[480px]">
            {/* Header */}
            <div className="p-4 bg-emerald-950/40 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-xs">Resident Live Support</h3>
                  <span className="text-[10px] text-emerald-300 font-semibold">● Online Helpline Agent</span>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                      m.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white/10 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-white/10 bg-[#181928] flex gap-2">
              <input
                type="text"
                placeholder="Type your message to DOHS support..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Community Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1f32] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" /> DOHS Community Calendar
              </h3>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-200">
                <span className="font-bold block text-sm">📅 Today: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <p className="text-[11px] text-slate-300 mt-1">DOHS Sheba marketplace and service bookings schedule</p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Community Pest Control Drive</span>
                    <span className="text-[10px] text-slate-400">DOHS Mirpur Block B & C</span>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">10:00 AM</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Water Purifier Filter Maintenance</span>
                    <span className="text-[10px] text-slate-400">Confirmed Booking Service</span>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">03:30 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowCalendarModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
              >
                Close Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
