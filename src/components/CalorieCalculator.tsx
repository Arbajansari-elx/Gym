import React, { useState } from "react";
import { Calculator, RotateCcw, AlertCircle, Sparkles, Apple, Activity } from "lucide-react";

export const CalorieCalculator: React.FC = () => {
  const [age, setAge] = useState<string>("25");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [heightCm, setHeightCm] = useState<string>("175");
  const [weightKg, setWeightKg] = useState<string>("75");
  const [activity, setActivity] = useState<string>("1.55"); // moderate default
  const [goal, setGoal] = useState<"maintain" | "fat_loss" | "muscle_gain">("maintain");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    targetCaloriesMin: number;
    targetCaloriesMax: number;
    recommendedTarget: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  } | null>(null);

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    const numAge = parseFloat(age);
    const numHeight = parseFloat(heightCm);
    const numWeight = parseFloat(weightKg);
    const numActivity = parseFloat(activity);

    if (isNaN(numAge) || numAge < 14 || numAge > 85) {
      newErrors.age = "Please enter an age between 14 and 85.";
    }
    if (isNaN(numHeight) || numHeight < 120 || numHeight > 230) {
      newErrors.height = "Please enter a valid height between 120 and 230 cm.";
    }
    if (isNaN(numWeight) || numWeight < 35 || numWeight > 220) {
      newErrors.weight = "Please enter a valid body weight between 35 and 220 kg.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Mifflin-St Jeor Formula
    let bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge;
    if (sex === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = Math.round(bmr * numActivity);

    let targetMin = tdee;
    let targetMax = tdee;
    let recommended = tdee;

    if (goal === "fat_loss") {
      targetMin = Math.round(tdee - 500);
      targetMax = Math.round(tdee - 300);
      recommended = Math.round(tdee - 400);
    } else if (goal === "muscle_gain") {
      targetMin = Math.round(tdee + 250);
      targetMax = Math.round(tdee + 450);
      recommended = Math.round(tdee + 350);
    }

    // Macro approximation: Protein ~ 2.0g/kg bodyweight, Fat ~ 25% of calories, Carbs remainder
    const proteinGrams = Math.round(numWeight * 2.0);
    const proteinCalories = proteinGrams * 4;
    const fatCalories = recommended * 0.25;
    const fatGrams = Math.round(fatCalories / 9);
    const carbsCalories = Math.max(0, recommended - (proteinCalories + fatCalories));
    const carbsGrams = Math.round(carbsCalories / 4);

    setResult({
      bmr: Math.round(bmr),
      tdee,
      targetCaloriesMin: targetMin,
      targetCaloriesMax: targetMax,
      recommendedTarget: recommended,
      proteinGrams,
      carbsGrams,
      fatGrams,
    });
  };

  const handleReset = () => {
    setAge("25");
    setSex("male");
    setHeightCm("175");
    setWeightKg("75");
    setActivity("1.55");
    setGoal("maintain");
    setErrors({});
    setResult(null);
  };

  return (
    <section className="py-16 bg-[#FAF7F2] relative text-[#191919]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
            <Calculator className="w-4 h-4" />
            <span>NUTRITION CALCULATOR</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-[#191919] uppercase mb-4">
            ESTIMATE YOUR <span className="text-[#D95D0F]">DAILY CALORIE NEEDS</span>
          </h2>
          <p className="text-[#57534E] text-base sm:text-lg leading-relaxed">
            Calculate your approximate Resting Metabolic Rate (BMR) and daily maintenance calories based on the recognized Mifflin–St Jeor formula.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(40,32,24,0.04)]">
            <form onSubmit={calculateCalories} className="space-y-5">
              {/* Sex selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-2">
                  Biological Sex
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSex("male")}
                    className={`py-2.5 px-4 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      sex === "male"
                        ? "bg-[#191919] text-white border-[#191919] shadow-xs"
                        : "bg-[#FAF7F2] text-[#57534E] border-[#E5DFD5] hover:border-[#D5CABE]"
                    }`}
                  >
                    MALE
                  </button>
                  <button
                    type="button"
                    onClick={() => setSex("female")}
                    className={`py-2.5 px-4 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      sex === "female"
                        ? "bg-[#191919] text-white border-[#191919] shadow-xs"
                        : "bg-[#FAF7F2] text-[#57534E] border-[#E5DFD5] hover:border-[#D5CABE]"
                    }`}
                  >
                    FEMALE
                  </button>
                </div>
              </div>

              {/* Age, Height, Weight inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="calc-age" className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-1.5">
                    Age (Years)
                  </label>
                  <input
                    id="calc-age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl text-[#191919] text-sm focus:border-[#D95D0F] focus:outline-none focus:ring-2 focus:ring-[#D95D0F]/15 transition-all shadow-2xs"
                    placeholder="25"
                    min="14"
                    max="90"
                  />
                  {errors.age && <p className="text-[11px] text-[#DC2626] mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label htmlFor="calc-height" className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-1.5">
                    Height (CM)
                  </label>
                  <input
                    id="calc-height"
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl text-[#191919] text-sm focus:border-[#D95D0F] focus:outline-none focus:ring-2 focus:ring-[#D95D0F]/15 transition-all shadow-2xs"
                    placeholder="175"
                    min="120"
                    max="230"
                  />
                  {errors.height && <p className="text-[11px] text-[#DC2626] mt-1">{errors.height}</p>}
                </div>

                <div>
                  <label htmlFor="calc-weight" className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-1.5">
                    Weight (KG)
                  </label>
                  <input
                    id="calc-weight"
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl text-[#191919] text-sm focus:border-[#D95D0F] focus:outline-none focus:ring-2 focus:ring-[#D95D0F]/15 transition-all shadow-2xs"
                    placeholder="75"
                    min="35"
                    max="220"
                  />
                  {errors.weight && <p className="text-[11px] text-[#DC2626] mt-1">{errors.weight}</p>}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label htmlFor="calc-activity" className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-1.5">
                  Activity Level
                </label>
                <select
                  id="calc-activity"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl text-[#191919] text-sm focus:border-[#D95D0F] focus:outline-none focus:ring-2 focus:ring-[#D95D0F]/15 transition-all shadow-2xs cursor-pointer"
                >
                  <option value="1.2">Sedentary (Little or no workout)</option>
                  <option value="1.375">Light Activity (Gym 1–3 days/week)</option>
                  <option value="1.55">Moderate Activity (Gym 3–5 days/week)</option>
                  <option value="1.725">Heavy Training (Hard workout 6–7 days/week)</option>
                  <option value="1.9">Extremely High Activity (Athlete / Physical job)</option>
                </select>
              </div>

              {/* Goal Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B635B] mb-2">
                  Primary Fitness Target
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "fat_loss", label: "Fat Loss (Deficit)" },
                    { id: "maintain", label: "Maintain Weight" },
                    { id: "muscle_gain", label: "Muscle Gain (Surplus)" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id as any)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        goal === g.id
                          ? "bg-[#191919] text-white border-[#191919] shadow-xs"
                          : "bg-[#FAF7F2] text-[#57534E] border-[#E5DFD5] hover:text-[#191919] hover:bg-[#EFE9DF]"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit & Reset actions */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#D95D0F] hover:bg-[#C2410C] rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  CALCULATE ESTIMATED CALORIES
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 text-[#6B635B] hover:text-[#191919] bg-[#FAF7F2] hover:bg-[#EFE9DF] rounded-xl border border-[#E5DFD5] transition-colors cursor-pointer"
                  title="Reset inputs"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_4px_24px_rgba(40,32,24,0.04)]">
            {result ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#D95D0F] flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    ESTIMATED DAILY REQUIREMENTS
                  </span>
                  <div className="font-athletic text-4xl sm:text-5xl font-bold text-[#191919] tabular-nums">
                    {result.recommendedTarget}{" "}
                    <span className="text-lg text-[#D95D0F] font-sans font-semibold">kcal/day</span>
                  </div>
                  <p className="text-xs text-[#6B635B] mt-1 font-medium">
                    Target Range: {result.targetCaloriesMin} – {result.targetCaloriesMax} kcal
                  </p>
                </div>

                {/* Metric breakdown cards */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA]">
                    <div className="text-[11px] text-[#78716C] uppercase font-semibold">Resting BMR</div>
                    <div className="font-athletic text-2xl font-bold text-[#191919] tabular-nums mt-0.5">
                      {result.bmr} <span className="text-xs font-normal text-[#78716C]">kcal</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA]">
                    <div className="text-[11px] text-[#78716C] uppercase font-semibold">Maintenance TDEE</div>
                    <div className="font-athletic text-2xl font-bold text-[#191919] tabular-nums mt-0.5">
                      {result.tdee} <span className="text-xs font-normal text-[#78716C]">kcal</span>
                    </div>
                  </div>
                </div>

                {/* Illustrative Macronutrient Split */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE5DA]">
                  <div className="text-xs font-bold text-[#191919] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Apple className="w-4 h-4 text-[#D95D0F]" />
                    <span>Illustrative Macro Targets</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E5DFD5]">
                      <div className="text-[10px] text-[#78716C] uppercase font-semibold">Protein</div>
                      <div className="text-sm font-bold text-[#191919] tabular-nums mt-0.5">{result.proteinGrams}g</div>
                      <div className="text-[9px] text-[#D95D0F] font-bold">High recovery</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E5DFD5]">
                      <div className="text-[10px] text-[#78716C] uppercase font-semibold">Carbs</div>
                      <div className="text-sm font-bold text-[#191919] tabular-nums mt-0.5">{result.carbsGrams}g</div>
                      <div className="text-[9px] text-[#78716C]">Energy fuel</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E5DFD5]">
                      <div className="text-[10px] text-[#78716C] uppercase font-semibold">Fats</div>
                      <div className="text-sm font-bold text-[#191919] tabular-nums mt-0.5">{result.fatGrams}g</div>
                      <div className="text-[9px] text-[#78716C]">Hormonal health</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD5] flex items-center justify-center text-[#D95D0F] mb-4">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="font-athletic text-xl font-bold text-[#191919] uppercase">
                  Awaiting Your Parameters
                </h4>
                <p className="text-xs text-[#6B635B] max-w-xs mt-1 leading-relaxed">
                  Enter your age, measurements, and daily activity level, then tap calculate to view your estimated caloric blueprint.
                </p>
              </div>
            )}

            {/* Medical / Estimation Disclaimer */}
            <div className="mt-6 pt-4 border-t border-[#ECE5DA] flex items-start gap-2.5 text-[11px] text-[#78716C] leading-relaxed">
              <AlertCircle className="w-4 h-4 text-[#D95D0F] shrink-0 mt-0.5" />
              <p>
                Calculations are approximations using the Mifflin-St Jeor formula and do not constitute clinical or medical guidance. Individual metabolic rates vary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
