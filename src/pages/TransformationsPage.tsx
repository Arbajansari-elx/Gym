import React from "react";
import { PageBanner } from "../components/PageBanner";
import { TransformationSection } from "../components/TransformationSection";
import { useNavigation } from "../context/NavigationContext";

export const TransformationsPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="EVIDENCE-BASED RESULTS"
        title="TRANSFORMATION"
        titleAccent="FRAMEWORK"
        subtitle="Explore our phased physique progression methodology. We emphasize honest training timelines, sustained nutritional habits, and authorized client journeys."
        customAction={{
          label: "START YOUR TRANSFORMATION",
          onClick: () => navigateTo("coaching"),
        }}
      />

      <div className="py-6">
        <TransformationSection />
      </div>
    </div>
  );
};
