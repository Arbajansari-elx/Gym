import React from "react";
import { MessageCircle, CheckCircle2, Award, Sparkles } from "lucide-react";
import { GYM_CONFIG, getWhatsAppUrl, TRAINER_HERO_IMAGE } from "../config/gymConfig";
import { useNavigation } from "../context/NavigationContext";
import { GymImage } from "./GymImage";

export const TrainerSection: React.FC = () => {
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

  return (
    <section id="training" className="py-20 lg:py-28 bg-[#0B0B0B] relative">
      {/* Background glow accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF6A00]/06 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-[#FF6A00] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            <span>HEAD COACH PROFILE</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-4">
            YOUR GOALS. <span className="text-[#FF6A00]">THE RIGHT GUIDANCE.</span>
          </h2>
          <p className="text-[#B3B3B3] text-base sm:text-lg">
            Train under direct supervision with individualized attention to lifting mechanics, structured progression, and relentless discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Trainer Portrait Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#2D2D2D] bg-[#161616] shadow-2xl group">
              <div className="aspect-[3/4] w-full">
                <GymImage
                  src={TRAINER_HERO_IMAGE}
                  alt="Coach Aditya Experts - Mahadev Gym Fitness Head Trainer"
                  theme="trainer"
                  overlay={true}
                  className="w-full h-full object-cover object-[72%_20%]"
                />
              </div>

              {/* Coach Badge Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="inline-block px-2.5 py-1 bg-[#FF6A00] text-black text-xs font-bold uppercase rounded mb-2 tracking-wider">
                  HEAD TRAINER
                </div>
                <h3 className="font-athletic text-2xl sm:text-3xl font-bold uppercase tracking-wide shining-name">
                  {GYM_CONFIG.trainerName}
                </h3>
                <p className="text-xs text-[#CCCCCC] mt-1">
                  Personal Training & Physique Conditioning Specialist
                </p>
              </div>
            </div>
          </div>

          {/* Trainer Bio, Philosophy & Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] mb-8">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FF6A00]" />
                <span>Training Philosophy</span>
              </h4>
              <p className="text-sm text-[#B3B3B3] leading-relaxed">
                "Fitness is not an accidental outcome—it is an exact discipline. My approach centers on teaching trainees how to execute movements with surgical accuracy, push intensity safely, and build habits that last for life. There are no shortcuts; there is only honest work and smart execution."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {guidancePillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="p-4 rounded-lg bg-[#141414] border border-[#222222] hover:border-[#333333] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2 text-white font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0" />
                    <span>{pillar.title}</span>
                  </div>
                  <p className="text-xs text-[#999999] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I would like to enquire about Personal Coaching at Mahadev Gym Fitness.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider text-black bg-[#FF6A00] hover:bg-[#E55E00] rounded-md transition-all shadow-[0_4px_20px_rgba(255,106,0,0.35)] hover:shadow-[0_6px_25px_rgba(255,106,0,0.5)] active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>CONNECT WITH ADITYA</span>
              </a>

              <button
                type="button"
                onClick={() => navigateTo("coaching")}
                className="inline-flex items-center justify-center px-6 py-4 text-sm font-semibold uppercase tracking-wider text-[#CCCCCC] hover:text-white bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] rounded-md transition-colors cursor-pointer"
              >
                VIEW COACHING PACKAGES
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
