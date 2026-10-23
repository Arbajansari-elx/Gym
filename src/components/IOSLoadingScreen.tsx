import React, { useEffect, useState, useRef } from "react";
import { TrishulIcon } from "./BrandLogo";

interface IOSLoadingScreenProps {
  onComplete?: () => void;
  duration?: number; // in milliseconds, defaults to 2000
}

export const IOSLoadingScreen: React.FC<IOSLoadingScreenProps> = ({
  onComplete,
  duration = 2000,
}) => {
  const [isFading, setIsFading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const hasStartedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  // Keep latest reference without triggering effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Ensure this timer runs ONLY ONCE across the entire component lifecycle
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Exactly 2 seconds timer as requested by user
    const timer = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      setIsFading(true);
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // 500ms smooth fade transition
      return () => clearTimeout(removeTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070707] transition-all duration-500 ease-out select-none ${
        isFading ? "opacity-0 pointer-events-none scale-102" : "opacity-100 pointer-events-auto scale-100"
      }`}
      aria-label="Loading Mahadev Gym Fitness"
      role="status"
    >
      {/* Subtle Apple Ambient Glow */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#FF6A00]/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Apple iOS Glass Logo Container */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ios-glass border border-white/10 flex items-center justify-center mb-6 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.15)]">
          <TrishulIcon className="w-10 h-12 sm:w-12 sm:h-14 text-[#FF6A00] drop-shadow-[0_0_16px_rgba(255,106,0,0.6)]" />
        </div>

        {/* Brand Label */}
        <div className="mb-8 flex flex-col items-center">
          <span className="font-athletic text-lg sm:text-2xl font-bold tracking-[0.22em] text-white uppercase">
            MAHADEV <span className="text-[#FF6A00]">GYM FITNESS</span>
          </span>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-[#888888] uppercase mt-1">
            PREMIUM CLUB
          </span>
        </div>

        {/* ========================================================
            ICONIC APPLE iOS 3-DOTS LOADING ANIMATION ("SAME TO SAME")
            ======================================================== */}
        <div className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-full ios-glass border border-white/10 shadow-lg">
          <span className="ios-loading-dot ios-loading-dot-1" />
          <span className="ios-loading-dot ios-loading-dot-2" />
          <span className="ios-loading-dot ios-loading-dot-3" />
        </div>
      </div>
    </div>
  );
};
