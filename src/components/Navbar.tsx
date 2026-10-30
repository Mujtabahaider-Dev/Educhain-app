"use client";

import React, { useState } from "react";
import { useEduStore } from "@/store/useEduStore";
import { sound } from "@/lib/audio";
import { RANKS } from "@/data/constants";
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Cloud, 
  ShieldCheck, 
  Award,
  BookOpen,
  Hammer,
  BarChart3,
  Trophy,
  Sun,
  Moon,
  Globe,
  LogIn,
  LogOut
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
  onOpenLanding,
  onOpenAuth,
  onSignOut,
}) => {
  const { xp, currentStreak, settings, updateSettings, toggleTheme, mistakes, name, avatar, signOut } = useEduStore();
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

  const handleSignOut = async () => {
    sound.playClick();
    await supabase.auth.signOut();
    signOut();
    setHasSession(false);
    if (onSignOut) {
      onSignOut();
    } else if (onOpenLanding) {
      onOpenLanding();
    }
  };

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
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-white/[0.08] bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => { setActiveTab("map"); sound.playClick(); }}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              ⛓️
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-neutral-900 dark:text-white text-base">EduChain</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.03]">
                  v2.0
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 -mt-0.5 hidden sm:inline">Learn • Connect • Unlock</span>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 border-l border-neutral-200 dark:border-white/[0.08] pl-6 ml-2">
            {[
              { id: "map", label: "My Quests", icon: BookOpen },
              { id: "forge", label: "Review Errors", icon: Hammer, badge: pendingMistakes > 0 ? pendingMistakes : null },
              { id: "leaderboard", label: "Leaderboard", icon: Trophy },
              { id: "analytics", label: "My Progress", icon: BarChart3 },
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
                  className={`relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    isActive
                      ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-white/[0.08] border border-neutral-200 dark:border-white/15 shadow-sm dark:shadow-none"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/20 dark:border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Status / Scholar Stats */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Landing Page Shortcut */}
          {onOpenLanding && (
            <button
              onClick={() => { sound.playClick(); onOpenLanding(); }}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
          )}

          {/* Cloud Status Pill */}
          <button
            onClick={handleSimulateSync}
            title="Supabase Cloud Status"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <Cloud className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-cyan-500" : "text-emerald-500 dark:text-emerald-400"}`} />
            <span>{syncing ? "Syncing..." : "Cloud Live"}</span>
          </button>

          {/* Streak Counter */}
          <div 
            title={`Current Streak: ${currentStreak} days`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.02] text-xs font-mono text-orange-600 dark:text-orange-400"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500/20 text-orange-500 dark:text-orange-400" />
            <span className="font-semibold">{currentStreak}d</span>
          </div>

          {/* XP Badge */}
          <div 
            title={`Total Experience Points: ${xp} XP`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.02] text-xs font-mono text-amber-600 dark:text-amber-300"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-500/20 text-amber-500 dark:text-amber-300" />
            <span className="font-semibold">{xp} XP</span>
          </div>

          {/* Theme Switcher Toggle (White Mode / Dark Mode) */}
          <button
            onClick={handleToggleTheme}
            aria-label={isDark ? "Switch to White / Light Mode" : "Switch to Dark Mode"}
            title={isDark ? "Switch to White Mode" : "Switch to Dark Mode"}
            className="p-1.5 rounded-md border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-white/20 transition-colors"
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
            className="p-1.5 rounded-md border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-white/20 transition-colors"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />}
          </button>

          {/* Auth Button: Login vs Sign Out */}
          {hasSession ? (
            <button
              onClick={handleSignOut}
              title="Sign Out of Supabase"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-rose-600 dark:text-rose-400 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            onOpenAuth && (
              <button
                onClick={() => { sound.playClick(); onOpenAuth("signin"); }}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )
          )}

          {/* Scholar Profile / Avatar */}
          <button
            onClick={() => {
              if (onOpenProfile) onOpenProfile();
              sound.playClick();
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-neutral-200 dark:border-white/[0.12] bg-neutral-50 dark:bg-white/[0.04] hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:border-neutral-300 dark:hover:border-white/25 transition-all text-xs font-medium"
          >
            <span className="text-sm">{avatar || "🧠"}</span>
            <span className="hidden sm:inline font-mono text-neutral-800 dark:text-neutral-200">{name || "Scholar"}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
              {currentRank.name}
            </span>
          </button>

        </div>

      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-200 dark:border-white/[0.06] bg-white/95 dark:bg-black/90 py-2 px-2">
        {[
          { id: "map", label: "Quests", icon: BookOpen },
          { id: "forge", label: "Errors", icon: Hammer, badge: pendingMistakes > 0 ? pendingMistakes : null },
          { id: "leaderboard", label: "Ranks", icon: Trophy },
          { id: "analytics", label: "Progress", icon: BarChart3 },
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
              className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] rounded transition-all ${
                isActive ? "text-neutral-900 dark:text-white font-semibold" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
