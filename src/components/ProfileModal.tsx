"use client";

import React, { useState, useEffect } from "react";
import { useEduStore } from "@/store/useEduStore";
import { useCurriculumStore } from "@/store/useCurriculumStore";
import { GradeType } from "@/types/curriculum";
import { GRADE_LABELS, RANKS } from "@/data/constants";
import { sound } from "@/lib/audio";
import { supabase } from "@/lib/supabase/client";
import { 
  X, 
  Check, 
  RotateCcw, 
  User, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  Mail, 
  Sparkles,
  Zap,
  Shield,
  Crown,
  Terminal,
  Atom,
  Compass,
  Calculator,
  Languages,
  Award
} from "lucide-react";
import { ScholarAvatar, SleekIcon } from "@/components/SleekIcon";

interface ProfileModalProps {
  onClose: () => void;
  onSignOut?: () => void;
  onOpenAuth?: (mode?: "signin" | "signup") => void;
}

const AVATAR_GLYPHS = [
  { id: "sparkles", label: "Sparkles", icon: Sparkles },
  { id: "zap", label: "Energy", icon: Zap },
  { id: "shield", label: "Guardian", icon: Shield },
  { id: "crown", label: "Monarch", icon: Crown },
  { id: "terminal", label: "Coder", icon: Terminal },
  { id: "atom", label: "Scientist", icon: Atom },
  { id: "compass", label: "Explorer", icon: Compass },
  { id: "calculator", label: "Analyst", icon: Calculator },
  { id: "languages", label: "Linguist", icon: Languages },
  { id: "award", label: "Scholar", icon: Award },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  onClose,
  onSignOut,
  onOpenAuth
}) => {
  const { name, avatar, grade, xp, isGuest, setProfile, resetProgress, signOut } = useEduStore();
  const { getAllClasses } = useCurriculumStore();
  const allClasses = getAllClasses();
  const [tempName, setTempName] = useState(name || "Scholar");
  const [tempAvatar, setTempAvatar] = useState(avatar || "🧠");
  const [tempGrade, setTempGrade] = useState<GradeType>(grade || "grade_9");
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email || null);
    });
  }, []);

  const currentRank = RANKS.slice().reverse().find((r) => xp >= r.minXp) || RANKS[0];

  const handleSave = () => {
    sound.playClick();
    setProfile(tempName.trim() || "Scholar", tempAvatar, tempGrade);
    onClose();
  };

  const handleReset = () => {
    sound.playIncorrect();
    resetProgress();
    setShowConfirmReset(false);
    onClose();
  };

  const handleSignOutClick = async () => {
    setIsSigningOut(true);
    sound.playClick();
    await supabase.auth.signOut();
    signOut();
    setIsSigningOut(false);
    onClose();
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/15 rounded-2xl p-6 shadow-2xl relative transition-colors duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Account Details</h3>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account Status Card */}
        <div className="mb-5 p-3.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ScholarAvatar name={tempName} avatar={tempAvatar} size="md" />
              <div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <span>{name || "Scholar"}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
                    {currentRank.name}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                  {userEmail ? (
                    <>
                      <Mail className="w-3 h-3 text-emerald-500" />
                      <span className="truncate max-w-[200px]">{userEmail}</span>
                    </>
                  ) : (
                    <span>Guest Mode (Local Only)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                <Zap className="w-3 h-3 fill-current" />
                <span>{xp} XP</span>
              </div>
            </div>
          </div>

          {/* Cloud Sync Status */}
          <div className="mt-2.5 pt-2 border-t border-neutral-200/60 dark:border-white/5 flex items-center justify-between text-[11px]">
            {userEmail ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cloud Connected via Supabase</span>
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">
                ⚠️ Progress is stored only in this browser
              </span>
            )}

            {!userEmail && onOpenAuth && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth("signup");
                }}
                className="text-xs font-semibold text-sky-600 dark:text-cyan-400 hover:underline"
              >
                Sign Up to Sync
              </button>
            )}
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase mb-1.5">
            Scholar Name
          </label>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            maxLength={25}
            className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
          />
        </div>

        {/* Avatar Glyph Picker */}
        <div className="mb-4">
          <label className="block text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase mb-1.5">
            Select Scholar Insignia
          </label>
          <div className="grid grid-cols-5 gap-2">
            {AVATAR_GLYPHS.map((item) => {
              const Icon = item.icon;
              const isSelected = tempAvatar === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setTempAvatar(item.id); sound.playClick(); }}
                  title={item.label}
                  className={`h-11 rounded-xl flex flex-col items-center justify-center gap-1 transition-all border ${
                    isSelected
                      ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs scale-105"
                      : "bg-neutral-50 dark:bg-[#141414] border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-black/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-mono leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Academic Enrolled Class Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase">
              Enrolled Class / Grade
            </label>
            <span className="text-[10px] font-mono text-neutral-500">
              Tailors curriculum on dashboard
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
            {allClasses.map((cls) => {
              const isSelected = tempGrade === cls.id;
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => {
                    setTempGrade(cls.id as GradeType);
                    sound.playClick();
                  }}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-black dark:border-white bg-black/[0.04] dark:bg-white/[0.06] shadow-xs"
                      : "border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-[#141414]/50 hover:border-black/20 dark:hover:border-white/20"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-neutral-200/70 dark:bg-white/10 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    <SleekIcon name={cls.id || cls.icon} className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {cls.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    </div>
                    {cls.description && (
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {cls.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SIGN OUT BUTTON (Requested in Account Details Popup) */}
        <div className="mb-5 pt-3 border-t border-neutral-200 dark:border-white/[0.08]">
          {userEmail ? (
            <button
              type="button"
              onClick={handleSignOutClick}
              disabled={isSigningOut}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span>{isSigningOut ? "Signing Out..." : "Sign Out of Account"}</span>
            </button>
          ) : (
            onOpenAuth && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth("signin");
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-cyan-400 hover:bg-sky-500/20 text-xs font-semibold transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )
          )}
        </div>

        {/* Save & Reset Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-white/[0.08]">
          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-medium hover:bg-rose-500/20"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="text-xs text-rose-600/80 dark:text-rose-400/80 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Progress</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="btn-vercel-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
};
