import React from "react";
import { PageBanner } from "../components/PageBanner";
import { WorkoutPlansSection } from "../components/WorkoutPlansSection";
import { useNavigation } from "../context/NavigationContext";

export const WorkoutPlansPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="TRAINING ROADMAPS"
        title="WORKOUT & FITNESS"
        titleAccent="PLANS"
        subtitle="Structured weekly splits designed for every training milestone—from initial technique mastery to advanced competitive hypertrophy and power."
        customAction={{
          label: "CALCULATE CALORIES",
          onClick: () => navigateTo("calculator"),
        }}
      />

      <div className="py-6">
        <WorkoutPlansSection />
      </div>
    </div>
  );
};
