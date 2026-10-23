import React, { useState } from "react";
import { MessageCircle, MapPin, Phone, Shield, ExternalLink, X, ArrowLeft } from "lucide-react";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";
import { useNavigation } from "../context/NavigationContext";
import { BrandLogo } from "./BrandLogo";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [activeLegalModal, setActiveLegalModal] = useState<"privacy" | "terms" | null>(null);
  const { currentPage, navigateTo, goBack } = useNavigation();

  const isClaudeTheme = currentPage !== "home";

  return (
    <footer
      className={`border-t transition-colors ${
        isClaudeTheme
          ? "bg-[#F3EFEA] border-[#E5DFD5] text-[#57534E] pt-12 pb-12"
          : "bg-[#0A0A0A] border-[#1C1C1C] text-[#B3B3B3] pt-16 pb-12"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full-Screen Page Exit Bar when viewing subpage */}
        {isClaudeTheme && (
          <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E5DFD5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <span className="text-[11px] font-bold text-[#D95D0F] tracking-widest uppercase block mb-1">
                FULL-SCREEN DEDICATED VIEW
              </span>
              <h3 className="font-athletic text-xl sm:text-2xl font-bold text-[#191919] uppercase tracking-wide">
                DONE EXPLORING THIS SECTION?
              </h3>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-xl">
                Slide down as much as you like. Whenever you are ready to return, tap the button below or the Back button at the top.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={goBack}
                className="px-6 py-3 rounded-xl bg-[#191919] hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-[#D95D0F]" />
                <span>← BACK TO HOME ARENA</span>
              </button>
              <a
                href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I am browsing the ${currentPage} page and would like to ask a question.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#191919] border border-[#E5DFD5] text-xs font-semibold active:scale-95 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <button
              type="button"
              onClick={() => navigateTo("home")}
              className="flex items-center text-left cursor-pointer group"
            >
              <BrandLogo size="md" theme={isClaudeTheme ? "light" : "dark"} />
            </button>

            <p className={`text-xs leading-relaxed max-w-sm ${isClaudeTheme ? "text-[#78716C]" : "text-[#888888]"}`}>
              Premium bodybuilding, functional conditioning, and disciplined strength development. Founded on biomechanical accuracy and coach-led consistency.
            </p>

            <div className={`pt-2 text-xs font-semibold tracking-wider uppercase ${isClaudeTheme ? "text-[#D95D0F]" : "text-[#FF6A00]"}`}>
              {GYM_CONFIG.subTagline}
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-widest ${isClaudeTheme ? "text-[#191919]" : "text-white"}`}>
              Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("home")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  Home Arena
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("about")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  About & Philosophy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("trainer")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  Head Coach Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("plans")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  Workout Plans
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("exercises")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  Exercise Library
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("gallery")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  8-Photo Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Features / Tools Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-widest ${isClaudeTheme ? "text-[#191919]" : "text-white"}`}>
              Specialized Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("calculator")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  Daily Calorie Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("muscle-fatloss")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  Muscle vs. Fat Loss
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("coaching")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  1-on-1 Coaching
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("tracking")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  Progress Tracking
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("transformations")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  Transformation Framework
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("reviews")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  Member Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("membership")}
                  className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
                >
                  Membership Tiers
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Location Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-widest ${isClaudeTheme ? "text-[#191919]" : "text-white"}`}>
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className={`flex items-start gap-2 ${isClaudeTheme ? "text-[#78716C]" : "text-[#999]"}`}>
                <MapPin className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isClaudeTheme ? "text-[#D95D0F]" : "text-[#FF6A00]"}`} />
                <span>{GYM_CONFIG.address}</span>
              </div>
              <div className={`flex items-center gap-2 ${isClaudeTheme ? "text-[#78716C]" : "text-[#999]"}`}>
                <Phone className={`w-3.5 h-3.5 shrink-0 ${isClaudeTheme ? "text-[#D95D0F]" : "text-[#FF6A00]"}`} />
                <span>{GYM_CONFIG.phoneFormatted}</span>
              </div>
              <div className="pt-2">
                <a
                  href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I am contacting from the website footer.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat with Aditya on WhatsApp</span>
                </a>
              </div>
              <div className="pt-1">
                <a
                  href={GYM_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline ${
                    isClaudeTheme ? "text-[#D95D0F]" : "text-[#FF6A00]"
                  }`}
                >
                  <span>Open Google Maps Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          isClaudeTheme ? "border-[#E5DFD5] text-[#A8A29E]" : "border-[#1A1A1A] text-[#666666]"
        }`}>
          <p>© {currentYear} {GYM_CONFIG.name}. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveLegalModal("privacy")}
              className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveLegalModal("terms")}
              className={`transition-colors cursor-pointer ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
            >
              Terms & Conditions
            </button>
            <button
              type="button"
              onClick={() => navigateTo("admin")}
              className={`transition-colors cursor-pointer flex items-center gap-1 ${isClaudeTheme ? "hover:text-[#D95D0F]" : "hover:text-[#FF6A00]"}`}
              title="Administrator Login & Gym Management Portal"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legal Dialogs */}
      {activeLegalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className={`relative w-full max-w-lg rounded-2xl p-6 shadow-2xl border ${
            isClaudeTheme ? "bg-[#FFFFFF] border-[#E5DFD5] text-[#191919]" : "bg-[#141414] border-[#333] text-white"
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
              isClaudeTheme ? "border-[#E5DFD5]" : "border-[#242424]"
            }`}>
              <h3 className={`font-athletic text-xl font-bold uppercase flex items-center gap-2 ${
                isClaudeTheme ? "text-[#191919]" : "text-white"
              }`}>
                <Shield className={`w-4 h-4 ${isClaudeTheme ? "text-[#D95D0F]" : "text-[#FF6A00]"}`} />
                {activeLegalModal === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
              </h3>
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className={`p-1.5 rounded cursor-pointer ${
                  isClaudeTheme ? "text-[#78716C] hover:text-[#191919] hover:bg-[#F2ECE2]" : "text-[#888] hover:text-white bg-[#202020]"
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`space-y-3 text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-2 ${
              isClaudeTheme ? "text-[#57534E]" : "text-[#AAA]"
            }`}>
              {activeLegalModal === "privacy" ? (
                <>
                  <p>
                    <strong>Data Handling:</strong> Mahadev Gym Fitness values your privacy. We do not sell, rent, or trade your personal contact details.
                  </p>
                  <p>
                    <strong>Calculator & Form Privacy:</strong> The Calorie Calculator executes exclusively in your web browser. Measurements and dietary parameters entered are never transferred to external tracking databases.
                  </p>
                  <p>
                    <strong>Enquiry Communications:</strong> Contact enquiries generated on this public website are sent directly to Coach Aditya Experts via WhatsApp for personalized communication.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Physical Activity Notice:</strong> Strength and cardiovascular training carry inherent physical demands. Visitors and trainees should consult their physician before initiating new rigorous exercise routines.
                  </p>
                  <p>
                    <strong>Informational Content:</strong> All workout splits, sample schedules, and calorie estimations provided on this website are for educational and guidance purposes only.
                  </p>
                  <p>
                    <strong>Facility Code:</strong> Members at Mahadev Gym Fitness are expected to practice safe gym etiquette, re-rack weights, use safety collars, and respect fellow lifters.
                  </p>
                </>
              )}
            </div>

            <div className={`pt-4 border-t mt-4 flex justify-end ${isClaudeTheme ? "border-[#E5DFD5]" : "border-[#242424]"}`}>
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded cursor-pointer ${
                  isClaudeTheme
                    ? "text-white bg-[#191919] hover:bg-black"
                    : "text-black bg-[#FF6A00] hover:bg-[#E55E00]"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
