import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

export const FloatingBackButton: React.FC = () => {
  const { currentPage } = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  // Monitor scroll position with requestAnimationFrame throttling and passive event listener
  useEffect(() => {
    let ticking = false;
    const SCROLL_THRESHOLD = 300;

    const updateVisibility = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const shouldBeVisible = scrollY > SCROLL_THRESHOLD;

      // Only update state when threshold boundary is crossed to avoid unnecessary re-renders
      if (shouldBeVisible !== isVisibleRef.current) {
        isVisibleRef.current = shouldBeVisible;
        setIsVisible(shouldBeVisible);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    // Initial check on mount
    updateVisibility();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Reset visibility when navigating between full-screen pages
  useEffect(() => {
    setIsVisible(false);
    isVisibleRef.current = false;
  }, [currentPage]);

  // Fluid native smooth scroll to absolute top, respecting prefers-reduced-motion
  const scrollToTop = useCallback(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
      aria-hidden={!isVisible}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#191919] hover:bg-black text-white shadow-[0_8px_25px_rgba(0,0,0,0.3)] border border-white/10 active:scale-95 transition-all cursor-pointer group text-xs font-bold uppercase tracking-wider"
        aria-label="Back to Top"
        title="Back to Top"
      >
        <div className="w-5 h-5 rounded-full bg-[#D95D0F] flex items-center justify-center text-white shrink-0 group-hover:-translate-x-0.5 transition-transform">
          <ArrowLeft className="w-3.5 h-3.5" />
        </div>
        <span className="pr-1">BACK TO HOME</span>
      </button>
    </div>
  );
};

