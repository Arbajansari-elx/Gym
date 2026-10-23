import React, { useState, useEffect, useMemo } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  Lock,
  Unlock,
  ShieldCheck,
  LogOut,
  ExternalLink,
  RefreshCw,
  Printer,
  X,
  UserCheck,
  Dumbbell,
  FileText,
  Flame,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
  QrCode,
  Download,
  Copy,
  Sun,
  Moon,
  FileSpreadsheet,
} from "lucide-react";
import QRCode from "qrcode";
import { auth } from "../lib/firebase";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";
import { useNavigation } from "../context/NavigationContext";
import { NAV_ITEMS, PageId } from "../types/navigation";
import {
  GymMember,
  GymEnquiry,
  GymAttendance,
  GymPayment,
  GymEquipment,
  subscribeToMembers,
  subscribeToEnquiries,
  subscribeToAttendance,
  subscribeToPayments,
  subscribeToEquipment,
  addMember,
  updateMember,
  deleteMember,
  updateEnquiryStatus,
  recordCheckIn,
  recordPayment,
  addEquipment,
  updateEquipment,
  seedInitialGymDataIfEmpty,
  INITIAL_MEMBERS,
  INITIAL_EQUIPMENT,
  INITIAL_PAYMENTS,
  INITIAL_ENQUIRIES,
  INITIAL_ATTENDANCE,
} from "../services/gymDatabase";
import {
  formatDateTimeIST,
  formatDateIST,
  getTodayDateStringIST,
  formatCurrencyINR,
} from "../utils/dateUtils";
import {
  getPermanentAttendanceUrl,
  syncActiveMembersIndex,
  correctAttendanceRecord,
  deleteAttendanceRecord,
  exportAttendanceToCSV,
} from "../services/attendanceService";

type AdminTab =
  | "overview"
  | "enquiries"
  | "members"
  | "attendance"
  | "payments"
  | "equipment"
  | "pages";

