"use client";

import React from "react";
import { Stage, SubjectType } from "@/types/curriculum";
import { SUBJECT_METADATA } from "@/data/constants";
import { useEduStore } from "@/store/useEduStore";
import { sound } from "@/lib/audio";
import { Play, Sparkles, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";

interface NextQuestHeroProps {
  stages: Stage[];
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  onStartStage: (stage: Stage) => void;
}

export const NextQuestHero: React.FC<NextQuestHeroProps> = ({
  stages,
  selectedSubject,
  onSelectSubject,
  onStartStage,
}) => {
  const { completedStages, unlockedStages, subjectProgress } = useEduStore();

  // Find the student's next recommended stage:
  // First unlocked stage that is not yet completed
  const nextStage = stages.find((s) => {
    const isUnlocked = unlockedStages.includes(s.id);
    const isCompleted = completedStages.includes(s.id);
    return isUnlocked && !isCompleted;
  }) || stages[0];

  const nextMeta = nextStage?.subject ? SUBJECT_METADATA[nextStage.subject] : SUBJECT_METADATA.mathematics;

  const handleStartNext = () => {
    if (!nextStage) return;
    sound.playClick();
    onStartStage(nextStage);
  };

  const subjectsList: SubjectType[] = ["mathematics", "science", "english", "computer_science"];

  return (
    <div className="space-y-6 mb-10">
      
      {/* 1. Hero Next Recommended Quest Card */}
      {nextStage && (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-6 sm:p-8 shadow-sm dark:shadow-none transition-all hover:border-neutral-300 dark:hover:border-white/20">
          
          {/* Subtle gradient backdrop */}
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none -mr-20 -mt-20"
            style={{ backgroundColor: nextMeta.color }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.04] text-xs font-mono text-neutral-700 dark:text-neutral-300 mb-3">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: nextMeta.color }} />
                <span>Recommended Next Quest</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                <span>{nextMeta.name}</span>
                <span>•</span>
                <span>Stage {nextStage.subjectStageNumber || 1}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
                {nextStage.title}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {nextStage.learningObjective || nextStage.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleStartNext}
                className="w-full sm:w-auto btn-vercel-primary px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Quest (5 min)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Four Subject Hub Selector Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
            Choose a Learning Track
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onSelectSubject("all");
            }}
            className={`text-xs font-mono transition-colors ${
              selectedSubject === "all"
                ? "text-neutral-900 dark:text-white font-semibold underline underline-offset-4"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Show All Subjects ({stages.length} Stages)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {subjectsList.map((subKey) => {
            const meta = SUBJECT_METADATA[subKey];
            const subjectStages = stages.filter((s) => s.subject === subKey);
            const subProg = subjectProgress[subKey] || { completedStages: [], unlockedStages: [] };
            const completedCount = subProg.completedStages.length;
            const totalCount = subjectStages.length || 6;
            const progressPercent = Math.round((completedCount / totalCount) * 100);
            const isSelected = selectedSubject === subKey;

            return (
              <button
                key={subKey}
                onClick={() => {
                  sound.playClick();
                  onSelectSubject(subKey);
                }}
                className={`p-4 rounded-xl border text-left transition-all relative group flex flex-col justify-between ${
                  isSelected
                    ? "bg-neutral-50 dark:bg-white/[0.08] border-neutral-900 dark:border-white shadow-sm ring-1 ring-neutral-900 dark:ring-white"
                    : "bg-white dark:bg-[#0a0a0a] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 hover:bg-neutral-50/50 dark:hover:bg-[#111111]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{meta.icon}</span>
                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: meta.badgeBg,
                        color: meta.color,
                      }}
                    >
                      {completedCount}/{totalCount} Done
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    {meta.name}
                  </h3>

                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                    {meta.description}
                  </p>
                </div>

                {/* Mini Progress Bar */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mb-1">
                    <span>Mastery</span>
                    <span className="font-semibold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(4, progressPercent)}%`,
                        backgroundColor: meta.color,
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
