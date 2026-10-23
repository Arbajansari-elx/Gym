import React, { useState } from "react";
import { LineChart, Dumbbell, TrendingUp, Calendar, CheckSquare, MessageCircle, Info } from "lucide-react";
import { GYM_CONFIG, getWhatsAppUrl } from "../config/gymConfig";

export const ProgressTrackingPreview: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<"bench" | "squat" | "weight">("bench");

  // Illustrative tracking chart data
  const chartData = {
    bench: [
      { week: "W1", value: 50 },
      { week: "W4", value: 57.5 },
      { week: "W8", value: 65 },
      { week: "W12", value: 72.5 },
      { week: "W16", value: 80 },
    ],
    squat: [
      { week: "W1", value: 70 },
      { week: "W4", value: 82.5 },
      { week: "W8", value: 95 },
      { week: "W12", value: 105 },
      { week: "W16", value: 120 },
    ],
    weight: [
      { week: "W1", value: 84 },
      { week: "W4", value: 82.5 },
      { week: "W8", value: 80.8 },
      { week: "W12", value: 79.2 },
      { week: "W16", value: 77.5 },
    ],
  };

  const currentData = chartData[selectedMetric];
  const unit = selectedMetric === "weight" ? "kg" : "kg (1RM est.)";

  return (
    <section className="py-20 lg:py-28 bg-[#0B0B0B] relative border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Informational Column */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 mb-3 text-[#FF6A00] text-xs font-semibold tracking-widest uppercase">
              <TrendingUp className="w-4 h-4" />
              <span>MEASURABLE ACCOUNTABILITY</span>
            </div>
            <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-6 leading-tight">
              PROGRESS TRACKING <br />
              <span className="text-[#FF6A00]">& METRICS METHODOLOGY</span>
            </h2>
            <p className="text-[#B3B3B3] text-base leading-relaxed mb-6">
              Guesswork kills motivation. At Mahadev Gym Fitness, trainees are guided to systematically log and review measurable markers over time to ensure ongoing adaptations.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { title: "Strength & 1RM Overload", desc: "Weekly record of working sets, weight on the bar, and rep speed." },
                { title: "Key Body Girth Measurements", desc: "Periodic chest, arms, waist, and quad calipers for true recomp insight." },
                { title: "Workout Attendance Consistency", desc: "Building uninterrupted training habits week in and week out." },
                { title: "Milestone Goal Check-ins", desc: "Structured reviews with Coach Aditya to adjust volume and nutrition." },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#141414] border border-[#222]">
                  <CheckSquare className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h3>
                    <p className="text-xs text-[#999] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={getWhatsAppUrl(`Hello ${GYM_CONFIG.trainerName}, I saw the fitness tracking methodology on your website and would like to ask how you monitor member progress.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black bg-[#FF6A00] hover:bg-[#E55E00] rounded-md transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ASK ABOUT FITNESS TRACKING</span>
            </a>
          </div>

          {/* Decorative Sample Progress Chart Display */}
          <div className="lg:col-span-6 bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#242424] mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6A00]">
                  PUBLIC PREVIEW
                </span>
                <h3 className="font-athletic text-xl font-bold text-white uppercase">
                  ILLUSTRATIVE PROGRESSION LOG
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-[#1C1C1C] p-1 rounded-lg border border-[#2D2D2D]">
                <button
                  type="button"
                  onClick={() => setSelectedMetric("bench")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    selectedMetric === "bench" ? "bg-[#FF6A00] text-black" : "text-[#888] hover:text-white"
                  }`}
                >
                  Bench
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetric("squat")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    selectedMetric === "squat" ? "bg-[#FF6A00] text-black" : "text-[#888] hover:text-white"
                  }`}
                >
                  Squat
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetric("weight")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    selectedMetric === "weight" ? "bg-[#FF6A00] text-black" : "text-[#888] hover:text-white"
                  }`}
                >
                  Weight
                </button>
              </div>
            </div>

            {/* Simulated Chart Bars */}
            <div className="h-48 flex items-end justify-between gap-4 px-2 py-4 border-b border-[#242424]">
              {currentData.map((d, index) => {
                const maxVal = Math.max(...currentData.map((c) => c.value));
                const minVal = Math.min(...currentData.map((c) => c.value));
                const heightPercent = 35 + ((d.value - minVal) / (maxVal - minVal || 1)) * 55;

                return (
                  <div key={d.week} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-xs font-mono font-bold text-[#E0E0E0] tabular-nums opacity-90 group-hover:text-[#FF6A00]">
                      {d.value}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] bg-gradient-to-t from-[#262626] to-[#FF6A00] rounded-t transition-all group-hover:brightness-110"
                    />
                    <span className="text-[11px] font-mono text-[#888]">{d.week}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#888]">
              <span>Sample progression curve ({unit})</span>
              <span className="text-[#FF6A00] font-semibold">16-Week Illustrative Trend</span>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-[#181818] border border-[#222] flex items-center gap-2 text-[11px] text-[#777]">
              <Info className="w-3.5 h-3.5 text-[#FF6A00] shrink-0" />
              <span>Public preview only. Actual member logs are managed directly during 1-on-1 coaching consultations.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
