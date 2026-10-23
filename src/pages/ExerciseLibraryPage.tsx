import React from "react";
import { PageBanner } from "../components/PageBanner";
import { ExerciseLibrarySection } from "../components/ExerciseLibrarySection";
import { useNavigation } from "../context/NavigationContext";

export const ExerciseLibraryPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="BIOMECHANICS DIRECTORY"
        title="EXERCISE LIBRARY &"
        titleAccent="FORM GUIDE"
        subtitle="Master the precise mechanics of compound and isolation lifts. Study step-by-step cues, avoid common training pitfalls, and view video demonstrations."
        customAction={{
          label: "EXPLORE WORKOUT PLANS",
          onClick: () => navigateTo("plans"),
        }}
      />

      <div className="py-6">
        <ExerciseLibrarySection />
      </div>
    </div>
  );
};
