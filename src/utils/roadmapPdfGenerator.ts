import { jsPDF } from "jspdf";

export interface ExerciseItem {
  name: string;
  setsReps: string;
  notes: string;
}

export interface DaySchedule {
  dayName: string;
  shortDay: string;
  title: string;
  focus: string;
  duration: string;
  exercises: ExerciseItem[];
  coachTip: string;
}

export interface NutritionDirective {
  protein: string;
  calories: string;
  hydration: string;
  sleep: string;
  notes: string;
}

export interface RoadmapPDFOptions {
  planType: "muscle-gain" | "fat-loss";
  schedule: Record<string, DaySchedule>;
  daysOrder?: string[];
}

export function generateRoadmapPDF(options: RoadmapPDFOptions): void {
  const { planType, schedule } = options;
  const isMuscleGain = planType === "muscle-gain";

  const planTitle = isMuscleGain
    ? "MUSCLE GAIN HYPERTROPHY ROADMAP"
    : "FAT LOSS METABOLIC SHRED ROADMAP";

  const planSubtitle = isMuscleGain
    ? "Official Monday to Saturday Progressive Overload & Hypertrophy Blueprint"
    : "Official Monday to Saturday High-Density EPOC & Metabolic Shred Blueprint";

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182 mm
  const maxY = pageHeight - 18; // bottom margin limit

  let currentY = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > maxY) {
      doc.addPage();
      currentY = 16;
      drawCompactPageHeader();
    }
  };

  const drawCompactPageHeader = () => {
    doc.setFillColor(248, 245, 239); // Claude cream
    doc.rect(marginX, currentY, contentWidth, 10, "F");
    doc.setDrawColor(229, 223, 213);
    doc.line(marginX, currentY + 10, marginX + contentWidth, currentY + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(24, 24, 27);
    doc.text("MAHADEV GYM FITNESS", marginX + 3, currentY + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(115, 107, 99);
    doc.text(
      `ROADMAP: ${planTitle} • COACH ADITYA EXPERTS`,
      marginX + 55,
      currentY + 6.5
    );

    currentY += 14;
  };

  // ==========================================
  // PAGE 1: HERO EXECUTIVE BANNER (CLAUDE-INSPIRED PALETTE)
  // ==========================================
  // Top decorative bar
  doc.setFillColor(217, 93, 15); // Warm terracotta orange
  doc.rect(marginX, currentY, contentWidth, 3, "F");
  currentY += 3;

  // Header Box
  doc.setFillColor(28, 25, 23); // Deep Charcoal Black
  doc.rect(marginX, currentY, contentWidth, 32, "F");

  // Gym Name & Badge
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 138, 51); // Soft vibrant orange
  doc.text("MAHADEV GYM FITNESS  •  COACH ADITYA EXPERTS", marginX + 6, currentY + 7);

  // Main Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(planTitle, marginX + 6, currentY + 16);

  // Tagline & Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(214, 211, 209);
  doc.text(planSubtitle, marginX + 6, currentY + 23);

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(168, 162, 158);
  doc.text(`Official Protocol • Issued: ${formattedDate}`, marginX + 6, currentY + 28.5);

  currentY += 36;

  // ==========================================
  // NUTRITION & RECOVERY PROTOCOL BOX
  // ==========================================
  doc.setFillColor(251, 248, 243); // Cream box
  doc.setDrawColor(229, 223, 213);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, currentY, contentWidth, 23, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(217, 93, 15);
  doc.text("COACH ADITYA'S NUTRITION & RECOVERY DIRECTIVE", marginX + 4, currentY + 5.5);

  const colW = contentWidth / 4;
  const metrics = isMuscleGain
    ? [
        { label: "DAILY PROTEIN", val: "2.0g / kg Bodyweight" },
        { label: "CALORIC INTAKE", val: "+350 kcal Lean Surplus" },
        { label: "DAILY WATER", val: "3.5 - 4.0 Liters" },
        { label: "SLEEP & RECOVERY", val: "7.5 - 8.5 Hours Deep" },
      ]
    : [
        { label: "DAILY PROTEIN", val: "2.2g / kg Bodyweight" },
        { label: "CALORIC INTAKE", val: "-450 kcal Deficit" },
        { label: "DAILY WATER", val: "4.0 Liters Daily" },
        { label: "SLEEP & RECOVERY", val: "7.5 - 8.0 Hours Deep" },
      ];

  metrics.forEach((m, idx) => {
    const mx = marginX + 4 + idx * colW;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(115, 107, 99);
    doc.text(m.label, mx, currentY + 11.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(24, 24, 27);
    doc.text(m.val, mx, currentY + 17.5);
  });

  currentY += 27;

  // ==========================================
  // 12-WEEK PROGRESSION ROADMAP TIMELINE
  // ==========================================
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 223, 213);
  doc.roundedRect(marginX, currentY, contentWidth, 19, 2, 2, "FD");

  const phaseW = contentWidth / 3;
  const phases = isMuscleGain
    ? [
        { phase: "PHASE 1 (WEEKS 1-4)", tag: "BASE LOCK", desc: "Technique lock, tendon conditioning & baseline RPE." },
        { phase: "PHASE 2 (WEEKS 5-8)", tag: "VOLUME OVERLOAD", desc: "Load progression (+2.5kg to 5kg), density sets." },
        { phase: "PHASE 3 (WEEKS 9-12)", tag: "PEAK RESULTS", desc: "Peak mechanical tension, myofibrillar expansion." },
      ]
    : [
        { phase: "PHASE 1 (WEEKS 1-4)", tag: "METABOLIC ADAPT", desc: "Calorie deficit adaptation, HIIT work capacity." },
        { phase: "PHASE 2 (WEEKS 5-8)", tag: "FAT OXIDATION", desc: "EPOC acceleration, glycogen depletion, vascularity." },
        { phase: "PHASE 3 (WEEKS 9-12)", tag: "PEAK SHRED", desc: "Stubborn fat mobilization & razor-sharp definition." },
      ];

  phases.forEach((p, idx) => {
    const px = marginX + 4 + idx * phaseW;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(24, 24, 27);
    doc.text(p.phase, px, currentY + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(217, 93, 15);
    doc.text(`[${p.tag}]`, px + 40, currentY + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(87, 83, 78);
    const splitDesc = doc.splitTextToSize(p.desc, phaseW - 6);
    doc.text(splitDesc, px, currentY + 10.5);
  });

  currentY += 24;

  // ==========================================
  // DAY-BY-DAY DETAILED SCHEDULES (MON - SAT + SUN)
  // ==========================================
  const daysKeys = options.daysOrder || ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  daysKeys.forEach((key) => {
    const day = schedule[key];
    if (!day) return;

    // Approximate height needed: header banner (11mm) + exercises table (~6mm per exercise) + coach tip (10mm) + margins (6mm)
    const exerciseCount = day.exercises.length;
    const estimatedHeight = 12 + exerciseCount * 6.5 + 13 + 6;

    checkPageBreak(estimatedHeight > 90 ? 45 : estimatedHeight);

    // DAY HEADER STRIP
    doc.setFillColor(245, 240, 232); // Claude warm ivory tone
    doc.setDrawColor(229, 223, 213);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, currentY, contentWidth, 9, 1.5, 1.5, "FD");

    // Left accent pill
    doc.setFillColor(217, 93, 15);
    doc.rect(marginX + 2, currentY + 1.8, 2.5, 5.4, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(24, 24, 27);
    doc.text(
      `${day.dayName.toUpperCase()}  —  ${day.title.toUpperCase()}`,
      marginX + 7,
      currentY + 6
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(115, 107, 99);
    doc.text(`Duration: ${day.duration} | Focus: ${day.focus}`, marginX + contentWidth - 3, currentY + 6, {
      align: "right",
    });

    currentY += 10.5;

    // EXERCISES TABLE HEADER
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 223, 213);
    doc.rect(marginX, currentY, contentWidth, 5.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(115, 107, 99);
    doc.text("#", marginX + 3, currentY + 4);
    doc.text("EXERCISE NAME", marginX + 11, currentY + 4);
    doc.text("TARGET SETS × REPS", marginX + 85, currentY + 4);
    doc.text("EXECUTION & TEMPO DIRECTIVE", marginX + 130, currentY + 4);

    currentY += 5.5;

    // EXERCISES ROWS
    day.exercises.forEach((ex, exIdx) => {
      checkPageBreak(8);

      const isEven = exIdx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 251, isEven ? 255 : 248, isEven ? 255 : 243);
      doc.setDrawColor(235, 230, 222);
      doc.rect(marginX, currentY, contentWidth, 6.2, "FD");

      // Number badge
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(217, 93, 15);
      doc.text(`${exIdx + 1}`, marginX + 3.5, currentY + 4.3);

      // Exercise Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.8);
      doc.setTextColor(24, 24, 27);
      doc.text(doc.splitTextToSize(ex.name, 72)[0] || ex.name, marginX + 11, currentY + 4.3);

      // Sets & Reps
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(194, 65, 12);
      doc.text(ex.setsReps, marginX + 85, currentY + 4.3);

      // Notes
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(87, 83, 78);
      doc.text(doc.splitTextToSize(ex.notes, 50)[0] || ex.notes, marginX + 130, currentY + 4.3);

      currentY += 6.2;
    });

    // COACH TIP CALLOUT
    checkPageBreak(11);
    doc.setFillColor(254, 243, 235); // light warm peach/orange tint
    doc.setDrawColor(245, 196, 163);
    doc.roundedRect(marginX, currentY + 1, contentWidth, 7.5, 1, 1, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(194, 65, 12);
    doc.text("COACH ADITYA DIRECTIVE:", marginX + 3, currentY + 5.5);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.8);
    doc.setTextColor(68, 64, 60);
    doc.text(
      `"${doc.splitTextToSize(day.coachTip, contentWidth - 48)[0]}"`,
      marginX + 45,
      currentY + 5.5
    );

    currentY += 12;
  });

  // ==========================================
  // FINAL PAGE CONTACT & PROTOCOL SIGN-OFF
  // ==========================================
  checkPageBreak(25);
  doc.setFillColor(28, 25, 23);
  doc.roundedRect(marginX, currentY, contentWidth, 20, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 138, 51);
  doc.text("MAHADEV GYM FITNESS — PERSONAL COACHING & FORM CHECKS", marginX + 5, currentY + 6.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(231, 229, 228);
  doc.text(
    "Need personalized adjustments, injury rehab, or weekly progress evaluations? Contact Coach Aditya Experts directly.",
    marginX + 5,
    currentY + 12
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("WhatsApp / Call: +91 98765 43210  •  Location: Main Gym Floor, Opp. Central Park", marginX + 5, currentY + 16.5);

  currentY += 24;

  // ==========================================
  // FOOTER WITH DYNAMIC TOTAL PAGES
  // ==========================================
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Bottom border rule
    doc.setDrawColor(229, 223, 213);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 11, marginX + contentWidth, pageHeight - 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 113, 108);
    doc.text("Mahadev Gym Fitness • Coach Aditya Experts • Official Training Blueprint", marginX, pageHeight - 7);

    doc.setFont("helvetica", "bold");
    doc.text(`Page ${i} of ${totalPages}`, marginX + contentWidth, pageHeight - 7, {
      align: "right",
    });
  }

  // Trigger browser download
  const sanitizedFilename = `Mahadev_Gym_${isMuscleGain ? "Muscle_Gain" : "Fat_Loss"}_Weekly_Roadmap.pdf`;
  doc.save(sanitizedFilename);
}
