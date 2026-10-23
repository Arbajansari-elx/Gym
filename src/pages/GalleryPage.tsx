import React from "react";
import { PageBanner } from "../components/PageBanner";
import { GymGallery } from "../components/GymGallery";
import { useNavigation } from "../context/NavigationContext";

export const GalleryPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="FACILITY TOUR"
        title="MAHADEV GYM"
        titleAccent="PREMIUM PHOTO GALLERY"
        subtitle="Full facility photographic showcase. Inspect our heavy-duty power racks, Olympic barbell platforms, dumbbells up to 50kg, and conditioning turf."
        customAction={{
          label: "SCHEDULE FACILITY VISIT",
          onClick: () => navigateTo("contact"),
        }}
      />

      <div className="py-6">
        <GymGallery />
      </div>
    </div>
  );
};
