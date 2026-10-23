import React from "react";
import { PageBanner } from "../components/PageBanner";
import { MuscleFatLossSection } from "../components/MuscleFatLossSection";
import { useNavigation } from "../context/NavigationContext";

export const MuscleFatLossPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="PHYSIQUE PATHWAYS"
        title="MUSCLE BUILDING &"
        titleAccent="FAT LOSS"
        subtitle="Compare evidence-based principles for lean muscle hypertrophy versus sustainable metabolic fat-loss conditioning. Choose your focus and execute."
        customAction={{
          label: "CHECK CALORIE TARGETS",
          onClick: () => navigateTo("calculator"),
        }}
      />

      <div className="py-6">
        <MuscleFatLossSection />
      </div>
    </div>
  );
};
