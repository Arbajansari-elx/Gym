import React, { useState } from "react";
import { MessageSquare, Star, MessageCircle, Send, Check } from "lucide-react";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";

export const ReviewsSection: React.FC = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackText.trim()) return;

    // Send via WhatsApp directly so feedback goes to coach
    const message = `*Member Feedback for Mahadev Gym Fitness*\nName: ${feedbackName}\nExperience: ${feedbackText}`;
    window.open(getWhatsAppUrl(message), "_blank");
    setSubmitted(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setSubmitted(false);
      setFeedbackName("");
      setFeedbackText("");
    }, 2500);
  };

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-[#0B0B0B] relative border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-[#FF6A00] text-xs font-semibold tracking-widest uppercase">
            <MessageSquare className="w-4 h-4" />
            <span>MEMBER FEEDBACK & VOICES</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-4">
            COMMUNITY <span className="text-[#FF6A00]">TESTIMONIALS</span>
          </h2>
          <p className="text-[#B3B3B3] text-base sm:text-lg">
            We value genuine lifter experiences. Every review on this platform is verified and shared directly by active gym members.
          </p>
        </div>

        {/* Compliant Placeholder State as requested */}
        <div className="max-w-2xl mx-auto rounded-2xl bg-[#141414] border border-[#262626] p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          {/* Subtle Orange Glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-[#FF6A00]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#FF6A00] mx-auto mb-6 shadow-inner">
            <Star className="w-7 h-7 fill-[#FF6A00]/20" />
          </div>

          <h3 className="font-athletic text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide mb-3">
            REAL MEMBER STORIES COMING SOON
          </h3>

          <p className="text-sm text-[#999999] max-w-md mx-auto leading-relaxed mb-8">
            We do not fabricate testimonials or create fake ratings. Our current members are invited to share their honest feedback directly with Coach Aditya.
          </p>

          <button
            type="button"
            onClick={() => setShowFeedbackModal(true)}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-black bg-[#FF6A00] hover:bg-[#E55E00] rounded-md transition-all shadow-[0_4px_18px_rgba(255,106,0,0.35)] active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>SHARE YOUR EXPERIENCE</span>
          </button>
        </div>
      </div>

      {/* Share Experience Modal */}
      {showFeedbackModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-[#161616] border border-[#333] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="font-athletic text-2xl font-bold text-white uppercase mb-2">
              SHARE YOUR GYM EXPERIENCE
            </h3>
            <p className="text-xs text-[#888] mb-6">
              Your feedback is shared directly with Coach Aditya Experts and will be featured on our public member wall after verification.
            </p>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-athletic text-lg font-bold text-white uppercase">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-[#888]">Opening WhatsApp to deliver your review to the coach...</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#333] rounded-lg text-white text-sm focus:border-[#FF6A00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-1">
                    Your Training Feedback
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us about your workout consistency, coach guidance, and training environment..."
                    className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#333] rounded-lg text-white text-sm focus:border-[#FF6A00] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#888] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-[#FF6A00] hover:bg-[#E55E00] rounded-md flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND VIA WHATSAPP</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
