import React, { useState, useEffect } from "react";
import { MessageCircle, Menu, X, ArrowLeft } from "lucide-react";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";
import { useNavigation } from "../context/NavigationContext";
import { NAV_ITEMS, PageId } from "../types/navigation";
import { BrandLogo } from "./BrandLogo";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPage, navigateTo, goBack } = useNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (pageId: PageId) => {
    setMobileMenuOpen(false);
    navigateTo(pageId);
  };

  const isClaudeTheme = currentPage !== "home";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isClaudeTheme
          ? isScrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-2xl border-b border-[#E5DFD5] py-2.5 sm:py-3 shadow-[0_4px_24px_rgba(40,30,20,0.06)] text-[#191919]"
            : "bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E2D8] py-3 sm:py-3.5 text-[#191919]"
          : isScrolled
          ? "bg-[#0B0B0B]/90 backdrop-blur-2xl border-b border-white/[0.08] py-2.5 sm:py-3 shadow-[0_8px_30px_rgba(0,0,0,0.7)] text-white"
          : "bg-gradient-to-b from-[#0B0B0B]/95 via-[#0B0B0B]/70 to-transparent py-3 sm:py-3.5 backdrop-blur-[4px] text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Wordmark with Authentic Trishul Icon or Sticky Back button on subpages */}
          {isClaudeTheme ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F2ECE2] text-[#191919] border border-[#E5DFD5] shadow-xs active:scale-95 transition-all cursor-pointer font-bold text-xs sm:text-sm group"
                aria-label="Back to home"
                title="Back to home"
              >
                <ArrowLeft className="w-4 h-4 text-[#D95D0F] group-hover:-translate-x-1 transition-transform" />
                <span className="font-sans tracking-wide uppercase text-[11px] sm:text-xs">BACK</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("home")}
                className="hidden md:flex items-center text-left cursor-pointer group active:scale-95 transition-transform"
                aria-label="Mahadev Gym Fitness Home"
              >
                <BrandLogo size="sm" theme="light" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleNavClick("home")}
              className="flex items-center text-left cursor-pointer group active:scale-95 transition-transform"
              aria-label="Mahadev Gym Fitness Home"
            >
              <BrandLogo size="md" theme="dark" />
            </button>
          )}

          {/* Desktop Navigation Links (Zone 2) - Readable 14px Typography */}
          <nav
            className={`hidden xl:flex items-center gap-1 p-1 rounded-lg border text-[14px] font-medium tracking-normal ${
              isClaudeTheme
                ? "bg-[#EFE9DF]/80 border-[#DFD6C9]"
                : "bg-white/[0.03] backdrop-blur-md border-white/[0.06]"
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isClaudeTheme
                      ? isActive
                        ? "bg-[#191919] text-white font-semibold shadow-xs"
                        : "text-[#57534E] hover:text-[#191919] hover:bg-[#E5DDD0]/70"
                      : isActive
                      ? "bg-white/[0.1] text-[#FF6A00] font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                      : "text-[#A3A3A3] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs (Zone 3) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <a
              href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I am contacting you from the Mahadev Gym Fitness website.`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 h-[40px] px-3.5 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap active:scale-95 border ${
                isClaudeTheme
                  ? "bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#191919] border-[#E5DFD5] shadow-xs"
                  : "bg-white/[0.05] hover:bg-white/[0.09] text-white border-white/10"
              }`}
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {/* JOIN NOW Button */}
            <button
              type="button"
              onClick={() => handleNavClick("contact")}
              className={`h-[40px] px-4 text-[13px] font-semibold uppercase tracking-wider rounded-md active:scale-95 cursor-pointer whitespace-nowrap transition-all ${
                isClaudeTheme
                  ? "bg-[#D95D0F] hover:bg-[#C2410C] text-white border border-[#D95D0F] shadow-sm"
                  : "btn-join-shining text-white"
              }`}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                JOIN NOW
              </span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={() => handleNavClick("contact")}
              className={`sm:hidden h-[36px] px-3 text-xs font-semibold uppercase tracking-wider rounded-md cursor-pointer ${
                isClaudeTheme
                  ? "bg-[#D95D0F] text-white"
                  : "btn-join-shining text-white"
              }`}
            >
              <span className="relative z-10">JOIN</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`h-[36px] w-[36px] flex items-center justify-center rounded-md border focus:outline-none focus-visible:ring-2 cursor-pointer ${
                isClaudeTheme
                  ? "text-[#191919] hover:text-[#D95D0F] bg-[#FFFFFF] border-[#E5DFD5] focus-visible:ring-[#D95D0F]"
                  : "text-[#E5E5E5] hover:text-[#FF6A00] bg-white/[0.04] border-white/10 focus-visible:ring-[#FF6A00]"
              }`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`xl:hidden border-b px-6 py-6 transition-all animate-in fade-in slide-in-from-top-4 duration-300 max-h-[82vh] overflow-y-auto shadow-2xl ${
            isClaudeTheme
              ? "bg-[#FAF7F2] border-[#E5DFD5] text-[#191919]"
              : "ios-glass border-white/10 text-white"
          }`}
        >
          {/* Dedicated Back Button inside mobile drawer when on subpage */}
          {isClaudeTheme && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                goBack();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 mb-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FFFFFF] border border-[#E5DFD5] text-[#191919] hover:bg-[#F2ECE2] shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#D95D0F]" />
              <span>← BACK TO HOME ARENA</span>
            </button>
          )}

          <div className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${isClaudeTheme ? "text-[#D95D0F]" : "text-[#FF6A00]"}`}>
            PAGES & FEATURES
          </div>
          <nav className="grid grid-cols-2 gap-2 mb-6">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left text-xs font-semibold py-2.5 px-3 rounded-xl border transition-all cursor-pointer ${
                    isClaudeTheme
                      ? isActive
                        ? "bg-[#191919] border-[#191919] text-white shadow-xs"
                        : "bg-[#FFFFFF] border-[#E8E2D8] text-[#292524] hover:bg-[#F2ECE2]"
                      : isActive
                      ? "bg-white/[0.12] border-[#FF6A00] text-[#FF6A00] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                      : "bg-white/[0.04] border-white/[0.06] text-[#CCC] hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className={`flex flex-col gap-2.5 pt-3 border-t ${isClaudeTheme ? "border-[#E5DFD5]" : "border-white/10"}`}>
            <a
              href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I want to enquire about Mahadev Gym Fitness.`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-3 text-xs font-semibold rounded-xl border ${
                isClaudeTheme
                  ? "bg-[#FFFFFF] border-[#E5DFD5] text-[#191919]"
                  : "bg-white/[0.05] border-white/10 text-white"
              }`}
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Chat with Aditya on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => handleNavClick("contact")}
              className={`flex items-center justify-center w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer ${
                isClaudeTheme
                  ? "bg-[#D95D0F] hover:bg-[#C2410C] text-white shadow-sm"
                  : "btn-join-shining text-white"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-pulse ${isClaudeTheme ? "bg-white" : "bg-[#FF6A00]"}`} />
                JOIN MAHADEV GYM
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
