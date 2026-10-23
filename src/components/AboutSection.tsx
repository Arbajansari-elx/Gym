import React from "react";
import { Dumbbell, Target, ShieldCheck, Zap } from "lucide-react";
import { GymImage } from "./GymImage";

export const AboutSection: React.FC = () => {
  const highlights = [
    {
      id: "strength",
      title: "1. Strength Training",
      desc: "Mastering fundamental barbell, dumbbell, and machine compound movements with uncompromising technique to build resilient raw power.",
      icon: Dumbbell,
    },
    {
      id: "conditioning",
      title: "2. Fitness & Conditioning",
      desc: "High-density functional training, stamina development, and metabolic endurance tailored to elevate athletic performance and cardiovascular health.",
      icon: Zap,
    },
    {
      id: "goals",
      title: "3. Goal-Oriented Workouts",
      desc: "Structured training splits designed around specific hypertrophy and fat-loss targets rather than random, ineffective gym sessions.",
      icon: Target,
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#0F0F0F] relative border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Gym Facility Visual */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#141414] aspect-[4/3] sm:aspect-[16/11] shadow-2xl">
              <GymImage
                alt="Mahadev Gym Fitness Training Arena"
                theme="facility"
                overlay={true}
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3.5 py-1.5 rounded border border-[#333] text-xs font-semibold text-[#FF6A00] tracking-wider uppercase">
                TRAINING PHILOSOPHY
              </div>
            </div>
            
            {/* Quote strip below image */}
            <div className="mt-4 p-4 rounded-lg bg-[#161616] border border-[#242424] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#FF6A00] shrink-0 mt-0.5" />
              <p className="text-xs text-[#B3B3B3] leading-relaxed">
                "Real transformation is not built in a weekend—it is earned repetition by repetition, session by session, with persistent discipline."
              </p>
            </div>
          </div>

          {/* Text and Philosophy */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-3 text-[#FF6A00] text-xs font-semibold tracking-widest uppercase">
              <span className="w-6 h-[2px] bg-[#FF6A00]" />
              <span>WHO WE ARE</span>
            </div>

            <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-6 leading-tight">
              MORE THAN A GYM. <br className="hidden sm:inline" />
              <span className="text-[#FF6A00]">A STRONGER LIFESTYLE.</span>
            </h2>

            <div className="space-y-4 text-[#B3B3B3] text-base leading-relaxed mb-8">
              <p>
                At Mahadev Gym Fitness, training is more than an occasional routine—it is a commitment to mental focus, physical strength, and long-term vitality. We believe every individual has the capacity to build a resilient physique when provided with proper exercise technique and progressive structure.
              </p>
              <p>
                Whether your target is building lean muscle, dropping body fat, or developing athletic conditioning, we eliminate guesswork. Our atmosphere fosters serious dedication without ego, ensuring every lifter trains safely, effectively, and with clear purpose.
              </p>
            </div>

            {/* Three Visual Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highlights.map((h) => {
                const IconComponent = h.icon;
                return (
                  <div
                    key={h.id}
                    className="p-4 rounded-lg bg-[#181818] border border-[#242424] hover:border-[#FF6A00]/50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded bg-[#202020] flex items-center justify-center text-[#FF6A00] mb-3 group-hover:bg-[#FF6A00] group-hover:text-black transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1.5">
                      {h.title}
                    </h3>
                    <p className="text-xs text-[#999999] leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
