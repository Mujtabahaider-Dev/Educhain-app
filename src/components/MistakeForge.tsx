"use client";

import React, { useState } from "react";
import { useEduStore } from "@/store/useEduStore";
import { MistakeRecord, SubjectType } from "@/types/curriculum";
import { SUBJECT_METADATA } from "@/data/constants";
import { sound } from "@/lib/audio";
import { 
  Hammer, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Filter, 
  Check, 
  Clock, 
  AlertCircle 
} from "lucide-react";

export const MistakeForge: React.FC = () => {
  const { mistakes, masterMistake } = useEduStore();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "mastered">("all");
  const [activePracticingId, setActivePracticingId] = useState<string | null>(null);
  const [practiceSelectedOption, setPracticeSelectedOption] = useState<number | null>(null);
  const [practiceAnswered, setPracticeAnswered] = useState(false);

  // Filter mistakes
  const filteredMistakes = mistakes.filter((m) => {
    const matchesSubject = selectedSubject === "all" || m.subject === selectedSubject;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !m.mastered) ||
      (statusFilter === "mastered" && m.mastered);
    return matchesSubject && matchesStatus;
  });

  const handleStartPractice = (item: MistakeRecord) => {
    sound.playClick();
    setActivePracticingId(item.id);
    setPracticeSelectedOption(null);
    setPracticeAnswered(false);
  };

  const handleAnswerPractice = (item: MistakeRecord, optionIndex: number) => {
    if (practiceAnswered) return;
    setPracticeSelectedOption(optionIndex);
    setPracticeAnswered(true);

    if (optionIndex === item.correctIndex) {
      sound.playCorrect();
      masterMistake(item.id);
    } else {
      sound.playIncorrect();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Hammer className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Active Recall & Recovery
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            The Mistake Forge
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl leading-relaxed">
            Every question you miss in regular quizzes automatically gets cataloged here. Master your past errors to turn weaknesses into permanent knowledge.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
            <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">Pending</div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {mistakes.filter((m) => !m.mastered).length}
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
            <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">Mastered</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {mistakes.filter((m) => m.mastered).length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All Subjects" },
            { id: "mathematics", label: "Mathematics" },
            { id: "science", label: "Science" },
            { id: "english", label: "English" },
            { id: "computer_science", label: "Computer Science" },
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubject(sub.id);
                sound.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSubject === sub.id
                  ? "bg-black dark:bg-white text-white dark:text-black font-semibold shadow-sm"
                  : "bg-neutral-100 dark:bg-[#111111] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-white/10"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 border border-neutral-200 dark:border-white/10 rounded-lg p-1 bg-white dark:bg-[#0a0a0a]">
          {(["all", "pending", "mastered"] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                sound.playClick();
              }}
              className={`px-2.5 py-1 rounded text-xs capitalize transition-all ${
                statusFilter === status
                  ? "bg-neutral-200 dark:bg-white/15 text-neutral-900 dark:text-white font-medium"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Empty State */}
      {filteredMistakes.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-[#0a0a0a]/50">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 flex items-center justify-center text-xl mx-auto mb-3 shadow-sm">
            ✨
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
            {mistakes.length === 0 ? "The Forge is Clean" : "No Matching Mistakes"}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
            {mistakes.length === 0
              ? "When you miss a question in any curriculum quiz, it will be added here automatically for deliberate practice."
              : "Try switching filters to view other subjects or mastered questions."}
          </p>
        </div>
      ) : (
        /* Mistake Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMistakes.map((item) => {
            const meta = SUBJECT_METADATA[item.subject];
            const isPracticing = activePracticingId === item.id;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-xl border transition-all ${
                  item.mastered
                    ? "bg-emerald-50/40 dark:bg-[#090d0b] border-emerald-500/20"
                    : "bg-white dark:bg-[#0a0a0a] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-sm dark:shadow-none"
                }`}
              >
                {/* Meta Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span className="text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400">
                      {meta.name} • Stage {item.stageId}
                    </span>
                  </div>

                  {item.mastered ? (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mastered</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <AlertCircle className="w-3 h-3" />
                      <span>Needs Practice ({item.timesMissed}x)</span>
                    </span>
                  )}
                </div>

                {/* Question Text */}
                <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3 leading-snug">
                  {item.question}
                </h4>

                {/* Practice Mode or Static View */}
                {isPracticing ? (
                  <div className="space-y-2 mt-4 pt-3 border-t border-neutral-100 dark:border-white/10">
                    <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
                      Select the correct answer to master:
                    </div>
                    {item.options.map((opt, optIdx) => {
                      const isSelected = practiceSelectedOption === optIdx;
                      const isCorrect = optIdx === item.correctIndex;

                      let btnStyle = "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] text-neutral-800 dark:text-neutral-200";
                      if (practiceAnswered) {
                        if (isCorrect) btnStyle = "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
                        else if (isSelected) btnStyle = "border-rose-500/50 bg-rose-500/10 text-rose-800 dark:text-rose-300";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={practiceAnswered}
                          onClick={() => handleAnswerPractice(item, optIdx)}
                          className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}

                    {practiceAnswered && (
                      <div className="mt-3 p-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]">
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                      Missed {new Date(item.missedAt).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => handleStartPractice(item)}
                      className="btn-vercel-secondary text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{item.mastered ? "Practice Again" : "Practice Now"}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
