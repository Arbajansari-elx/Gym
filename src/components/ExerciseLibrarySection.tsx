import React, { useState } from "react";
import { Play, X, AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react";
import { EXERCISE_LIBRARY, ExerciseItem } from "../config/gymConfig";

export const ExerciseLibrarySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeExercise, setActiveExercise] = useState<ExerciseItem | null>(null);

  const categories = ["All", "Chest", "Legs", "Back", "Shoulders", "Arms", "Core"];

  const filteredExercises =
    selectedCategory === "All"
      ? EXERCISE_LIBRARY
      : EXERCISE_LIBRARY.filter((ex) => ex.category === selectedCategory);

  return (
    <section className="py-16 bg-[#FAF7F2] relative text-[#191919]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              <span>TECHNIQUE & BIOMECHANICS</span>
            </div>
            <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-[#191919] uppercase">
              EXERCISE INSTRUCTIONS <span className="text-[#D95D0F]">& FORM GUIDE</span>
            </h2>
            <p className="text-[#57534E] text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
              Prevent injury, optimize hypertrophy, and lift with absolute precision. Study fundamental movement executions below.
            </p>
          </div>

          {/* Category Filter Buttons (Claude Segmented Control) */}
          <div className="flex flex-wrap gap-1 p-1 bg-[#EFE9DF] border border-[#DFD6C9] rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#191919] text-white font-bold shadow-xs"
                    : "text-[#6B635B] hover:text-[#191919] hover:bg-[#E5DDD0]/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#D95D0F]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-[0_2px_12px_rgba(40,32,24,0.03)]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-[#D95D0F] font-bold tracking-wider uppercase">
                    {exercise.category}
                  </span>
                  <span className="text-[#6B635B] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5DFD5] text-[11px] font-medium">
                    {exercise.difficulty}
                  </span>
                </div>

                <h3 className="font-athletic text-xl font-bold text-[#191919] uppercase tracking-wide mb-2 group-hover:text-[#D95D0F] transition-colors">
                  {exercise.name}
                </h3>

                <p className="text-xs text-[#57534E] mb-4">
                  <strong className="text-[#191919]">Target:</strong> {exercise.targetMuscle}
                </p>

                {/* Form preview snippet */}
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA] text-xs text-[#44403C] space-y-1 mb-2">
                  <div className="font-semibold text-[11px] uppercase tracking-wide flex items-center gap-1.5 text-[#D95D0F]">
                    <Info className="w-3.5 h-3.5" />
                    <span>Key Form Cue</span>
                  </div>
                  <p className="line-clamp-2 text-[#57534E] leading-relaxed">{exercise.instructions[0]}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-[#FFFFFF] border-t border-[#ECE5DA]">
                <button
                  type="button"
                  onClick={() => setActiveExercise(exercise)}
                  className="w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white bg-[#191919] hover:bg-[#2A2A2A] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#FF8A33]" />
                  <span>VIEW TECHNIQUE GUIDE</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demonstration & Technique Breakdown Modal */}
      {activeExercise && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FFFFFF] border border-[#E5DFD5] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#191919]">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#ECE5DA] mb-6">
              <div>
                <span className="text-xs font-bold text-[#D95D0F] uppercase tracking-wider bg-[#F5ECE1] border border-[#EED7C4] px-2.5 py-1 rounded-md">
                  {activeExercise.category} • {activeExercise.difficulty}
                </span>
                <h3 className="font-athletic text-2xl sm:text-3xl font-bold text-[#191919] uppercase mt-2">
                  {activeExercise.name}
                </h3>
                <p className="text-xs text-[#6B635B] mt-1 font-medium">{activeExercise.targetMuscle}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveExercise(null)}
                className="p-2 text-[#78716C] hover:text-[#191919] rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DF] transition-colors border border-[#E5DFD5] cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Demonstration Area */}
            <div className="rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E5DFD5] aspect-video w-full mb-6 relative flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5ECE1] border border-[#EED7C4] flex items-center justify-center text-[#D95D0F] mb-3 shadow-sm">
                <Play className="w-7 h-7 fill-[#D95D0F] ml-1" />
              </div>
              <span className="text-sm font-bold text-[#191919] uppercase tracking-wider">
                Coach Demonstration: {activeExercise.name}
              </span>
              <span className="text-xs text-[#6B635B] mt-1 max-w-md">
                Demonstrated under Aditya Experts supervision. Master safe joint angles before increasing training load.
              </span>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-5 mb-6">
              <div>
                <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D95D0F]" />
                  <span>Execution Checklist</span>
                </h4>
                <ol className="space-y-2 text-xs text-[#44403C]">
                  {activeExercise.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#D95D0F] font-bold font-mono">0{idx + 1}.</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Common Mistakes */}
              <div className="p-4 rounded-xl bg-[#FEF3EB] border border-[#FCD9BD]">
                <h4 className="text-xs font-bold text-[#C2410C] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#C2410C]" />
                  <span>Common Pitfalls to Avoid</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-[#9A3412]">
                  {activeExercise.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#C2410C] font-bold">×</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Tip */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA] text-xs text-[#57534E]">
                <strong className="text-[#191919]">Coach Aditya's Pro Tip:</strong> {activeExercise.proTip}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-[#ECE5DA]">
              <button
                type="button"
                onClick={() => setActiveExercise(null)}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D95D0F] hover:bg-[#C2410C] rounded-xl cursor-pointer shadow-sm transition-all"
              >
                GOT IT, CLOSE GUIDE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
