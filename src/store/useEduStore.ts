"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GradeType, SubjectType, MistakeRecord, QuizAttemptRecord } from "@/types/curriculum";
import { UserState } from "@/types/user";
import { RANKS, ACHIEVEMENTS } from "@/data/constants";
import { sound } from "@/lib/audio";

interface EduStoreState extends UserState {
  mistakes: MistakeRecord[];
  quizHistory: QuizAttemptRecord[];
  
  // Actions
  setProfile: (name: string, avatar: string, grade: GradeType) => void;
  updateSettings: (settings: Partial<UserState["settings"]>) => void;
  addXp: (amount: number) => void;
  recordQuizAttempt: (attempt: {
    stageId: number | string;
    subject: SubjectType;
    score: number;
    total: number;
    accuracy: number;
    xpEarned: number;
    missedQuestions: Array<{
      id: string;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }>;
  }) => void;
  masterMistake: (mistakeId: string) => void;
  checkStreak: () => void;
  toggleTheme: () => void;
  resetProgress: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const DEFAULT_STATE: UserState = {
  id: null,
  name: "Scholar",
  avatar: "🧠",
  grade: "grade_9",
  xp: 0,
  currentStreak: 1,
  longestStreak: 1,
  lastActiveDate: new Date().toISOString().split("T")[0],
  completedStages: [],
  unlockedStages: [1, 7, 13, 19], // Initial stage unlocked for each subject
  bestScores: {},
  subjectProgress: {
    mathematics: { unlockedStages: [1], completedStages: [], bestScores: {} },
    science: { unlockedStages: [7], completedStages: [], bestScores: {} },
    english: { unlockedStages: [13], completedStages: [], bestScores: {} },
    computer_science: { unlockedStages: [19], completedStages: [], bestScores: {} },
  },
  totalQuizzesAttempted: 0,
  totalQuestionsAnswered: 0,
  totalQuestionsCorrect: 0,
  totalQuestionsMissed: 0,
  totalQuestionsTimedOut: 0,
  unlockedAchievements: [],
  settings: {
    soundEnabled: true,
    volume: 0.7,
    theme: "light",
  },
};

export const useEduStore = create<EduStoreState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      mistakes: [],
      quizHistory: [],

      setProfile: (name, avatar, grade) => {
        set({ name, avatar, grade });
      },

