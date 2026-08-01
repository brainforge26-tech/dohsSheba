'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

const WHATSAPP_NUMBER = '8801306031982';
const DISPLAY_NUMBER = '01306031982';

export function WhatsAppButton() {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';

  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const defaultMsg = isBn
    ? 'আসসালামু আলাইকুম, আমি DOHS শেবা সার্ভিস সম্পর্কিত কিছু জানতে চাই।'
    : 'Assalamu Alaikum, I have an inquiry regarding DOHS Sheba services.';

  const handleOpenWhatsApp = (customText?: string) => {
    const textToUse = customText || userMsg || defaultMsg;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textToUse)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end">
      
      {/* Interactive Floating Chat Box */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-[#121424]/95 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl p-5 text-white space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#121424] absolute -bottom-0.5 -right-0.5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span>DOHS Sheba Support</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-medium">WhatsApp: {DISPLAY_NUMBER}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Preview Body */}
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 text-xs leading-relaxed space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold block">Support Team:</span>
              <p className="text-slate-300">
                {isBn
                  ? 'হ্যালো! DOHS শেবায় আপনাকে স্বাগতম। আমাদের সাথে সরাসরি হোয়াটসঅ্যাপে কথা বলতে নিচের অপশনে মেসেজ লিখুন।'
                  : 'Hello! Welcome to DOHS Sheba. Send us a message directly on WhatsApp for instant assistance.'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 block">
                {isBn ? 'মেসেজ পরিবর্তন করুন (Initial Message):' : 'Initial Message to Support:'}
              </label>
              <textarea
                rows={3}
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                placeholder={defaultMsg}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => handleOpenWhatsApp()}
            className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>{isBn ? 'হোয়াটসঅ্যাপে চ্যাট শুরু করুন' : 'Start Chat on WhatsApp'}</span>
          </button>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => {
          if (!isOpen && !userMsg) setUserMsg(defaultMsg);
          setIsOpen(!isOpen);
        }}
        className="group relative p-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl shadow-emerald-500/40 transition-all duration-300 active:scale-90 flex items-center justify-center border border-white/30"
        title="Chat on WhatsApp (01306031982)"
      >
        <span className="w-3 h-3 rounded-full bg-white absolute top-0.5 right-0.5 animate-ping opacity-75" />
        
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </button>

    </div>
  );
}
