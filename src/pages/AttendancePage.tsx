import React, { useState, useEffect } from "react";
import {
  Flame,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  MessageCircle,
  Home,
  RefreshCw,
  Sun,
  Moon,
  Info,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";
import {
  getDayOfWeekIST,
  getFullDateStringIST,
  getLiveTimeStringIST,
  getCurrentSessionIST,
} from "../utils/dateUtils";
import { markMemberAttendance, AttendanceSubmissionResult } from "../services/attendanceService";

export const AttendancePage: React.FC = () => {
  const { navigateTo } = useNavigation();

  // Live Clock & Date in Asia/Kolkata (IST)
  const [liveTime, setLiveTime] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  const [fullDate, setFullDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      setLiveTime(getLiveTimeStringIST());
      setCurrentDay(getDayOfWeekIST());
      setFullDate(getFullDateStringIST());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Form State
  const [memberName, setMemberName] = useState<string>("");
  const [session, setSession] = useState<"Morning" | "Evening">(getCurrentSessionIST);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<AttendanceSubmissionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    setSubmitting(true);
    setResult(null);

    try {
      const res = await markMemberAttendance({
        memberName: memberName.trim(),
        session,
      });
      setResult(res);
    } catch (err: any) {
      setResult({
        success: false,
        reason: "serverError",
        message: err?.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setMemberName("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white flex flex-col justify-between selection:bg-[#FF6A00] selection:text-black">
      {/* Top Gate Header */}
      <header className="bg-[#141414] border-b border-white/10 px-4 py-3 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF6A00] flex items-center justify-center text-black font-bold shadow-md">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="font-athletic text-sm sm:text-base font-bold text-white uppercase tracking-wider block">
                MAHADEV <span className="text-[#FF6A00]">GYM FITNESS</span>
              </span>
              <span className="text-[10px] text-stone-400 block -mt-0.5">
                Official Gate Attendance System
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo("home")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Website</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-md space-y-5">
          {/* Live IST Telemetry Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#181818] via-[#141414] to-[#161616] border border-white/10 shadow-xl text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF6A00]/15 border border-[#FF6A00]/30 text-[10px] font-bold text-[#FF6A00] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
              <span>LIVE IST CLOCK · ASIA/KOLKATA</span>
            </div>

            <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white py-1">
              {liveTime || "00:00:00 AM"}
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-stone-300 font-medium">
              <span className="flex items-center gap-1 text-[#FF6A00]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{currentDay || "Today"}</span>
              </span>
              <span className="text-stone-600">·</span>
              <span className="text-stone-300">{fullDate || "Loading date..."}</span>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Top Accent glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#FF6A00]/10 rounded-full blur-xl pointer-events-none" />

            <div className="text-center mb-6">
              <h1 className="font-athletic text-2xl font-bold uppercase tracking-wide text-white">
                MEMBER ATTENDANCE
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                Enter your registered name to mark daily session check-in
              </p>
            </div>

            {/* Submission Result Feedback */}
            {result && (
              <div
                className={`mb-5 p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                  result.success
                    ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                    : result.alreadyMarked
                    ? "bg-amber-950/60 border-amber-500/40 text-amber-200"
                    : "bg-rose-950/60 border-rose-500/40 text-rose-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        result.alreadyMarked ? "text-amber-400" : "text-rose-400"
                      }`}
                    />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-white">{result.message}</p>
                    {result.recordedTime && (
                      <p className="text-[11px] text-stone-300">
                        Recorded Session:{" "}
                        <strong className="text-[#FF6A00]">{result.session}</strong> at{" "}
                        <strong className="text-white">{result.recordedTime}</strong>
                      </p>
                    )}
                    {result.memberName && (
                      <p className="text-[11px] text-stone-400">
                        Member: <strong className="text-white">{result.memberName}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick actions depending on status */}
                {result.reason === "expired" && (
                  <div className="mt-3 pt-2.5 border-t border-rose-500/20">
                    <a
                      href={getWhatsAppUrl(
                        `Hello Coach Aditya, my membership at Mahadev Gym appears expired. I would like to renew my membership.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Contact Coach Aditya to Renew</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Attendance Input Form */}
            {result?.success ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <p className="text-xs text-stone-300 max-w-xs mx-auto">
                  Have a powerful workout! Stay disciplined and push your limits.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResetForAnother}
                    className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-black bg-[#FF6A00] hover:bg-[#E55E00] rounded-xl shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    Mark Another Member
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo("home")}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Return to Gym Homepage
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Session Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                    Select Gym Session *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSession("Morning")}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        session === "Morning"
                          ? "bg-[#FF6A00] border-[#FF6A00] text-black shadow-lg"
                          : "bg-white/[0.03] border-white/10 text-stone-300 hover:bg-white/[0.07]"
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Morning Session</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSession("Evening")}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        session === "Evening"
                          ? "bg-[#FF6A00] border-[#FF6A00] text-black shadow-lg"
                          : "bg-white/[0.03] border-white/10 text-stone-300 hover:bg-white/[0.07]"
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Evening Session</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-500 block mt-1.5 text-center">
                    Morning (05:30 AM - 10:30 AM) · Evening (05:00 PM - 10:30 PM)
                  </span>
                </div>

                {/* Member Name Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                    Your Registered Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white text-sm focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00] transition-colors placeholder:text-stone-600 font-medium"
                  />
                  <span className="text-[10px] text-stone-500 block mt-1">
                    Enter the exact name registered on your gym membership.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !memberName.trim()}
                  className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-black bg-[#FF6A00] hover:bg-[#E55E00] rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Recording Attendance...</span>
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>MARK ATTENDANCE FOR {session.toUpperCase()}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security & System Info Notice */}
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-stone-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>Permanent Entrance QR System</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-normal">
                Members may mark attendance once per Morning session and once per Evening session per calendar day. Duplicate submissions for the same session are automatically prevented.
              </p>
            </div>
          </div>

          {/* Quick Help Link */}
          <div className="text-center text-xs text-stone-400">
            <span>Need help or new membership? </span>
            <a
              href={getWhatsAppUrl("Hello Coach Aditya, I am at the gym gate and need assistance with attendance.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6A00] hover:underline font-semibold"
            >
              Chat with Coach Aditya
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-stone-400 border-t border-white/5">
        <p>
          {GYM_CONFIG.name} · {GYM_CONFIG.address} · Powered by Coach Aditya Management
        </p>
      </footer>
    </div>
  );
};
