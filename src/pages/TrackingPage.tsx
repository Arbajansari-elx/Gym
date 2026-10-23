import React from "react";
import { PageBanner } from "../components/PageBanner";
import { ProgressTrackingPreview } from "../components/ProgressTrackingPreview";
import { useNavigation } from "../context/NavigationContext";

export const TrackingPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="MEASURABLE STANDARDS"
        title="PROGRESS TRACKING"
        titleAccent="METHODOLOGY"
        subtitle="Learn how we track 1RM strength progression, body composition metrics, and weekly consistency to ensure continuous physical adaptations without stagnation."
        customAction={{
          label: "ASK COACH ABOUT TRACKING",
          onClick: () => navigateTo("trainer"),
        }}
      />

      <div className="py-6">
        <ProgressTrackingPreview />
      </div>
    </div>
  );
};