      toggleTheme: () => {
        set((state) => {
          const nextTheme = state.settings.theme === "dark" ? "light" : "dark";
          if (typeof document !== "undefined") {
            if (nextTheme === "dark") {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }
          return {
            settings: { ...state.settings, theme: nextTheme },
          };
        });
      },

      updateSettings: (newSettings) => {
        set((state) => {
          const updated = { ...state.settings, ...newSettings };
          sound.setEnabled(updated.soundEnabled);
          sound.setVolume(updated.volume);
          if (typeof document !== "undefined" && updated.theme) {
            if (updated.theme === "dark") {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }
          return { settings: updated };
        });
      },

      addXp: (amount) => {
        set((state) => {
          const oldXp = state.xp;
          const newXp = oldXp + amount;

          // Check for Rank Level Up
          const oldRank = RANKS.slice().reverse().find((r) => oldXp >= r.minXp);
          const newRank = RANKS.slice().reverse().find((r) => newXp >= r.minXp);
          if (oldRank && newRank && newRank.level > oldRank.level) {
            sound.playUnlock();
          }

          return { xp: newXp };
        });
      },

      recordQuizAttempt: (attempt) => {
        const state = get();
        const { stageId, subject, score, total, accuracy, xpEarned, missedQuestions } = attempt;

        const dateStr = new Date().toISOString();
        const passed = accuracy >= 70;

        // Clone subject progress
        const currentSubProgress = state.subjectProgress[subject] || {
          unlockedStages: [stageId],
          completedStages: [],
          bestScores: {},
        };

        const updatedCompleted = passed && !currentSubProgress.completedStages.includes(stageId)
          ? [...currentSubProgress.completedStages, stageId]
          : currentSubProgress.completedStages;

        // Auto unlock next stage in sequence
        const nextStageId = typeof stageId === "number" ? stageId + 1 : stageId;
        const updatedUnlocked = passed && !currentSubProgress.unlockedStages.includes(nextStageId)
          ? [...currentSubProgress.unlockedStages, nextStageId]
          : currentSubProgress.unlockedStages;

        const updatedBestScores = {
          ...currentSubProgress.bestScores,
          [stageId]: Math.max(currentSubProgress.bestScores[stageId] || 0, accuracy),
        };

        // Global unions
        const globalCompleted = passed && !state.completedStages.includes(stageId)
          ? [...state.completedStages, stageId]
          : state.completedStages;

        const globalUnlocked = passed && !state.unlockedStages.includes(nextStageId)
          ? [...state.unlockedStages, nextStageId]
          : state.unlockedStages;

        // Update mistakes pool
        let updatedMistakes = [...state.mistakes];
        missedQuestions.forEach((q) => {
          const existingIdx = updatedMistakes.findIndex((m) => m.questionId === q.id);
          if (existingIdx >= 0) {
            updatedMistakes[existingIdx].timesMissed += 1;
            updatedMistakes[existingIdx].mastered = false;
            updatedMistakes[existingIdx].missedAt = dateStr;
          } else {
            updatedMistakes.push({
              id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              questionId: q.id,
              subject,
              stageId,
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation,
              missedAt: dateStr,
              mastered: false,
              timesMissed: 1,
            });
          }
        });

        // Achievements check
        const newAchievements = [...state.unlockedAchievements];
        const checkUnlock = (id: string) => {
          if (!newAchievements.includes(id)) {
            newAchievements.push(id);
            sound.playAchievement();
            const ach = ACHIEVEMENTS.find((a) => a.id === id);
            if (ach) {
              get().addXp(ach.xpReward);
            }
          }
        };

        if (passed) checkUnlock("first_link");
        if (accuracy === 100) checkUnlock("perfect_round");
        if (subject === "mathematics" && updatedCompleted.length >= 2) checkUnlock("math_explorer");
        if (subject === "science" && updatedCompleted.length >= 2) checkUnlock("science_voyager");
        if (subject === "english" && updatedCompleted.length >= 2) checkUnlock("english_scholar");
        if (subject === "computer_science" && updatedCompleted.length >= 2) checkUnlock("cs_architect");

        const allSubjectsHaveCompletion =
          (subject === "mathematics" ? updatedCompleted.length : state.subjectProgress.mathematics.completedStages.length) >= 1 &&
          (subject === "science" ? updatedCompleted.length : state.subjectProgress.science.completedStages.length) >= 1 &&
          (subject === "english" ? updatedCompleted.length : state.subjectProgress.english.completedStages.length) >= 1 &&
          (subject === "computer_science" ? updatedCompleted.length : state.subjectProgress.computer_science.completedStages.length) >= 1;

        if (allSubjectsHaveCompletion) checkUnlock("polymath");

        set({
          xp: state.xp + xpEarned,
          completedStages: globalCompleted,
          unlockedStages: globalUnlocked,
          bestScores: { ...state.bestScores, [stageId]: Math.max(state.bestScores[stageId] || 0, accuracy) },
          subjectProgress: {
            ...state.subjectProgress,
            [subject]: {
              unlockedStages: updatedUnlocked,
              completedStages: updatedCompleted,
              bestScores: updatedBestScores,
            },
          },
          totalQuizzesAttempted: state.totalQuizzesAttempted + 1,
          totalQuestionsAnswered: state.totalQuestionsAnswered + total,
          totalQuestionsCorrect: state.totalQuestionsCorrect + score,
          totalQuestionsMissed: state.totalQuestionsMissed + (total - score),
          mistakes: updatedMistakes,
          quizHistory: [
            ...state.quizHistory,
            { stageId, subject, score, total, accuracy, xpEarned, completedAt: dateStr },
          ],
          unlockedAchievements: newAchievements,
        });

        get().checkStreak();
      },

      masterMistake: (mistakeId) => {
        set((state) => {
          const updated = state.mistakes.map((m) =>
            m.id === mistakeId ? { ...m, mastered: true } : m
          );
          const masteredCount = updated.filter((m) => m.mastered).length;
          if (masteredCount >= 5 && !state.unlockedAchievements.includes("mistake_forger")) {
            sound.playAchievement();
            get().addXp(100);
          }
          return { mistakes: updated };
        });
      },

      checkStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();
        if (!state.lastActiveDate) {
          set({ lastActiveDate: today, currentStreak: 1, longestStreak: 1 });
          return;
        }

        if (state.lastActiveDate === today) return;

        const lastDate = new Date(state.lastActiveDate);
        const currDate = new Date(today);
        const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          const nextStreak = state.currentStreak + 1;
          const nextLongest = Math.max(nextStreak, state.longestStreak);
          set({ currentStreak: nextStreak, longestStreak: nextLongest, lastActiveDate: today });

          if (nextStreak >= 3 && !state.unlockedAchievements.includes("streak_starter")) {
            get().addXp(75);
          }
          if (nextStreak >= 7 && !state.unlockedAchievements.includes("streak_titan")) {
            get().addXp(150);
          }
        } else if (diffDays > 1) {
          set({ currentStreak: 1, lastActiveDate: today });
        }
      },

      resetProgress: () => {
        set({ ...DEFAULT_STATE, mistakes: [], quizHistory: [] });
      },

      exportData: () => {
        const state = get();
        return JSON.stringify(state, null, 2);
      },

      importData: (jsonData) => {
        try {
          const parsed = JSON.parse(jsonData);
          if (parsed && typeof parsed.xp === "number" && parsed.subjectProgress) {
            set({ ...parsed });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "educhain_v2_store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
