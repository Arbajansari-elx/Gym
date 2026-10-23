import React from "react";
import { MessageCircle, Check, Sparkles, Clock, Calendar } from "lucide-react";
import { COACHING_PACKAGES, GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";

export const CoachingPackagesSection: React.FC = () => {
  return (
    <section id="coaching" className="py-16 lg:py-24 bg-[#FAF7F2] relative text-[#191919]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            <span>ELITE MENTORSHIP</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-[#191919] uppercase mb-4">
            PERSONAL TRAINING. <span className="text-[#D95D0F]">PERSONAL PROGRESS.</span>
          </h2>
          <p className="text-[#57534E] text-base sm:text-lg leading-relaxed">
            Direct 1-on-1 coaching with {GYM_CONFIG.trainerName}. Tailored form guidance, accountability, and customized fitness strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COACHING_PACKAGES.map((pkg, index) => {
            const isHighlight = index === 1; // Middle package highlight
            const whatsappMessage = `Hello ${GYM_CONFIG.trainerName}, I am interested in the ${pkg.name} package at Mahadev Gym Fitness. Please share the details.`;

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl flex flex-col justify-between p-6 sm:p-8 transition-all relative ${
                  isHighlight
                    ? "bg-[#FFFFFF] border-2 border-[#D95D0F] shadow-[0_12px_40px_rgba(217,93,15,0.12)]"
                    : "bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#D5CABE] shadow-[0_4px_24px_rgba(40,32,24,0.04)]"
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D95D0F] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm whitespace-nowrap">
                    RECOMMENDED CHOICE
                  </div>
                )}

                <div>
                  {/* Frequency and duration */}
                  <div className="flex items-center justify-between text-xs text-[#78716C] mb-3">
                    <span className="flex items-center gap-1.5 font-medium text-[#292524]">
                      <Clock className="w-3.5 h-3.5 text-[#D95D0F]" />
                      {pkg.frequency}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#78716C]" />
                      {pkg.duration}
                    </span>
                  </div>

                  <h3 className="font-athletic text-2xl font-bold text-[#191919] uppercase tracking-wide mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#D95D0F] uppercase tracking-wider mb-4">
                    {pkg.tagline}
                  </p>
                  <p className="text-xs text-[#57534E] leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  {/* Pricing Placeholder Tag */}
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA] mb-6 flex items-center justify-between">
                    <span className="text-xs text-[#78716C] uppercase tracking-wider font-semibold">
                      Package Rate
                    </span>
                    <span className="text-sm font-bold text-[#191919] tracking-wide">
                      {pkg.priceNote}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#44403C]">
                        <Check className="w-4 h-4 text-[#D95D0F] shrink-0 mt-0.5" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Action */}
                <a
                  href={getWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-xs ${
                    isHighlight
                      ? "bg-[#D95D0F] hover:bg-[#C2410C] text-white"
                      : "bg-[#191919] hover:bg-[#2A2A2A] text-white border border-[#191919]"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>ENQUIRE VIA WHATSAPP</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
