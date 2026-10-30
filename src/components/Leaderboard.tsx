"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useEduStore } from "@/store/useEduStore";
import { BENCHMARK_PLAYERS, RANKS } from "@/data/constants";
import { LeaderboardScholar } from "@/types/user";
import { sound } from "@/lib/audio";
import { Trophy, Zap, Flame, Target, Award, RotateCw, Radio, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Category = "xp" | "stages" | "streak" | "accuracy";

const getRankName = (points: number): string => {
  const r = RANKS.slice().reverse().find((rank) => points >= rank.minXp);
  return r ? r.name : "Novice";
};

export const Leaderboard: React.FC = () => {
  const { 
    name, 
    avatar, 
    xp, 
    completedStages, 
    currentStreak, 
    totalQuizzesAttempted, 
    totalQuestionsCorrect, 
    totalQuestionsAnswered, 
    isGuest 
  } = useEduStore();

  const [activeCategory, setActiveCategory] = useState<Category>("xp");
  const [cloudScholars, setCloudScholars] = useState<LeaderboardScholar[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // Compute current user's accuracy
  const userAccuracy = totalQuestionsAnswered > 0
    ? Math.round((totalQuestionsCorrect / totalQuestionsAnswered) * 100)
    : 0;

  const currentRankName = getRankName(xp);

  // Fetch profiles dynamically from Supabase
  const fetchProfiles = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    
    try {
      // Get current auth session to identify current user
      const { data: sessionData } = await supabase.auth.getSession();
      const authId = sessionData?.session?.user?.id || null;
      setCurrentUserId(authId);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, player_name, player_avatar, xp, stages_completed, current_streak, accuracy, quizzes_attempted, questions_answered, questions_correct")
        .order("xp", { ascending: false })
        .limit(100);

      if (error) {
        console.warn("Could not fetch live leaderboard profiles:", error.message);
        setIsLiveConnected(false);
        return;
      }

      if (data && data.length > 0) {
        const mapped: LeaderboardScholar[] = data.map((p) => {
          const isCurrent = (authId && p.id === authId) || (!isGuest && p.player_name === name);
          
          const profileXp = isCurrent ? Math.max(p.xp || 0, xp) : (p.xp || 0);
          const profileStages = isCurrent ? Math.max(p.stages_completed || 0, completedStages.length) : (p.stages_completed || 0);
          const profileStreak = isCurrent ? Math.max(p.current_streak || 0, currentStreak) : (p.current_streak || 0);
          const profileQuizzes = isCurrent ? Math.max(p.quizzes_attempted || 0, totalQuizzesAttempted) : (p.quizzes_attempted || 0);
          
          let calculatedAcc = p.accuracy;
          if (calculatedAcc === null || calculatedAcc === undefined) {
            calculatedAcc = (p.questions_answered && p.questions_answered > 0)
              ? Math.round(((p.questions_correct || 0) / p.questions_answered) * 100)
              : 0;
          }
          const profileAccuracy = isCurrent ? (userAccuracy || calculatedAcc || 0) : calculatedAcc;

          return {
            id: p.id,
            name: isCurrent ? name : (p.player_name || "Scholar"),
            avatar: isCurrent ? avatar : (p.player_avatar || "🦉"),
            xp: profileXp,
            rank: getRankName(profileXp),
            stages: profileStages,
            streak: profileStreak,
            accuracy: profileAccuracy,
            quizzes: profileQuizzes,
            isCurrentUser: Boolean(isCurrent),
          };
        });

        setCloudScholars(mapped);
        setIsLiveConnected(true);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Leaderboard load exception:", err);
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [xp, completedStages.length, currentStreak, totalQuizzesAttempted, userAccuracy, isGuest, name, avatar]);

  useEffect(() => {
    fetchProfiles();

    // Set up Realtime subscription for instant live updates
    const channel = supabase
      .channel("public-profiles-leaderboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          fetchProfiles(false);
        }
      )
      .subscribe((status) => {
        setIsLiveConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProfiles]);

  // Fallback to BENCHMARK_PLAYERS if database had no records or connection failed
  const baseScholars = cloudScholars.length > 0 ? cloudScholars : BENCHMARK_PLAYERS;

  // Check if current user is represented
  const hasCurrentUserInList = baseScholars.some((s) => s.isCurrentUser);

  // If user has progress or is signed in and not yet in the list, insert them
  const shouldShowUser = !hasCurrentUserInList && (!isGuest || xp > 0 || totalQuizzesAttempted > 0);

  const currentUserScholar: LeaderboardScholar = {
    id: currentUserId || "current_user",
    name: name || (isGuest ? "Guest Scholar" : "Scholar"),
    avatar: avatar || "🧠",
    xp,
    rank: currentRankName,
    stages: completedStages.length,
    streak: currentStreak,
    accuracy: userAccuracy,
    quizzes: totalQuizzesAttempted,
    isCurrentUser: true,
  };

  // Combine and sort scholars by active category
  const allScholars = [...baseScholars, ...(shouldShowUser ? [currentUserScholar] : [])].sort((a, b) => {
    if (activeCategory === "xp") return b.xp - a.xp;
    if (activeCategory === "stages") return b.stages - a.stages;
    if (activeCategory === "streak") return b.streak - a.streak;
    if (activeCategory === "accuracy") {
      // Prioritize scholars who completed quizzes
      const aQualified = a.quizzes >= 2;
      const bQualified = b.quizzes >= 2;
      if (aQualified && !bQualified) return -1;
      if (!aQualified && bQualified) return 1;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return b.xp - a.xp;
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

            {/* Live Database Status Indicator */}
            <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full text-[11px] font-mono bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08]">
              {isLiveConnected ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">Live Supabase DB</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <span className="text-amber-600 dark:text-amber-400">Offline Fallback</span>
                </>
              )}
              <span className="text-neutral-400 dark:text-neutral-600">•</span>
              <span className="text-neutral-600 dark:text-neutral-400 font-bold">{allScholars.length} Scholars</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Global Leaderboard
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Realtime rankings synchronized across all registered students. Complete stages to climb the leaderboard.
          </p>
        </div>

        {/* Controls: Refresh & Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={() => {
              sound.playClick();
              fetchProfiles(true);
            }}
            disabled={isRefreshing}
            title="Refresh Leaderboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all disabled:opacity-50 shadow-sm dark:shadow-none"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-sky-500" : ""}`} />
            <span className="hidden sm:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 border border-neutral-200 dark:border-white/10 rounded-xl p-1 bg-white dark:bg-[#0a0a0a] shadow-sm dark:shadow-none">
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
              className={`p-4 rounded-xl border relative flex flex-col items-center text-center shadow-sm dark:shadow-none transition-all ${borderColors[idx]} ${
                scholar.isCurrentUser ? "ring-2 ring-sky-500 dark:ring-cyan-400/60 bg-sky-500/[0.05]" : ""
              }`}
            >
              <div className="text-2xl mb-1">{medals[idx]}</div>
              <div className="text-3xl mb-1">{scholar.avatar}</div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span className="truncate max-w-[140px]">{scholar.name}</span>
                {scholar.isCurrentUser && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-700 dark:bg-cyan-500/20 dark:text-cyan-300 border border-sky-500/30 dark:border-cyan-500/30">
                    You
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                {scholar.rank} • {scholar.quizzes} Quizzes
              </div>

              {/* Dynamic Metric Value */}
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
                    ? "bg-sky-500/[0.08] dark:bg-cyan-500/[0.1] font-semibold border-l-2 border-l-sky-500 dark:border-l-cyan-400"
                    : "hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
                }`}
              >
                <td className="py-3 px-4 text-center font-mono text-neutral-400 dark:text-neutral-500">
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{scholar.avatar}</span>
                    <span className="text-neutral-900 dark:text-white font-medium">{scholar.name}</span>
                    {scholar.isCurrentUser && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-700 dark:bg-cyan-500/20 dark:text-cyan-300 font-semibold border border-sky-500/30 dark:border-cyan-500/30">
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

      {/* Footer Info */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-500 gap-2">
        <span>⚡ Synchronized in real-time with EduChain Cloud Network</span>
        {lastUpdated && (
          <span>Last sync: {lastUpdated.toLocaleTimeString()}</span>
        )}
      </div>

    </div>
  );
};
