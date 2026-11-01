"use client";

import React, { useRef, useState } from "react";
import { useEduStore } from "@/store/useEduStore";
import { SUBJECT_METADATA, getSubjectMeta } from "@/data/constants";
import { MistakeForge } from "@/components/MistakeForge";
import { sound } from "@/lib/audio";
import { 
  BarChart3, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Target, 
  Check,
  Hammer,
  ArrowRight
} from "lucide-react";

export const AnalyticsView: React.FC = () => {
  const {
    name,
    avatar,
    grade,
    xp,
    totalQuizzesAttempted,
    totalQuestionsAnswered,
    totalQuestionsCorrect,
    totalQuestionsMissed,
    totalQuestionsTimedOut,
    subjectProgress,
    quizHistory,
    mistakes,
    exportData,
    importData,
    resetProgress,
  } = useEduStore();

  const [activeSection, setActiveSection] = useState<"overview" | "mistakes">("overview");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const pendingMistakes = mistakes.filter((m) => !m.mastered);
  const masteredMistakes = mistakes.filter((m) => m.mastered);

  const overallAccuracy = totalQuestionsAnswered > 0
    ? Math.round((totalQuestionsCorrect / totalQuestionsAnswered) * 100)
    : 0;

  // Compute subject accuracy
  const subjectStats = (["mathematics", "science", "english", "computer_science"] as const).map(
    (sub) => {
      const meta = getSubjectMeta(sub);
      const attempts = quizHistory.filter((q) => q.subject === sub);
      const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
      const totalQs = attempts.reduce((acc, curr) => acc + curr.total, 0);
      const accuracy = totalQs > 0 ? Math.round((totalScore / totalQs) * 100) : 0;
      const completedCount = subjectProgress[sub]?.completedStages?.length || 0;

      return {
        key: sub,
        name: meta?.name || sub,
        color: meta?.color || "#38bdf8",
        accuracy,
        quizzes: attempts.length,
        completedStages: completedCount,
      };
    }
  );

  const handleExport = () => {
    sound.playClick();
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `educhain-backup-${(name || "scholar").toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        sound.playUnlock();
        setImportStatus("Progress restored successfully!");
      } else {
        sound.playIncorrect();
        setImportStatus("Invalid file format. Please check JSON.");
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Sub-Navigation: Overview vs Review Errors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-cyan-400">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Scholar Progress Hub
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            My Learning Progress
          </h1>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex items-center gap-1 border border-neutral-200 dark:border-white/10 rounded-xl p-1 bg-white dark:bg-[#0a0a0a] shadow-sm">
          <button
            onClick={() => {
              setActiveSection("overview");
              sound.playClick();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSection === "overview"
                ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics & Stats</span>
          </button>

          <button
            onClick={() => {
              setActiveSection("mistakes");
              sound.playClick();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSection === "mistakes"
                ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Review Errors</span>
            {pendingMistakes.length > 0 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                activeSection === "mistakes"
                  ? "bg-white/20 dark:bg-black/20 text-white dark:text-black"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
              }`}>
                {pendingMistakes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW A: MISTAKE FORGE (Review Errors embedded directly inside My Progress) */}
      {activeSection === "mistakes" ? (
        <MistakeForge />
      ) : (
        /* VIEW B: PERFORMANCE ANALYTICS & STATS */
        <>
          {/* Data Portability Controls Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Track mastery trends across subjects, error distribution, and historical accuracy trajectories.
            </p>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExport}
                className="btn-vercel-secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-vercel-secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          {importStatus && (
            <div className="mb-6 p-3 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-cyan-300 text-xs font-mono text-center animate-in fade-in">
              {importStatus}
            </div>
          )}

          {/* Top Level Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm dark:shadow-none">
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">Overall Accuracy</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">{overallAccuracy}%</div>
              <div className="text-[11px] text-neutral-500 mt-1">{totalQuestionsCorrect} / {totalQuestionsAnswered} correct</div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm dark:shadow-none">
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">Quizzes Completed</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">{totalQuizzesAttempted}</div>
              <div className="text-[11px] text-neutral-500 mt-1">across all subjects</div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm dark:shadow-none">
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">Errors Mastered</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {masteredMistakes.length}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">{pendingMistakes.length} pending review</div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm dark:shadow-none">
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">Experience Points</div>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-300 mt-1">{xp.toLocaleString()} XP</div>
              <div className="text-[11px] text-neutral-500 mt-1">scholar points</div>
            </div>
          </div>

          {/* Quick Review Errors Banner if pending mistakes exist */}
          {pendingMistakes.length > 0 && (
            <div className="mb-8 p-4 rounded-xl border border-amber-500/30 bg-amber-500/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Hammer className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    You have {pendingMistakes.length} missed question{pendingMistakes.length > 1 ? "s" : ""} to review
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Review and retry your mistakes in the Forge to gain back mastery and earn bonus XP.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveSection("mistakes");
                  sound.playClick();
                }}
                className="btn-vercel-primary text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Review Errors Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Subject Performance Bars */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] mb-8 shadow-sm dark:shadow-none">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
              Subject Mastery Comparison
            </h3>

            <div className="space-y-4">
              {subjectStats.map((sub) => (
                <div key={sub.key}>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">{sub.name}</span>
                    <span className="text-neutral-900 dark:text-white font-semibold">
                      {sub.accuracy}% <span className="text-neutral-400 dark:text-neutral-500 font-normal">({sub.quizzes} quizzes)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(5, sub.accuracy)}%`,
                        backgroundColor: sub.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quiz Attempts Log */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm dark:shadow-none">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
              Recent Quiz Attempts Trajectory
            </h3>

            {quizHistory.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 dark:text-neutral-500 text-xs font-mono">
                No quiz attempts recorded yet. Take a challenge in the Curriculum Chain to start plotting your trajectory!
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-white/[0.04]">
                {quizHistory.slice(-5).reverse().map((attempt, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                        {new Date(attempt.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white capitalize">
                        {attempt.subject.replace("_", " ")} • Stage {attempt.stageId}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 font-mono">
                      <span className={attempt.accuracy >= 70 ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-amber-600 dark:text-amber-400"}>
                        {attempt.score}/{attempt.total} ({attempt.accuracy}%)
                      </span>
                      <span className="text-amber-600 dark:text-amber-300 font-semibold">
                        +{attempt.xpEarned} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};
