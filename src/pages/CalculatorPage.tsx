import React from "react";
import { PageBanner } from "../components/PageBanner";
import { CalorieCalculator } from "../components/CalorieCalculator";
import { useNavigation } from "../context/NavigationContext";

export const CalculatorPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="NUTRITIONAL BLUEPRINT"
        title="INTERACTIVE DAILY"
        titleAccent="CALORIE CALCULATOR"
        subtitle="Estimate your Resting Metabolic Rate (BMR) and daily maintenance energy expenditure (TDEE) based on recognized exercise physiology formulas."
        customAction={{
          label: "EXPLORE WORKOUT PLANS",
          onClick: () => navigateTo("plans"),
        }}
      />

      <div className="py-6">
        <CalorieCalculator />
      </div>
    </div>
  );
};
