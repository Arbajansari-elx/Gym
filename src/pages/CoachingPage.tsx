import React from "react";
import { PageBanner } from "../components/PageBanner";
import { CoachingPackagesSection } from "../components/CoachingPackagesSection";
import { useNavigation } from "../context/NavigationContext";
import { GYM_CONFIG } from "../config/gymConfig";

export const CoachingPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="DIRECT MENTORSHIP"
        title="ONE-TO-ONE"
        titleAccent="PERSONAL COACHING"
        subtitle={`Partner directly with ${GYM_CONFIG.trainerName} for hands-on technique evaluation, weekly progressive overload supervision, and customized nutrition protocols.`}
        customAction={{
          label: "MEET COACH ADITYA",
          onClick: () => navigateTo("trainer"),
        }}
      />

      <div className="py-6">
        <CoachingPackagesSection />
      </div>
    </div>
  );
};
