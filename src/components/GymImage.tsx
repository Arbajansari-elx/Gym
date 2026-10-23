import React, { useState } from "react";

interface GymImageProps {
  src?: string;
  alt: string;
  className?: string;
  theme?: "hero" | "trainer" | "facility" | "workout" | "cardio" | "iron" | "gallery";
  overlay?: boolean;
}

export const GymImage: React.FC<GymImageProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  theme = "iron",
  overlay = true,
}) => {
  const [hasError, setHasError] = useState(!src);

  // High-fidelity SVG/CSS artistic fallback themes
  const renderArtisticFallback = () => {
    switch (theme) {
      case "hero":
      case "trainer":
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-[#121212] via-[#1a120c] to-[#0b0b0b] flex items-center justify-center overflow-hidden">
            {/* Ambient orange glow */}
            <div className="absolute -top-12 -right-12 w-96 h-96 bg-[#FF6A00]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#FF6A00]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Gym Athletic Silhouette Graphic */}
            <svg
              className="w-3/4 max-w-md h-auto opacity-70 text-[#FF6A00] drop-shadow-[0_10px_25px_rgba(255,106,0,0.25)]"
              viewBox="0 0 200 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head & Neck */}
              <circle cx="100" cy="35" r="18" fill="#2A2A2A" stroke="#FF6A00" strokeWidth="2" />
              <path d="M92 53 L92 65 L108 65 L108 53 Z" fill="#222" />
              {/* Broad Muscular Shoulders & Traps */}
              <path
                d="M50 78 C65 65, 80 64, 100 64 C120 64, 135 65, 150 78 L168 115 C158 120, 148 112, 142 105 L138 150 C125 158, 115 160, 100 160 C85 160, 75 158, 62 150 L58 105 C52 112, 42 120, 32 115 Z"
                fill="#1E1E1E"
                stroke="#FF6A00"
                strokeWidth="2.5"
              />
              {/* Pectoral & Core Definition Lines */}
              <path d="M72 88 C85 96, 95 96, 100 96 C105 96, 115 96, 128 88" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" />
              <line x1="100" y1="96" x2="100" y2="145" stroke="#FF6A00" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <path d="M85 115 C95 118, 105 118, 115 115" stroke="#FF6A00" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <path d="M88 132 C95 135, 105 135, 112 132" stroke="#FF6A00" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              {/* Dumbbell / Barbell Bar */}
              <rect x="15" y="108" width="170" height="6" rx="3" fill="#383838" stroke="#FF6A00" strokeWidth="1" />
              <rect x="10" y="98" width="10" height="26" rx="2" fill="#252525" stroke="#FF6A00" strokeWidth="1.5" />
              <rect x="180" y="98" width="10" height="26" rx="2" fill="#252525" stroke="#FF6A00" strokeWidth="1.5" />
            </svg>

            {/* Subtle Texture lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-[#B3B3B3]">
              <span className="font-athletic text-[#FF6A00] tracking-wider font-semibold uppercase">
                {theme === "trainer" ? "Aditya Experts Coaching" : "Mahadev Gym Athletics"}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#888]">Cinematic Studio</span>
            </div>
          </div>
        );

      case "facility":
      case "gallery":
        return (
          <div className="relative w-full h-full bg-[#141414] flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            {/* Dumbbell & Rack Geometry */}
            <svg
              className="w-24 h-24 text-[#FF6A00] opacity-50 mb-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6.5 6.5 11 11" />
              <path d="m21 21-1-1" />
              <path d="m3 3 1 1" />
              <path d="m18 22 4-4" />
              <path d="m2 6 4-4" />
              <path d="m3 10 7-7" />
              <path d="m14 21 7-7" />
            </svg>
            <span className="relative z-10 text-xs font-semibold uppercase tracking-widest text-[#FF6A00]">
              {alt || "Mahadev Gym Arena"}
            </span>
            <span className="relative z-10 text-[11px] text-[#888] mt-1">High-Caliber Training Floor</span>
          </div>
        );

      case "workout":
      default:
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#1C1C1C] to-[#121212] flex flex-col items-center justify-center p-4">
            <svg
              className="w-16 h-16 text-[#FF6A00] opacity-40 mb-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-xs font-medium text-[#E5E5E5] tracking-wide text-center">
              {alt || "Strength Training"}
            </span>
            <span className="text-[10px] text-[#FF6A00] mt-1 tracking-widest uppercase">Form & Discipline</span>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#121212]">
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setHasError(true)}
          className={className}
        />
      ) : (
        renderArtisticFallback()
      )}

      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent pointer-events-none" />
      )}
    </div>
  );
};
