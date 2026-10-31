"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Stage, SubjectType, Question } from "@/types/curriculum";
import { STAGES_DATA } from "@/data/curriculum";
import { SUBJECT_METADATA } from "@/data/constants";
import { supabase } from "@/lib/supabase/client";

export interface CustomSubject {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  badgeBg?: string;
  borderColor?: string;
  created_at?: string;
}

export const DEFAULT_SUBJECTS: CustomSubject[] = [
  {
    id: "computer_science",
    name: "Computer Science",
    icon: "💻",
    description: "Hardware Architecture, Binary Logic, Algorithms & Programming",
    color: "#fbbf24",
    badgeBg: "rgba(251, 191, 36, 0.1)",
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  {
    id: "science",
    name: "Science",
    icon: "🧬",
    description: "Physics, Chemistry, Atomic Structure & Cell Biology",
    color: "#34d399",
    badgeBg: "rgba(52, 211, 153, 0.1)",
    borderColor: "rgba(52, 211, 153, 0.3)",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "📐",
    description: "Arithmetic, Matrices, Real Numbers, Algebra & Geometry",
    color: "#38bdf8",
    badgeBg: "rgba(56, 189, 248, 0.1)",
    borderColor: "rgba(56, 189, 248, 0.3)",
  },
  {
    id: "english",
    name: "English",
    icon: "📖",
    description: "Grammar, Tenses, Voice, Narration & Literary Rhetoric",
    color: "#a78bfa",
    badgeBg: "rgba(167, 139, 250, 0.1)",
    borderColor: "rgba(167, 139, 250, 0.3)",
  },
];

interface CurriculumStoreState {
  customSubjects: CustomSubject[];
  customStages: Stage[];
  isLoading: boolean;
  cloudSyncStatus: "checking" | "connected" | "disconnected";
  cloudSyncMessage?: string;
  
  // Actions
  checkSupabaseHealth: () => Promise<boolean>;
  pushLocalToCloud: () => Promise<{ success: boolean; stagesSynced: number; subjectsSynced: number; error?: string }>;
  addSubject: (subject: CustomSubject) => Promise<{ success: boolean; cloudSynced: boolean; error?: string }>;
  updateSubject: (subjectId: string, updatedData: Partial<CustomSubject>) => Promise<{ success: boolean; cloudSynced: boolean; error?: string }>;
  addStage: (stage: Stage) => Promise<{ success: boolean; cloudSynced: boolean; error?: string }>;
  updateStage: (stageId: string | number, updatedData: Partial<Stage>) => Promise<{ success: boolean; cloudSynced: boolean; error?: string }>;
  deleteStage: (stageId: string | number) => Promise<{ success: boolean; error?: string }>;
  deleteSubject: (subjectId: string) => Promise<{ success: boolean; error?: string }>;
  syncWithSupabase: () => Promise<void>;
  getAllSubjects: () => CustomSubject[];
  getAllStages: () => Stage[];
}

export const useCurriculumStore = create<CurriculumStoreState>()(
  persist(
    (set, get) => ({
      customSubjects: [],
      customStages: [],
      isLoading: false,
      cloudSyncStatus: "checking",
      cloudSyncMessage: undefined,

      checkSupabaseHealth: async () => {
        try {
          const { error } = await supabase.from("custom_stages").select("id").limit(1);
          if (error) {
            set({ 
              cloudSyncStatus: "disconnected", 
              cloudSyncMessage: error.message || "Table 'custom_stages' not found in Supabase" 
            });
            return false;
          }
          set({ 
            cloudSyncStatus: "connected", 
            cloudSyncMessage: "Connected to Supabase cloud database" 
          });
          return true;
        } catch (e: any) {
          set({ 
            cloudSyncStatus: "disconnected", 
            cloudSyncMessage: e?.message || "Failed to connect to Supabase" 
          });
          return false;
        }
      },

      pushLocalToCloud: async () => {
        const { customSubjects, customStages } = get();
        let stagesCount = 0;
        let subjectsCount = 0;

        try {
          // Push custom subjects
          for (const sub of customSubjects) {
            const { error } = await supabase.from("custom_subjects").upsert({
              id: sub.id,
              name: sub.name,
              icon: sub.icon,
              description: sub.description,
              color: sub.color,
              badge_bg: sub.badgeBg,
              border_color: sub.borderColor,
            });
            if (!error) subjectsCount++;
          }

          // Push custom stages with questions
          for (const stg of customStages) {
            const { error } = await supabase.from("custom_stages").upsert({
              id: String(stg.id),
              subject_id: stg.subject,
              subject_name: stg.subjectName,
              subject_stage_number: stg.subjectStageNumber || 1,
              grade: stg.grade || "grade_9",
              chapter: stg.chapter,
              topic: stg.topic,
              title: stg.title,
              description: stg.description,
              learning_objective: stg.learningObjective,
              difficulty: stg.difficulty || "Medium",
              xp_reward: stg.xpReward || 100,
              questions: stg.questions,
            });
            if (!error) stagesCount++;
          }

          set({ cloudSyncStatus: "connected", cloudSyncMessage: "All local data synced to Supabase" });
          return { success: true, stagesSynced: stagesCount, subjectsSynced: subjectsCount };
        } catch (err: any) {
          return { success: false, stagesSynced: stagesCount, subjectsSynced: subjectsCount, error: err?.message };
        }
      },

      getAllSubjects: () => {
        const { customSubjects } = get();
        const customIds = new Set(customSubjects.map((s) => s.id));
        const filteredDefaults = DEFAULT_SUBJECTS.filter((s) => !customIds.has(s.id));
        return [...filteredDefaults, ...customSubjects];
      },

      getAllStages: () => {
        const { customStages } = get();
        const customIds = new Set(customStages.map((s) => String(s.id)));
        const filteredDefaults = STAGES_DATA.filter((s) => !customIds.has(String(s.id)));
        return [...filteredDefaults, ...customStages];
      },

      addSubject: async (subject: CustomSubject) => {
        const cleanId = subject.id.toLowerCase().replace(/[^a-z0-9_]/g, "_");
        const formatted: CustomSubject = {
          ...subject,
          id: cleanId,
          badgeBg: subject.badgeBg || `${subject.color}1a`,
          borderColor: subject.borderColor || `${subject.color}4d`,
          created_at: new Date().toISOString(),
        };

        // 1. Update local state immediately
        set((state) => ({
          customSubjects: [
            ...state.customSubjects.filter((s) => s.id !== formatted.id),
            formatted,
          ],
        }));

        // 2. Try persisting to Supabase if table exists
        let cloudSynced = false;
        let cloudError: string | undefined;

        try {
          const { error } = await supabase.from("custom_subjects").upsert({
            id: formatted.id,
            name: formatted.name,
            icon: formatted.icon,
            description: formatted.description,
            color: formatted.color,
            badge_bg: formatted.badgeBg,
            border_color: formatted.borderColor,
          });

          if (error) {
            cloudError = error.message;
            set({ cloudSyncStatus: "disconnected", cloudSyncMessage: error.message });
          } else {
            cloudSynced = true;
            set({ cloudSyncStatus: "connected" });
          }
        } catch (e: any) {
          cloudError = e?.message;
          set({ cloudSyncStatus: "disconnected", cloudSyncMessage: e?.message });
        }

        return { success: true, cloudSynced, error: cloudError };
      },

      updateSubject: async (subjectId: string, updatedData: Partial<CustomSubject>) => {
        const allSubs = get().getAllSubjects();
        const existing = allSubs.find((s) => s.id === subjectId);
        if (!existing) return { success: false, cloudSynced: false, error: "Subject not found" };

        const merged: CustomSubject = {
          ...existing,
          ...updatedData,
          id: subjectId,
        };

        set((state) => ({
          customSubjects: [
            ...state.customSubjects.filter((s) => s.id !== subjectId),
            merged,
          ],
        }));

        let cloudSynced = false;
        let cloudError: string | undefined;

        try {
          const { error } = await supabase.from("custom_subjects").upsert({
            id: merged.id,
            name: merged.name,
            icon: merged.icon,
            description: merged.description,
            color: merged.color,
            badge_bg: merged.badgeBg,
            border_color: merged.borderColor,
          });

          if (error) {
            cloudError = error.message;
          } else {
            cloudSynced = true;
          }
        } catch (e: any) {
          cloudError = e?.message;
        }

        return { success: true, cloudSynced, error: cloudError };
      },

      addStage: async (stage: Stage) => {
        const stageId = stage.id || `custom_${Date.now()}`;
        const formatted: Stage = {
          ...stage,
          id: stageId,
        };

        // 1. Update local state immediately
        set((state) => ({
          customStages: [
            ...state.customStages.filter((s) => String(s.id) !== String(stageId)),
            formatted,
          ],
        }));

        // 2. Try persisting to Supabase if table exists
        let cloudSynced = false;
        let cloudError: string | undefined;

        try {
          const { error } = await supabase.from("custom_stages").upsert({
            id: String(stageId),
            subject_id: formatted.subject,
            subject_name: formatted.subjectName,
            subject_stage_number: formatted.subjectStageNumber || 1,
            grade: formatted.grade || "grade_9",
            chapter: formatted.chapter,
            topic: formatted.topic,
            title: formatted.title,
            description: formatted.description,
            learning_objective: formatted.learningObjective,
            difficulty: formatted.difficulty || "Medium",
            xp_reward: formatted.xpReward || 100,
            questions: formatted.questions,
          });

          if (error) {
            cloudError = error.message;
            set({ cloudSyncStatus: "disconnected", cloudSyncMessage: error.message });
          } else {
            cloudSynced = true;
            set({ cloudSyncStatus: "connected" });
          }
        } catch (e: any) {
          cloudError = e?.message;
          set({ cloudSyncStatus: "disconnected", cloudSyncMessage: e?.message });
        }

        return { success: true, cloudSynced, error: cloudError };
      },

      updateStage: async (stageId: string | number, updatedData: Partial<Stage>) => {
        const currentStages = get().getAllStages();
        const existing = currentStages.find((s) => String(s.id) === String(stageId));
        if (!existing) return { success: false, cloudSynced: false, error: "Stage not found" };

        const merged: Stage = {
          ...existing,
          ...updatedData,
          id: stageId,
        };

        set((state) => ({
          customStages: [
            ...state.customStages.filter((s) => String(s.id) !== String(stageId)),
            merged,
          ],
        }));

        let cloudSynced = false;
        let cloudError: string | undefined;

        try {
          const { error } = await supabase.from("custom_stages").upsert({
            id: String(stageId),
            subject_id: merged.subject,
            subject_name: merged.subjectName,
            subject_stage_number: merged.subjectStageNumber || 1,
            grade: merged.grade || "grade_9",
            chapter: merged.chapter,
            topic: merged.topic,
            title: merged.title,
            description: merged.description,
            learning_objective: merged.learningObjective,
            difficulty: merged.difficulty || "Medium",
            xp_reward: merged.xpReward || 100,
            questions: merged.questions,
          });

          if (error) {
            cloudError = error.message;
          } else {
            cloudSynced = true;
          }
        } catch (e: any) {
          cloudError = e?.message;
        }

        return { success: true, cloudSynced, error: cloudError };
      },

      deleteStage: async (stageId: string | number) => {
        set((state) => ({
          customStages: state.customStages.filter((s) => String(s.id) !== String(stageId)),
        }));

        try {
          await supabase.from("custom_stages").delete().eq("id", String(stageId));
        } catch (e) {
          console.warn("Supabase stage delete error:", e);
        }

        return { success: true };
      },

      deleteSubject: async (subjectId: string) => {
        set((state) => ({
          customSubjects: state.customSubjects.filter((s) => s.id !== subjectId),
          customStages: state.customStages.filter((s) => s.subject !== subjectId),
        }));

        try {
          await supabase.from("custom_subjects").delete().eq("id", subjectId);
          await supabase.from("custom_stages").delete().eq("subject_id", subjectId);
        } catch (e) {
          console.warn("Supabase subject delete error:", e);
        }

        return { success: true };
      },

      syncWithSupabase: async () => {
        set({ isLoading: true });
        try {
          // Fetch custom subjects
          const { data: cloudSubjects, error: subErr } = await supabase
            .from("custom_subjects")
            .select("*");

          if (!subErr && cloudSubjects) {
            const mappedSubs: CustomSubject[] = cloudSubjects.map((s: any) => ({
              id: s.id,
              name: s.name,
              icon: s.icon || "📚",
              description: s.description || "",
              color: s.color || "#38bdf8",
              badgeBg: s.badge_bg,
              borderColor: s.border_color,
            }));
            set({ customSubjects: mappedSubs });
          }

          // Fetch custom stages
          const { data: cloudStages, error: stageErr } = await supabase
            .from("custom_stages")
            .select("*");

          if (!stageErr && cloudStages) {
            const mappedStages: Stage[] = cloudStages.map((s: any) => ({
              id: s.id,
              subject: s.subject_id as SubjectType,
              subjectName: s.subject_name,
              subjectStageNumber: s.subject_stage_number,
              grade: s.grade,
              chapter: s.chapter,
              topic: s.topic,
              title: s.title,
              description: s.description,
              learningObjective: s.learning_objective,
              difficulty: s.difficulty,
              xpReward: s.xp_reward,
              questions: Array.isArray(s.questions) ? s.questions : [],
            }));
            set({ customStages: mappedStages });
          }
        } catch (e) {
          console.warn("Cloud sync error:", e);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "educhain-custom-curriculum-storage",
    }
  )
);
