"use client";

import React from "react";
import { Stage, SubjectType, StreamDomainId } from "@/types/curriculum";
import { SUBJECT_METADATA, STREAM_DOMAINS, SUBJECT_TO_STREAM } from "@/data/constants";
import { useEduStore } from "@/store/useEduStore";
import { sound } from "@/lib/audio";
import { Play, Sparkles, ChevronRight, CheckCircle2, ArrowRight, Layers, Compass } from "lucide-react";

interface NextQuestHeroProps {
  stages: Stage[];
  selectedStream: string;
  onSelectStream: (streamId: string) => void;
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  onStartStage: (stage: Stage) => void;
}

export const NextQuestHero: React.FC<NextQuestHeroProps> = ({
  stages,
  selectedStream,
  onSelectStream,
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

  // Determine current active stream domain
  const activeStreamDomain = STREAM_DOMAINS.find((d) => d.id === selectedStream);

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

      {/* 2. Hierarchical Stream & Subject Hub Selector */}
      <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.02] p-5">
        
        {/* Tier 1 Header & Stream Domain Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-200 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-200/60 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
              <Compass className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
              Step 1: Choose Educational Domain
            </span>
          </div>

          {/* Stream Level Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClick();
                onSelectStream("all");
                onSelectSubject("all");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedStream === "all"
                  ? "bg-black dark:bg-white text-white dark:text-black font-semibold shadow-sm"
                  : "bg-white dark:bg-[#0a0a0a] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/10 hover:text-black dark:hover:text-white"
              }`}
            >
              All Domains
            </button>

            {STREAM_DOMAINS.map((domain) => {
              const isActive = selectedStream === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectStream(domain.id);
                    // Default to all subjects inside this domain or the first subject
                    onSelectSubject("all");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-black dark:bg-white text-white dark:text-black font-semibold shadow-sm"
                      : "bg-white dark:bg-[#0a0a0a] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/10 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <span>{domain.icon}</span>
                  <span>{domain.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 2: Sub-categories / Subjects inside Domain */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
                Step 2: Select Specialized Subject
              </span>
              {activeStreamDomain && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-neutral-200/50 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300">
                  in {activeStreamDomain.name}
                </span>
              )}
            </div>

            {selectedSubject !== "all" && (
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectSubject("all");
                }}
                className="text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline underline-offset-4"
              >
                View All in Domain
              </button>
            )}
          </div>

          {/* Cards for Sub-categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {STREAM_DOMAINS.flatMap((domain) => {
              // If a domain is selected, only show subcategories from that domain
              if (selectedStream !== "all" && domain.id !== selectedStream) return [];
              return domain.subCategories.map((sub) => ({ ...sub, parentDomain: domain }));
            }).map((sub) => {
              const meta = SUBJECT_METADATA[sub.subjectId];
              const subjectStages = stages.filter((s) => s.subject === sub.subjectId);
              const subProg = subjectProgress[sub.subjectId] || { completedStages: [], unlockedStages: [] };
              const completedCount = subProg.completedStages.length;
              const totalCount = subjectStages.length || 6;
              const progressPercent = Math.round((completedCount / totalCount) * 100);
              const isSelected = selectedSubject === sub.subjectId;

              return (
                <button
                  key={sub.subjectId}
                  onClick={() => {
                    sound.playClick();
                    onSelectStream(sub.parentDomain.id);
                    onSelectSubject(sub.subjectId);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all relative group flex flex-col justify-between ${
                    isSelected
                      ? "bg-white dark:bg-[#121212] border-neutral-900 dark:border-white shadow-md ring-2 ring-neutral-900 dark:ring-white"
                      : "bg-white dark:bg-[#0a0a0a] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 hover:bg-neutral-50/70 dark:hover:bg-[#111111]"
                  }`}
                >
                  <div>
                    {/* Header badge with Parent Stream indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl">{sub.icon}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400">
                          {sub.parentDomain.shortName}
                        </span>
                      </div>
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
                      {sub.name}
                    </h3>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                      {sub.description}
                    </p>

                    {/* Step 3: Key Topics Chips */}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {sub.primaryTopics.slice(0, 2).map((t, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-white/[0.04]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
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

    </div>
  );
};
