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
      className={`relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
        isUnlocked
          ? "cursor-pointer bg-white dark:bg-[#0a0a0a] hover:bg-neutral-50/80 dark:hover:bg-[#111111] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/25 shadow-sm hover:shadow-md dark:shadow-none"
          : "opacity-50 bg-neutral-100/70 dark:bg-[#050505] border-neutral-200/50 dark:border-white/[0.04] cursor-not-allowed select-none"
      }`}
    >
      <div>
        {/* Top Row: Subject & Stage #, Difficulty, XP */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: meta.color }}
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              {stage.subjectName || "Track"} • Stage {stage.subjectStageNumber || stage.id}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              stage.difficulty === "Easy"
                ? "text-emerald-700 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                : stage.difficulty === "Medium"
                ? "text-amber-700 dark:text-amber-400 border-amber-500/20 bg-amber-500/10"
                : "text-rose-700 dark:text-rose-400 border-rose-500/20 bg-rose-500/10"
            }`}>
              {stage.difficulty || "Standard"}
            </span>
            <span className="text-xs font-mono font-semibold text-neutral-500 dark:text-neutral-400">
              +{stage.xpReward} XP
            </span>
          </div>
        </div>

        {/* Big Stage Title */}
        <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1 leading-snug">
          {stage.title}
        </h3>

        {/* Topic Tag */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mb-3">
          {stage.chapter} {stage.topic ? `— ${stage.topic}` : ""}
        </p>

        {/* Collapsible Curriculum Objective & Tags */}
        {showDetails && (
          <div className="mt-2 mb-3 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/70 dark:border-white/5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed animate-in fade-in duration-200">
            <div className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Learning Objective:
            </div>
            <p className="mb-2">{stage.learningObjective || stage.description}</p>
            {stage.questions[0]?.tags && stage.questions[0].tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {stage.questions[0].tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-white/10 text-neutral-700 dark:text-neutral-300"
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
      <div className="pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between">
        
        {/* Status Pill */}
        <div className="flex items-center gap-1.5">
          {isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
              <span>Passed ({bestScore}%)</span>
            </span>
          ) : isUnlocked ? (
            <span className="flex items-center gap-1 text-xs font-mono font-medium text-sky-600 dark:text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>Ready</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-mono text-neutral-400 dark:text-neutral-600">
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
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity">
              <Play className="w-3 h-3 fill-current" />
              <span>{isCompleted ? "Retry" : "Start"}</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
