import React from "react";
import { Check, MessageCircle, Sparkles } from "lucide-react";
import { MEMBERSHIP_OPTIONS, GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";

export const MembershipSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAF7F2] relative text-[#191919]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            <span>GYM ACCESS TIERS</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-[#191919] uppercase mb-4">
            CHOOSE YOUR <span className="text-[#D95D0F]">MEMBERSHIP PLAN</span>
          </h2>
          <p className="text-[#57534E] text-base sm:text-lg leading-relaxed">
            Flexible passes and multi-month options suited to your personal training consistency and fitness goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MEMBERSHIP_OPTIONS.map((plan) => {
            const isFeatured = !!plan.badge;
            const message = `Hello ${GYM_CONFIG.trainerName}, I would like to inquire about the ${plan.title} at Mahadev Gym Fitness. Please share the pricing and joining formalities.`;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  isFeatured
                    ? "bg-[#FFFFFF] border-2 border-[#D95D0F] shadow-[0_12px_40px_rgba(217,93,15,0.12)]"
                    : "bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#D5CABE] shadow-[0_4px_24px_rgba(40,32,24,0.04)]"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D95D0F] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="text-xs text-[#78716C] font-semibold uppercase tracking-wider mb-2">
                    {plan.period}
                  </div>
                  <h3 className="font-athletic text-2xl font-bold text-[#191919] uppercase tracking-wide mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-[#57534E] leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Pricing Placeholder Tag */}
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA] mb-6 flex items-center justify-between">
                    <span className="text-xs text-[#78716C] uppercase tracking-wider font-semibold">
                      Fee Schedule
                    </span>
                    <span className="text-sm font-bold text-[#191919] tracking-wide">
                      {plan.pricingLabel}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#44403C]">
                        <Check className="w-4 h-4 text-[#D95D0F] shrink-0 mt-0.5" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={getWhatsAppUrl(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-xs ${
                    isFeatured
                      ? "bg-[#D95D0F] hover:bg-[#C2410C] text-white"
                      : "bg-[#191919] hover:bg-[#2A2A2A] text-white border border-[#191919]"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] relative z-10" />
                  <span className="relative z-10">ENQUIRE ABOUT MEMBERSHIP</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Public Scope Reminder Note */}
        <div className="mt-12 text-center text-xs text-[#78716C] max-w-xl mx-auto leading-relaxed">
          Rates and packages are subject to personal consultation. No online recurring billing or surprise charges. Visit the facility or chat on WhatsApp to finalize enrollment.
        </div>
      </div>
    </section>
  );
};
