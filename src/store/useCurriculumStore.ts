"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Stage, SubjectType, Question, SchoolClass } from "@/types/curriculum";
import { STAGES_DATA } from "@/data/curriculum";
import { SUBJECT_METADATA, DEFAULT_CLASSES } from "@/data/constants";
import { supabase } from "@/lib/supabase/client";

export interface CustomSubject {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  badgeBg?: string;
  borderColor?: string;
  grade?: string; // Links subject to a Class / Grade (e.g. "grade_9", "grade_10")
  created_at?: string;
}

export const DEFAULT_SUBJECTS: CustomSubject[] = [
  {
    id: "computer_science",
    name: "Computer Science",
    icon: "terminal",
    description: "Hardware Architecture, Binary Logic, Algorithms & Programming",
    color: "#fbbf24",
    badgeBg: "rgba(251, 191, 36, 0.1)",
    borderColor: "rgba(251, 191, 36, 0.3)",
    grade: "grade_9",
  },
  {
    id: "science",
    name: "Science",
    icon: "atom",
    description: "Physics, Chemistry, Atomic Structure & Cell Biology",
    color: "#34d399",
    badgeBg: "rgba(52, 211, 153, 0.1)",
    borderColor: "rgba(52, 211, 153, 0.3)",
    grade: "grade_9",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "calculator",
    description: "Arithmetic, Matrices, Real Numbers, Algebra & Geometry",
    color: "#38bdf8",
    badgeBg: "rgba(56, 189, 248, 0.1)",
    borderColor: "rgba(56, 189, 248, 0.3)",
    grade: "grade_9",
  },
  {
    id: "english",
    name: "English",
    icon: "languages",
    description: "Grammar, Tenses, Voice, Narration & Literary Rhetoric",
    color: "#a78bfa",
    badgeBg: "rgba(167, 139, 250, 0.1)",
    borderColor: "rgba(167, 139, 250, 0.3)",
    grade: "grade_9",
  },
];

interface CurriculumStoreState {
  customClasses: SchoolClass[];
  deletedClassIds: string[];
  customSubjects: CustomSubject[];
  customStages: Stage[];
  deletedSubjectIds: string[];
  isLoading: boolean;
  cloudSyncStatus: "checking" | "connected" | "disconnected";
  cloudSyncMessage?: string;
  
  // Actions
  checkSupabaseHealth: () => Promise<boolean>;
  pushLocalToCloud: () => Promise<{ success: boolean; stagesSynced: number; subjectsSynced: number; classesSynced: number; error?: string }>;
  addClass: (cls: SchoolClass) => Promise<{ success: boolean; cloudSynced: boolean; error?: string }>;
  updateClass: (classId: string, updatedData: Partial<SchoolClass>) => Promise<{ success: boolean; cloudSynced: boolean; error?: string }>;
  deleteClass: (classId: string) => Promise<{ success: boolean; error?: string }>;
  restoreClass: (classId: string) => Promise<{ success: boolean }>;
  restoreAllDefaultClasses: () => void;
  getAllClasses: () => SchoolClass[];
  addSubject: (subject: CustomSubject) => Promise<{ success: boolean; cloudSynced: boolean; error?: string }>;
  updateSubject: (subjectId: string, updatedData: Partial<CustomSubject>) => Promise<{ success: boolean; cloudSynced: boolean; error?: string }>;
  addStage: (stage: Stage) => Promise<{ success: boolean; cloudSynced: boolean; error?: string }>;
  updateStage: (stageId: string | number, updatedData: Partial<Stage>) => Promise<{ success: boolean; cloudSynced: boolean; error?: string }>;
  deleteStage: (stageId: string | number) => Promise<{ success: boolean; error?: string }>;
  deleteSubject: (subjectId: string) => Promise<{ success: boolean; error?: string }>;
  restoreSubject: (subjectId: string) => Promise<{ success: boolean }>;
  restoreAllDefaultSubjects: () => void;
  syncWithSupabase: () => Promise<void>;
  getAllSubjects: (grade?: string) => CustomSubject[];
  getAllStages: () => Stage[];
}

