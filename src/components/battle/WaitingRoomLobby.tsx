"use client";

import React, { useState } from "react";
import { 
  Swords, 
  Users, 
  Copy, 
  Check, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  Crown,
  Play
} from "lucide-react";
import { useMultiplayerStore } from "@/store/useMultiplayerStore";
import { sound } from "@/lib/audio";

export const WaitingRoomLobby: React.FC = () => {
  const { 
    currentRoom, 
    players, 
    localPlayerId, 
    isHost, 
    isReady, 
    toggleReady, 
    startMatch, 
    leaveRoom 
  } = useMultiplayerStore();

  const [copiedLink, setCopiedLink] = useState(false);

  if (!currentRoom) return null;

  const playerList = Object.values(players);
  const totalPlayers = playerList.length;
  const readyCount = playerList.filter((p) => p.isReady).length;
  const canStart = isHost && totalPlayers >= 2 && readyCount === totalPlayers;

  const copyInvite = () => {
    sound.playClick();
    const url = typeof window !== "undefined" 
      ? `${window.location.origin}/battle?room=${currentRoom.roomCode}`
      : `https://educhain-app.vercel.app/battle?room=${currentRoom.roomCode}`;

    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Bar with Leave */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            leaveRoom();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Leave Room</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
            Realtime Lobby Active
          </span>
        </div>
      </div>

      {/* Main Room Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-xl space-y-6">
        
        {/* Room Header & Code Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                {currentRoom.mode === "duel" ? "⚔️ 1v1 Duel" : "👥 Party Mode"}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Host: <strong>{currentRoom.hostName}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              {currentRoom.roomName}
            </h2>
          </div>

          {/* Big Room Code Box */}
          <div className="flex items-center gap-2 bg-neutral-50 dark:bg-white/[0.03] p-2.5 pl-4 rounded-2xl border border-neutral-200 dark:border-white/10">
            <div>
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Room Code</div>
              <div className="text-xl font-mono font-extrabold tracking-widest text-neutral-900 dark:text-white">
                {currentRoom.roomCode}
              </div>
            </div>

            <button
              onClick={copyInvite}
              className="ml-3 px-3.5 py-2 rounded-xl text-xs font-bold btn-vercel-primary flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
            </button>
          </div>
        </div>

        {/* Configuration Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-700 dark:text-neutral-300 font-medium">
            📚 Subject: <strong>{currentRoom.subjectName}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-700 dark:text-neutral-300 font-medium">
            🎯 Scope: <strong>{currentRoom.chapter || "All Chapters"}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-700 dark:text-neutral-300 font-medium">
            ⚡ <strong>{currentRoom.questionCount} Questions</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-700 dark:text-neutral-300 font-medium">
            ⏱️ <strong>{currentRoom.timePerQuestion}s / Question</strong>
          </div>
        </div>

        {/* Players in Room */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Players Joined ({totalPlayers} {currentRoom.mode === "duel" ? "/ 2" : ""})
            </h4>
            <span className="text-xs text-neutral-500">
              {readyCount} of {totalPlayers} Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {playerList.map((player) => {
              const isSelf = player.id === localPlayerId;

              return (
                <div
                  key={player.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    player.isReady
                      ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10"
                      : "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{player.avatar || "🧠"}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white">
                          {player.name} {isSelf && <span className="text-neutral-400 font-normal text-xs">(You)</span>}
                        </span>
                        {player.isHost && (
                          <span title="Host">
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-500 block">
                        {player.isHost ? "Room Creator" : "Challenger"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
                    {player.isReady ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ready</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Circle className="w-4 h-4" />
                        <span>Not Ready</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty challenger slot for 1v1 */}
            {currentRoom.mode === "duel" && totalPlayers < 2 && (
              <div className="p-4 rounded-2xl border border-dashed border-neutral-300 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.01] flex items-center justify-center gap-2 text-neutral-400 text-xs">
                <span>Waiting for opponent to join...</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Ready Toggle for Non-Hosts */}
          {!isHost && (
            <button
              onClick={toggleReady}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isReady
                  ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                  : "btn-vercel-primary"
              }`}
            >
              {isReady ? <Circle className="w-4 h-4 text-emerald-500" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{isReady ? "Cancel Ready" : "I'm Ready!"}</span>
            </button>
          )}

          {/* Host Start Battle Button */}
          {isHost && (
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-neutral-500">
                {totalPlayers < 2 
                  ? "Share the room code or invite link with a friend to begin."
                  : !canStart
                  ? "Waiting for all players to click Ready..."
                  : "All players are ready for battle!"}
              </span>

              <button
                disabled={!canStart}
                onClick={startMatch}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-extrabold btn-vercel-primary flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:scale-100"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Battle!</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
