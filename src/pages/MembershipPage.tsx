import React from "react";
import { PageBanner } from "../components/PageBanner";
import { MembershipSection } from "../components/MembershipSection";
import { useNavigation } from "../context/NavigationContext";

export const MembershipPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="GYM ACCESS PASSES"
        title="MEMBERSHIP TIERS &"
        titleAccent="ENROLLMENT"
        subtitle="Choose from Monthly, Quarterly, or Annual membership access. Complete floor access, free-weights, functional conditioning zone, and coach consultation."
        customAction={{
          label: "CONTACT FOR PRICING",
          onClick: () => navigateTo("contact"),
        }}
      />

      <div className="py-6">
        <MembershipSection />
      </div>
    </div>
  );
};
