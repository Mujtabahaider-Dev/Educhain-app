"use client";

import React, { useState } from "react";
import { Stage } from "@/types/curriculum";
import { SUBJECT_METADATA } from "@/data/constants";
import { sound } from "@/lib/audio";
import { Lock, CheckCircle2, Play, ChevronDown, ChevronUp, Info } from "lucide-react";

interface StageCardProps {
  stage: Stage;
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore?: number;
  onSelect: (stage: Stage) => void;
}

export const StageCard: React.FC<StageCardProps> = ({
  stage,
  isUnlocked,
  isCompleted,
  bestScore = 0,
  onSelect,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const meta = stage.subject ? SUBJECT_METADATA[stage.subject] : SUBJECT_METADATA.science;

  const handleClick = (e: React.MouseEvent) => {
    // If clicking the info toggle, don't trigger quiz
    if ((e.target as HTMLElement).closest(".btn-details-toggle")) return;

    if (!isUnlocked) {
      sound.playIncorrect();
      return;
    }
    sound.playClick();
    onSelect(stage);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
        isUnlocked
          ? "cursor-pointer bg-white dark:bg-[#0c0c0e] hover:bg-neutral-50/60 dark:hover:bg-[#121216] border-black/[0.07] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-white/[0.02]"
          : "opacity-45 bg-neutral-100/50 dark:bg-[#08080a] border-black/[0.04] dark:border-white/[0.04] cursor-not-allowed select-none"
      }`}
    >
      <div>
        {/* Top Row: Subject & Stage #, Difficulty, XP */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0 ring-4 ring-neutral-100 dark:ring-white/5"
              style={{ backgroundColor: meta.color }}
            />
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {stage.subjectName || "Track"} • Stage {stage.subjectStageNumber || stage.id}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              stage.difficulty === "Easy"
                ? "text-emerald-700 dark:text-emerald-400 border-emerald-500/25 bg-emerald-500/10"
                : stage.difficulty === "Medium"
                ? "text-amber-700 dark:text-amber-400 border-amber-500/25 bg-amber-500/10"
                : "text-rose-700 dark:text-rose-400 border-rose-500/25 bg-rose-500/10"
            }`}>
              {stage.difficulty || "Standard"}
            </span>
            <span className="text-[11px] font-mono font-medium text-neutral-500 dark:text-neutral-400">
              +{stage.xpReward} XP
            </span>
          </div>
        </div>

        {/* Big Stage Title */}
        <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100 mb-1 leading-snug group-hover:text-black dark:group-hover:text-white transition-colors">
          {stage.title}
        </h3>

        {/* Topic Tag */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mb-3">
          {stage.chapter} {stage.topic ? `— ${stage.topic}` : ""}
        </p>

        {/* Collapsible Curriculum Objective & Tags */}
        {showDetails && (
          <div className="mt-2 mb-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed animate-in fade-in duration-200">
            <div className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>Learning Objective:</span>
            </div>
            <p className="mb-2 text-neutral-600 dark:text-neutral-400">{stage.learningObjective || stage.description}</p>
            {stage.questions[0]?.tags && stage.questions[0].tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {stage.questions[0].tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 border border-black/[0.04] dark:border-white/[0.04]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Status & Start Button */}
      <div className="pt-3.5 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
        
        {/* Status Pill */}
        <div className="flex items-center gap-1.5">
          {isCompleted ? (
            <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
              <span>Passed ({bestScore}%)</span>
            </span>
          ) : isUnlocked ? (
            <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-sky-600 dark:text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-cyan-400 animate-pulse" />
              <span>Available</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 dark:text-neutral-600">
              <Lock className="w-3.5 h-3.5" />
              <span>Locked</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn-details-toggle p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
            title={showDetails ? "Hide syllabus details" : "View syllabus details"}
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          </button>

          {isUnlocked && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-medium tracking-tight shadow-sm hover:opacity-90 active:scale-95 transition-all">
              <Play className="w-3 h-3 fill-current" />
              <span>{isCompleted ? "Retry" : "Start"}</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
