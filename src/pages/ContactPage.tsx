import React from "react";
import { PageBanner } from "../components/PageBanner";
import { LocationSection } from "../components/LocationSection";
import { ContactSection } from "../components/ContactSection";
import { useNavigation } from "../context/NavigationContext";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";

export const ContactPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="DIRECT ACCESS"
        title="FACILITY LOCATION &"
        titleAccent="CONTACT"
        subtitle={`Reach out directly to Head Coach ${GYM_CONFIG.trainerName}, get instant GPS directions to our gym location via Google Maps, or send a detailed training enquiry.`}
        customAction={{
          label: "CHAT ON WHATSAPP",
          onClick: () =>
            window.open(
              getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I am contacting you from the Mahadev Gym Fitness contact page.`),
              "_blank"
            ),
        }}
      />

      <div className="py-6 space-y-6">
        <LocationSection />
        <ContactSection />
      </div>
    </div>
  );
};
