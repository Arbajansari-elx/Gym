import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
      {/* Tooltip bubble on desktop */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2.5 ios-glass text-white px-3.5 py-2 rounded-2xl shadow-xl text-xs">
          <span>Chat with <strong className="shining-name">{GYM_CONFIG.trainerName}</strong></span>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-[#888] hover:text-white ml-1 p-0.5 rounded-full hover:bg-white/10"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I am visiting the Mahadev Gym Fitness website and would like to chat.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-14 h-14 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-black flex items-center justify-center shadow-[0_6px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.6)] transition-all transform hover:scale-105 active:scale-95 border border-white/20"
        aria-label="Chat with Coach Aditya Experts on WhatsApp"
        title="Chat with Coach Aditya Experts on WhatsApp"
      >
        {/* Subtle Pulse Ring */}
        <span className="absolute -inset-1 rounded-2xl bg-[#25D366] opacity-30 group-hover:animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      </a>
    </div>
  );
};
