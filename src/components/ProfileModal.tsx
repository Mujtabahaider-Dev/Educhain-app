"use client";

import React, { useState } from "react";
import { useEduStore } from "@/store/useEduStore";
import { GradeType } from "@/types/curriculum";
import { GRADE_LABELS } from "@/data/constants";
import { sound } from "@/lib/audio";
import { X, Check, RotateCcw, User, ShieldAlert } from "lucide-react";

interface ProfileModalProps {
  onClose: () => void;
}

const AVATARS = ["🧠", "🦉", "🚀", "⚡", "🧬", "🧙‍♂️", "🎨", "🤖", "🛡️", "💎"];

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { name, avatar, grade, setProfile, resetProgress } = useEduStore();
  const [tempName, setTempName] = useState(name || "Scholar");
  const [tempAvatar, setTempAvatar] = useState(avatar || "🧠");
  const [tempGrade, setTempGrade] = useState<GradeType>(grade || "grade_9");
  const [showConfirmReset, setShowConfirmReset] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/15 rounded-2xl p-6 shadow-2xl relative transition-colors duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Scholar Profile</h3>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
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

        {/* Avatar Picker */}
        <div className="mb-4">
          <label className="block text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase mb-1.5">
            Select Avatar
          </label>
          <div className="grid grid-cols-5 gap-2">
            {AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => { setTempAvatar(av); sound.playClick(); }}
                className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                  tempAvatar === av
                    ? "bg-black/10 dark:bg-white/20 border-2 border-black dark:border-white scale-105"
                    : "bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10"
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Grade Selection */}
        <div className="mb-6">
          <label className="block text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase mb-1.5">
            Curriculum Grade
          </label>
          <select
            value={tempGrade}
            onChange={(e) => setTempGrade(e.target.value as GradeType)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
          >
            {Object.entries(GRADE_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-white/[0.08]">
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
              <span>Reset Save Data</span>
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
