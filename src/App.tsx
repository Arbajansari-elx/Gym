/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { FloatingBackButton } from "./components/FloatingBackButton";
import { IOSLoadingScreen } from "./components/IOSLoadingScreen";

// Dedicated Full-Screen Feature Pages
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { TrainerPage } from "./pages/TrainerPage";
import { WorkoutPlansPage } from "./pages/WorkoutPlansPage";
import { ExerciseLibraryPage } from "./pages/ExerciseLibraryPage";
import { MuscleFatLossPage } from "./pages/MuscleFatLossPage";
import { CoachingPage } from "./pages/CoachingPage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { TrackingPage } from "./pages/TrackingPage";
import { GalleryPage } from "./pages/GalleryPage";
import { TransformationsPage } from "./pages/TransformationsPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { MembershipPage } from "./pages/MembershipPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminPage } from "./pages/AdminPage";
import { AttendancePage } from "./pages/AttendancePage";
import { JoinNowModal } from "./components/JoinNowModal";

const PageRouter: React.FC = () => {
  const { currentPage } = useNavigation();

  switch (currentPage) {
    case "admin":
      return <AdminPage />;
    case "attendance":
      return <AttendancePage />;
    case "about":
      return <AboutPage />;
    case "trainer":
      return <TrainerPage />;
    case "plans":
      return <WorkoutPlansPage />;
    case "exercises":
      return <ExerciseLibraryPage />;
    case "muscle-fatloss":
      return <MuscleFatLossPage />;
    case "coaching":
      return <CoachingPage />;
    case "calculator":
      return <CalculatorPage />;
    case "tracking":
      return <TrackingPage />;
    case "gallery":
      return <GalleryPage />;
    case "transformations":
      return <TransformationsPage />;
    case "reviews":
      return <ReviewsPage />;
    case "membership":
      return <MembershipPage />;
    case "contact":
      return <ContactPage />;
    case "home":
    default:
      return <HomePage />;
  }
};

const AppContent: React.FC = () => {
  const { currentPage } = useNavigation();
  const [showLoadingScreen, setShowLoadingScreen] = React.useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);

  const handleLoadingComplete = React.useCallback(() => {
    // Dismiss loading screen permanently - never force redirect or kick user off their current page
    setShowLoadingScreen(false);
  }, []);

  React.useEffect(() => {
    const handleOpenJoinModal = () => setIsJoinModalOpen(true);
    window.addEventListener("open-join-modal", handleOpenJoinModal);
    return () => window.removeEventListener("open-join-modal", handleOpenJoinModal);
  }, []);

  // When on the admin dashboard, render full-screen Admin command center
  if (currentPage === "admin") {
    return <AdminPage />;
  }

  // When on the gate attendance page, render dedicated kiosk view
  if (currentPage === "attendance") {
    return <AttendancePage />;
  }

  const isClaudeTheme = currentPage !== "home";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isClaudeTheme
          ? "bg-[#FAF7F2] text-[#191919] selection:bg-[#D95D0F] selection:text-white"
          : "bg-[#0B0B0B] text-white selection:bg-[#FF6A00] selection:text-black"
      }`}
    >
      {/* Apple iOS Loading Screen: Shows only once on initial launch, then fully unmounts */}
      {showLoadingScreen && (
        <IOSLoadingScreen duration={2000} onComplete={handleLoadingComplete} />
      )}

      {/* Sticky Global Header with Back button & page switcher */}
      <Header />

      {/* Dynamic Full-Screen Page Display */}
      <main className="flex-grow">
        <PageRouter />
      </main>

      {/* Theme-Adaptive Footer with Back to Home button */}
      <Footer />

      {/* Floating Back Button when inside a subpage */}
      <FloatingBackButton />

      {/* Persistent Floating WhatsApp Call-to-Action */}
      <FloatingWhatsApp />

      {/* Public Join Now Enquiry Modal */}
      <JoinNowModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