export const AdminPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("admin@mahadevgym.com");
  const [loginPassword, setLoginPassword] = useState("MahadevGym@2025");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Admin Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Live Firestore Datasets
  const [members, setMembers] = useState<GymMember[]>([]);
  const [enquiries, setEnquiries] = useState<GymEnquiry[]>([]);
  const [attendance, setAttendance] = useState<GymAttendance[]>([]);
  const [payments, setPayments] = useState<GymPayment[]>([]);
  const [equipment, setEquipment] = useState<GymEquipment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modals & Forms State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<GymMember | null>(null);
  const [selectedMemberForCard, setSelectedMemberForCard] = useState<GymMember | null>(null);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<GymPayment | null>(null);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [seedingMessage, setSeedingMessage] = useState<string | null>(null);

  // Filters & Search
  const [memberSearch, setMemberSearch] = useState("");
  const [memberSessionFilter, setMemberSessionFilter] = useState<string>("all");
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>("all");

  const [enquirySearch, setEnquirySearch] = useState("");
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>("all");
  const [enquirySessionFilter, setEnquirySessionFilter] = useState<string>("all");

  // Attendance Quick Check-in & Desk State
  const [checkInSearch, setCheckInSearch] = useState("");
  const [checkInSession, setCheckInSession] = useState<"Morning" | "Evening">("Morning");
  const [showQrPosterModal, setShowQrPosterModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [urlCopied, setUrlCopied] = useState(false);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string>(getTodayDateStringIST());
  const [attendanceSessionFilter, setAttendanceSessionFilter] = useState<string>("all");
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [selectedAttendanceForCorrection, setSelectedAttendanceForCorrection] = useState<GymAttendance | null>(null);
  const [correctionSession, setCorrectionSession] = useState<"Morning" | "Evening">("Morning");
  const [correctionStatus, setCorrectionStatus] = useState<"Present" | "Absent" | "Excused">("Present");
  const [correctionNotes, setCorrectionNotes] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");
  const [savingCorrection, setSavingCorrection] = useState(false);
  const [showPrintRegisterModal, setShowPrintRegisterModal] = useState(false);

  // Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [googleLoading, setGoogleLoading] = useState(false);

  const isAuthenticated = Boolean(currentUser || isDemoAdmin);

  // Subscribe to real-time collections ONLY when authenticated with Firebase
  useEffect(() => {
    if (!currentUser) {
      if (isDemoAdmin) {
        // Safely load in-memory demo data without sending unauthenticated Firestore queries
        setMembers(INITIAL_MEMBERS.map((m, idx) => ({ ...m, id: `demo-mem-${idx + 1}` })));
        setEnquiries(INITIAL_ENQUIRIES.map((e, idx) => ({ ...e, id: `demo-enq-${idx + 1}` })));
        setAttendance(INITIAL_ATTENDANCE.map((a, idx) => ({ ...a, id: `demo-att-${idx + 1}` })));
        setPayments(INITIAL_PAYMENTS.map((p, idx) => ({ ...p, id: `demo-pay-${idx + 1}` })));
        setEquipment(INITIAL_EQUIPMENT.map((eq, idx) => ({ ...eq, id: `demo-eq-${idx + 1}` })));
        setDataLoading(false);
      }
      return;
    }

    setDataLoading(true);
    const unsubs: (() => void)[] = [];

    unsubs.push(
      subscribeToMembers((list) => {
        setMembers(list);
        setDataLoading(false);
      })
    );

    unsubs.push(
      subscribeToEnquiries((list) => {
        setEnquiries(list);
      })
    );

    unsubs.push(
      subscribeToAttendance((list) => {
        setAttendance(list);
      })
    );

    unsubs.push(
      subscribeToPayments((list) => {
        setPayments(list);
      })
    );

    unsubs.push(
      subscribeToEquipment((list) => {
        setEquipment(list);
      })
    );

    return () => {
      unsubs.forEach((u) => u && u());
    };
  }, [currentUser, isDemoAdmin]);

  // Auto-sync active members index for gate attendance verification
  useEffect(() => {
    if (members.length > 0) {
      syncActiveMembersIndex(members).catch((err) => {
        console.warn("Active member index sync:", err);
      });
    }
  }, [members]);

  // Generate permanent QR code data URL
  useEffect(() => {
    const url = getPermanentAttendanceUrl();
    QRCode.toDataURL(url, {
      width: 450,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then((dataUri) => {
        setQrDataUrl(dataUri);
      })
      .catch((err) => {
        console.error("Failed to generate QR code data URL", err);
      });
  }, []);

  // Handle Google Sign-in for Admin
  const handleGoogleSignIn = async () => {
    setLoginError("");
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setLoginError(err.message || "Failed to sign in with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSubmitting(true);

    try {
      // First attempt authentic Firebase email login
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
    } catch (err: any) {
      // If Firebase email/password is not enabled in Firebase Console or credentials are local demo:
      if (
        loginEmail.trim().toLowerCase() === "admin@mahadevgym.com" &&
        (loginPassword === "MahadevGym@2025" || loginPassword === "mahadev777" || loginPassword.length >= 6)
      ) {
        setIsDemoAdmin(true);
      } else {
        setLoginError(err.message || "Invalid credentials. Please verify your login details.");
      }
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setIsDemoAdmin(false);
    setCurrentUser(null);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setResetSent(true);
    } catch (err: any) {
      alert("Notice: " + (err.message || "Password reset requested. Check your email."));
      setResetSent(true);
    }
  };

  // Seed sample data
  const handleSeedData = async () => {
    setSeedingMessage("Populating Mahadev Gym records...");
    const result = await seedInitialGymDataIfEmpty();
    setSeedingMessage(result.message);
    setTimeout(() => setSeedingMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // COMPUTED LIVE STATISTICS (PHASE 4 RULES)
  // -------------------------------------------------------------
  const todayIST = getTodayDateStringIST();
  const currentMonthPrefix = todayIST.slice(0, 7); // YYYY-MM

  const stats = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === "Active").length;
    const morningMembers = members.filter((m) => m.status === "Active" && m.session === "Morning").length;
    const eveningMembers = members.filter((m) => m.status === "Active" && m.session === "Evening").length;

    // Today's new joins (created today)
    const todayJoins = members.filter((m) => m.createdAt && m.createdAt.startsWith(todayIST)).length;

    // New Join Now Enquiries (Pending)
    const pendingEnquiries = enquiries.filter((e) => e.status === "Pending").length;

    // Today's Attendance breakdown
    const todayRecords = attendance.filter((a) => a.date === todayIST && a.status !== "Absent");
    const todayAttendance = todayRecords.length;
    const morningAttendance = todayRecords.filter((a) => a.session === "Morning").length;
    const eveningAttendance = todayRecords.filter((a) => a.session === "Evening").length;

    // Unique active members attended today
    const attendedMemberIds = new Set(todayRecords.map((a) => a.memberId));
    const activeAttendedCount = members.filter((m) => m.status === "Active" && attendedMemberIds.has(m.memberId)).length;
    const activeAbsentCount = Math.max(0, activeMembers - activeAttendedCount);
    const attendancePercentage = activeMembers > 0 ? Math.round((activeAttendedCount / activeMembers) * 100) : 0;

    // Today's collection
    const todayCollection = payments
      .filter((p) => p.paymentDate && p.paymentDate.startsWith(todayIST))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Current Month's Collection
    const monthCollection = payments
      .filter((p) => p.paymentDate && p.paymentDate.startsWith(currentMonthPrefix))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Pending Fees total across all active members
    const pendingFees = members
      .filter((m) => m.status === "Active")
      .reduce((sum, m) => sum + (m.pendingAmount || 0), 0);

    // Upcoming membership expirations (within 7 days)
    const now = new Date().getTime();
    const sevenDaysFromNow = now + 7 * 86400000;
    const expiringSoon = members.filter((m) => {
      if (m.status !== "Active" || !m.endDate) return false;
      const endMs = new Date(m.endDate).getTime();
      return endMs >= now && endMs <= sevenDaysFromNow;
    }).length;

    return {
      totalMembers,
      activeMembers,
      morningMembers,
      eveningMembers,
      todayJoins,
      pendingEnquiries,
      todayAttendance,
      morningAttendance,
      eveningAttendance,
      activeAttendedCount,
      activeAbsentCount,
      attendancePercentage,
      todayCollection,
      monthCollection,
      pendingFees,
      expiringSoon,
    };
  }, [members, enquiries, attendance, payments, todayIST, currentMonthPrefix]);

  // Filtered Members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        !memberSearch ||
        m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.phone.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.memberId.toLowerCase().includes(memberSearch.toLowerCase());

      const matchSession =
        memberSessionFilter === "all" || m.session === memberSessionFilter;

      const matchStatus =
        memberStatusFilter === "all" ||
        (memberStatusFilter === "pendingFee" ? m.pendingAmount > 0 : m.status === memberStatusFilter);

      return matchSearch && matchSession && matchStatus;
    });
  }, [members, memberSearch, memberSessionFilter, memberStatusFilter]);

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchSearch =
        !enquirySearch ||
        e.name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
        e.phone.toLowerCase().includes(enquirySearch.toLowerCase());

      const matchStatus =
        enquiryStatusFilter === "all" || e.status === enquiryStatusFilter;

      const matchSession =
        enquirySessionFilter === "all" || e.session === enquirySessionFilter;

      return matchSearch && matchStatus && matchSession;
    });
  }, [enquiries, enquirySearch, enquiryStatusFilter, enquirySessionFilter]);

  // Handle Quick Check-in
  const handleQuickCheckIn = async (member: GymMember) => {
    try {
      if (currentUser) {
        await recordCheckIn({
          memberDocId: member.id || member.memberId,
          memberId: member.memberId,
          memberName: member.name,
          session: checkInSession,
          checkInTime: new Date().toISOString(),
          date: todayIST,
          type: "Manual",
        });
      } else {
        const newAtt: GymAttendance = {
          id: "att-" + Date.now(),
          memberDocId: member.id || member.memberId,
          memberId: member.memberId,
          memberName: member.name,
          session: checkInSession,
          checkInTime: new Date().toISOString(),
          date: todayIST,
          type: "Manual",
        };
        setAttendance((prev) => [newAtt, ...prev]);
      }
      setSeedingMessage(`Check-in recorded for ${member.name} (${member.memberId})!`);
      setTimeout(() => setSeedingMessage(null), 3000);
      setCheckInSearch("");
    } catch (err: any) {
      setSeedingMessage("Error checking in: " + err.message);
      setTimeout(() => setSeedingMessage(null), 4000);
    }
  };

  // Filtered Attendance Records
  const filteredAttendance = useMemo(() => {
    return attendance.filter((a) => {
      if (selectedAttendanceDate !== "all" && a.date !== selectedAttendanceDate) return false;
      if (attendanceSessionFilter !== "all" && a.session !== attendanceSessionFilter) return false;
      if (attendanceSearch.trim()) {
        const q = attendanceSearch.toLowerCase();
        const matchName = (a.memberName || "").toLowerCase().includes(q);
        const matchId = (a.memberId || "").toLowerCase().includes(q);
        const matchNotes = (a.notes || a.correctionReason || "").toLowerCase().includes(q);
        if (!matchName && !matchId && !matchNotes) return false;
      }
      return true;
    });
  }, [attendance, selectedAttendanceDate, attendanceSessionFilter, attendanceSearch]);

  const handleCopyAttendanceUrl = () => {
    const url = getPermanentAttendanceUrl();
    navigator.clipboard.writeText(url);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2500);
  };

  const handleDownloadQrCode = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "mahadev_gym_gate_qr.png";
    link.click();
  };

  const handleOpenCorrectionModal = (record: GymAttendance) => {
    setSelectedAttendanceForCorrection(record);
    setCorrectionSession(record.session || "Morning");
    setCorrectionStatus((record.status as any) || "Present");
    setCorrectionNotes(record.notes || "");
    setCorrectionReason(record.correctionReason || "");
  };

  const handleSaveCorrection = async () => {
    if (!selectedAttendanceForCorrection || !selectedAttendanceForCorrection.id) return;
    if (!correctionReason.trim()) {
      alert("Please provide an audit reason for modifying this attendance record.");
      return;
    }
    setSavingCorrection(true);
    try {
      await correctAttendanceRecord(
        selectedAttendanceForCorrection.id,
        {
          session: correctionSession,
          status: correctionStatus,
          notes: correctionNotes.trim(),
        },
        currentUser?.email || "admin@mahadevgym.com",
        correctionReason.trim()
      );
      setAttendance((prev) =>
        prev.map((item) =>
          item.id === selectedAttendanceForCorrection.id
            ? {
                ...item,
                session: correctionSession,
                status: correctionStatus,
                notes: correctionNotes.trim(),
                correctionReason: correctionReason.trim(),
                correctedBy: currentUser?.email || "admin@mahadevgym.com",
                correctedAt: new Date().toISOString(),
              }
            : item
        )
      );
      setSeedingMessage(`Attendance updated for ${selectedAttendanceForCorrection.memberName}`);
      setTimeout(() => setSeedingMessage(null), 3000);
      setSelectedAttendanceForCorrection(null);
    } catch (err: any) {
      alert("Error correcting record: " + err.message);
    } finally {
      setSavingCorrection(false);
    }
  };

  const handleDeleteAttendance = async (record: GymAttendance) => {
    if (!record.id) return;
    if (
      !window.confirm(
        `Are you sure you want to remove the attendance record for ${record.memberName} on ${record.date} (${record.session})?`
      )
    ) {
      return;
    }
    try {
      await deleteAttendanceRecord(record.id);
      setAttendance((prev) => prev.filter((item) => item.id !== record.id));
      setSeedingMessage(`Attendance record removed for ${record.memberName}`);
      setTimeout(() => setSeedingMessage(null), 3000);
    } catch (err: any) {
      alert("Error removing record: " + err.message);
    }
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN VIEW (IF NOT AUTHENTICATED)
  // -------------------------------------------------------------
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[350px] bg-[#FF6A00]/[0.08] rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3 bg-[#FF6A00]/10 border border-[#FF6A00]/25 px-3 py-1.5 rounded-full text-xs font-bold text-[#FF6A00] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>OFFICIAL GYM MANAGEMENT SYSTEM</span>
            </div>
            <h1 className="font-athletic text-3xl sm:text-4xl font-bold uppercase tracking-wide text-white">
              MAHADEV <span className="text-[#FF6A00]">GYM FITNESS</span>
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              Admin & Coach Aditya Management Portal
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF6A00]" />
              <span>ADMINISTRATOR LOGIN</span>
            </h2>
            <p className="text-xs text-stone-400 mb-6">
              Sign in with your authorized admin account to manage members, live attendance, and fees.
            </p>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Google One-Click Admin Sign-in */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-3 px-4 mb-4 text-xs font-bold uppercase tracking-wider text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? "Connecting Google..." : "Sign in with Google (Admin: dhuruvrathe397@gmail.com)"}</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#141414] px-3 text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                Or Use Admin Passcode
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@mahadevgym.com"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white text-sm focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                    Secure Password / Passcode
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-[#FF6A00] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white text-sm focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00] transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    {showPassword ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick credential helper badge */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-stone-400">
                <span className="text-[#FF6A00] font-semibold">Pre-set Admin Credentials:</span>
                <br />
                Email: <code className="text-white">admin@mahadevgym.com</code>
                <br />
                Password: <code className="text-white">MahadevGym@2025</code>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-black bg-[#FF6A00] hover:bg-[#E55E00] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 mt-4"
              >
                {loginSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>ENTER ADMIN DASHBOARD</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsDemoAdmin(true)}
                className="w-full py-2.5 px-4 text-[11px] font-semibold text-stone-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <span>Preview in Offline Demo Mode</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => navigateTo("home")}
                className="text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Return to Public Website
              </button>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-sm rounded-2xl bg-[#181818] border border-white/15 p-6 text-white shadow-2xl">
              <h3 className="font-athletic text-lg font-bold uppercase mb-2">
                RESET ADMIN PASSWORD
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                Enter your authorized admin email. A password reset link will be sent through Firebase Authentication.
              </p>

              {resetSent ? (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs text-emerald-300">
                    Reset instructions dispatched. Please check your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setResetSent(false);
                    }}
                    className="px-4 py-2 text-xs font-bold uppercase bg-[#FF6A00] text-black rounded-lg"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@mahadevgym.com"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none"
                  />
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold uppercase bg-[#FF6A00] text-black rounded-lg"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#E5E5E5] flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-[#141414] border-b border-[#222222] sticky top-0 z-40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF6A00] flex items-center justify-center text-black font-bold shadow-md">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-athletic text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  MAHADEV <span className="text-[#FF6A00]">GYM FITNESS</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/30 hidden sm:inline-block">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Coach Aditya Experts Command Center · Asia/Kolkata (IST)
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Cloud Synced</span>
              </span>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Demo Mode</span>
                </span>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-colors cursor-pointer"
                  title="Sign in with Google to enable real-time cloud sync"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A00]" />
                  <span>Connect Google</span>
                </button>
              </div>
            )}

            {/* Seed demo data button if database is empty */}
            {currentUser && (
              <button
                type="button"
                onClick={handleSeedData}
                title="Populate demo members and data if empty"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>Seed Data</span>
              </button>
            )}

            {/* View Website Button */}
            <button
              type="button"
              onClick={() => navigateTo("home")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span className="hidden sm:inline">View Website</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-300 hover:text-red-200 bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Seeding Toast Message */}
      {seedingMessage && (
        <div className="bg-[#FF6A00] text-black font-bold text-xs py-2 px-4 text-center sticky top-[57px] z-50">
          {seedingMessage}
        </div>
      )}

      {/* Admin Tab Navigation Bar */}
      <div className="bg-[#111111] border-b border-[#222222] px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-2">
          {[
            { id: "overview" as AdminTab, label: "Live Overview", icon: TrendingUp },
            {
              id: "enquiries" as AdminTab,
              label: "Join Now Enquiries",
              icon: MessageCircle,
              badge: stats.pendingEnquiries > 0 ? stats.pendingEnquiries : undefined,
            },
            { id: "members" as AdminTab, label: "Members Directory", icon: Users, badge: stats.activeMembers },
            { id: "attendance" as AdminTab, label: "Attendance Desk", icon: Clock, badge: stats.todayAttendance },
            { id: "payments" as AdminTab, label: "Fees & Payments", icon: DollarSign },
            { id: "equipment" as AdminTab, label: "Gym Equipment", icon: Dumbbell },
            {
              id: "pages" as AdminTab,
              label: "Page Navigator (All Pages)",
              icon: Layers,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF6A00] text-black shadow-md font-bold"
                    : "text-stone-300 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-stone-400"}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-black text-white" : "bg-[#FF6A00]/20 text-[#FF6A00]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================= */}
        {/* TAB 1: LIVE DASHBOARD STATS (11 CARDS AS SPECIFIED)       */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Welcome Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#181818] via-[#141414] to-[#121212] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#FF6A00] uppercase tracking-widest block mb-1">
                  LIVE GYM TELEMETRY · IST TIMEZONE
                </span>
                <h2 className="font-athletic text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
                  WELCOME BACK, COACH ADITYA
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
                  Real-time synchronization with Firebase Firestore database. All member check-ins, fee collections, and prospective member enquiries are active.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E55E00] text-black font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register New Member</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRecordPaymentModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <DollarSign className="w-4 h-4 text-[#FF6A00]" />
                  <span>Record Fee Payment</span>
                </button>
              </div>
            </div>

            {/* 11 Live Stat Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-athletic text-lg font-bold uppercase tracking-wider text-white">
                  KEY BUSINESS METRICS
                </h3>
                <span className="text-xs text-stone-400">
                  Updated: {formatDateTimeIST(new Date())}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {/* 1. Total Registered Members */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      1. Total Members
                    </span>
                    <Users className="w-4 h-4 text-[#FF6A00]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white">
                    {stats.totalMembers}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">All database records</p>
                </div>

                {/* 2. Active Members */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-emerald-500/30 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                      2. Active Members
                    </span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white">
                    {stats.activeMembers}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Valid gym passes</p>
                </div>

                {/* 3. Morning Members */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      3. Morning Members
                    </span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white">
                    {stats.morningMembers}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Morning slot active</p>
                </div>

                {/* 4. Evening Members */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      4. Evening Members
                    </span>
                    <Clock className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white">
                    {stats.eveningMembers}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Evening slot active</p>
                </div>

                {/* 5. Today's New Joins */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      5. Today's New Joins
                    </span>
                    <UserCheck className="w-4 h-4 text-[#FF6A00]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white">
                    {stats.todayJoins}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Registered today</p>
                </div>

                {/* 6. New Join Now Enquiries */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-[#FF6A00]/40 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF6A00]">
                      6. Pending Enquiries
                    </span>
                    <MessageCircle className="w-4 h-4 text-[#FF6A00]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white">
                    {stats.pendingEnquiries}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">From public website</p>
                </div>

                {/* 7. Today's Attendance */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      7. Today's Attendance
                    </span>
                    <Clock className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white">
                    {stats.todayAttendance}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Check-ins today</p>
                </div>

                {/* 8. Today's Collection */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      8. Today's Collection
                    </span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-athletic text-emerald-400">
                    {formatCurrencyINR(stats.todayCollection)}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Confirmed payments</p>
                </div>

                {/* 9. Current Month's Collection */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      9. Month's Collection
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-athletic text-emerald-400">
                    {formatCurrencyINR(stats.monthCollection)}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">{currentMonthPrefix}</p>
                </div>

                {/* 10. Pending Fees */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-rose-500/30 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                      10. Pending Fees
                    </span>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-athletic text-rose-400">
                    {formatCurrencyINR(stats.pendingFees)}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Outstanding dues</p>
                </div>

                {/* 11. Upcoming Membership Expirations */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-amber-500/30 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                      11. Expiring Soon (7d)
                    </span>
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-amber-400">
                    {stats.expiringSoon}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Renewal alert</p>
                </div>
              </div>
            </div>

            {/* Quick Overdue Fee Alerts */}
            {stats.pendingFees > 0 && (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                    PENDING FEE BALANCES DETECTED
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Total outstanding dues across active members:{" "}
                    <strong className="text-white">{formatCurrencyINR(stats.pendingFees)}</strong>. Review the Members Directory to send payment reminders or record collections.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("members");
                    setMemberStatusFilter("pendingFee");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase shrink-0 cursor-pointer"
                >
                  View Defaulters
                </button>
              </div>
            )}

            {/* Split Section: Recent Enquiries & Recent Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Public Join Now Enquiries */}
              <div className="p-6 rounded-3xl bg-[#141414] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-athletic text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#FF6A00]" />
                    <span>RECENT PUBLIC JOIN ENQUIRIES</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("enquiries")}
                    className="text-xs text-[#FF6A00] hover:underline cursor-pointer"
                  >
                    View All ({enquiries.length})
                  </button>
                </div>

                {enquiries.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400">
                    No website enquiries logged yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {enquiries.slice(0, 4).map((enq) => (
                      <div
                        key={enq.id}
                        className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white">{enq.name}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                enq.status === "Pending"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : enq.status === "Contacted"
                                  ? "bg-sky-500/20 text-sky-400"
                                  : enq.status === "Converted"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-stone-500/20 text-stone-400"
                              }`}
                            >
                              {enq.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            {enq.phone} · {enq.session} ({enq.timeSlot})
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`tel:${enq.phone}`}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white"
                            title="Call Member"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={getWhatsAppUrl(`Hello ${enq.name}, I am Coach Aditya from Mahadev Gym Fitness reviewing your Join Now enquiry.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400"
                            title="WhatsApp Chat"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Payment Transactions */}
              <div className="p-6 rounded-3xl bg-[#141414] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-athletic text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>RECENT PAYMENT COLLECTIONS</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("payments")}
                    className="text-xs text-[#FF6A00] hover:underline cursor-pointer"
                  >
                    View All ({payments.length})
                  </button>
                </div>

                {payments.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400">
                    No payment transactions recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.slice(0, 4).map((pay) => (
                      <div
                        key={pay.id}
                        className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white">{pay.memberName}</span>
                            <span className="font-mono text-[10px] text-[#FF6A00]">{pay.invoiceNumber}</span>
                          </div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            {formatDateIST(pay.paymentDate)} · Method: {pay.paymentMethod}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-athletic text-sm font-bold text-emerald-400">
                            +{formatCurrencyINR(pay.amount)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentForReceipt(pay)}
                            className="block text-[10px] text-[#FF6A00] hover:underline ml-auto mt-0.5 cursor-pointer"
                          >
                            Receipt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PUBLIC JOIN NOW ENQUIRY MANAGEMENT (PHASE 6)       */}
        {/* ========================================================= */}
        {activeTab === "enquiries" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-athletic text-2xl font-bold uppercase text-white tracking-wide">
                  PUBLIC JOIN NOW ENQUIRIES ({filteredEnquiries.length})
                </h2>
                <p className="text-xs text-stone-400">
                  Every enquiry submitted via the website Join Now form arrives here instantly in real-time.
                </p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by visitor name or phone..."
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              {/* Status Filter */}
              <select
                value={enquiryStatusFilter}
                onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending (New)</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted to Member</option>
                <option value="Dropped">Dropped</option>
              </select>

              {/* Session Filter */}
              <select
                value={enquirySessionFilter}
                onChange={(e) => setEnquirySessionFilter(e.target.value)}
                className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none cursor-pointer"
              >
                <option value="all">All Sessions</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            {/* Enquiries Table */}
            <div className="rounded-3xl bg-[#141414] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1A1A1A] border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Visitor & Phone</th>
                      <th className="py-3 px-4">Session & Slot</th>
                      <th className="py-3 px-4">Submission Time (IST)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Note / Message</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          No enquiries found matching filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{enq.name}</div>
                            <div className="text-[11px] text-stone-400 font-mono">{enq.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-white">{enq.session}</span>
                            <div className="text-[11px] text-stone-400">{enq.timeSlot}</div>
                          </td>
                          <td className="py-3.5 px-4 text-stone-400">
                            {formatDateTimeIST(enq.createdAt)}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={enq.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value as any;
                                if (currentUser && enq.id) {
                                  await updateEnquiryStatus(enq.id, newStatus);
                                } else {
                                  setEnquiries((prev) =>
                                    prev.map((item) =>
                                      item.id === enq.id ? { ...item, status: newStatus } : item
                                    )
                                  );
                                }
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                                enq.status === "Pending"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  : enq.status === "Contacted"
                                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                                  : enq.status === "Converted"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : "bg-stone-500/20 text-stone-300 border-stone-500/40"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Converted">Converted</option>
                              <option value="Dropped">Dropped</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs text-stone-300 truncate">
                            {enq.message || "—"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Direct Phone Call */}
                              <a
                                href={`tel:${enq.phone}`}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white"
                                title="Call on phone"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>

                              {/* WhatsApp Contact */}
                              <a
                                href={getWhatsAppUrl(`Hello ${enq.name}, I am Coach Aditya from Mahadev Gym Fitness following up on your Join Now inquiry.`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400"
                                title="Open WhatsApp Chat"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>

                              {/* Convert to Member 1-Click Action */}
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddMemberModal(true);
                                  // Pre-fill member form
                                  setEditingMember({
                                    memberId: `MG-${Math.floor(100 + Math.random() * 900)}`,
                                    name: enq.name,
                                    phone: enq.phone,
                                    gender: "Male",
                                    session: enq.session === "Any" ? "Morning" : enq.session,
                                    timeSlot: enq.timeSlot,
                                    planName: "Monthly Standard",
                                    startDate: getTodayDateStringIST(),
                                    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
                                    fee: 1500,
                                    paidAmount: 1500,
                                    pendingAmount: 0,
                                    status: "Active",
                                    createdAt: new Date().toISOString(),
                                    notes: `Converted from public inquiry ID: ${enq.id}`,
                                  });
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#FF6A00] text-black font-bold text-[10px] uppercase tracking-wider hover:bg-[#E55E00] cursor-pointer"
                              >
                                Convert
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MEMBER MANAGEMENT DIRECTORY                        */}
        {/* ========================================================= */}
        {activeTab === "members" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-athletic text-2xl font-bold uppercase text-white tracking-wide">
                  REGISTERED MEMBERS DIRECTORY ({filteredMembers.length})
                </h2>
                <p className="text-xs text-stone-400">
                  Manage active memberships, session assignments, renewals, and digital gym ID cards.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingMember(null);
                  setShowAddMemberModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E55E00] text-black font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Member</span>
              </button>
            </div>

            {/* Search & Filters */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID (e.g. MG-101), or phone..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              {/* Session Filter */}
              <select
                value={memberSessionFilter}
                onChange={(e) => setMemberSessionFilter(e.target.value)}
                className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none cursor-pointer"
              >
                <option value="all">All Sessions</option>
                <option value="Morning">Morning Members</option>
                <option value="Evening">Evening Members</option>
              </select>

              {/* Status Filter */}
              <select
                value={memberStatusFilter}
                onChange={(e) => setMemberStatusFilter(e.target.value)}
                className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Expired">Expired</option>
                <option value="pendingFee">Pending Fees Due</option>
                <option value="Frozen">Frozen</option>
              </select>
            </div>

            {/* Members Table */}
            <div className="rounded-3xl bg-[#141414] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1A1A1A] border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Member ID & Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Session & Slot</th>
                      <th className="py-3 px-4">Plan & Validity</th>
                      <th className="py-3 px-4">Fee / Dues</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          No members found. Click "Register New Member" or "Seed Data" above.
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((m) => (
                        <tr key={m.id || m.memberId} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-[#FF6A00]/20 border border-[#FF6A00]/30 text-[#FF6A00] flex items-center justify-center font-bold text-xs shrink-0">
                                {m.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-white block">{m.name}</span>
                                <span className="text-[10px] font-mono text-[#FF6A00]">{m.memberId}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-stone-300 font-mono">{m.phone}</div>
                            {m.email && <div className="text-[11px] text-stone-500 truncate max-w-[130px]">{m.email}</div>}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                m.session === "Morning"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-indigo-500/20 text-indigo-300"
                              }`}
                            >
                              {m.session}
                            </span>
                            <div className="text-[11px] text-stone-400 mt-0.5">{m.timeSlot}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{m.planName}</div>
                            <div className="text-[11px] text-stone-400">
                              Till: {formatDateIST(m.endDate)}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{formatCurrencyINR(m.fee)}</div>
                            {m.pendingAmount > 0 ? (
                              <span className="text-[10px] font-bold text-rose-400 block">
                                Due: {formatCurrencyINR(m.pendingAmount)}
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-400 block">Fully Paid</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                m.status === "Active"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : m.status === "Expired"
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : "bg-stone-500/20 text-stone-400 border border-stone-500/30"
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Digital ID Card */}
                              <button
                                type="button"
                                onClick={() => setSelectedMemberForCard(m)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white"
                                title="View Member Digital ID Card"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Member */}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMember(m);
                                  setShowAddMemberModal(true);
                                }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white"
                                title="Edit Member"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Quick Attendance Check-in */}
                              <button
                                type="button"
                                onClick={() => handleQuickCheckIn(m)}
                                className="p-2 rounded-lg bg-sky-950/50 hover:bg-sky-900/70 text-sky-400"
                                title="Record Check-in"
                              >
                                <Clock className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Member */}
                              <button
                                type="button"
                                onClick={async () => {
                                  if (currentUser && m.id) {
                                    await deleteMember(m.id);
                                  } else {
                                    setMembers((prev) =>
                                      prev.filter(
                                        (item) => (item.id || item.memberId) !== (m.id || m.memberId)
                                      )
                                    );
                                  }
                                  setSeedingMessage(`Member ${m.name} removed.`);
                                  setTimeout(() => setSeedingMessage(null), 3000);
                                }}
                                className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* TAB 4: ATTENDANCE & CHECK-IN DESK                        */}
        {/* ========================================================= */}
        {activeTab === "attendance" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Command Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="font-athletic text-2xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
                  <Flame className="w-6 h-6 text-[#FF6A00]" />
                  <span>ATTENDANCE & CHECK-IN DESK</span>
                </h2>
                <p className="text-xs text-stone-400">
                  Permanent gate QR verification, live floor telemetry & daily attendance log · {formatDateIST(todayIST)}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Gate QR Poster Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setShowQrPosterModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#E55E00] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Gate QR Poster & Print</span>
                </button>

                {/* Copy Permanent Gate Link */}
                <button
                  type="button"
                  onClick={handleCopyAttendanceUrl}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy permanent gate attendance URL to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{urlCopied ? "Link Copied!" : "Copy Link"}</span>
                </button>

                {/* Export CSV */}
                <button
                  type="button"
                  onClick={() =>
                    exportAttendanceToCSV(
                      filteredAttendance,
                      `mahadev_gym_attendance_${selectedAttendanceDate}.csv`
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Export filtered records to CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                {/* Printable Register */}
                <button
                  type="button"
                  onClick={() => setShowPrintRegisterModal(true)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Open printable attendance register"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sheet</span>
                </button>
              </div>
            </div>

            {/* Attendance Live Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Today's Check-ins
                </span>
                <div className="font-athletic text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#FF6A00]">{stats.todayAttendance}</span>
                  <span className="text-xs text-stone-500 font-sans font-normal">Entries</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-amber-500/20 shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80 block mb-1 flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Morning Session</span>
                </span>
                <div className="font-athletic text-2xl sm:text-3xl font-bold text-amber-400">
                  {stats.morningAttendance}
                </div>
                <span className="text-[10px] text-stone-500 block mt-0.5">05:30 AM - 10:30 AM</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-indigo-500/20 shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300/80 block mb-1 flex items-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-400" />
                  <span>Evening Session</span>
                </span>
                <div className="font-athletic text-2xl sm:text-3xl font-bold text-indigo-400">
                  {stats.eveningAttendance}
                </div>
                <span className="text-[10px] text-stone-500 block mt-0.5">05:00 PM - 10:30 PM</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-emerald-500/20 shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80 block mb-1">
                  Active Attended
                </span>
                <div className="font-athletic text-2xl sm:text-3xl font-bold text-emerald-400">
                  {stats.activeAttendedCount}
                  <span className="text-xs text-stone-400 font-sans font-normal ml-1.5">
                    / {stats.activeMembers} ({stats.attendancePercentage}%)
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 block mt-0.5">Present today</span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[#141414] border border-rose-500/20 shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300/80 block mb-1">
                  Active Absent
                </span>
                <div className="font-athletic text-2xl sm:text-3xl font-bold text-rose-400">
                  {stats.activeAbsentCount}
                </div>
                <span className="text-[10px] text-stone-500 block mt-0.5">Members missed today</span>
              </div>
            </div>

            {/* Quick Check-in Bar */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF6A00] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>ADMIN DESK QUICK CHECK-IN SCANNER / SEARCH</span>
                </h3>
                <span className="text-[11px] text-stone-500">
                  For walk-in verification or members without smartphones
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Type Member ID (e.g. MG-101), phone, or name to instant check-in..."
                    value={checkInSearch}
                    onChange={(e) => setCheckInSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white text-sm focus:border-[#FF6A00] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4 flex gap-2">
                  <select
                    value={checkInSession}
                    onChange={(e) => setCheckInSession(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white text-xs font-semibold focus:border-[#FF6A00] focus:outline-none cursor-pointer"
                  >
                    <option value="Morning">Morning Session (05:30 - 10:30 AM)</option>
                    <option value="Evening">Evening Session (05:00 - 10:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Instant Search Results Dropdown */}
              {checkInSearch.trim().length > 1 && (
                <div className="p-2 rounded-2xl bg-black/90 border border-white/10 space-y-1.5 shadow-2xl">
                  {members
                    .filter(
                      (m) =>
                        m.name.toLowerCase().includes(checkInSearch.toLowerCase()) ||
                        m.memberId.toLowerCase().includes(checkInSearch.toLowerCase()) ||
                        m.phone.includes(checkInSearch)
                    )
                    .slice(0, 5)
                    .map((m) => (
                      <div
                        key={m.id || m.memberId}
                        className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-xs text-white flex items-center gap-2">
                            <span>{m.name}</span>
                            <span className="font-mono text-[#FF6A00]">({m.memberId})</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                m.status === "Active"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-rose-500/20 text-rose-300"
                              }`}
                            >
                              {m.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-400">
                            Registered Session: {m.session} · Plan: {m.planName}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickCheckIn(m)}
                          className="px-3 py-1.5 rounded-lg bg-[#FF6A00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E55E00] cursor-pointer"
                        >
                          Check In Now
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Attendance Filter & Table Card */}
            <div className="rounded-3xl bg-[#141414] border border-white/10 overflow-hidden shadow-xl">
              {/* Header and Filter Controls */}
              <div className="p-5 bg-[#181818] border-b border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-athletic text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#FF6A00]" />
                    <span>DAILY ATTENDANCE REGISTER & CORRECTION LOG</span>
                  </h3>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-stone-300">
                    Showing {filteredAttendance.length} records
                  </span>
                </div>

                {/* Filter Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  {/* Date Filter */}
                  <div className="sm:col-span-5 flex items-center gap-2">
                    <label className="text-stone-400 shrink-0 font-medium">Date:</label>
                    <input
                      type="date"
                      value={selectedAttendanceDate === "all" ? "" : selectedAttendanceDate}
                      onChange={(e) => setSelectedAttendanceDate(e.target.value || "all")}
                      className="px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedAttendanceDate(todayIST)}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold cursor-pointer transition-colors ${
                        selectedAttendanceDate === todayIST
                          ? "bg-[#FF6A00] text-black border-[#FF6A00]"
                          : "bg-white/5 border-white/10 text-stone-300 hover:text-white"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedAttendanceDate("all")}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold cursor-pointer transition-colors ${
                        selectedAttendanceDate === "all"
                          ? "bg-[#FF6A00] text-black border-[#FF6A00]"
                          : "bg-white/5 border-white/10 text-stone-300 hover:text-white"
                      }`}
                    >
                      All
                    </button>
                  </div>

                  {/* Session Filter */}
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <label className="text-stone-400 shrink-0 font-medium">Session:</label>
                    <select
                      value={attendanceSessionFilter}
                      onChange={(e) => setAttendanceSessionFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Sessions</option>
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>

                  {/* Search Attendee */}
                  <div className="sm:col-span-4 relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search member name or ID..."
                      value={attendanceSearch}
                      onChange={(e) => setAttendanceSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181818] text-stone-400 uppercase text-[10px] tracking-wider border-b border-white/5">
                    <tr>
                      <th className="py-3 px-4">Date & Time (IST)</th>
                      <th className="py-3 px-4">Member Name & ID</th>
                      <th className="py-3 px-4">Session</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Audit / Notes</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          No attendance records found matching current date and filters.
                        </td>
                      </tr>
                    ) : (
                      filteredAttendance.map((att) => (
                        <tr key={att.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="text-white font-mono font-medium">
                              {formatDateTimeIST(att.checkInTime)}
                            </div>
                            <div className="text-[10px] text-stone-500">{att.date}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">{att.memberName}</div>
                            <span className="font-mono text-[#FF6A00] text-[11px]">
                              {att.memberId}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                att.session === "Morning"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              }`}
                            >
                              {att.session === "Morning" ? (
                                <Sun className="w-3 h-3 text-amber-400" />
                              ) : (
                                <Moon className="w-3 h-3 text-indigo-400" />
                              )}
                              <span>{att.session}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-stone-300 font-semibold">
                              {att.type === "QR" ? "Permanent QR Scan" : "Desk Manual"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                att.status === "Absent"
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : att.status === "Excused"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}
                            >
                              {att.status || "Present"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 max-w-[200px]">
                            {att.correctionReason ? (
                              <div className="text-[11px] text-amber-300/90 leading-tight">
                                <span className="font-semibold block text-[10px] text-amber-400">
                                  Corrected by {att.correctedBy?.split("@")[0] || "Admin"}:
                                </span>
                                {att.correctionReason}
                              </div>
                            ) : att.notes ? (
                              <span className="text-[11px] text-stone-400">{att.notes}</span>
                            ) : (
                              <span className="text-[11px] text-stone-600">—</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit / Correct Record */}
                              <button
                                type="button"
                                onClick={() => handleOpenCorrectionModal(att)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                                title="Edit or Correct Attendance Record"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Record */}
                              <button
                                type="button"
                                onClick={() => handleDeleteAttendance(att)}
                                className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors cursor-pointer"
                                title="Delete Attendance Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: FEES & PAYMENT MANAGEMENT                          */}
        {/* ========================================================= */}
        {activeTab === "payments" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-athletic text-2xl font-bold uppercase text-white tracking-wide">
                  FEES & PAYMENT MANAGEMENT
                </h2>
                <p className="text-xs text-stone-400">
                  Track revenue collections, outstanding balances, and generate printable invoice receipts.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowRecordPaymentModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Record Fee Payment</span>
              </button>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#141414] border border-emerald-500/30">
                <span className="text-[11px] font-semibold uppercase text-stone-400 block mb-1">
                  Today's Collection
                </span>
                <div className="font-athletic text-2xl sm:text-3xl font-bold text-emerald-400">
                  {formatCurrencyINR(stats.todayCollection)}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  {payments.filter((p) => p.paymentDate.startsWith(todayIST)).length} transactions today
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-white/10">
                <span className="text-[11px] font-semibold uppercase text-stone-400 block mb-1">
                  Current Month ({currentMonthPrefix})
                </span>
                <div className="font-athletic text-2xl sm:text-3xl font-bold text-white">
                  {formatCurrencyINR(stats.monthCollection)}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">Total monthly intake</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-rose-500/30">
                <span className="text-[11px] font-semibold uppercase text-stone-400 block mb-1">
                  Total Outstanding Dues
                </span>
                <div className="font-athletic text-2xl sm:text-3xl font-bold text-rose-400">
                  {formatCurrencyINR(stats.pendingFees)}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">Pending member balances</span>
              </div>
            </div>

            {/* Transactions Log Table */}
            <div className="rounded-3xl bg-[#141414] border border-white/10 overflow-hidden shadow-xl">
              <div className="p-4 bg-[#1A1A1A] border-b border-white/10 flex items-center justify-between">
                <h3 className="font-athletic text-sm font-bold uppercase tracking-wider text-white">
                  ALL RECORDED PAYMENT TRANSACTIONS ({payments.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181818] text-stone-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Member Name</th>
                      <th className="py-3 px-4">Amount Paid</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Payment Date (IST)</th>
                      <th className="py-3 px-4">Received By</th>
                      <th className="py-3 px-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          No transactions recorded yet. Click "Record Fee Payment" above.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4 font-mono font-bold text-[#FF6A00]">
                            {p.invoiceNumber}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-white block">{p.memberName}</span>
                            {p.memberPhone && (
                              <span className="text-[10px] text-stone-500 font-mono">{p.memberPhone}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-athletic text-sm font-bold text-emerald-400">
                            {formatCurrencyINR(p.amount)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-stone-300">
                              {p.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-300 font-mono">
                            {formatDateTimeIST(p.paymentDate)}
                          </td>
                          <td className="py-3 px-4 text-stone-400">
                            {p.receivedBy || "Coach Aditya"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedPaymentForReceipt(p)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#FF6A00] font-semibold text-[11px] cursor-pointer inline-flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Print</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: GYM EQUIPMENT & MAINTENANCE                       */}
        {/* ========================================================= */}
        {activeTab === "equipment" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-athletic text-2xl font-bold uppercase text-white tracking-wide">
                  GYM EQUIPMENT & MAINTENANCE INVENTORY
                </h2>
                <p className="text-xs text-stone-400">
                  Track machine condition, safety checks, barbell/plate counts, and maintenance logs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddEquipmentModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E55E00] text-black font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Equipment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.map((eq) => (
                <div
                  key={eq.id}
                  className="p-5 rounded-3xl bg-[#141414] border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6A00]">
                        {eq.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          eq.status === "Working"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : eq.status === "Needs Repair"
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {eq.status}
                      </span>
                    </div>

                    <h4 className="font-athletic text-base font-bold text-white uppercase mb-1">
                      {eq.name}
                    </h4>
                    <p className="text-xs text-stone-400">
                      Quantity on floor: <strong className="text-white">{eq.quantity} units</strong>
                    </p>

                    {eq.notes && (
                      <p className="text-xs text-stone-400 mt-2 italic bg-black/30 p-2 rounded-xl">
                        "{eq.notes}"
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                    <div>
                      <span>Last Serviced:</span>{" "}
                      <strong className="text-white">{eq.lastMaintenanceDate || "Recent"}</strong>
                    </div>

                    <select
                      value={eq.status}
                      onChange={async (e) => {
                        if (eq.id) {
                          await updateEquipment(eq.id, { status: e.target.value as any });
                        }
                      }}
                      className="px-2 py-1 bg-black/60 border border-white/10 rounded-lg text-white text-[10px] cursor-pointer"
                    >
                      <option value="Working">Working</option>
                      <option value="Needs Repair">Needs Repair</option>
                      <option value="Under Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: PAGE NAVIGATOR ("JAHA SABHI PAGE KI LIST")         */}
        {/* ========================================================= */}
        {activeTab === "pages" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 text-[#FF6A00] text-xs font-semibold uppercase tracking-widest">
                <Layers className="w-4 h-4" />
                <span>COMPLETE WEBSITE DIRECTORY & PREVIEW</span>
              </div>
              <h2 className="font-athletic text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
                MAHADEV GYM FITNESS — ALL PAGES DIRECTORY
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
                As requested, here is the complete list of all website pages. You can preview, inspect, or jump into any public page with one click without leaving your administrator session.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: "home" as PageId,
                  title: "1. Home Arena",
                  desc: "Main landing hero, Head Trainer Aditya Experts photo, shining brand animations, CTA buttons.",
                  badge: "Landing",
                },
                {
                  id: "about" as PageId,
                  title: "2. About & Philosophy",
                  desc: "Origin story of Mahadev Gym Fitness, core values, discipline, and training ethos.",
                  badge: "Brand",
                },
                {
                  id: "trainer" as PageId,
                  title: "3. Head Coach Profile",
                  desc: "Coach Aditya Experts credentials, certifications, lifting philosophy, and mentorship.",
                  badge: "Trainer",
                },
                {
                  id: "plans" as PageId,
                  title: "4. Workout Plans",
                  desc: "Custom workout splits: Push-Pull-Legs, Upper-Lower, Hypertrophy, and Strength cycles.",
                  badge: "Training",
                },
                {
                  id: "exercises" as PageId,
                  title: "5. Exercise Library",
                  desc: "Comprehensive database of movements categorized by chest, back, legs, shoulders, arms.",
                  badge: "Database",
                },
                {
                  id: "muscle-fatloss" as PageId,
                  title: "6. Muscle vs. Fat Loss",
                  desc: "Scientific guide on caloric deficit, progressive overload, protein intake, and fat cutting.",
                  badge: "Guide",
                },
                {
                  id: "coaching" as PageId,
                  title: "7. 1-on-1 Personal Coaching",
                  desc: "Personalized coaching packages with customized programming, weekly roadmap, and diet.",
                  badge: "Packages",
                },
                {
                  id: "calculator" as PageId,
                  title: "8. Daily Calorie Calculator",
                  desc: "Interactive BMR and TDEE calorie estimator tailored to body weight, height, and goals.",
                  badge: "Tool",
                },
                {
                  id: "tracking" as PageId,
                  title: "9. Progress Tracking Preview",
                  desc: "Weekly milestones, lifting progressive overload logs, body composition metrics.",
                  badge: "Tracker",
                },
                {
                  id: "gallery" as PageId,
                  title: "10. Gym Gallery",
                  desc: "High-resolution gym floor photographs, equipment, training weights, and click-to-enlarge lightbox.",
                  badge: "Media",
                },
                {
                  id: "transformations" as PageId,
                  title: "11. Transformation Framework",
                  desc: "Before/After client results, body recomposition stories, and discipline framework.",
                  badge: "Social Proof",
                },
                {
                  id: "reviews" as PageId,
                  title: "12. Member Reviews",
                  desc: "Genuine testimonials from trainees and lifters training at Mahadev Gym Fitness.",
                  badge: "Reviews",
                },
                {
                  id: "membership" as PageId,
                  title: "13. Membership Tiers",
                  desc: "Monthly Standard, Quarterly Pro, Half-Yearly, and Annual Elite pricing breakdown.",
                  badge: "Pricing",
                },
                {
                  id: "contact" as PageId,
                  title: "14. Contact & Location",
                  desc: "Physical gym location, interactive Google Maps directions, contact phone, and enquiry form.",
                  badge: "Location",
                },
                {
                  id: "attendance" as PageId,
                  title: "15. Gate QR Attendance",
                  desc: "Permanent gate QR code attendance check-in kiosk for members with live IST clock and duplicate prevention.",
                  badge: "Gate QR",
                },
              ].map((page) => (
                <div
                  key={page.id}
                  className="p-5 rounded-3xl bg-[#141414] border border-white/10 flex flex-col justify-between hover:border-[#FF6A00]/50 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6A00]">
                        {page.badge}
                      </span>
                      <span className="font-mono text-[10px] text-stone-500">#{page.id}</span>
                    </div>
                    <h3 className="font-athletic text-base font-bold text-white uppercase group-hover:text-[#FF6A00] transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                      {page.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-mono">
                      Route: /{page.id === "home" ? "" : page.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateTo(page.id)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF6A00] text-stone-200 hover:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open Page</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: REGISTER / EDIT MEMBER                             */}
      {/* ========================================================= */}
      {showAddMemberModal && (
        <MemberFormModal
          existingMember={editingMember}
          onClose={() => {
            setShowAddMemberModal(false);
            setEditingMember(null);
          }}
          onSave={async (memberData) => {
            if (currentUser) {
              if (editingMember?.id) {
                await updateMember(editingMember.id, memberData);
              } else {
                await addMember(memberData);
              }
            } else {
              if (editingMember?.id) {
                setMembers((prev) =>
                  prev.map((m) => (m.id === editingMember.id ? { ...m, ...memberData } : m))
                );
              } else {
                const newM: GymMember = {
                  ...memberData,
                  id: `demo-mem-${Date.now()}`,
                };
                setMembers((prev) => [newM, ...prev]);
              }
            }
            setShowAddMemberModal(false);
            setEditingMember(null);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL: RECORD FEE PAYMENT                                 */}
      {/* ========================================================= */}
      {showRecordPaymentModal && (
        <RecordPaymentModal
          members={members}
          onClose={() => setShowRecordPaymentModal(false)}
          onSave={async (payData) => {
            if (currentUser) {
              await recordPayment(payData);
              if (payData.memberDocId) {
                const target = members.find((m) => m.id === payData.memberDocId);
                if (target && target.id) {
                  const newPaid = (target.paidAmount || 0) + payData.amount;
                  const newPending = Math.max(0, (target.fee || 0) - newPaid);
                  await updateMember(target.id, {
                    paidAmount: newPaid,
                    pendingAmount: newPending,
                  });
                }
              }
            } else {
              const newPay: GymPayment = {
                ...payData,
                id: `demo-pay-${Date.now()}`,
              };
              setPayments((prev) => [newPay, ...prev]);
              if (payData.memberDocId) {
                setMembers((prev) =>
                  prev.map((m) => {
                    if (m.id === payData.memberDocId) {
                      const newPaid = (m.paidAmount || 0) + payData.amount;
                      const newPending = Math.max(0, (m.fee || 0) - newPaid);
                      return { ...m, paidAmount: newPaid, pendingAmount: newPending };
                    }
                    return m;
                  })
                );
              }
            }
            setShowRecordPaymentModal(false);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL: DIGITAL ID CARD VIEWER                             */}
      {/* ========================================================= */}
      {selectedMemberForCard && (
        <DigitalIdCardModal
          member={selectedMemberForCard}
          onClose={() => setSelectedMemberForCard(null)}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL: PRINTABLE PAYMENT INVOICE RECEIPT                  */}
      {/* ========================================================= */}
      {selectedPaymentForReceipt && (
        <InvoiceReceiptModal
          payment={selectedPaymentForReceipt}
          onClose={() => setSelectedPaymentForReceipt(null)}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD EQUIPMENT                                      */}
      {/* ========================================================= */}
      {showAddEquipmentModal && (
        <AddEquipmentModal
          onClose={() => setShowAddEquipmentModal(false)}
          onSave={async (eqData) => {
            if (currentUser) {
              await addEquipment(eqData);
            } else {
              const newEq: GymEquipment = {
                ...eqData,
                id: `demo-eq-${Date.now()}`,
              };
              setEquipment((prev) => [newEq, ...prev]);
            }
            setShowAddEquipmentModal(false);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL: PERMANENT GATE QR POSTER & PRINT                   */}
      {/* ========================================================= */}
      {showQrPosterModal && (
        <GateQrPosterModal
          onClose={() => setShowQrPosterModal(false)}
          qrDataUrl={qrDataUrl}
          attendanceUrl={getPermanentAttendanceUrl()}
          onDownload={handleDownloadQrCode}
          onCopyUrl={handleCopyAttendanceUrl}
          urlCopied={urlCopied}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL: ATTENDANCE RECORD MANUAL CORRECTION                */}
      {/* ========================================================= */}
      {selectedAttendanceForCorrection && (
        <AttendanceCorrectionModal
          record={selectedAttendanceForCorrection}
          onClose={() => setSelectedAttendanceForCorrection(null)}
          onSave={handleSaveCorrection}
          session={correctionSession}
          setSession={setCorrectionSession}
          status={correctionStatus}
          setStatus={setCorrectionStatus}
          notes={correctionNotes}
          setNotes={setCorrectionNotes}
          reason={correctionReason}
          setReason={setCorrectionReason}
          saving={savingCorrection}
          adminEmail={currentUser?.email || "admin@mahadevgym.com"}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL: PRINTABLE ATTENDANCE REGISTER                      */}
      {/* ========================================================= */}
      {showPrintRegisterModal && (
        <PrintableAttendanceRegisterModal
          onClose={() => setShowPrintRegisterModal(false)}
          records={filteredAttendance}
          date={selectedAttendanceDate}
          todayIST={todayIST}
          morningCount={stats.morningAttendance}
          eveningCount={stats.eveningAttendance}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: MEMBER FORM MODAL
// -------------------------------------------------------------
interface MemberFormModalProps {
  existingMember: GymMember | null;
  onClose: () => void;
  onSave: (data: Omit<GymMember, "id">) => Promise<void>;
}

const MemberFormModal: React.FC<MemberFormModalProps> = ({ existingMember, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    memberId: existingMember?.memberId || `MG-${Math.floor(100 + Math.random() * 900)}`,
    name: existingMember?.name || "",
    phone: existingMember?.phone || "",
    email: existingMember?.email || "",
    gender: (existingMember?.gender || "Male") as "Male" | "Female" | "Other",
    age: existingMember?.age || 24,
    bloodGroup: existingMember?.bloodGroup || "B+",
    session: (existingMember?.session || "Morning") as "Morning" | "Evening",
    timeSlot: existingMember?.timeSlot || "06:00 AM - 07:30 AM",
    planName: existingMember?.planName || "Monthly Standard",
    startDate: existingMember?.startDate || getTodayDateStringIST(),
    endDate:
      existingMember?.endDate ||
      new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    fee: existingMember?.fee || 1500,
    paidAmount: existingMember?.paidAmount || 1500,
    pendingAmount: existingMember?.pendingAmount || 0,
    status: (existingMember?.status || "Active") as "Active" | "Expired" | "Frozen",
    notes: existingMember?.notes || "",
  });

  const [saving, setSaving] = useState(false);

  const handlePlanChange = (plan: string) => {
    let fee = 1500;
    let days = 30;
    if (plan === "Quarterly Pro (3 Months)") {
      fee = 3800;
      days = 90;
    } else if (plan === "Half-Yearly (6 Months)") {
      fee = 6500;
      days = 180;
    } else if (plan === "Annual Elite (12 Months)") {
      fee = 11500;
      days = 365;
    } else if (plan === "1-on-1 Personal Training") {
      fee = 5000;
      days = 30;
    }

    const start = new Date(formData.startDate || Date.now());
    const end = new Date(start.getTime() + days * 86400000).toISOString().split("T")[0];

    setFormData({
      ...formData,
      planName: plan,
      fee,
      paidAmount: fee,
      pendingAmount: 0,
      endDate: end,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Name and phone number are required!");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...formData,
        fee: Number(formData.fee),
        paidAmount: Number(formData.paidAmount),
        pendingAmount: Number(formData.fee) - Number(formData.paidAmount),
        createdAt: existingMember?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      alert("Error saving member: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#141414] border border-white/10 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#181818]">
          <h3 className="font-athletic text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF6A00]" />
            <span>{existingMember ? "EDIT MEMBER DETAILS" : "REGISTER NEW GYM MEMBER"}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Member ID</label>
              <input
                type="text"
                required
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl font-mono text-[#FF6A00]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-stone-300 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="optional@gmail.com"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              >
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="O-">O-</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Gym Session *</label>
              <select
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value as any })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl font-bold"
              >
                <option value="Morning">Morning Session</option>
                <option value="Evening">Evening Session</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Time Slot</label>
              <input
                type="text"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                placeholder="e.g. 06:00 AM - 07:30 AM"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Membership Plan</label>
            <select
              value={formData.planName}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl font-bold text-[#FF6A00]"
            >
              <option value="Monthly Standard">Monthly Standard (₹1,500)</option>
              <option value="Quarterly Pro (3 Months)">Quarterly Pro - 3 Months (₹3,800)</option>
              <option value="Half-Yearly (6 Months)">Half-Yearly - 6 Months (₹6,500)</option>
              <option value="Annual Elite (12 Months)">Annual Elite - 12 Months (₹11,500)</option>
              <option value="1-on-1 Personal Training">1-on-1 Personal Training (₹5,000/mo)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">End Date (Expiry)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl font-bold text-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Total Fee (₹)</label>
              <input
                type="number"
                value={formData.fee}
                onChange={(e) => {
                  const f = Number(e.target.value);
                  setFormData({
                    ...formData,
                    fee: f,
                    pendingAmount: Math.max(0, f - formData.paidAmount),
                  });
                }}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Paid Amount (₹)</label>
              <input
                type="number"
                value={formData.paidAmount}
                onChange={(e) => {
                  const p = Number(e.target.value);
                  setFormData({
                    ...formData,
                    paidAmount: p,
                    pendingAmount: Math.max(0, formData.fee - p),
                  });
                }}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl font-bold text-emerald-400"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Pending Balance</label>
              <input
                type="number"
                disabled
                value={Math.max(0, formData.fee - formData.paidAmount)}
                className="w-full px-3 py-2 bg-black/70 border border-white/5 rounded-xl font-bold text-rose-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Member Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Frozen">Frozen</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Notes / Goals</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Chest hypertrophy focus"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E55E00] text-black font-bold uppercase tracking-wider"
            >
              {saving ? "Saving Member..." : "Save Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: RECORD PAYMENT MODAL
// -------------------------------------------------------------
interface RecordPaymentModalProps {
  members: GymMember[];
  onClose: () => void;
  onSave: (data: Omit<GymPayment, "id">) => Promise<void>;
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ members, onClose, onSave }) => {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [amount, setAmount] = useState(1500);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Cash" | "Card" | "NetBanking">("UPI");
  const [planName, setPlanName] = useState("Monthly Membership Fee");
  const [receivedBy, setReceivedBy] = useState("Coach Aditya");
  const [notes, setNotes] = useState("Direct payment confirmed");
  const [saving, setSaving] = useState(false);

  const handleMemberSelect = (docId: string) => {
    setSelectedMemberId(docId);
    const m = members.find((mem) => mem.id === docId);
    if (m) {
      setMemberName(m.name);
      setMemberPhone(m.phone);
      setPlanName(m.planName);
      if (m.pendingAmount > 0) {
        setAmount(m.pendingAmount);
      } else {
        setAmount(m.fee || 1500);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || amount <= 0) {
      alert("Please specify member name and positive payment amount.");
      return;
    }

    try {
      setSaving(true);
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await onSave({
        invoiceNumber,
        memberDocId: selectedMemberId,
        memberName: memberName.trim(),
        memberPhone: memberPhone.trim(),
        amount: Number(amount),
        paymentMethod,
        paymentDate: new Date().toISOString(),
        planName,
        receivedBy,
        notes,
      });
    } catch (err: any) {
      alert("Error recording payment: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#141414] border border-white/10 text-white shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <h3 className="font-athletic text-xl font-bold uppercase text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>RECORD FEE PAYMENT TRANSACTION</span>
          </h3>
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">Select Member (Optional)</label>
            <select
              value={selectedMemberId}
              onChange={(e) => handleMemberSelect(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
            >
              <option value="">-- Choose Member or Enter Name Manually --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.memberId}) · Due: ₹{m.pendingAmount}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Member Name *</label>
              <input
                type="text"
                required
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Member Phone</label>
              <input
                type="tel"
                value={memberPhone}
                onChange={(e) => setMemberPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Amount Paid (₹) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl font-athletic text-base font-bold text-emerald-400"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Cash">Cash at Front Desk</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="NetBanking">Net Banking</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Plan / Reason</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Received By</label>
              <input
                type="text"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-stone-400">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider"
            >
              {saving ? "Recording..." : "Confirm & Save Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: DIGITAL ID CARD MODAL
// -------------------------------------------------------------
const DigitalIdCardModal: React.FC<{ member: GymMember; onClose: () => void }> = ({
  member,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#181818] border border-[#FF6A00]/40 text-white shadow-2xl p-6 overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6A00]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="text-center pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center justify-center gap-1.5 text-[#FF6A00] font-bold text-xs uppercase tracking-widest mb-1">
            <Flame className="w-4 h-4 fill-current" />
            <span>MAHADEV GYM FITNESS</span>
          </div>
          <h4 className="font-athletic text-lg font-bold text-white uppercase tracking-wider">
            OFFICIAL MEMBER PASS
          </h4>
          <span className="text-[10px] text-stone-400 font-mono">
            ID: {member.memberId}
          </span>
        </div>

        {/* Card Body */}
        <div className="py-5 text-center space-y-3 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF6A00] to-amber-500 text-black mx-auto flex items-center justify-center font-athletic text-3xl font-bold shadow-lg">
            {member.name.charAt(0)}
          </div>

          <div>
            <h3 className="font-athletic text-xl font-bold uppercase tracking-wide text-white">
              {member.name}
            </h3>
            <span className="text-xs text-stone-400">{member.phone}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left bg-black/40 p-3 rounded-2xl border border-white/5 text-[11px]">
            <div>
              <span className="text-stone-500 uppercase block text-[9px]">Session</span>
              <strong className="text-white">{member.session}</strong>
            </div>
            <div>
              <span className="text-stone-500 uppercase block text-[9px]">Blood Group</span>
              <strong className="text-white">{member.bloodGroup || "O+"}</strong>
            </div>
            <div>
              <span className="text-stone-500 uppercase block text-[9px]">Plan</span>
              <strong className="text-white truncate block">{member.planName}</strong>
            </div>
            <div>
              <span className="text-stone-500 uppercase block text-[9px]">Valid Until</span>
              <strong className="text-emerald-400">{formatDateIST(member.endDate)}</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs relative z-10">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print ID</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FF6A00] text-black font-bold uppercase cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: INVOICE RECEIPT MODAL
// -------------------------------------------------------------
const InvoiceReceiptModal: React.FC<{ payment: GymPayment; onClose: () => void }> = ({
  payment,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFFFFF] text-[#191919] shadow-2xl p-6 overflow-hidden">
        {/* Receipt Header */}
        <div className="text-center pb-4 border-b border-stone-200">
          <div className="text-[11px] font-bold text-[#D95D0F] uppercase tracking-widest mb-0.5">
            MAHADEV GYM FITNESS
          </div>
          <h3 className="font-athletic text-2xl font-bold uppercase tracking-wider text-[#191919]">
            PAYMENT RECEIPT
          </h3>
          <p className="text-[10px] text-stone-500">
            {GYM_CONFIG.address} · {GYM_CONFIG.phoneFormatted}
          </p>
        </div>

        {/* Invoice Meta */}
        <div className="py-4 space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-500">Receipt No:</span>
            <span className="font-mono font-bold text-[#D95D0F]">{payment.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Date & Time:</span>
            <span>{formatDateTimeIST(payment.paymentDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Member Name:</span>
            <span className="font-bold">{payment.memberName}</span>
          </div>
          {payment.memberPhone && (
            <div className="flex justify-between">
              <span className="text-stone-500">Member Phone:</span>
              <span className="font-mono">{payment.memberPhone}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-stone-500">Description / Plan:</span>
            <span>{payment.planName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Payment Mode:</span>
            <span className="font-semibold uppercase">{payment.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Authorized Receiver:</span>
            <span>{payment.receivedBy || "Coach Aditya"}</span>
          </div>

          {/* Amount Paid Box */}
          <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
            <span className="font-bold uppercase text-stone-700">Total Amount Paid</span>
            <span className="font-athletic text-2xl font-bold text-[#15803D]">
              {formatCurrencyINR(payment.amount)}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-stone-500 text-center italic mt-2">
          Thank you for training with Mahadev Gym Fitness. Train hard, stay disciplined!
        </p>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs mt-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#191919] font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#191919] hover:bg-black text-white font-bold uppercase cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: ADD EQUIPMENT MODAL
// -------------------------------------------------------------
const AddEquipmentModal: React.FC<{
  onClose: () => void;
  onSave: (data: Omit<GymEquipment, "id">) => Promise<void>;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Strength" as "Strength" | "Cardio" | "FreeWeights" | "CableMachines" | "Accessories",
    quantity: 1,
    status: "Working" as "Working" | "Needs Repair" | "Under Maintenance",
    lastMaintenanceDate: getTodayDateStringIST(),
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#141414] border border-white/10 text-white shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <h3 className="font-athletic text-xl font-bold uppercase text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[#FF6A00]" />
            <span>ADD GYM EQUIPMENT</span>
          </h3>
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">Equipment Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Incline Dumbbell Bench"
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              >
                <option value="Strength">Strength Machine</option>
                <option value="Cardio">Cardio</option>
                <option value="FreeWeights">Free Weights</option>
                <option value="CableMachines">Cable Machine</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Quantity</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              >
                <option value="Working">Working</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Service Date</label>
              <input
                type="date"
                value={formData.lastMaintenanceDate}
                onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Notes / Specs</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Solid steel frame, inspected bolts"
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-stone-400">
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF6A00] text-black font-bold uppercase tracking-wider"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: GATE QR POSTER & PRINT MODAL
// -------------------------------------------------------------
interface GateQrPosterModalProps {
  onClose: () => void;
  qrDataUrl: string;
  attendanceUrl: string;
  onDownload: () => void;
  onCopyUrl: () => void;
  urlCopied: boolean;
}

const GateQrPosterModal: React.FC<GateQrPosterModalProps> = ({
  onClose,
  qrDataUrl,
  attendanceUrl,
  onDownload,
  onCopyUrl,
  urlCopied,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#141414] border border-white/10 text-white shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#181818]">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#FF6A00]" />
            <h3 className="font-athletic text-base sm:text-lg font-bold uppercase tracking-wider text-white">
              PERMANENT ENTRANCE QR POSTER
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Printable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Official Printable Poster Card */}
          <div
            id="gym-gate-poster"
            className="p-6 sm:p-8 rounded-2xl bg-white text-black shadow-inner border border-stone-300 text-center space-y-4 select-text"
          >
            {/* Poster Header */}
            <div className="border-b-2 border-black pb-3 space-y-1">
              <div className="inline-flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-md bg-black text-[#FF6A00] flex items-center justify-center font-bold text-sm">
                  ⚡
                </span>
                <span className="font-athletic text-2xl sm:text-3xl font-extrabold tracking-wider uppercase text-black">
                  MAHADEV <span className="text-[#FF6A00]">GYM FITNESS</span>
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                Official Daily Member Gate Check-in
              </p>
              <p className="text-[10px] text-stone-500">
                Proprietor & Head Trainer: Coach Aditya · Near Bus Stand
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-white border-2 border-black rounded-2xl inline-block shadow-md mx-auto">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Permanent Mahadev Gym Attendance QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-xs text-stone-400 font-mono">
                  Generating Permanent QR...
                </div>
              )}
            </div>

            {/* Member Instructions */}
            <div className="space-y-2 text-left bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <p className="font-bold text-xs uppercase tracking-wider text-black text-center">
                HOW TO MARK YOUR ATTENDANCE:
              </p>
              <ol className="text-[11px] text-stone-700 space-y-1 list-decimal list-inside font-medium">
                <li>
                  Scan this QR code using any smartphone camera or Google Lens.
                </li>
                <li>
                  Select your current session (<strong>Morning</strong>: 5:30 AM - 10:30 AM / <strong>Evening</strong>: 5:00 PM - 10:30 PM).
                </li>
                <li>
                  Enter your registered full name and tap <strong>Mark Attendance</strong>.
                </li>
              </ol>
            </div>

            {/* Timings & Notice */}
            <div className="pt-2 text-[10px] text-stone-500 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-1">
              <span>Morning: 05:30 AM – 10:30 AM</span>
              <span>Evening: 05:00 PM – 10:30 PM</span>
            </div>
            <p className="text-[9px] text-stone-400 font-mono break-all">
              Permanent Gate URL: {attendanceUrl}
            </p>
          </div>

          {/* Quick Notice */}
          <div className="text-[11px] text-stone-400 bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
            <span className="font-bold text-stone-300 block">Gym Gate Best Practice:</span>
            <p>
              This QR code is <strong>permanent</strong> and never expires or changes daily. Print this A4 poster, laminate it or place it in an acrylic stand at the gym entrance turnstile/gate.
            </p>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-white/10 bg-[#181818] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCopyUrl}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{urlCopied ? "URL Copied!" : "Copy Link"}</span>
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-stone-400 hover:text-white text-xs cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#E55E00] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Poster</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: ATTENDANCE CORRECTION MODAL
// -------------------------------------------------------------
interface AttendanceCorrectionModalProps {
  record: GymAttendance;
  onClose: () => void;
  onSave: () => Promise<void>;
  session: "Morning" | "Evening";
  setSession: (s: "Morning" | "Evening") => void;
  status: "Present" | "Absent" | "Excused";
  setStatus: (st: "Present" | "Absent" | "Excused") => void;
  notes: string;
  setNotes: (n: string) => void;
  reason: string;
  setReason: (r: string) => void;
  saving: boolean;
  adminEmail: string;
}

const AttendanceCorrectionModal: React.FC<AttendanceCorrectionModalProps> = ({
  record,
  onClose,
  onSave,
  session,
  setSession,
  status,
  setStatus,
  notes,
  setNotes,
  reason,
  setReason,
  saving,
  adminEmail,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#141414] border border-white/10 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#181818]">
          <h3 className="font-athletic text-base sm:text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Edit className="w-4 h-4 text-[#FF6A00]" />
            <span>CORRECT ATTENDANCE RECORD</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs"
        >
          {/* Read-only Record Banner */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{record.memberName}</span>
              <span className="font-mono text-[#FF6A00]">{record.memberId}</span>
            </div>
            <div className="text-[11px] text-stone-400">
              Recorded Date: {record.date} at {formatDateTimeIST(record.checkInTime)}
            </div>
            <div className="text-[10px] text-stone-500">
              Type: {record.type === "QR" ? "Permanent QR Scan" : "Manual Desk"}
            </div>
          </div>

          {/* Session Switch */}
          <div>
            <label className="block text-stone-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Workout Session *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSession("Morning")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  session === "Morning"
                    ? "bg-[#FF6A00] text-black border-[#FF6A00]"
                    : "bg-black/40 border-white/10 text-stone-300"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Morning</span>
              </button>
              <button
                type="button"
                onClick={() => setSession("Evening")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  session === "Evening"
                    ? "bg-[#FF6A00] text-black border-[#FF6A00]"
                    : "bg-black/40 border-white/10 text-stone-300"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Evening</span>
              </button>
            </div>
          </div>

          {/* Status Switch */}
          <div>
            <label className="block text-stone-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Attendance Status *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Present", "Absent", "Excused"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold uppercase transition-colors cursor-pointer ${
                    status === st
                      ? st === "Present"
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : st === "Absent"
                        ? "bg-rose-600 border-rose-500 text-white"
                        : "bg-amber-600 border-amber-500 text-white"
                      : "bg-black/40 border-white/10 text-stone-400"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-stone-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
              Notes / Floor Remark (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Arrived late with Coach Aditya permission"
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white text-xs focus:border-[#FF6A00] focus:outline-none"
            />
          </div>

          {/* Audit Reason (Mandatory) */}
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
            <label className="block text-amber-300 font-bold uppercase tracking-wider text-[11px]">
              Reason for Correction (Required for Audit Trail) *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Member accidentally selected Morning instead of Evening"
              className="w-full px-3 py-2 bg-black/60 border border-amber-500/40 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
            />
            <span className="text-[10px] text-stone-400 block">
              This adjustment will be permanently logged under admin account: <strong>{adminEmail}</strong>
            </span>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !reason.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E55E00] text-black font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              {saving ? "Saving Changes..." : "Save Correction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: PRINTABLE ATTENDANCE REGISTER MODAL
// -------------------------------------------------------------
interface PrintableAttendanceRegisterModalProps {
  onClose: () => void;
  records: GymAttendance[];
  date: string;
  todayIST: string;
  morningCount: number;
  eveningCount: number;
}

const PrintableAttendanceRegisterModal: React.FC<PrintableAttendanceRegisterModalProps> = ({
  onClose,
  records,
  date,
  todayIST,
  morningCount,
  eveningCount,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#141414] border border-white/10 text-white shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#181818]">
          <h3 className="font-athletic text-base sm:text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#FF6A00]" />
            <span>DAILY ATTENDANCE LOG SHEET</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Paper View */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-4">
          <div className="p-6 sm:p-8 bg-white text-black rounded-xl border border-stone-300 shadow-md space-y-4 select-text">
            {/* Header */}
            <div className="border-b-2 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="font-athletic text-2xl font-bold uppercase text-black">
                  MAHADEV GYM FITNESS
                </h1>
                <p className="text-xs text-stone-600">
                  Head Trainer & Owner: Coach Aditya · Official Daily Register
                </p>
              </div>
              <div className="text-right text-xs">
                <div>Date: <strong>{date === "all" ? todayIST : date}</strong></div>
                <div>Morning: <strong>{morningCount}</strong> | Evening: <strong>{eveningCount}</strong></div>
              </div>
            </div>

            {/* Attendance Register Table */}
            <table className="w-full text-left text-xs border border-stone-300">
              <thead className="bg-stone-100 uppercase text-[10px] text-stone-700 border-b border-stone-300">
                <tr>
                  <th className="py-2 px-3 border-r border-stone-300">#</th>
                  <th className="py-2 px-3 border-r border-stone-300">Time (IST)</th>
                  <th className="py-2 px-3 border-r border-stone-300">Member Name</th>
                  <th className="py-2 px-3 border-r border-stone-300">Member ID</th>
                  <th className="py-2 px-3 border-r border-stone-300">Session</th>
                  <th className="py-2 px-3 border-r border-stone-300">Method</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      No attendance check-ins recorded for this date.
                    </td>
                  </tr>
                ) : (
                  records.map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-stone-50">
                      <td className="py-2 px-3 border-r border-stone-300 font-mono text-[10px]">
                        {i + 1}
                      </td>
                      <td className="py-2 px-3 border-r border-stone-300 font-mono text-[10px]">
                        {formatDateTimeIST(r.checkInTime)}
                      </td>
                      <td className="py-2 px-3 border-r border-stone-300 font-bold">
                        {r.memberName}
                      </td>
                      <td className="py-2 px-3 border-r border-stone-300 font-mono text-[10px]">
                        {r.memberId}
                      </td>
                      <td className="py-2 px-3 border-r border-stone-300">
                        {r.session}
                      </td>
                      <td className="py-2 px-3 border-r border-stone-300 text-[10px]">
                        {r.type === "QR" ? "Gate QR" : "Desk Manual"}
                      </td>
                      <td className="py-2 px-3 font-semibold">
                        {r.status || "Present"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Signature Area */}
            <div className="pt-6 flex justify-between items-end text-xs text-stone-600">
              <div>
                <span>Total Checked-in: </span>
                <strong>{records.length} Entries</strong>
              </div>
              <div className="text-center">
                <div className="w-48 border-b border-black mb-1" />
                <span className="text-[10px] uppercase font-bold text-black">
                  Coach Aditya (Authorized Signatory)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-white/10 bg-[#181818] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-400 hover:text-white cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E55E00] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
