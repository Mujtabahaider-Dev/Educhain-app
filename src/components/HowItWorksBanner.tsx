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
    <div className="relative mb-8 p-6 rounded-2xl border border-sky-500/20 dark:border-white/10 bg-gradient-to-r from-sky-50/80 via-white to-sky-50/40 dark:from-[#0c1424] dark:via-[#080d18] dark:to-[#050912] shadow-sm dark:shadow-none animate-in fade-in duration-300">
      
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
        <span className="p-1 rounded bg-sky-500/10 text-sky-600 dark:text-cyan-400">
          <Compass className="w-4 h-4" />
        </span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-sky-700 dark:text-cyan-400 font-mono">
          How EduChain Works • 3 Quick Steps
        </h2>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Step 1 */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-cyan-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            1
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              Pick Your Subject
            </h3>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
              Choose Math, Science, English, or CS. Each track progresses independently at your own pace.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            2
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              Conquer 5 Questions
            </h3>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
              Beat the 20s timer! Score 70% or higher to master the stage and link to the next challenge.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            3
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              Rank Up & Review Errors
            </h3>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
              Earn XP for scholar ranks. Any questions you miss are waiting in the Mistake Forge to practice!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
