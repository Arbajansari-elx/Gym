import React from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";

interface PageBannerProps {
  kicker: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  customAction?: {
    label: string;
    onClick: () => void;
  };
}

export const PageBanner: React.FC<PageBannerProps> = ({
  kicker,
  title,
  titleAccent,
  subtitle,
  customAction,
}) => {
  const { goBack } = useNavigation();

  return (
    <div className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-[#FAF7F2] border-b border-[#E5DFD5] overflow-hidden text-[#191919]">
      {/* Subtle Claude AI warm ambient blur */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#E8DDD0]/50 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#19191908_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation Breadcrumb / Return */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B635B] hover:text-[#D95D0F] transition-colors cursor-pointer group px-3 py-1.5 rounded-lg bg-white/70 border border-[#E5DFD5] hover:bg-white shadow-xs"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4 text-[#D95D0F] group-hover:-translate-x-1 transition-transform" />
            <span>← BACK TO HOME</span>
          </button>

          <a
            href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I am browsing the ${title} page on the Mahadev Gym website.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Content Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-2 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
              <span className="w-5 h-[2px] bg-[#D95D0F]" />
              <span>{kicker}</span>
            </div>

            <h1 className="font-athletic text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#191919] uppercase leading-[1.05]">
              {title} {titleAccent && <span className="text-[#D95D0F]">{titleAccent}</span>}
            </h1>

            <p className="text-[#57534E] text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          {customAction && (
            <button
              type="button"
              onClick={customAction.onClick}
              className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#191919] hover:bg-[#2A2A2A] rounded-xl shadow-sm active:scale-95 cursor-pointer self-start md:self-auto shrink-0 transition-all border border-[#191919]"
            >
              <span>{customAction.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
