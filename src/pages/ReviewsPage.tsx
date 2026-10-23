import React from "react";
import { PageBanner } from "../components/PageBanner";
import { ReviewsSection } from "../components/ReviewsSection";
import { useNavigation } from "../context/NavigationContext";

export const ReviewsPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="AUTHENTIC VOICES"
        title="MEMBER REVIEWS &"
        titleAccent="TESTIMONIALS"
        subtitle="We strictly publish genuine feedback from verified members with explicit permission. Read about our community and share your experience directly with Coach Aditya."
        customAction={{
          label: "VISIT GYM FACILITY",
          onClick: () => navigateTo("contact"),
        }}
      />

      <div className="py-6">
        <ReviewsSection />
      </div>
    </div>
  );
};
