"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Swords, 
  Users, 
  ArrowLeft, 
  Plus, 
  LogIn, 
  Sparkles, 
  Flame, 
  Globe, 
  ChevronRight,
  RefreshCw,
  Trophy,
  Zap
} from "lucide-react";
import { useMultiplayerStore } from "@/store/useMultiplayerStore";
import { useEduStore } from "@/store/useEduStore";
import { CreateRoomModal } from "@/components/battle/CreateRoomModal";
import { WaitingRoomLobby } from "@/components/battle/WaitingRoomLobby";
import { BattleArena } from "@/components/battle/BattleArena";
import { BattlePodium } from "@/components/battle/BattlePodium";
import { MultiplayerRoom } from "@/types/multiplayer";
import { sound } from "@/lib/audio";

function BattleContent() {
  const searchParams = useSearchParams();
  const roomQueryCode = searchParams.get("room");

  const { 
    gameStatus, 
    joinRoom, 
    setLocalPlayer, 
    fetchPublicRooms,
    localPlayerId 
  } = useMultiplayerStore();

  const { name, avatar } = useEduStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [publicRooms, setPublicRooms] = useState<MultiplayerRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Sync user identity to multiplayer store
  useEffect(() => {
    const id = localPlayerId || `player_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setLocalPlayer(id, name || "Scholar", avatar || "🧠");
  }, [name, avatar, setLocalPlayer, localPlayerId]);

  // Load public rooms
  const loadRooms = async () => {
    setLoadingRooms(true);
    const rooms = await fetchPublicRooms();
    setPublicRooms(rooms);
    setLoadingRooms(false);
  };

  useEffect(() => {
    if (gameStatus === "idle") {
      loadRooms();
    }
  }, [gameStatus]);

  // If URL has ?room=CODE, attempt auto-join
  useEffect(() => {
    if (roomQueryCode && gameStatus === "idle") {
      setJoinCodeInput(roomQueryCode);
      handleJoin(roomQueryCode);
    }
  }, [roomQueryCode, gameStatus]);

  const handleJoin = async (codeToJoin?: string) => {
    const code = (codeToJoin || joinCodeInput).trim().toUpperCase();
    if (!code) {
      setErrorMessage("Please enter a 6-digit room code.");
      return;
    }

    setIsJoining(true);
    setErrorMessage(null);
    sound.playClick();

    const res = await joinRoom(code);
    setIsJoining(false);

    if (res.success) {
      sound.playUnlock();
    } else {
      setErrorMessage(res.error || "Failed to join room.");
    }
  };

  // Render Game Views
  if (gameStatus === "lobby") {
    return <WaitingRoomLobby />;
  }

  if (gameStatus === "countdown" || gameStatus === "playing") {
    return <BattleArena />;
  }

  if (gameStatus === "podium") {
    return <BattlePodium />;
  }

  // Idle Home Screen (Hub)
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Swords className="w-3.5 h-3.5" />
            <span>Real-Time Multiplayer Arena</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Challenge Your Friends in Live Quiz Showdowns
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Create custom battle rooms configured for any subject and chapter, or join live lobbies to test your speed, combos, and knowledge in head-to-head multiplayer.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setIsCreateOpen(true);
              }}
              className="btn-vercel-primary px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Room</span>
            </button>

            <Link
              href="/"
              className="px-5 py-3 rounded-2xl text-xs font-semibold border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all text-neutral-700 dark:text-neutral-300"
            >
              <span>Back to Solo Quests</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Join Room Box */}
      <div className="p-6 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <LogIn className="w-4 h-4 text-cyan-500" />
              <span>Have an Invite Code?</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Enter the 6-character room code shared by your friend (e.g. EDU-482)
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              placeholder="EDU-XXX"
              maxLength={8}
              className="w-full sm:w-44 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-sm font-mono font-bold tracking-widest text-neutral-900 dark:text-white uppercase placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />

            <button
              disabled={isJoining || !joinCodeInput.trim()}
              onClick={() => handleJoin()}
              className="btn-vercel-primary px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <span>{isJoining ? "Joining..." : "Join Battle"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Open Public Rooms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Open Public Rooms
            </h3>
          </div>

          <button
            onClick={loadRooms}
            disabled={loadingRooms}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingRooms ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {publicRooms.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-neutral-200 dark:border-white/10 text-center space-y-3">
            <div className="text-3xl">⚔️</div>
            <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              No public lobbies waiting right now
            </div>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              Be the first! Click &ldquo;Create Custom Room&rdquo; above and set it to Public so other scholars can join your arena.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicRooms.map((room) => (
              <div
                key={room.id}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] hover:border-neutral-300 dark:hover:border-white/20 transition-all shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                    {room.mode === "duel" ? "⚔️ 1v1" : "👥 Party"}
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-500">
                    {room.roomCode}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                    {room.roomName}
                  </h4>
                  <div className="text-xs text-neutral-500 truncate mt-0.5">
                    {room.subjectName} • {room.chapter || "All Chapters"}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-white/5 text-[11px] text-neutral-500">
                  <span>Host: {room.hostName}</span>
                  <span>{room.questionCount} Qs • {room.timePerQuestion}s</span>
                </div>

                <button
                  onClick={() => handleJoin(room.roomCode)}
                  className="w-full py-2 rounded-xl text-xs font-bold btn-vercel-primary flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Join Room</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

    </div>
  );
}

export default function BattlePage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
              title="Return to Solo Quests"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">EduChain Arena</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold uppercase animate-pulse">
                  Multiplayer
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Synchronized Peer-to-Peer Quiz Battles
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
          >
            <span>Solo Quests</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="text-center py-20 text-xs text-neutral-400">Loading Battle Arena...</div>}>
          <BattleContent />
        </Suspense>
      </main>

    </div>
  );
}
