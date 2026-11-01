"use client";

import React, { useEffect } from "react";
import { Stage, SubjectType } from "@/types/curriculum";
import { useEduStore } from "@/store/useEduStore";
import { useCurriculumStore } from "@/store/useCurriculumStore";
import { sound } from "@/lib/audio";
import { Play, Sparkles, GraduationCap } from "lucide-react";
import { SleekIcon, SleekBadgeIcon } from "@/components/SleekIcon";

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
  const { grade, setGrade, completedStages, subjectProgress } = useEduStore();
  const { getAllSubjects, getAllClasses } = useCurriculumStore();
  const allClasses = getAllClasses();
  
  // Filter subjects for the student's active class
  const classSubjects = getAllSubjects(grade);

  // If currently selected subject does not belong to active class, select first available
  useEffect(() => {
    if (classSubjects.length > 0 && !classSubjects.some((s) => s.id === selectedSubject)) {
      onSelectSubject(classSubjects[0].id);
    }
  }, [classSubjects, selectedSubject, onSelectSubject]);

  // Find the student's next recommended stage: first uncompleted stage in current class
  const nextStage = stages.find((s) => !completedStages.includes(s.id)) || stages[0];
  const nextSubMeta = classSubjects.find((s) => s.id === nextStage?.subject) || classSubjects[0];

  const handleStartNext = () => {
    if (!nextStage) return;
    sound.playClick();
    onStartStage(nextStage);
  };

  const activeClassObj = allClasses.find((c) => c.id === grade) || allClasses[0];

  return (
    <div className="space-y-6 mb-8">
      
      {/* 1. Sleek Class Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06]">
        <div className="flex items-center gap-2 px-2">
          <GraduationCap className="w-4 h-4 text-neutral-500 shrink-0" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500 shrink-0">
            Select Class:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {allClasses.map((cls) => {
            const isActive = grade === cls.id;
            return (
              <button
                key={cls.id}
                onClick={() => {
                  sound.playClick();
                  setGrade(cls.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-xs font-semibold"
                    : "bg-white dark:bg-[#0c0c0e] text-neutral-600 dark:text-neutral-400 border border-black/[0.06] dark:border-white/[0.08] hover:text-black dark:hover:text-white"
                }`}
              >
                <SleekIcon name={cls.id || cls.icon} className="w-3.5 h-3.5 shrink-0" />
                <span>{cls.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Hero Next Recommended Quest Card */}
      {nextStage && (
        <div className="relative overflow-hidden rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0c0e] p-6 sm:p-8 shadow-sm transition-all hover:border-black/15 dark:hover:border-white/15">
          
          {/* Subtle gradient glow */}
          <div 
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ backgroundColor: nextSubMeta?.color || "#38bdf8" }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-neutral-100/80 dark:bg-white/[0.04] text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: nextSubMeta?.color || "#38bdf8" }} />
                <span className="font-semibold uppercase tracking-wider">{activeClassObj?.name || "Class"} • Next Quest</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                <span>{nextSubMeta?.name}</span>
                <span>•</span>
                <span>Stage {nextStage.subjectStageNumber || 1}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white leading-tight">
                {nextStage.title}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {nextStage.learningObjective || nextStage.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleStartNext}
                className="w-full sm:w-auto btn-vercel-primary px-7 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Continue Quest (5 min)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Dead-Simple 1-Click Subject Switcher (Filtered by Student's Active Class) */}
      <div className="pt-1">
        {classSubjects.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {classSubjects.map((sub) => {
              const isSelected = selectedSubject === sub.id;
              const subProg = subjectProgress[sub.id as SubjectType] || { completedStages: [] };
              const subStages = stages.filter((s) => s.subject === sub.id);
              const completedCount = subProg.completedStages.length;
              const totalCount = subStages.length || 1;

              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectSubject(sub.id);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-medium transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? "bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm font-semibold"
                      : "bg-white dark:bg-[#0c0c0e] text-neutral-600 dark:text-neutral-400 border border-black/[0.06] dark:border-white/[0.08] hover:text-neutral-950 dark:hover:text-white hover:border-black/15 dark:hover:border-white/15"
                  }`}
                >
                  <SleekBadgeIcon name={sub.id} color={sub.color} size="sm" />
                  <span>{sub.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? "bg-white/20 dark:bg-black/15 text-white dark:text-neutral-950"
                        : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-500"
                    }`}
                  >
                    {completedCount}/{totalCount}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.01] text-center">
            <p className="text-xs font-mono text-neutral-500 mb-1">
              No subjects registered yet for {activeClassObj?.name || "this class"}.
            </p>
            <p className="text-[11px] text-neutral-400">
              Select another class above or add subjects for {activeClassObj?.name} in the Admin Panel.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
