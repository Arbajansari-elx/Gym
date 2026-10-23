import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light";
}

export const TrishulIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-[#FF6A00]" }) => (
  <svg
    viewBox="0 0 40 48"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    {/* Central Spearhead */}
    <path d="M20 2 L23 10 L21.5 24 L18.5 24 L17 10 Z" />
    <polygon points="20,0 23.5,8 20,6 16.5,8" />
    
    {/* Left Curved Prong */}
    <path d="M18 16 C12 16 6 12 6 4 C6 2 7 2 7.5 4 C8.5 10 13 13 18 14 Z" />
    <path d="M6 3 L3 7 L7 6 Z" />

    {/* Right Curved Prong */}
    <path d="M22 16 C28 16 34 12 34 4 C34 2 33 2 32.5 4 C31.5 10 27 13 22 14 Z" />
    <path d="M34 3 L37 7 L33 6 Z" />

    {/* Horizontal Collar Ring */}
    <rect x="15" y="23" width="10" height="3" rx="1.5" />
    <rect x="13" y="27" width="14" height="2" rx="1" />

    {/* Main Shaft / Handle */}
    <path d="M18.5 26 L18.5 46 L21.5 46 L21.5 26 Z" />
    <polygon points="20,48 18,45 22,45" />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = "md", theme = "dark" }) => {
  const iconSize = size === "lg" ? "w-9 h-11" : size === "sm" ? "w-6 h-7" : "w-7 h-9";
  const titleSize = size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-lg" : "text-xl sm:text-2xl";
  const subtitleSize = size === "lg" ? "text-xs tracking-[0.25em]" : size === "sm" ? "text-[9px] tracking-[0.2em]" : "text-[10px] tracking-[0.22em]";
  const isLight = theme === "light";

  return (
    <div className="flex items-center gap-2.5">
      <TrishulIcon className={`${iconSize} ${isLight ? "text-[#D95D0F]" : "text-[#FF6A00]"} shrink-0 drop-shadow-[0_0_12px_rgba(255,106,0,0.35)]`} />
      <div className="flex flex-col leading-none">
        <span className={`font-athletic ${titleSize} font-bold ${isLight ? "text-[#191919]" : "text-white"} tracking-wider leading-none`}>
          MAHADEV
        </span>
        <span className={`font-athletic ${subtitleSize} font-bold ${isLight ? "text-[#D95D0F]" : "text-[#FF6A00]"} uppercase mt-0.5 leading-none`}>
          GYM FITNESS
        </span>
      </div>
    </div>
  );
};
