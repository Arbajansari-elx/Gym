import React from "react";
import { ArrowRight, MessageCircle, Flame } from "lucide-react";
import { getWhatsAppUrl, TRAINER_HERO_IMAGE } from "../config/gymConfig";
import { useNavigation } from "../context/NavigationContext";
import { TrishulIcon } from "./BrandLogo";

export const Hero: React.FC = () => {
  const { navigateTo } = useNavigation();

  const handleJoinNow = () => {
    window.dispatchEvent(new CustomEvent("open-join-modal"));
  };

  const handleExploreWorkouts = () => {
    navigateTo("plans");
  };

  return (
    <section
      id="home"
      className="relative bg-[#0B0B0B] overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-18 lg:pt-32 lg:pb-22 border-b border-[#1C1C1C]"
    >
      {/* Subtle, restrained ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-[#FF6A00]/[0.07] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* ========================================================= */}
        {/* 1. TRAINER PHOTOGRAPH AT THE TOP                          */}
        {/* ========================================================= */}
        <div className="mb-8 sm:mb-10">
          {/* Seamless blend container: Soft black glow all around, zero white outlines */}
          <div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden bg-[#0B0B0B] shadow-[0_0_90px_30px_#0B0B0B,0_0_50px_15px_#0B0B0B,0_25px_60px_rgba(0,0,0,0.99)] group">
            <div className="relative aspect-[16/10] sm:aspect-[21/10] md:aspect-[21/9] w-full overflow-hidden">
              <img
                src={TRAINER_HERO_IMAGE}
                alt="Coach Aditya Experts - Mahadev Gym Fitness Head Trainer"
                className="w-full h-full object-cover object-[72%_10%] sm:object-[68%_14%] lg:object-[65%_18%] filter brightness-95 contrast-105 group-hover:scale-[1.01] transition-transform duration-700"
              />

              {/* Bottom fade & Right-side black glow only (top & left glows removed as requested) */}
              <div className="absolute inset-x-0 bottom-0 h-20 sm:h-32 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/85 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-[#0B0B0B] via-[#0B0B0B]/90 to-transparent pointer-events-none z-10" />

              {/* Top Corner: Sleek Brand Tag */}
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-5 flex items-center gap-1.5 bg-[#0B0B0B]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/[0.05] shadow-lg z-20">
                <TrishulIcon className="w-3.5 h-4.5 text-[#FF6A00]" />
                <span className="font-athletic text-[11px] sm:text-xs font-bold text-white tracking-wider">
                  MAHADEV <span className="text-[#FF6A00]">GYM FITNESS</span>
                </span>
              </div>

              {/* Bottom Badge: HEAD TRAINER & COACH (Ultra-compact reduced height, zero white outline) */}
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-5 right-2.5 sm:right-auto flex items-center justify-between sm:justify-start gap-2.5 bg-[#0B0B0B]/92 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1 rounded-md border border-white/[0.06] shadow-[0_6px_24px_rgba(0,0,0,0.9)] z-20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-sm bg-[#FF6A00] flex items-center justify-center text-black font-bold shadow-[0_0_8px_rgba(255,106,0,0.4)] shrink-0">
                    <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black fill-current" />
                  </div>
                  <div className="flex flex-col justify-center leading-none">
                    <span className="text-[8px] sm:text-[9px] font-bold text-[#8E8E93] uppercase tracking-wider leading-none mb-0.5">
                      HEAD TRAINER & COACH
                    </span>
                    {/* Continuous Always Shining Name */}
                    <span className="font-athletic text-sm sm:text-base font-bold uppercase tracking-wide shining-name leading-tight">
                      ADITYA EXPERTS
                    </span>
                  </div>
                </div>

                <a
                  href={getWhatsAppUrl(`Hello Aditya Experts, I want to inquire about personal coaching at Mahadev Gym Fitness.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-join-shining sm:ml-2 px-2.5 py-1 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all shadow-sm flex items-center gap-1 shrink-0"
                >
                  <MessageCircle className="w-3 h-3 text-white relative z-10" />
                  <span className="relative z-10 hidden sm:inline">Connect</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. PHOTO KE NICHE: BRAND, TAGLINE & CTA BUTTONS           */}
        {/* ========================================================= */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Brand Kicker */}
          <div className="flex items-center justify-center gap-2 mb-3 text-xs sm:text-sm font-semibold tracking-wider text-[#FF6A00] uppercase">
            <TrishulIcon className="w-4 h-4.5 text-[#FF6A00]" />
            <span>MAHADEV GYM FITNESS</span>
          </div>

          {/* Tagline directly below with a clear but modest gap */}
          <p className="text-sm sm:text-base font-medium text-[#A3A3A3] tracking-normal mb-8 max-w-xl text-center leading-relaxed">
            TRAIN HARD. STAY DISCIPLINED. BECOME UNSTOPPABLE.
          </p>

          {/* Compact, Proportional CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-8">
            {/* Primary Button: JOIN NOW (44–48px height, 18–24px padding, 14px semibold, 4-6px border radius, orange with white text) */}
            <button
              type="button"
              onClick={handleJoinNow}
              className="btn-join-shining h-[46px] min-h-[44px] px-6 text-[14px] font-semibold uppercase tracking-wider text-white rounded-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span className="relative z-10">JOIN NOW</span>
              <ArrowRight className="w-4 h-4 text-white relative z-10" />
            </button>

            {/* Secondary Button: EXPLORE WORKOUTS (40–44px height, 18–24px padding, 14px semibold, 4-6px border radius, transparent with thin orange border) */}
            <button
              type="button"
              onClick={handleExploreWorkouts}
              className="h-[44px] min-h-[44px] px-6 text-[14px] font-semibold uppercase tracking-wider text-white bg-transparent hover:bg-[#FF6A00]/10 border border-[#FF6A00]/80 hover:border-[#FF6A00] rounded-md transition-colors active:scale-95 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>EXPLORE WORKOUTS</span>
              <ArrowRight className="w-4 h-4 text-[#FF6A00]" />
            </button>
          </div>

          {/* Restrained Coach Endorsement Line */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#8E8E93]">
            <span className="font-semibold uppercase tracking-wider text-[#A3A3A3]">HEAD TRAINER & COACH</span>
            <span aria-hidden="true" className="text-[#444]">·</span>
            <span className="shining-name font-athletic font-bold text-sm tracking-wide">ADITYA EXPERTS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
