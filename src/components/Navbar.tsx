"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useEduStore } from "@/store/useEduStore";
import { sound } from "@/lib/audio";
import { RANKS } from "@/data/constants";
import { 
  Flame, 
  Zap, 
  Volume2, 
  VolumeX, 
  Cloud, 
  BookOpen, 
  BarChart3, 
  Trophy, 
  Sun, 
  Moon, 
  LogIn,
  Swords
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenLanding?: () => void;
  onOpenAuth?: (mode?: "signin" | "signup") => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenAuth,
}) => {
  const { xp, currentStreak, settings, updateSettings, toggleTheme, mistakes, name, avatar, isGuest } = useEduStore();
  const [syncing, setSyncing] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(Boolean(session?.user));
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(Boolean(session?.user));
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Compute current rank
  const currentRank = RANKS.slice().reverse().find((r) => xp >= r.minXp) || RANKS[0];

  // Count pending mistakes
  const pendingMistakes = mistakes.filter((m) => !m.mastered).length;

  const toggleSound = () => {
    const nextVal = !settings.soundEnabled;
    updateSettings({ soundEnabled: nextVal });
    if (nextVal) sound.playClick();
  };

  const handleToggleTheme = () => {
    sound.playClick();
    toggleTheme();
  };

  const handleSimulateSync = () => {
    setSyncing(true);
    sound.playClick();
    setTimeout(() => {
      setSyncing(false);
    }, 1200);
  };

  const isDark = settings.theme === "dark";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] dark:border-white/[0.08] bg-white/75 dark:bg-black/75 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => { setActiveTab("map"); sound.playClick(); }}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-all">
              <span className="text-sm">⚡</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-neutral-950 dark:text-white text-base">EduChain</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-black/[0.08] dark:border-white/[0.12] text-neutral-600 dark:text-neutral-400 bg-neutral-100/80 dark:bg-white/[0.04] font-semibold">
                  v2.0
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 -mt-0.5 hidden sm:inline font-normal">Learn • Connect • Unlock</span>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 border-l border-neutral-200/80 dark:border-white/[0.08] pl-5 ml-1">
            {[
              { id: "map", label: "My Quests", icon: BookOpen },
              { id: "leaderboard", label: "Leaderboard", icon: Trophy },
              { 
                id: "analytics", 
                label: "My Progress", 
                icon: BarChart3, 
                badge: pendingMistakes > 0 ? `${pendingMistakes}` : null 
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    sound.playClick();
                  }}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-xl transition-all ${
                    isActive
                      ? "text-neutral-950 dark:text-white bg-neutral-100 dark:bg-white/[0.09] shadow-xs font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/[0.03] font-medium"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="ml-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <Link
              href="/battle"
              onClick={() => sound.playClick()}
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/[0.03]"
            >
              <Swords className="w-3.5 h-3.5 text-rose-500" />
              <span>Multiplayer</span>
              <span className="ml-0.5 text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                LIVE
              </span>
            </Link>
          </nav>
        </div>

        {/* Right Status / Scholar Stats & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Cloud Status Pill */}
          <button
            onClick={handleSimulateSync}
            title="Supabase Cloud Status"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            <Cloud className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-cyan-500" : "text-emerald-500 dark:text-emerald-400"}`} />
            <span>{syncing ? "Syncing..." : "Cloud Active"}</span>
          </button>

          {/* Streak Counter */}
          <div 
            title={`Current Streak: ${currentStreak} days`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0c0c0e] text-xs font-mono text-orange-600 dark:text-orange-400 font-bold shadow-xs"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500/20 text-orange-500 dark:text-orange-400" />
            <span>{currentStreak}d</span>
          </div>

          {/* XP Badge */}
          <div 
            title={`Total Experience Points: ${xp} XP`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0c0c0e] text-xs font-mono text-amber-600 dark:text-amber-400 font-bold shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-500/20 text-amber-500 dark:text-amber-400" />
            <span>{xp} XP</span>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={handleToggleTheme}
            aria-label={isDark ? "Switch to White / Light Mode" : "Switch to Dark Mode"}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-1.5 rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0c0c0e] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors shadow-xs"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={settings.soundEnabled ? "Mute Sound FX" : "Unmute Sound FX"}
            title={settings.soundEnabled ? "Mute Web Audio API" : "Unmute Web Audio API"}
            className="p-1.5 rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0c0c0e] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors shadow-xs"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />}
          </button>

          {/* Login button if guest */}
          {!hasSession && isGuest && onOpenAuth && (
            <button
              onClick={() => { sound.playClick(); onOpenAuth("signin"); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Scholar Profile / Avatar Button */}
          <button
            onClick={() => {
              if (onOpenProfile) onOpenProfile();
              sound.playClick();
            }}
            title="Account Details & Settings"
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-neutral-200/80 dark:border-white/[0.12] bg-white dark:bg-[#0c0c0e] hover:border-neutral-300 dark:hover:border-white/20 transition-all text-xs font-medium shadow-xs"
          >
            <span className="text-sm">{avatar || "👤"}</span>
            <span className="hidden sm:inline font-mono text-neutral-800 dark:text-neutral-200 font-semibold text-xs">
              {name || (isGuest ? "Guest Explorer" : "Scholar")}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 font-mono font-medium">
              {isGuest && xp === 0 ? "Guest" : currentRank.name}
            </span>
          </button>

        </div>

      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-200 dark:border-white/[0.06] bg-white/95 dark:bg-black/90 py-2 px-2">
        {[
          { id: "map", label: "Quests", icon: BookOpen },
          { id: "leaderboard", label: "Ranks", icon: Trophy },
          { 
            id: "analytics", 
            label: "Progress", 
            icon: BarChart3, 
            badge: pendingMistakes > 0 ? pendingMistakes : null 
          },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                sound.playClick();
              }}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] rounded transition-all relative ${
                isActive ? "text-neutral-900 dark:text-white font-semibold" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}

        <Link
          href="/battle"
          onClick={() => sound.playClick()}
          className="flex flex-col items-center gap-1 px-3 py-1 text-[11px] rounded transition-all relative text-rose-600 dark:text-rose-400 font-bold"
        >
          <div className="relative">
            <Swords className="w-4 h-4" />
            <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <span>Battle</span>
        </Link>
      </div>
    </header>
  );
};
