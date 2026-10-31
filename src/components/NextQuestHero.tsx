"use client";

import React from "react";
import { Stage, SubjectType } from "@/types/curriculum";
import { SUBJECT_METADATA } from "@/data/constants";
import { useEduStore } from "@/store/useEduStore";
import { sound } from "@/lib/audio";
import { Play } from "lucide-react";

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
  const { completedStages, subjectProgress } = useEduStore();

  // Find the student's next recommended stage: first uncompleted stage
  const nextStage = stages.find((s) => !completedStages.includes(s.id)) || stages[0];

  const nextMeta = nextStage?.subject ? SUBJECT_METADATA[nextStage.subject] : SUBJECT_METADATA.computer_science;

  const handleStartNext = () => {
    if (!nextStage) return;
    sound.playClick();
    onStartStage(nextStage);
  };

  const subjectKeys: SubjectType[] = ["computer_science", "science", "mathematics", "english"];

  return (
    <div className="space-y-6 mb-8">
      
      {/* 1. Hero Next Recommended Quest Card */}
      {nextStage && (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-5 sm:p-7 shadow-sm dark:shadow-none transition-all hover:border-neutral-300 dark:hover:border-white/20">
          
          {/* Subtle gradient backdrop */}
          <div 
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none -mr-20 -mt-20"
            style={{ backgroundColor: nextMeta.color }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.04] text-xs font-mono text-neutral-700 dark:text-neutral-300 mb-2.5">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: nextMeta.color }} />
                <span>Next Recommended Quest</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                <span>{nextMeta.name}</span>
                <span>•</span>
                <span>Stage {nextStage.subjectStageNumber || 1}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white mb-1.5">
                {nextStage.title}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1 leading-relaxed">
                {nextStage.learningObjective || nextStage.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleStartNext}
                className="w-full sm:w-auto btn-vercel-primary px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continue Quest (5 min)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Dead-Simple 1-Click Subject Switcher (Without "All Quests" tab) */}
      <div className="pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {subjectKeys.map((subKey) => {
            const meta = SUBJECT_METADATA[subKey];
            const isSelected = selectedSubject === subKey;
            const subProg = subjectProgress[subKey] || { completedStages: [] };
            const subStages = stages.filter((s) => s.subject === subKey);
            const completedCount = subProg.completedStages.length;
            const totalCount = subStages.length || 6;

            return (
              <button
                key={subKey}
                onClick={() => {
                  sound.playClick();
                  onSelectSubject(subKey);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-sm ring-1 ring-black dark:ring-white"
                    : "bg-white dark:bg-[#0a0a0a] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/10 hover:text-black dark:hover:text-white hover:border-neutral-300"
                }`}
              >
                <span className="text-base">{meta.icon}</span>
                <span>{meta.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold ${
                    isSelected
                      ? "bg-white/20 dark:bg-black/15 text-white dark:text-black"
                      : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-500"
                  }`}
                >
                  {completedCount}/{totalCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
