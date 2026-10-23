import React, { useState } from "react";
import { Sparkles, ShieldCheck, ArrowRight, Eye, CheckCircle2 } from "lucide-react";
import { SAMPLE_TRANSFORMATIONS } from "../config/gymConfig";

export const TransformationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section className="py-20 lg:py-28 bg-[#0F0F0F] relative border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-[#FF6A00] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            <span>PROGRESS & PHYSIQUE EVOLUTION</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-4">
            TRANSFORMATION <span className="text-[#FF6A00]">METHODOLOGY</span>
          </h2>
          <p className="text-[#B3B3B3] text-base sm:text-lg">
            Real progress is built on time, structured overload, and nutritional consistency. Explore our framework for sustainable physique changes.
          </p>
        </div>

        {/* Transformation Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {SAMPLE_TRANSFORMATIONS.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#141414] border border-[#262626] hover:border-[#FF6A00]/40 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
            >
              {/* Graphic Comparison Viewport */}
              <div className="relative aspect-[4/3] w-full bg-[#181818] p-4 flex items-center justify-between gap-3 border-b border-[#242424]">
                {/* Phase 1: Baseline */}
                <div className="flex-1 h-full bg-[#1F1F1F] rounded-lg border border-[#333] flex flex-col items-center justify-center p-3 text-center relative overflow-hidden group-hover:border-[#555] transition-colors">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#888] mb-1">
                    STARTING PHASE
                  </div>
                  <div className="font-athletic text-lg font-bold text-[#AAA] uppercase">
                    Week 01
                  </div>
                  <div className="text-[10px] text-[#777] mt-1">Form Baseline</div>
                  <div className="w-8 h-[2px] bg-[#444] mt-3" />
                </div>

                {/* Arrow Divider */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#242424] border border-[#3A3A3A] flex items-center justify-center text-[#FF6A00] shadow">
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Phase 2: Result */}
                <div className="flex-1 h-full bg-[#201A16] rounded-lg border border-[#FF6A00]/40 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF6A00] mb-1">
                    TARGET PHASE
                  </div>
                  <div className="font-athletic text-lg font-bold text-white uppercase">
                    {item.timeline}
                  </div>
                  <div className="text-[10px] text-[#CCC] mt-1">Refined V-Taper</div>
                  <div className="w-8 h-[2px] bg-[#FF6A00] mt-3" />
                </div>
              </div>

              {/* Information */}
              <div className="p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A00] block mb-1">
                  {item.focus}
                </span>
                <h3 className="font-athletic text-xl font-bold text-white uppercase tracking-wide mb-2">
                  {item.label}
                </h3>
                <p className="text-xs text-[#999999] leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="p-2.5 rounded bg-[#181818] border border-[#222] text-[11px] text-[#777] italic">
                  {item.note}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ethics & Authorization Statement */}
        <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] max-w-3xl mx-auto flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#FF6A00] shrink-0 mt-0.5" />
          <p className="text-xs text-[#888] leading-relaxed">
            <strong className="text-white">Authenticity Guarantee:</strong> Mahadev Gym Fitness strictly displays verified member transformations only with documented client authorization. We do not use deceptive before-and-after digital alterations.
          </p>
        </div>
      </div>
    </section>
  );
};
