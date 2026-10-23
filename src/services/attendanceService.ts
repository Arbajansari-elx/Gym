import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import {
  getTodayDateStringIST,
  getDayOfWeekIST,
  formatDateTimeIST,
  normalizeMemberName,
  getNameSlug,
} from "../utils/dateUtils";
import { GymAttendance, GymMember, INITIAL_MEMBERS } from "./gymDatabase";

export interface AttendanceSubmissionResult {
  success: boolean;
  message: string;
  alreadyMarked?: boolean;
  reason?: "notFound" | "expired" | "ambiguous" | "alreadyMarked" | "serverError";
  recordedTime?: string;
  memberName?: string;
  session?: "Morning" | "Evening";
  date?: string;
  memberId?: string;
}

export interface ActiveMemberIndexItem {
  memberId: string;
  memberDocId?: string;
  memberName: string;
  session: "Morning" | "Evening";
  status: "Active" | "Expired" | "Frozen";
  isAmbiguous?: boolean;
  count?: number;
  updatedAt?: string;
}

// Local in-memory store for offline demo mode
let offlineActiveIndex: Map<string, ActiveMemberIndexItem> = new Map();
let offlineAttendanceRecords: GymAttendance[] = [];

// Initialize offline index with sample members
export function initializeOfflineIndex(membersList: GymMember[] = INITIAL_MEMBERS as GymMember[]) {
  offlineActiveIndex.clear();
  const nameCounts: Record<string, number> = {};

  // Count names to detect duplicates
  membersList.forEach((m) => {
    const slug = getNameSlug(m.name);
    nameCounts[slug] = (nameCounts[slug] || 0) + 1;
  });

  membersList.forEach((m) => {
    const slug = getNameSlug(m.name);
    const isAmbiguous = (nameCounts[slug] || 0) > 1;

    offlineActiveIndex.set(slug, {
      memberId: m.memberId,
      memberDocId: m.id || m.memberId,
      memberName: m.name,
      session: m.session,
      status: m.status,
      isAmbiguous,
      count: nameCounts[slug] || 1,
      updatedAt: new Date().toISOString(),
    });
  });
}

// Run initial offline index setup
initializeOfflineIndex();

/**
 * Synchronize the active members lookup index in Firestore.
 * This runs when an administrator registers or updates members.
 * The index contains ONLY non-sensitive data (memberName, memberId, session, status)
 * so public visitors can verify membership by name without exposing any phone, fee, or personal details.
 */
export async function syncActiveMembersIndex(members: GymMember[]): Promise<void> {
  // Update local memory first
  initializeOfflineIndex(members);

  if (!auth.currentUser) {
    return;
  }

  try {
    const nameCounts: Record<string, number> = {};
    members.forEach((m) => {
      const slug = getNameSlug(m.name);
      nameCounts[slug] = (nameCounts[slug] || 0) + 1;
    });

    for (const m of members) {
      const slug = getNameSlug(m.name);
      if (!slug) continue;

      const isAmbiguous = (nameCounts[slug] || 0) > 1;
      const indexDoc: ActiveMemberIndexItem = {
        memberId: m.memberId,
        memberDocId: m.id || m.memberId,
        memberName: m.name,
        session: m.session,
        status: m.status,
        isAmbiguous,
        count: nameCounts[slug] || 1,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "active_members_index", slug), indexDoc, { merge: true });
    }
  } catch (error) {
    console.warn("Could not sync active_members_index to Firestore:", error);
  }
}

/**
 * Submit Member QR Attendance
 *
 * Requirements enforced:
 * 1. Only active registered members are eligible.
 * 2. Duplicate names are safely flagged as ambiguous to avoid false check-ins.
 * 3. A member can attend once for Morning and once for Evening per calendar day.
 * 4. Deterministic document ID prevents concurrent duplicate writes atomically.
 * 5. Uses India Standard Time (Asia/Kolkata) authoritatively.
 */
