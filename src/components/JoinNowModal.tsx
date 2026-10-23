import React, { useState } from "react";
import { X, Send, CheckCircle2, Flame, Sparkles, MessageCircle, Clock, Calendar } from "lucide-react";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";
import { createPublicEnquiry } from "../services/gymDatabase";

interface JoinNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinNowModal: React.FC<JoinNowModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    session: "Morning" as "Morning" | "Evening",
    timeSlot: "06:00 AM - 07:30 AM",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const morningSlots = [
    "05:30 AM - 07:00 AM (Early Lifters)",
    "06:00 AM - 07:30 AM (Prime Morning)",
    "07:30 AM - 09:00 AM (Active Strength)",
    "09:00 AM - 10:30 AM (Cardio & Mobility)",
  ];

  const eveningSlots = [
    "05:00 PM - 06:30 PM (Pre-Rush Session)",
    "06:30 PM - 08:00 PM (Prime Power Hour)",
    "08:00 PM - 09:30 PM (Hypertrophy Block)",
    "09:30 PM - 10:30 PM (Late Night Discipline)",
  ];

  const handleSessionChange = (newSession: "Morning" | "Evening") => {
    setFormData({
      ...formData,
      session: newSession,
      timeSlot: newSession === "Morning" ? morningSlots[0] : eveningSlots[0],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("Please provide your full name.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const docId = await createPublicEnquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        session: formData.session,
        timeSlot: formData.timeSlot,
        message: formData.message.trim(),
        status: "Pending",
        createdAt: new Date().toISOString(),
      });

      setEnquiryId(docId);
      setSubmitted(true);
    } catch (err) {
      console.error("Enquiry submission error:", err);
      setErrorMsg("Failed to save enquiry. Please try again or connect via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = () => {
    const text = `*New Join Now Enquiry - Mahadev Gym Fitness*\nID: ${enquiryId || "New"}\nName: ${formData.name}\nPhone: ${formData.phone}\nSession: ${formData.session}\nTime Slot: ${formData.timeSlot}\nMessage: ${formData.message || "Ready to join"}`;
    window.open(getWhatsAppUrl(text), "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#121212] border border-[#2A2A2A] text-white shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-[#181818] to-[#121212] border-b border-[#242424] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/15 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00]">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#FF6A00] tracking-widest uppercase block">
                MAHADEV GYM FITNESS
              </span>
              <h3 className="font-athletic text-xl font-bold uppercase tracking-wide text-white">
                JOIN NOW ENQUIRY
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white bg-white/[0.05] hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[78vh] overflow-y-auto">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FF6A00]/15 border border-[#FF6A00]/40 text-[#FF6A00] mx-auto flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-athletic text-2xl font-bold text-white uppercase">
                ENQUIRY SUBMITTED SUCCESSFULLY!
              </h4>
              <p className="text-sm text-[#A3A3A3] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{formData.name}</strong>. Your enquiry has been securely logged in our gym management system.
              </p>
              {enquiryId && (
                <div className="inline-block px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-[#FF6A00]">
                  Enquiry ID: {enquiryId.slice(0, 8).toUpperCase()}
                </div>
              )}
              <div className="pt-4 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#15803D] hover:bg-[#166534] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>CONFIRM ON WHATSAPP WITH COACH ADITYA</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00] transition-colors"
                />
              </div>

              {/* Session Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Preferred Gym Session *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSessionChange("Morning")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.session === "Morning"
                        ? "bg-[#FF6A00] border-[#FF6A00] text-black shadow-md"
                        : "bg-white/[0.03] border-white/10 text-stone-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Morning Session</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSessionChange("Evening")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.session === "Evening"
                        ? "bg-[#FF6A00] border-[#FF6A00] text-black shadow-md"
                        : "bg-white/[0.03] border-white/10 text-stone-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Evening Session</span>
                  </button>
                </div>
              </div>

              {/* Time Slot Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Preferred Joining Time Slot *
                </label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00] transition-colors cursor-pointer"
                >
                  {(formData.session === "Morning" ? morningSlots : eveningSlots).map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Optional Note / Fitness Goal
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Weight loss, strength training, or personal coaching query..."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00] transition-colors"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-black bg-[#FF6A00] hover:bg-[#E55E00] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>SUBMIT JOIN NOW ENQUIRY</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-stone-400 text-center mt-2.5">
                  Your enquiry is securely saved to Mahadev Gym's database. Coach Aditya will review it shortly.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
