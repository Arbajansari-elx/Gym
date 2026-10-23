import React from "react";
import { MapPin, Navigation, Clock, MessageCircle, ExternalLink } from "lucide-react";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";

export const LocationSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAF7F2] relative text-[#191919]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
            <MapPin className="w-4 h-4" />
            <span>FACILITY ACCESS & DIRECTIONS</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-[#191919] uppercase mb-4">
            FIND <span className="text-[#D95D0F]">MAHADEV GYM FITNESS</span>
          </h2>
          <p className="text-[#57534E] text-base sm:text-lg leading-relaxed">
            Visit our training floor in person for a free tour, equipment walkthrough, and direct coach interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Location Info Box */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_4px_24px_rgba(40,32,24,0.04)]">
            <div>
              <div className="flex items-center gap-2.5 text-[#191919] font-bold text-lg uppercase tracking-wide mb-4">
                <MapPin className="w-5 h-5 text-[#D95D0F] shrink-0" />
                <span>Gym Location Details</span>
              </div>

              {/* Configurable Address */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE5DA] mb-6">
                <div className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1">
                  Facility Address
                </div>
                <p className="text-sm text-[#191919] font-medium leading-relaxed">
                  {GYM_CONFIG.address}
                </p>
                <div className="mt-2 text-xs text-[#D95D0F] font-bold">
                  {GYM_CONFIG.city}
                </div>
              </div>

              {/* Operating Hours */}
              <div className="space-y-3 mb-8">
                <div className="text-xs font-bold text-[#191919] uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#D95D0F]" />
                  <span>Floor Timings</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA] text-xs text-[#44403C] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B635B] font-medium">Mon – Sat:</span>
                    <span className="font-semibold text-[#191919]">5:30 AM – 10:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#E8E0D5]">
                    <span className="text-[#6B635B] font-medium">Sunday:</span>
                    <span className="font-semibold text-[#D95D0F]">7:00 AM – 12:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Directions & WhatsApp */}
            <div className="space-y-3 pt-4 border-t border-[#ECE5DA]">
              <a
                href={GYM_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#D95D0F] hover:bg-[#C2410C] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>GET DIRECTIONS ON GOOGLE MAPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I would like to visit Mahadev Gym Fitness. Please share the exact landmark.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#191919] bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>ASK FOR LANDMARK ON WHATSAPP</span>
              </a>
            </div>
          </div>

          {/* Map Display Card */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8E2D8] rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(40,32,24,0.04)] flex flex-col justify-between">
            <div className="p-4 bg-[#FAF7F2] border-b border-[#ECE5DA] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#191919] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#D95D0F]" />
                <span>Interactive Location Navigator</span>
              </div>
              <a
                href={GYM_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#D95D0F] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Open in App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Map Frame / High-Fidelity Styled Map View (Claude Cream Canvas) */}
            <div className="relative w-full h-[380px] bg-[#F5EFE6] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[#F5EFE6] flex flex-col items-center justify-center p-6 text-center">
                {/* Visual Map Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#19191910_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                
                {/* Styled Pin Marker */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#D95D0F]/20 flex items-center justify-center animate-ping absolute inset-0" />
                  <div className="w-16 h-16 rounded-full bg-[#D95D0F] text-white flex items-center justify-center shadow-lg relative z-10">
                    <MapPin className="w-8 h-8 fill-white" />
                  </div>
                </div>

                <h4 className="font-athletic text-2xl font-bold text-[#191919] uppercase tracking-wide relative z-10">
                  {GYM_CONFIG.name}
                </h4>
                <p className="text-xs text-[#57534E] max-w-sm mt-1 mb-5 relative z-10 font-medium">
                  {GYM_CONFIG.address}
                </p>

                <a
                  href={GYM_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-[#191919] hover:bg-[#2A2A2A] rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-sm active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#FF8A33]" />
                  <span>Launch Google Maps GPS Navigation</span>
                </a>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF7F2] border-t border-[#ECE5DA] text-center text-[11px] text-[#78716C]">
              Verified Google Maps Coordinates • Opp. Central Park, Gym Floor
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
