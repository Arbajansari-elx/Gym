import React from "react";
import { PageBanner } from "../components/PageBanner";
import { MessageCircle, CheckCircle2, Award, Sparkles, ChevronRight } from "lucide-react";
import { GymImage } from "../components/GymImage";
import { GYM_CONFIG, getWhatsAppUrl, TRAINER_HERO_IMAGE } from "../config/gymConfig";
import { useNavigation } from "../context/NavigationContext";

export const TrainerPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  const guidancePillars = [
    {
      title: "Biomechanical Form & Safety",
      description: "Every movement is adjusted to your skeletal leverage and joint mobility, preventing chronic wear and maximizing muscle fiber recruitment.",
    },
    {
      title: "Progressive Overload Blueprint",
      description: "Systematic progression tracking ensuring your lifts and stamina continue advancing every week rather than hitting frustrating plateaus.",
    },
    {
      title: "Nutritional Realism",
      description: "No extreme starvation diets. Practical, sustainable caloric and protein protocols aligned with your daily schedule and fitness objective.",
    },
    {
      title: "Accountability & Mental Grit",
      description: "Direct mentorship to build regular gym consistency, develop lifting confidence, and maintain discipline through every phase.",
    },
  ];

  const coachingOfferings = [
    {
      title: "Squat, Bench & Deadlift Biomechanics",
      desc: "Detailed bar path review, stance calibration, and bracing mechanics for maximal power output and spinal safety.",
    },
    {
      title: "Physique Hypertrophy & Symmetry",
      desc: "Balancing muscle proportions, target isolation exercises, and deliberate eccentric control.",
    },
    {
      title: "Metabolic Fat-Loss Conditioning",
      desc: "Preserving hard-earned muscle mass during calorie deficits while optimizing cardiovascular conditioning.",
    },
    {
      title: "Joint Mobility & Active Recovery",
      desc: "Pre-hab routines, hip and shoulder opening protocols, and injury prevention strategies.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="HEAD COACH PROFILE"
        title="TRAIN WITH"
        titleAccent={GYM_CONFIG.trainerName.toUpperCase()}
        subtitle="Direct personal mentorship, uncompromising focus on biomechanical safety, and systematic progression designed to unlock your ultimate strength."
        customAction={{
          label: "CONNECT ON WHATSAPP",
          onClick: () =>
            window.open(
              getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I would like to consult with you regarding personal coaching at Mahadev Gym Fitness.`),
              "_blank"
            ),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-20">
        {/* Coach Profile Card & Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#E5DFD5] shadow-[0_16px_45px_rgba(40,32,24,0.08)]">
              <div className="aspect-[3/4] w-full bg-[#EDE6DC]">
                <GymImage
                  src={TRAINER_HERO_IMAGE}
                  alt={`Coach ${GYM_CONFIG.trainerName} - Head Trainer`}
                  theme="trainer"
                  overlay={false}
                  className="w-full h-full object-cover object-[72%_20%]"
                />
              </div>

              <div className="p-6 bg-[#FFFFFF] border-t border-[#E8E2D8]">
                <div className="inline-block px-2.5 py-1 bg-[#F5ECE1] border border-[#EED7C4] text-[#D95D0F] text-xs font-bold uppercase rounded mb-2 tracking-wider">
                  HEAD TRAINER
                </div>
                <h2 className="font-athletic text-3xl font-bold uppercase tracking-wide text-[#191919]">
                  {GYM_CONFIG.trainerName}
                </h2>
                <p className="text-xs text-[#6B635B] mt-1 font-medium">
                  Personal Training & Physique Conditioning Specialist
                </p>
              </div>
            </div>
          </div>

          {/* Bio & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              <span>YOUR GOALS. THE RIGHT GUIDANCE.</span>
            </div>

            <h2 className="font-athletic text-3xl sm:text-5xl font-bold text-[#191919] uppercase leading-tight">
              COMMITTED TO YOUR <span className="text-[#D95D0F]">STRENGTH.</span>
            </h2>

            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5DFD5] shadow-[0_4px_24px_rgba(40,32,24,0.03)]">
              <div className="flex items-center gap-2 text-[#D95D0F] font-bold text-sm uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>Coach Philosophy</span>
              </div>
              <p className="text-sm text-[#44403C] leading-relaxed italic">
                "Fitness is not an accidental outcome—it is an exact discipline. My approach centers on teaching trainees how to execute movements with surgical accuracy, push intensity safely, and build habits that last for life. There are no shortcuts; there is only honest work and smart execution."
              </p>
            </div>

            <p className="text-sm text-[#57534E] leading-relaxed">
              Every lifter has unique bone leverage, joint mobility, and recovery capacity. Rather than forcing trainees into generic workout routines, Coach Aditya tailors movement patterns to match individual anatomy, ensuring steady gains without chronic joint distress.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I want to speak with you regarding personal coaching at Mahadev Gym Fitness.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D95D0F] hover:bg-[#C2410C] rounded-xl shadow-sm flex items-center gap-2 active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CONNECT WITH ADITYA</span>
              </a>

              <button
                type="button"
                onClick={() => navigateTo("coaching")}
                className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#191919] bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <span>VIEW COACHING PACKAGES</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D95D0F]" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-athletic text-3xl sm:text-4xl font-bold text-[#191919] uppercase mb-2">
              CORE COACHING PILLARS
            </h3>
            <p className="text-xs sm:text-sm text-[#6B635B]">
              The foundations that guide every personal training session at Mahadev Gym Fitness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidancePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#D95D0F]/50 transition-all shadow-[0_2px_12px_rgba(40,32,24,0.03)]"
              >
                <div className="flex items-center gap-2.5 mb-3 text-[#191919] font-bold text-base uppercase">
                  <CheckCircle2 className="w-5 h-5 text-[#D95D0F] shrink-0" />
                  <span>{pillar.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Offerings list */}
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] p-8 sm:p-12 shadow-[0_4px_24px_rgba(40,32,24,0.03)]">
          <h3 className="font-athletic text-2xl sm:text-3xl font-bold text-[#191919] uppercase mb-6">
            AREAS OF SPECIALIZED CONSULTATION
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coachingOfferings.map((off, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8]">
                <div className="text-xs font-bold text-[#D95D0F] uppercase tracking-wider mb-2">
                  Focus 0{idx + 1}
                </div>
                <h4 className="text-sm font-bold text-[#191919] uppercase mb-2">{off.title}</h4>
                <p className="text-xs text-[#6B635B] leading-relaxed">{off.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
