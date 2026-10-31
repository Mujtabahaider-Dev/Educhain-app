"use client";

import React, { useState } from "react";
import { 
  X, 
  Swords, 
  Users, 
  Clock, 
  BookOpen, 
  Layers, 
  Sparkles, 
  Globe, 
  Lock,
  ChevronRight
} from "lucide-react";
import { useCurriculumStore } from "@/store/useCurriculumStore";
import { useMultiplayerStore } from "@/store/useMultiplayerStore";
import { useEduStore } from "@/store/useEduStore";
import { RoomMode } from "@/types/multiplayer";
import { sound } from "@/lib/audio";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (roomCode: string) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { getAllSubjects, getAllStages } = useCurriculumStore();
  const { createRoom, localPlayerId, localPlayerName, localPlayerAvatar } = useMultiplayerStore();
  const { name, avatar } = useEduStore();

  const allSubjects = getAllSubjects();
  const allStages = getAllStages();

  const [roomName, setRoomName] = useState(`${name || "Scholar"}'s Battle Arena`);
  const [subjectId, setSubjectId] = useState(allSubjects[0]?.id || "computer_science");
  const [chapter, setChapter] = useState<string>("all");
  const [mode, setMode] = useState<RoomMode>("duel");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(15);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter available chapters for selected subject
  const stagesForSubject = allStages.filter((s) => s.subject === subjectId);
  const distinctChapters = Array.from(new Set(stagesForSubject.map((s) => s.chapter))).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    sound.playClick();

    const selectedSubjectObj = allSubjects.find((s) => s.id === subjectId) || allSubjects[0];

    const hostId = localPlayerId || `user_${Date.now()}`;
    const hostName = name || localPlayerName || "Scholar";
    const hostAvatar = avatar || localPlayerAvatar || "🧠";

    const res = await createRoom({
      roomName: roomName.trim() || `${hostName}'s Battle`,
      hostId,
      hostName,
      hostAvatar,
      mode,
      subjectId,
      subjectName: selectedSubjectObj.name,
      chapter: chapter === "all" ? null : chapter,
      questionCount,
      timePerQuestion,
      isPublic,
    });

    setIsSubmitting(false);

    if (res.success && res.roomCode) {
      sound.playUnlock();
      onClose();
      if (onSuccess) onSuccess(res.roomCode);
    } else {
      setErrorMessage(res.error || "Failed to create room. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Create Battle Room
              </h3>
              <p className="text-xs text-neutral-500">
                Configure quiz scope, timers, and challenge your friends
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Room Name */}
          <div>
            <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
              Room Title
            </label>
            <input
              type="text"
              required
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Ahmed's CS Showdown"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-white/20 transition-all"
            />
          </div>

          {/* Room Mode (1v1 Duel vs Party) */}
          <div>
            <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode("duel");
                }}
                className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  mode === "duel"
                    ? "border-amber-500/40 bg-amber-500/10 text-neutral-900 dark:text-white shadow-sm ring-1 ring-amber-500/40"
                    : "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-xs">1v1 Duel</span>
                </div>
                <span className="text-[11px] text-neutral-500">
                  Head-to-head clash (2 players max)
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode("party");
                }}
                className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  mode === "party"
                    ? "border-purple-500/40 bg-purple-500/10 text-neutral-900 dark:text-white shadow-sm ring-1 ring-purple-500/40"
                    : "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="font-bold text-xs">Classroom / Party</span>
                </div>
                <span className="text-[11px] text-neutral-500">
                  Group leaderboard (2–12+ players)
                </span>
              </button>
            </div>
          </div>

          {/* Subject & Chapter Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setChapter("all");
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                {allSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id} className="dark:bg-neutral-900">
                    {sub.icon} {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                Chapter Scope
              </label>
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                <option value="all" className="dark:bg-neutral-900">📚 All Chapters (Full Subject)</option>
                {distinctChapters.map((chp) => (
                  <option key={chp} value={chp} className="dark:bg-neutral-900">
                    {chp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions & Timer Tuning */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Question Count</span>
              </label>
              <div className="flex rounded-xl border border-neutral-200 dark:border-white/10 overflow-hidden bg-neutral-50 dark:bg-white/[0.02]">
                {[5, 7, 10].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setQuestionCount(count);
                    }}
                    className={`flex-1 py-2 text-xs font-bold transition-colors ${
                      questionCount === count
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-500" />
                <span>Time per Q</span>
              </label>
              <div className="flex rounded-xl border border-neutral-200 dark:border-white/10 overflow-hidden bg-neutral-50 dark:bg-white/[0.02]">
                {[10, 15, 20].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTimePerQuestion(sec);
                    }}
                    className={`flex-1 py-2 text-xs font-bold transition-colors ${
                      timePerQuestion === sec
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy Toggle (Public vs Private) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              {isPublic ? (
                <Globe className="w-4 h-4 text-emerald-500" />
              ) : (
                <Lock className="w-4 h-4 text-amber-500" />
              )}
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  {isPublic ? "Public Room" : "Private Room"}
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  {isPublic ? "Listed on open rooms board" : "Only accessible via code or direct link"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsPublic(!isPublic);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                isPublic ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  isPublic ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-vercel-primary py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            <span>{isSubmitting ? "Generating Room..." : "Create Battle Room & Open Lobby"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