export async function markMemberAttendance(input: {
  memberName: string;
  session: "Morning" | "Evening";
}): Promise<AttendanceSubmissionResult> {
  const trimmedName = input.memberName.trim();
  if (!trimmedName || trimmedName.length < 2) {
    return {
      success: false,
      reason: "notFound",
      message: "Please enter your full registered name.",
    };
  }

  const nameSlug = getNameSlug(trimmedName);
  const todayIST = getTodayDateStringIST();
  const dayOfWeek = getDayOfWeekIST();

  // Step 1: Resolve member from server / Firestore / offline index
  let matchedMember: ActiveMemberIndexItem | null = null;

  // Try fetching from Firestore active_members_index
  try {
    const indexSnap = await getDoc(doc(db, "active_members_index", nameSlug));
    if (indexSnap.exists()) {
      matchedMember = indexSnap.data() as ActiveMemberIndexItem;
    }
  } catch {
    // If client is offline or rules restrict, fallback to local index
  }

  // Fallback to offline index if not found in Firestore
  if (!matchedMember) {
    matchedMember = offlineActiveIndex.get(nameSlug) || null;
  }

  // If still not matched, check if normalized string matches any known member
  if (!matchedMember) {
    for (const [, item] of offlineActiveIndex.entries()) {
      if (normalizeMemberName(item.memberName) === normalizeMemberName(trimmedName)) {
        matchedMember = item;
        break;
      }
    }
  }

  // Check 1: Member Exists
  if (!matchedMember) {
    return {
      success: false,
      reason: "notFound",
      message: `No membership record found for "${trimmedName}". Please check your spelling or register at the front desk with Coach Aditya.`,
    };
  }

  // Check 2: Name Ambiguity Guard
  if (matchedMember.isAmbiguous) {
    return {
      success: false,
      reason: "ambiguous",
      message: `Multiple active members share the name "${matchedMember.memberName}". To avoid marking the wrong account, please verify your attendance with Coach Aditya at the front desk.`,
    };
  }

  // Check 3: Active Status
  if (matchedMember.status !== "Active") {
    return {
      success: false,
      reason: "expired",
      message: `Membership for ${matchedMember.memberName} is currently ${matchedMember.status}. Only active members can mark daily attendance. Please contact the front desk to renew.`,
    };
  }

  // Step 2: Deterministic Record Key
  // e.g. att_MG-101_2026-10-23_morning
  const deterministicId = `att_${matchedMember.memberId}_${todayIST}_${input.session.toLowerCase()}`;

  // Check if attendance already exists in Firestore
  try {
    const existingSnap = await getDoc(doc(db, "attendance", deterministicId));
    if (existingSnap.exists()) {
      const data = existingSnap.data() as GymAttendance;
      return {
        success: false,
        alreadyMarked: true,
        reason: "alreadyMarked",
        message: `Attendance for the ${input.session} session has already been marked today.`,
        recordedTime: formatDateTimeIST(data.checkInTime),
        memberName: matchedMember.memberName,
        session: input.session,
        date: todayIST,
      };
    }
  } catch {
    // Check in offline records if Firestore is unavailable
    const offlineExisting = offlineAttendanceRecords.find(
      (r) => r.id === deterministicId || (r.memberId === matchedMember?.memberId && r.date === todayIST && r.session === input.session)
    );
    if (offlineExisting) {
      return {
        success: false,
        alreadyMarked: true,
        reason: "alreadyMarked",
        message: `Attendance for the ${input.session} session has already been marked today.`,
        recordedTime: formatDateTimeIST(offlineExisting.checkInTime),
        memberName: matchedMember.memberName,
        session: input.session,
        date: todayIST,
      };
    }
  }

  // Step 3: Record Authoritative Attendance
  const now = new Date();
  const newRecord: GymAttendance = {
    id: deterministicId,
    memberDocId: matchedMember.memberDocId || matchedMember.memberId,
    memberId: matchedMember.memberId,
    memberName: matchedMember.memberName,
    session: input.session,
    checkInTime: now.toISOString(),
    date: todayIST,
    dayOfWeek,
    type: "QR",
    status: "Present",
    markedAt: now.toISOString(),
  };

  try {
    await setDoc(doc(db, "attendance", deterministicId), newRecord);
  } catch (err: any) {
    // If Firestore fails (e.g. offline / unauthenticated demo), record in memory
    offlineAttendanceRecords.unshift(newRecord);
  }

  return {
    success: true,
    message: "Thank you! Attendance marked successfully.",
    recordedTime: formatDateTimeIST(now),
    memberName: matchedMember.memberName,
    session: input.session,
    date: todayIST,
    memberId: matchedMember.memberId,
  };
}

/**
 * Perform manual attendance correction by authorized admin
 */
export async function correctAttendanceRecord(
  attendanceId: string,
  updates: Partial<GymAttendance>,
  adminEmail: string,
  reason: string
): Promise<void> {
  const path = `attendance/${attendanceId}`;
  const now = new Date().toISOString();

  // In Firestore
  try {
    await updateDoc(doc(db, "attendance", attendanceId), {
      ...updates,
      updatedAt: now,
      updatedBy: adminEmail,
      correctionReason: reason,
    });
  } catch (err) {
    // If in demo mode, update local memory
    offlineAttendanceRecords = offlineAttendanceRecords.map((r) =>
      r.id === attendanceId
        ? {
            ...r,
            ...updates,
            updatedAt: now,
            updatedBy: adminEmail,
            correctionReason: reason,
          }
        : r
    );
  }
}

/**
 * Delete an attendance record (Admin only)
 */
export async function deleteAttendanceRecord(attendanceId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "attendance", attendanceId));
  } catch {
    offlineAttendanceRecords = offlineAttendanceRecords.filter((r) => r.id !== attendanceId);
  }
}

/**
 * Build the permanent QR attendance URL
 */
export function getPermanentAttendanceUrl(customDomain?: string): string {
  const base = customDomain?.trim() || (typeof window !== "undefined" ? window.location.origin : "");
  // Use clean query parameter routing which works on any hosting platform
  const cleanBase = base.replace(/\/+$/, "");
  return `${cleanBase}/?page=attendance`;
}

/**
 * Export attendance records to clean CSV file
 */
export function exportAttendanceToCSV(records: GymAttendance[], filename = "mahadev_gym_attendance.csv"): void {
  if (!records || records.length === 0) {
    alert("No attendance records to export.");
    return;
  }

  const headers = ["Member Name", "Member ID", "Date", "Day", "Session", "Time (IST)", "Method", "Status", "Notes"];
  const rows = records.map((r) => [
    `"${(r.memberName || "").replace(/"/g, '""')}"`,
    `"${r.memberId || ""}"`,
    `"${r.date || ""}"`,
    `"${r.dayOfWeek || getDayOfWeekIST(r.date)}"`,
    `"${r.session || ""}"`,
    `"${formatDateTimeIST(r.checkInTime)}"`,
    `"${r.type || "QR"}"`,
    `"${r.status || "Present"}"`,
    `"${(r.notes || r.correctionReason || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
