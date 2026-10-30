"use client";

import React, { useState } from "react";
import { useEduStore } from "@/store/useEduStore";
import { BENCHMARK_PLAYERS, RANKS } from "@/data/constants";
import { LeaderboardScholar } from "@/types/user";
import { sound } from "@/lib/audio";
import { Trophy, Zap, Flame, Target, Award, Crown } from "lucide-react";

type Category = "xp" | "stages" | "streak" | "accuracy";

export const Leaderboard: React.FC = () => {
  const { name, avatar, xp, completedStages, currentStreak, totalQuizzesAttempted, totalQuestionsCorrect, totalQuestionsAnswered, isGuest } = useEduStore();
  const [activeCategory, setActiveCategory] = useState<Category>("xp");

  // Compute current user's accuracy
  const userAccuracy = totalQuestionsAnswered > 0
    ? Math.round((totalQuestionsCorrect / totalQuestionsAnswered) * 100)
    : 0;

  const currentRank = RANKS.slice().reverse().find((r) => xp >= r.minXp) || RANKS[0];

  // Only include user on leaderboard if they've earned XP / attempted a quiz or are signed in
  const shouldShowUser = !isGuest || xp > 0 || totalQuizzesAttempted > 0;

  const currentUserScholar: LeaderboardScholar = {
    id: "current_user",
    name: name || (isGuest ? "Guest Scholar" : "Scholar"),
    avatar: avatar || "🧠",
    xp,
    rank: currentRank.name,
    stages: completedStages.length,
    streak: currentStreak,
    accuracy: userAccuracy,
    quizzes: totalQuizzesAttempted,
    isCurrentUser: true,
  };

  // Combine and sort
  const allScholars = [...BENCHMARK_PLAYERS, ...(shouldShowUser ? [currentUserScholar] : [])].sort((a, b) => {
    if (activeCategory === "xp") return b.xp - a.xp;
    if (activeCategory === "stages") return b.stages - a.stages;
    if (activeCategory === "streak") return b.streak - a.streak;
    if (activeCategory === "accuracy") {
      // Prioritize scholars with >= 3 quizzes
      const aQualified = a.quizzes >= 3;
      const bQualified = b.quizzes >= 3;
      if (aQualified && !bQualified) return -1;
      if (!aQualified && bQualified) return 1;
      return b.accuracy - a.accuracy;
    }
    return 0;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Live Scholar Rankings
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Global Leaderboard
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Compete across 4 distinct categories. Accuracy rankings require a minimum of 3 completed quizzes.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 border border-neutral-200 dark:border-white/10 rounded-xl p-1 bg-white dark:bg-[#0a0a0a]">
          {[
            { id: "xp", label: "XP Points", icon: Zap },
            { id: "stages", label: "Stages", icon: Award },
            { id: "streak", label: "Streaks", icon: Flame },
            { id: "accuracy", label: "Accuracy", icon: Target },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as Category);
                  sound.playClick();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-black dark:bg-white text-white dark:text-black font-semibold shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Podium Top 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
        {allScholars.slice(0, 3).map((scholar, idx) => {
          const medals = ["🥇", "🥈", "🥉"];
          const borderColors = [
            "border-amber-400/50 bg-amber-500/[0.06] dark:border-amber-400/40 dark:bg-amber-500/[0.03]",
            "border-neutral-300 bg-neutral-100/60 dark:border-neutral-300/30 dark:bg-neutral-300/[0.02]",
            "border-amber-700/40 bg-amber-700/[0.06] dark:border-amber-700/30 dark:bg-amber-700/[0.02]",
          ];

          return (
            <div
              key={scholar.id}
              className={`p-4 rounded-xl border relative flex flex-col items-center text-center shadow-sm dark:shadow-none ${borderColors[idx]} ${
                scholar.isCurrentUser ? "ring-2 ring-sky-500 dark:ring-cyan-400/40" : ""
              }`}
            >
              <div className="text-2xl mb-1">{medals[idx]}</div>
              <div className="text-2xl mb-1">{scholar.avatar}</div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>{scholar.name}</span>
                {scholar.isCurrentUser && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-700 dark:bg-cyan-500/20 dark:text-cyan-300 border border-sky-500/30 dark:border-cyan-500/30">
                    You
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                {scholar.rank} • {scholar.quizzes} Quizzes
              </div>

              {/* Dynamic Value */}
              <div className="mt-3 text-base font-bold font-mono text-neutral-900 dark:text-white">
                {activeCategory === "xp" && `${scholar.xp.toLocaleString()} XP`}
                {activeCategory === "stages" && `${scholar.stages} Stages`}
                {activeCategory === "streak" && `${scholar.streak} Days`}
                {activeCategory === "accuracy" && `${scholar.accuracy}%`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#0a0a0a] shadow-sm dark:shadow-none">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.02] text-neutral-500 dark:text-neutral-400 font-mono">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Scholar</th>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4 text-right">Stages</th>
              <th className="py-3 px-4 text-right">Streak</th>
              <th className="py-3 px-4 text-right">Accuracy</th>
              <th className="py-3 px-4 text-right">XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.04]">
            {allScholars.map((scholar, idx) => (
              <tr
                key={scholar.id}
                className={`transition-colors ${
                  scholar.isCurrentUser
                    ? "bg-sky-50 dark:bg-cyan-500/[0.06] font-medium"
                    : "hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
                }`}
              >
                <td className="py-3 px-4 text-center font-mono text-neutral-400 dark:text-neutral-500">
                  {idx + 1}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{scholar.avatar}</span>
                    <span className="text-neutral-900 dark:text-white font-medium">{scholar.name}</span>
                    {scholar.isCurrentUser && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-sky-500/20 text-sky-700 dark:bg-cyan-500/20 dark:text-cyan-300">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 font-mono">
                  {scholar.rank}
                </td>
                <td className="py-3 px-4 text-right font-mono text-neutral-700 dark:text-neutral-300">
                  {scholar.stages}
                </td>
                <td className="py-3 px-4 text-right font-mono text-orange-600 dark:text-orange-400">
                  {scholar.streak}d
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  <span className={scholar.accuracy >= 90 ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-neutral-700 dark:text-neutral-300"}>
                    {scholar.accuracy}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-amber-600 dark:text-amber-300">
                  {scholar.xp.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
