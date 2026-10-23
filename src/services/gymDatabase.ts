import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "../lib/firebase";

export interface GymEnquiry {
  id?: string;
  name: string;
  phone: string;
  session: "Morning" | "Evening" | "Any";
  timeSlot: string;
  message?: string;
  status: "Pending" | "Contacted" | "Converted" | "Dropped";
  createdAt: string;
  notes?: string;
}

export interface GymMember {
  id?: string;
  memberId: string;
  name: string;
  phone: string;
  email?: string;
  gender: "Male" | "Female" | "Other";
  age?: number;
  emergencyPhone?: string;
  bloodGroup?: string;
  session: "Morning" | "Evening";
  timeSlot: string;
  planId?: string;
  planName: string;
  startDate: string;
  endDate: string;
  fee: number;
  paidAmount: number;
  pendingAmount: number;
  status: "Active" | "Expired" | "Frozen";
  photoUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GymAttendance {
  id?: string;
  memberDocId: string;
  memberId: string;
  memberName: string;
  session: "Morning" | "Evening";
  checkInTime: string;
  date: string; // YYYY-MM-DD
  dayOfWeek?: string;
  type?: "Manual" | "QR" | "Biometric";
  status?: "Present" | "Absent" | "Excused";
  notes?: string;
  correctionReason?: string;
  correctedBy?: string;
  correctedAt?: string;
  markedAt?: string;
}

export interface GymPayment {
  id?: string;
  invoiceNumber: string;
  memberDocId?: string;
  memberName: string;
  memberPhone?: string;
  amount: number;
  paymentMethod: "UPI" | "Cash" | "Card" | "NetBanking";
  paymentDate: string;
  planName: string;
  notes?: string;
  receivedBy?: string;
}

export interface GymEquipment {
  id?: string;
  name: string;
  category: "Strength" | "Cardio" | "FreeWeights" | "CableMachines" | "Accessories";
  quantity: number;
  status: "Working" | "Needs Repair" | "Under Maintenance";
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
}

export interface GymPlan {
  id?: string;
  name: string;
  durationMonths: number;
  price: number;
  features?: string;
  isPopular?: boolean;
}

// -------------------------------------------------------------
// ENQUIRIES SERVICE
// -------------------------------------------------------------
export async function createPublicEnquiry(enquiry: Omit<GymEnquiry, "id">): Promise<string> {
  const path = "enquiries";
  try {
    const docRef = await addDoc(collection(db, path), enquiry);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToEnquiries(
  onUpdate: (enquiries: GymEnquiry[]) => void,
  onError?: (error: Error) => void
) {
  if (!auth.currentUser) {
    return () => {};
  }
  const path = "enquiries";
  try {
    const q = query(collection(db, path), orderBy("createdAt", "desc"), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: GymEnquiry[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GymEnquiry, "id">),
        }));
        onUpdate(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateEnquiryStatus(
  id: string,
  status: GymEnquiry["status"],
  notes?: string
) {
  const path = `enquiries/${id}`;
  try {
    const updateData: Record<string, any> = { status };
    if (notes !== undefined) updateData.notes = notes;
    await updateDoc(doc(db, "enquiries", id), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// -------------------------------------------------------------
// MEMBERS SERVICE
// -------------------------------------------------------------
export function subscribeToMembers(
  onUpdate: (members: GymMember[]) => void,
  onError?: (error: Error) => void
) {
  if (!auth.currentUser) {
    return () => {};
  }
  const path = "members";
  try {
    const q = query(collection(db, path), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: GymMember[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GymMember, "id">),
        }));
        onUpdate(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function addMember(member: Omit<GymMember, "id">): Promise<string> {
  const path = "members";
  try {
    const docRef = await addDoc(collection(db, path), member);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateMember(id: string, data: Partial<GymMember>): Promise<void> {
  const path = `members/${id}`;
  try {
    await updateDoc(doc(db, "members", id), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteMember(id: string): Promise<void> {
  const path = `members/${id}`;
  try {
    await deleteDoc(doc(db, "members", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// ATTENDANCE SERVICE
// -------------------------------------------------------------
export function subscribeToAttendance(
  onUpdate: (records: GymAttendance[]) => void,
  onError?: (error: Error) => void
) {
  if (!auth.currentUser) {
    return () => {};
  }
  const path = "attendance";
  try {
    const q = query(collection(db, path), orderBy("checkInTime", "desc"), limit(200));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: GymAttendance[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GymAttendance, "id">),
        }));
        onUpdate(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function recordCheckIn(attendance: Omit<GymAttendance, "id">): Promise<string> {
  const path = "attendance";
  try {
    const docRef = await addDoc(collection(db, path), attendance);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// -------------------------------------------------------------
// PAYMENTS SERVICE
// -------------------------------------------------------------
export function subscribeToPayments(
  onUpdate: (payments: GymPayment[]) => void,
  onError?: (error: Error) => void
) {
  if (!auth.currentUser) {
    return () => {};
  }
  const path = "payments";
  try {
    const q = query(collection(db, path), orderBy("paymentDate", "desc"), limit(200));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: GymPayment[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GymPayment, "id">),
        }));
        onUpdate(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function recordPayment(payment: Omit<GymPayment, "id">): Promise<string> {
  const path = "payments";
  try {
    const docRef = await addDoc(collection(db, path), payment);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// -------------------------------------------------------------
// EQUIPMENT SERVICE
// -------------------------------------------------------------
export function subscribeToEquipment(
  onUpdate: (equipment: GymEquipment[]) => void,
  onError?: (error: Error) => void
) {
  if (!auth.currentUser) {
    return () => {};
  }
  const path = "equipment";
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: GymEquipment[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GymEquipment, "id">),
        }));
        onUpdate(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function addEquipment(item: Omit<GymEquipment, "id">): Promise<string> {
  const path = "equipment";
  try {
    const docRef = await addDoc(collection(db, path), item);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateEquipment(id: string, item: Partial<GymEquipment>): Promise<void> {
  const path = `equipment/${id}`;
  try {
    await updateDoc(doc(db, "equipment", id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// -------------------------------------------------------------
// SAMPLE INITIAL DATASETS (Used for seeding & offline demo mode)
// -------------------------------------------------------------
export const INITIAL_MEMBERS: Omit<GymMember, "id">[] = [
  {
    memberId: "MG-101",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@gmail.com",
    gender: "Male",
    age: 26,
    bloodGroup: "B+",
    session: "Morning",
    timeSlot: "06:00 AM - 07:30 AM",
    planName: "Quarterly Pro (3 Months)",
    startDate: "2025-01-10",
    endDate: "2025-04-10",
    fee: 3800,
    paidAmount: 3800,
    pendingAmount: 0,
    status: "Active",
    notes: "Focus on hypertrophy and chest strength",
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    memberId: "MG-102",
    name: "Pooja Verma",
    phone: "+91 98223 11450",
    email: "pooja.v@outlook.com",
    gender: "Female",
    age: 24,
    bloodGroup: "O+",
    session: "Morning",
    timeSlot: "07:30 AM - 09:00 AM",
    planName: "Annual Elite (12 Months)",
    startDate: "2025-02-01",
    endDate: "2026-02-01",
    fee: 11500,
    paidAmount: 11500,
    pendingAmount: 0,
    status: "Active",
    notes: "General conditioning and functional weight training",
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    memberId: "MG-103",
    name: "Amit Rawat",
    phone: "+91 97112 55990",
    email: "amit.rawat@yahoo.com",
    gender: "Male",
    age: 31,
    bloodGroup: "A+",
    session: "Evening",
    timeSlot: "06:30 PM - 08:00 PM",
    planName: "Monthly Standard",
    startDate: "2025-02-15",
    endDate: "2025-03-15",
    fee: 1500,
    paidAmount: 1000,
    pendingAmount: 500,
    status: "Active",
    notes: "Pending fee ₹500 to be cleared on next visit",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    memberId: "MG-104",
    name: "Vikram Chauhan",
    phone: "+91 98990 44321",
    email: "vikram.power@gmail.com",
    gender: "Male",
    age: 28,
    bloodGroup: "AB+",
    session: "Evening",
    timeSlot: "08:00 PM - 09:30 PM",
    planName: "Half-Yearly (6 Months)",
    startDate: "2024-09-01",
    endDate: "2025-03-01",
    fee: 6500,
    paidAmount: 6500,
    pendingAmount: 0,
    status: "Active",
    notes: "Membership expiring soon, renewed for next quarter",
    createdAt: new Date(Date.now() - 160 * 86400000).toISOString(),
  },
  {
    memberId: "MG-105",
    name: "Sneha Patil",
    phone: "+91 96541 22889",
    email: "sneha.patil@gmail.com",
    gender: "Female",
    age: 29,
    bloodGroup: "B+",
    session: "Morning",
    timeSlot: "06:30 AM - 08:00 AM",
    planName: "Monthly Standard",
    startDate: "2025-01-05",
    endDate: "2025-02-05",
    fee: 1500,
    paidAmount: 1500,
    pendingAmount: 0,
    status: "Expired",
    notes: "Membership expired, renewal follow-up pending",
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
  },
];

export const INITIAL_EQUIPMENT: Omit<GymEquipment, "id">[] = [
  {
    name: "Olympic Flat Bench Press & Barbell Set",
    category: "Strength",
    quantity: 3,
    status: "Working",
    lastMaintenanceDate: "2025-02-10",
    nextMaintenanceDate: "2025-05-10",
    notes: "Heavy duty commercial frames, collars inspected",
  },
  {
    name: "Power Rack & Squat Cage",
    category: "Strength",
    quantity: 2,
    status: "Working",
    lastMaintenanceDate: "2025-01-20",
    nextMaintenanceDate: "2025-04-20",
    notes: "Safety pins in pristine condition",
  },
  {
    name: "Commercial Treadmill (Pro 5.0 HP)",
    category: "Cardio",
    quantity: 4,
    status: "Working",
    lastMaintenanceDate: "2025-02-15",
    nextMaintenanceDate: "2025-04-15",
    notes: "Belt aligned and lubricated",
  },
  {
    name: "Dual Adjustable Cable Crossover",
    category: "CableMachines",
    quantity: 1,
    status: "Working",
    lastMaintenanceDate: "2025-01-15",
    nextMaintenanceDate: "2025-04-15",
    notes: "Steel aircraft cables checked",
  },
  {
    name: "Leg Press / Hack Squat 45-Degree Combo",
    category: "Strength",
    quantity: 1,
    status: "Working",
    lastMaintenanceDate: "2025-02-01",
    nextMaintenanceDate: "2025-05-01",
    notes: "Smooth linear bearings",
  },
  {
    name: "Rubber Hex Dumbbell Set (2.5kg to 40kg)",
    category: "FreeWeights",
    quantity: 2,
    status: "Working",
    lastMaintenanceDate: "2025-02-01",
    nextMaintenanceDate: "2025-08-01",
    notes: "Solid cast iron encased in premium rubber",
  },
];

export const INITIAL_PAYMENTS: Omit<GymPayment, "id">[] = [
  {
    invoiceNumber: "INV-2025-001",
    memberName: "Rahul Sharma",
    memberPhone: "+91 98765 43210",
    amount: 3800,
    paymentMethod: "UPI",
    paymentDate: new Date(Date.now() - 45 * 86400000).toISOString(),
    planName: "Quarterly Pro (3 Months)",
    receivedBy: "Coach Aditya",
    notes: "Google Pay confirmed",
  },
  {
    invoiceNumber: "INV-2025-002",
    memberName: "Pooja Verma",
    memberPhone: "+91 98223 11450",
    amount: 11500,
    paymentMethod: "NetBanking",
    paymentDate: new Date(Date.now() - 25 * 86400000).toISOString(),
    planName: "Annual Elite (12 Months)",
    receivedBy: "Coach Aditya",
    notes: "Bank transfer",
  },
  {
    invoiceNumber: "INV-2025-003",
    memberName: "Amit Rawat",
    memberPhone: "+91 97112 55990",
    amount: 1000,
    paymentMethod: "Cash",
    paymentDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    planName: "Monthly Standard",
    receivedBy: "Coach Aditya",
    notes: "Partial payment; balance ₹500 pending",
  },
  {
    invoiceNumber: "INV-2025-004",
    memberName: "Vikram Chauhan",
    memberPhone: "+91 98990 44321",
    amount: 6500,
    paymentMethod: "UPI",
    paymentDate: new Date().toISOString(),
    planName: "Half-Yearly Renewal",
    receivedBy: "Coach Aditya",
    notes: "PhonePe payment",
  },
];

export const INITIAL_ENQUIRIES: Omit<GymEnquiry, "id">[] = [
  {
    name: "Deepak Mehra",
    phone: "+91 98112 99011",
    session: "Evening",
    timeSlot: "07:00 PM - 08:30 PM",
    message: "Looking for weight gain and muscle building program.",
    status: "Pending",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    name: "Karan Johar",
    phone: "+91 98770 12345",
    session: "Morning",
    timeSlot: "06:00 AM - 07:30 AM",
    message: "Enquiring about personal training rates.",
    status: "Contacted",
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    notes: "Spoke on phone, visiting gym tomorrow morning.",
  },
];

export const INITIAL_ATTENDANCE: Omit<GymAttendance, "id">[] = [
  {
    memberDocId: "seed-1",
    memberId: "MG-101",
    memberName: "Rahul Sharma",
    session: "Morning",
    checkInTime: new Date(Date.now() - 4 * 3600000).toISOString(),
    date: new Date().toISOString().split("T")[0],
    type: "Manual",
  },
  {
    memberDocId: "seed-2",
    memberId: "MG-102",
    memberName: "Pooja Verma",
    session: "Morning",
    checkInTime: new Date(Date.now() - 3 * 3600000).toISOString(),
    date: new Date().toISOString().split("T")[0],
    type: "Manual",
  },
];

// -------------------------------------------------------------
// SEEDING SERVICE (Generates realistic Mahadev Gym initial records in Firestore)
// -------------------------------------------------------------
export async function seedInitialGymDataIfEmpty(): Promise<{ seeded: boolean; message: string }> {
  if (!auth.currentUser) {
    return {
      seeded: false,
      message: "Please sign in with your admin Google account first to seed cloud database.",
    };
  }

  try {
    const membersSnap = await getDocs(collection(db, "members"));
    if (!membersSnap.empty) {
      return { seeded: false, message: "Database already contains records." };
    }

    for (const mem of INITIAL_MEMBERS) {
      await addDoc(collection(db, "members"), mem);
    }

    for (const eq of INITIAL_EQUIPMENT) {
      await addDoc(collection(db, "equipment"), eq);
    }

    for (const p of INITIAL_PAYMENTS) {
      await addDoc(collection(db, "payments"), p);
    }

    for (const enq of INITIAL_ENQUIRIES) {
      await addDoc(collection(db, "enquiries"), enq);
    }

    for (const att of INITIAL_ATTENDANCE) {
      await addDoc(collection(db, "attendance"), att);
    }

    return { seeded: true, message: "Sample gym records seeded successfully in Firestore!" };
  } catch (error) {
    console.error("Seeding error:", error);
    return { seeded: false, message: "Error seeding data: " + String(error) };
  }
}
