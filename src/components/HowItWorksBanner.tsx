"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/audio";
import { BookOpen, Zap, Trophy, X, Compass, CheckCircle2 } from "lucide-react";

export const HowItWorksBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("educhain_how_it_works_dismissed");
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    sound.playClick();
    setIsDismissed(true);
    localStorage.setItem("educhain_how_it_works_dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <div className="relative mb-8 p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-neutral-50/70 dark:bg-[#0c0c0e] shadow-sm dark:shadow-none animate-in fade-in duration-300">
      
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        title="Dismiss guide"
        className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1 rounded bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
          <Compass className="w-3.5 h-3.5" />
        </span>
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
          How EduChain Works • 3 Quick Steps
        </h2>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Step 1 */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 flex items-center justify-center font-mono font-semibold text-xs shrink-0">
            01
          </div>
          <div>
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">
              Pick Your Subject
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
              Choose Math, Science, English, or CS. Each track progresses independently at your own pace.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 flex items-center justify-center font-mono font-semibold text-xs shrink-0">
            02
          </div>
          <div>
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">
              Conquer 5 Questions
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
              Beat the 20s timer! Score 70% or higher to master the stage and link to the next challenge.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 flex items-center justify-center font-mono font-semibold text-xs shrink-0">
            03
          </div>
          <div>
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">
              Rank Up & Review Errors
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
              Earn XP for scholar ranks. Any questions you miss are waiting in the Mistake Forge to practice!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
