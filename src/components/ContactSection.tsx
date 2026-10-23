import React, { useState } from "react";
import { MessageCircle, Send, Phone, MapPin, CheckCircle2, User, AlertCircle, Sparkles } from "lucide-react";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";
import { createPublicEnquiry } from "../services/gymDatabase";

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    fitnessGoal: "Muscle Building",
    preferredTiming: "Morning (5:30 AM - 10:00 AM)",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMsg("Please provide a valid contact number.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      // Derive preferred session from slot
      const isMorning = formData.preferredTiming.toLowerCase().includes("morning");
      await createPublicEnquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        session: isMorning ? "Morning" : "Evening",
        timeSlot: formData.preferredTiming,
        message: `Goal: ${formData.fitnessGoal}. ${formData.message}`.trim(),
        status: "Pending",
        createdAt: new Date().toISOString(),
      });

      setSubmitted(true);
      const waText = `*New Website Enquiry - Mahadev Gym Fitness*\nName: ${formData.name}\nPhone: ${formData.phone}\nGoal: ${formData.fitnessGoal}\nPreferred Slot: ${formData.preferredTiming}\nNote: ${formData.message || "Looking to join"}`;
      window.open(getWhatsAppUrl(waText), "_blank");
    } catch (err: any) {
      console.error("Enquiry save error:", err);
      // Still allow whatsapp redirection if firestore has temporary connection issue
      setSubmitted(true);
      const waText = `*New Website Enquiry - Mahadev Gym Fitness*\nName: ${formData.name}\nPhone: ${formData.phone}\nGoal: ${formData.fitnessGoal}\nPreferred Slot: ${formData.preferredTiming}\nNote: ${formData.message || "Looking to join"}`;
      window.open(getWhatsAppUrl(waText), "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-[#FAF7F2] relative text-[#191919]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            <span>START YOUR TRANSFORMATION</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-[#191919] uppercase mb-4">
            CONNECT WITH <span className="text-[#D95D0F]">MAHADEV GYM FITNESS</span>
          </h2>
          <p className="text-[#57534E] text-base sm:text-lg leading-relaxed">
            Have questions about workouts, memberships, or personal coaching? Reach out directly to Coach {GYM_CONFIG.trainerName}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Contact Details & WhatsApp Spotlight */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-[0_4px_24px_rgba(40,32,24,0.04)]">
              <h3 className="font-athletic text-2xl font-bold text-[#191919] uppercase mb-6">
                DIRECT CONTACT CHANNELS
              </h3>

              <div className="space-y-5">
                {/* Trainer & Gym Details */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] flex items-center justify-center text-[#D95D0F] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#78716C] uppercase font-semibold">Head Coach</div>
                    <div className="text-sm font-bold text-[#191919]">{GYM_CONFIG.trainerName}</div>
                    <div className="text-xs text-[#6B635B]">{GYM_CONFIG.name}</div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] flex items-center justify-center text-[#D95D0F] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#78716C] uppercase font-semibold">Contact Number</div>
                    <div className="text-sm font-bold text-[#191919]">{GYM_CONFIG.phoneFormatted}</div>
                    <div className="text-xs text-[#78716C]">Direct calls & WhatsApp support</div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] flex items-center justify-center text-[#D95D0F] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#78716C] uppercase font-semibold">Gym Location</div>
                    <div className="text-sm text-[#191919] font-medium">{GYM_CONFIG.address}</div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="mt-8 pt-6 border-t border-[#ECE5DA]">
                <a
                  href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I am contacting you from the Mahadev Gym Fitness website.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 text-sm font-bold uppercase tracking-wider text-white bg-[#15803D] hover:bg-[#166534] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>CHAT WITH ADITYA ON WHATSAPP</span>
                </a>
                <p className="text-center text-[11px] text-[#78716C] mt-2">
                  Fastest response: Typically replies within a few hours.
                </p>
              </div>
            </div>

            {/* Quick Note Card */}
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] flex items-start gap-3 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-[#D95D0F] shrink-0 mt-0.5" />
              <p className="text-xs text-[#57534E] leading-relaxed">
                Walk-ins are welcome during open floor hours. For personalized 1-on-1 coaching consultations, please schedule via WhatsApp in advance.
              </p>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(40,32,24,0.04)]">
            <h3 className="font-athletic text-2xl font-bold text-[#191919] uppercase mb-2">
              SEND MEMBERSHIP OR TRAINING ENQUIRY
            </h3>
            <p className="text-xs text-[#6B635B] mb-6 leading-relaxed">
              Fill in your details below. Your submission will open in WhatsApp so Coach Aditya can review your goals immediately.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F5ECE1] border border-[#EED7C4] text-[#D95D0F] mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-athletic text-2xl font-bold text-[#191919] uppercase">
                  ENQUIRY GENERATED
                </h4>
                <p className="text-sm text-[#57534E] max-w-md mx-auto leading-relaxed">
                  Your enquiry has been dispatched to WhatsApp for direct review by Coach Aditya Experts.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D95D0F] hover:bg-[#C2410C] rounded-xl mt-4 cursor-pointer shadow-sm transition-all"
                >
                  SEND ANOTHER ENQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#DC2626]">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Vikram Singh"
                      className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl text-[#191919] text-sm focus:border-[#D95D0F] focus:outline-none focus:ring-2 focus:ring-[#D95D0F]/15 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl text-[#191919] text-sm focus:border-[#D95D0F] focus:outline-none focus:ring-2 focus:ring-[#D95D0F]/15 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-1.5">
                      Primary Fitness Goal
                    </label>
                    <select
                      name="fitnessGoal"
                      value={formData.fitnessGoal}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl text-[#191919] text-sm focus:border-[#D95D0F] focus:outline-none focus:ring-2 focus:ring-[#D95D0F]/15 transition-all shadow-2xs cursor-pointer"
                    >
                      <option value="Muscle Building">Muscle Building & Hypertrophy</option>
                      <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                      <option value="Strength Powerlifting">Strength & Powerlifting</option>
                      <option value="General Health">General Physical Fitness</option>
                      <option value="Personal Coaching Enquiry">1-on-1 Personal Coaching</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-1.5">
                      Preferred Training Slot
                    </label>
                    <select
                      name="preferredTiming"
                      value={formData.preferredTiming}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl text-[#191919] text-sm focus:border-[#D95D0F] focus:outline-none focus:ring-2 focus:ring-[#D95D0F]/15 transition-all shadow-2xs cursor-pointer"
                    >
                      <option value="Morning (5:30 AM - 10:00 AM)">Morning (5:30 AM – 10:00 AM)</option>
                      <option value="Afternoon (11:00 AM - 4:00 PM)">Afternoon (11:00 AM – 4:00 PM)</option>
                      <option value="Evening (5:00 PM - 10:30 PM)">Evening (5:00 PM – 10:30 PM)</option>
                      <option value="Flexible">Flexible / Shift Timings</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-1.5">
                    Questions or Specific Injuries / Requests
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell Coach Aditya about any previous lifting experience or specific guidance needed..."
                    className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl text-[#191919] text-sm focus:border-[#D95D0F] focus:outline-none focus:ring-2 focus:ring-[#D95D0F]/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#D95D0F] hover:bg-[#C2410C] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>SUBMIT ENQUIRY VIA WHATSAPP</span>
                  </button>
                  <p className="text-[11px] text-[#78716C] text-center mt-2">
                    Ensures direct delivery to the trainer's phone without middleman delays.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
