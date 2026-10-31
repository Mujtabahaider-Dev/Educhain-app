"use client";

import React, { useEffect, useState } from "react";
import { 
  Trophy, 
  Crown, 
  Zap, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles,
  Award
} from "lucide-react";
import { useMultiplayerStore } from "@/store/useMultiplayerStore";
import { useEduStore } from "@/store/useEduStore";
import { sound } from "@/lib/audio";

export const BattlePodium: React.FC = () => {
  const { podiumResults, localPlayerId, currentRoom, leaveRoom } = useMultiplayerStore();
  const { addXp } = useEduStore();
  const [xpAwarded, setXpAwarded] = useState(false);

  const winner = podiumResults[0];
  const myResult = podiumResults.find((p) => p.playerId === localPlayerId);

  // Automatically credit earned XP to player profile
  useEffect(() => {
    if (!xpAwarded && myResult && myResult.xpEarned > 0) {
      addXp(myResult.xpEarned);
      setXpAwarded(true);
    }
  }, [xpAwarded, myResult, addXp]);

  const isMeWinner = winner?.playerId === localPlayerId;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Card */}
      <div className="p-8 sm:p-10 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-2xl text-center space-y-6">
        
        {/* Fanfare icon */}
        <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Battle Completed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
            {isMeWinner ? "🎉 Victory is Yours!" : "⚔️ Good Game!"}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {currentRoom?.subjectName} • {currentRoom?.roomName}
          </p>
        </div>

        {/* Podium Standings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {podiumResults.map((player, idx) => {
            const isWinner = idx === 0;
            const isSelf = player.playerId === localPlayerId;

            return (
              <div
                key={player.playerId}
                className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isWinner
                    ? "border-amber-500/40 bg-amber-500/10 shadow-md ring-1 ring-amber-500/30"
                    : "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="text-3xl">{player.avatar || "🧠"}</span>
                    {isWinner && (
                      <Crown className="w-4 h-4 text-amber-500 absolute -top-2 -right-1 fill-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">
                        {player.name}
                      </span>
                      {isSelf && (
                        <span className="text-[10px] font-mono font-bold text-neutral-400">(You)</span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500 block">
                      {isWinner ? "🥇 Champion" : `🥈 Rank #${player.rank}`}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-mono font-extrabold text-neutral-900 dark:text-white">
                    {player.score} pts
                  </div>
                  <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 justify-end">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>+{player.xpEarned} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* XP Bonus Notice */}
        {myResult && (
          <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              You earned <strong>+{myResult.xpEarned} XP</strong> added to your total Scholar profile!
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              leaveRoom();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold btn-vercel-primary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Battle Arena</span>
          </button>
        </div>

      </div>

    </div>
  );
};