export const useCurriculumStore = create<CurriculumStoreState>()(
  persist(
    (set, get) => ({
      customClasses: [],
      deletedClassIds: [],
      customSubjects: [],
      customStages: [],
      deletedSubjectIds: [],
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

      getAllClasses: () => {
        const { customClasses, deletedClassIds = [] } = get();
        const deletedSet = new Set(deletedClassIds);
        const customIds = new Set(customClasses.map((c) => c.id));
        const filteredDefaults = DEFAULT_CLASSES.filter((c) => !customIds.has(c.id) && !deletedSet.has(c.id));
        const activeCustom = customClasses.filter((c) => !deletedSet.has(c.id));
        const all = [...filteredDefaults, ...activeCustom];
        return all.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
      },

      addClass: async (cls: SchoolClass) => {
        const cleanId = cls.id.toLowerCase().replace(/[^a-z0-9_]/g, "_");
        const formatted: SchoolClass = {
          ...cls,
          id: cleanId,
          displayOrder: cls.displayOrder ?? 99,
          icon: cls.icon || "🎓",
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          customClasses: [
            ...state.customClasses.filter((c) => c.id !== formatted.id),
            formatted,
          ],
        }));

        let cloudSynced = false;
        let cloudError: string | undefined;

        try {
          const { error } = await supabase.from("custom_classes").upsert({
            id: formatted.id,
            name: formatted.name,
            description: formatted.description,
            icon: formatted.icon,
            display_order: formatted.displayOrder,
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

      updateClass: async (classId: string, updatedData: Partial<SchoolClass>) => {
        const allClasses = get().getAllClasses();
        const existing = allClasses.find((c) => c.id === classId);
        if (!existing) return { success: false, cloudSynced: false, error: "Class not found" };

        const merged: SchoolClass = {
          ...existing,
          ...updatedData,
          id: classId,
        };

        set((state) => ({
          customClasses: [
            ...state.customClasses.filter((c) => c.id !== classId),
            merged,
          ],
        }));

        let cloudSynced = false;
        let cloudError: string | undefined;

        try {
          const { error } = await supabase.from("custom_classes").upsert({
            id: merged.id,
            name: merged.name,
            description: merged.description,
            icon: merged.icon,
            display_order: merged.displayOrder,
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

      deleteClass: async (classId: string) => {
        set((state) => ({
          deletedClassIds: Array.from(new Set([...(state.deletedClassIds || []), classId])),
          customClasses: state.customClasses.filter((c) => c.id !== classId),
        }));

        try {
          await supabase.from("custom_classes").delete().eq("id", classId);
        } catch (e) {
          console.warn("Supabase class delete error:", e);
        }

        return { success: true };
      },

      restoreClass: async (classId: string) => {
        set((state) => ({
          deletedClassIds: (state.deletedClassIds || []).filter((id) => id !== classId),
        }));
        return { success: true };
      },

      restoreAllDefaultClasses: () => {
        set({ deletedClassIds: [] });
      },

      pushLocalToCloud: async () => {
        const { customClasses, customSubjects, customStages } = get();
        let classesCount = 0;
        let subjectsCount = 0;
        let stagesCount = 0;

        try {
          // Push custom classes
          for (const cls of customClasses) {
            const { error } = await supabase.from("custom_classes").upsert({
              id: cls.id,
              name: cls.name,
              description: cls.description,
              icon: cls.icon,
              display_order: cls.displayOrder,
            });
            if (!error) classesCount++;
          }

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
              grade: sub.grade || "grade_9",
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
          return { success: true, stagesSynced: stagesCount, subjectsSynced: subjectsCount, classesSynced: classesCount };
        } catch (err: any) {
          return { success: false, stagesSynced: stagesCount, subjectsSynced: subjectsCount, classesSynced: classesCount, error: err?.message };
        }
      },

      getAllSubjects: (grade?: string) => {
        const { customSubjects, deletedSubjectIds = [] } = get();
        const deletedSet = new Set(deletedSubjectIds);
        const customIds = new Set(customSubjects.map((s) => s.id));
        const filteredDefaults = DEFAULT_SUBJECTS.filter((s) => !customIds.has(s.id) && !deletedSet.has(s.id));
        const activeCustom = customSubjects.filter((s) => !deletedSet.has(s.id));
        const all = [...filteredDefaults, ...activeCustom].map((s) => ({
          ...s,
          grade: s.grade || "grade_9",
        }));
        if (grade) {
          return all.filter((s) => s.grade === grade);
        }
        return all;
      },

      getAllStages: () => {
        const { customStages, deletedSubjectIds = [] } = get();
        const deletedSet = new Set(deletedSubjectIds);
        const customIds = new Set(customStages.map((s) => String(s.id)));
        const filteredDefaults = STAGES_DATA.filter((s) => !customIds.has(String(s.id)) && (!s.subject || !deletedSet.has(s.subject)));
        const activeCustom = customStages.filter((s) => !s.subject || !deletedSet.has(s.subject));
        return [...filteredDefaults, ...activeCustom].map((stg) => ({
          ...stg,
          grade: stg.grade || "grade_9",
        }));
      },

      addSubject: async (subject: CustomSubject) => {
        const cleanId = subject.id.toLowerCase().replace(/[^a-z0-9_]/g, "_");
        const formatted: CustomSubject = {
          ...subject,
          id: cleanId,
          grade: subject.grade || "grade_9",
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
            grade: formatted.grade,
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
          grade: updatedData.grade || existing.grade || "grade_9",
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
            grade: merged.grade,
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
          deletedSubjectIds: Array.from(new Set([...(state.deletedSubjectIds || []), subjectId])),
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

      restoreSubject: async (subjectId: string) => {
        set((state) => ({
          deletedSubjectIds: (state.deletedSubjectIds || []).filter((id) => id !== subjectId),
        }));
        return { success: true };
      },

      restoreAllDefaultSubjects: () => {
        set({ deletedSubjectIds: [] });
      },

      syncWithSupabase: async () => {
        set({ isLoading: true });
        try {
          // Fetch custom classes
          try {
            const { data: cloudClasses, error: classErr } = await supabase
              .from("custom_classes")
              .select("*")
              .order("display_order", { ascending: true });

            if (!classErr && cloudClasses) {
              const mappedClasses: SchoolClass[] = cloudClasses.map((c: any) => ({
                id: c.id,
                name: c.name,
                description: c.description || "",
                icon: c.icon || "🎓",
                displayOrder: c.display_order ?? 1,
                created_at: c.created_at,
              }));
              set({ customClasses: mappedClasses });
            }
          } catch (e) {
            console.warn("custom_classes sync check:", e);
          }

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
              grade: s.grade || "grade_9",
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
              grade: s.grade || "grade_9",
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
