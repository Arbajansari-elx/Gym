import React from "react";
import { ArrowRight, MessageCircle, Flame, Dumbbell, UserCheck, Layers, BookOpen, Target, Sparkles, Calculator, LineChart, Camera, Award, Star, CreditCard, MapPin } from "lucide-react";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";
import { useNavigation } from "../context/NavigationContext";
import { PageId } from "../types/navigation";
import { Hero } from "../components/Hero";
import { WeeklyRoadmapFeature } from "../components/WeeklyRoadmapFeature";

export const HomePage: React.FC = () => {
  const { navigateTo } = useNavigation();

  const featureCards: {
    id: PageId;
    title: string;
    category: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accent?: boolean;
  }[] = [
    {
      id: "about",
      category: "Our Ethos",
      title: "Philosophy & Facility",
      description: "Discover our training standards, free-weight environment, and discipline-first approach.",
      icon: Dumbbell,
    },
    {
      id: "trainer",
      category: "Mentorship",
      title: "Head Coach Aditya Experts",
      description: "Direct 1-on-1 coaching profile, lifting philosophy, and biomechanics mastery.",
      icon: UserCheck,
      accent: true,
    },
    {
      id: "plans",
      category: "Roadmaps",
      title: "Workout Plans & Timetable",
      description: "Beginner, Intermediate, and Advanced splits with full weekly schedule routine.",
      icon: Layers,
    },
    {
      id: "exercises",
      category: "Biomechanics",
      title: "Exercise Library & Form Guide",
      description: "Detailed movement execution cues, common pitfalls to avoid, and video demos.",
      icon: BookOpen,
    },
    {
      id: "muscle-fatloss",
      category: "Physique Goals",
      title: "Muscle Building & Fat Loss",
      description: "Hypertrophy resistance pathways versus metabolic fat-loss conditioning.",
      icon: Target,
    },
    {
      id: "coaching",
      category: "Personal Training",
      title: "1-on-1 Coaching Packages",
      description: "Starter, Plus, and Dedicated Elite packages tailored for serious physique results.",
      icon: Sparkles,
      accent: true,
    },
    {
      id: "calculator",
      category: "Nutrition Tool",
      title: "Daily Calorie Calculator",
      description: "Interactive Mifflin–St Jeor formula calculating your BMR, TDEE, and macro targets.",
      icon: Calculator,
    },
    {
      id: "tracking",
      category: "Accountability",
      title: "Progress Tracking Methodology",
      description: "Measurable progression curves, 1RM overload tracking, and body composition logs.",
      icon: LineChart,
    },
    {
      id: "gallery",
      category: "Visual Arena",
      title: "8-Photo Gym Gallery Slider",
      description: "Autoplaying facility tour featuring our heavy dumbbell bay, racks, and turf.",
      icon: Camera,
    },
    {
      id: "transformations",
      category: "Authentic Results",
      title: "Transformation Framework",
      description: "Documented progress evolution principles with strict client permission policy.",
      icon: Award,
    },
    {
      id: "reviews",
      category: "Member Voices",
      title: "Community Reviews & Feedback",
      description: "Genuine member testimonials and open invitation to share your gym journey.",
      icon: Star,
    },
    {
      id: "membership",
      category: "Enrollment",
      title: "Membership Passes & Tiers",
      description: "Monthly, Quarterly, and Annual gym access passes with floor consultation.",
      icon: CreditCard,
    },
    {
      id: "contact",
      category: "Visit Us",
      title: "Location & WhatsApp Contact",
      description: "Google Maps directions link, facility timings, and validated enquiry form.",
      icon: MapPin,
      accent: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* 1. CINEMATIC HERO SECTION USING UPLOADED TRAINER PHOTOGRAPH */}
      <Hero />

      {/* 2. DEDICATED FULL-SCREEN FEATURE DIRECTORY */}
      <section className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 mb-2.5 text-[#FF6A00] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FULL WEBSITE NAVIGATION</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase mb-3">
            EXPLORE EVERY FEATURE <span className="text-[#FF6A00]">IN FULL SCREEN</span>
          </h2>
          <p className="text-[#A3A3A3] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Each section is built as its own complete, dedicated experience. Select any feature below to enter its full-screen view.
          </p>
        </div>

        {/* ======================================================== */}
        {/* BADA BOX: MONDAY TO SATURDAY WEEKLY PLAN & FULL ROADMAP  */}
        {/* MUSCLE GAIN KA ALAG & FAT LOSS KA ALAG                   */}
        {/* ======================================================== */}
        <div className="mb-14 sm:mb-18">
          <WeeklyRoadmapFeature />
        </div>

        {/* Feature Cards Grid - Refined iOS Glassmorphism & Precise Radiuses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => navigateTo(card.id)}
                className={`ios-glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer group active:scale-[0.99] ${
                  card.accent
                    ? "border-[#FF6A00]/60 shadow-[0_8px_30px_rgba(255,106,0,0.12)] hover:border-[#FF6A00]"
                    : "border-white/[0.08] hover:border-[#FF6A00]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    {/* Clean unboxed metadata kicker */}
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6A00]">
                      {card.category}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-black transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  <h3 className="font-athletic text-2xl font-bold text-white uppercase tracking-wide mb-2 group-hover:text-[#FF6A00] transition-colors leading-snug">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-[#E5E5E5] group-hover:text-[#FF6A00] uppercase tracking-wider">
                  <span>OPEN FULL SCREEN</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. COACH CALLOUT BANNER - Refined iOS Glassmorphism */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ios-glass rounded-2xl p-7 sm:p-10 border border-white/10 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-semibold text-[#FF6A00] uppercase tracking-wider block">
                PERSONAL COACHING
              </span>
              <h3 className="font-athletic text-2xl sm:text-3xl lg:text-4xl font-bold text-white uppercase leading-tight">
                READY TO TRAIN WITH <span className="shining-name">ADITYA EXPERTS</span>?
              </h3>
              <p className="text-xs sm:text-sm text-[#A3A3A3] max-w-xl leading-relaxed">
                Get individualized feedback on your squat, bench, and deadlift mechanics, plus tailored macronutrient guidance.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigateTo("trainer")}
                className="h-[44px] min-h-[44px] px-5 sm:px-6 text-[13px] font-semibold uppercase tracking-wider text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-md transition-colors cursor-pointer active:scale-95 inline-flex items-center justify-center"
              >
                VIEW COACH BIO
              </button>
              <a
                href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I am ready to start personal coaching at Mahadev Gym.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-join-shining h-[44px] min-h-[44px] px-5 sm:px-6 text-[13px] font-semibold uppercase tracking-wider text-white rounded-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-white relative z-10" />
                <span className="relative z-10">CHAT ON WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
