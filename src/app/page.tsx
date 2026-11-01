"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { StageCard } from "@/components/StageCard";
import { QuizModal } from "@/components/QuizModal";
import { Leaderboard } from "@/components/Leaderboard";
import { AnalyticsView } from "@/components/AnalyticsView";
import { ProfileModal } from "@/components/ProfileModal";
import { AuthModal } from "@/components/AuthModal";
import { LandingPage } from "@/components/LandingPage";
import { HowItWorksBanner } from "@/components/HowItWorksBanner";
import { NextQuestHero } from "@/components/NextQuestHero";
import { SleekBadgeIcon } from "@/components/SleekIcon";
import { useEduStore } from "@/store/useEduStore";
import { useCurriculumStore } from "@/store/useCurriculumStore";
import { supabase } from "@/lib/supabase/client";
import { GradeType, Stage, SubjectType } from "@/types/curriculum";
import { GRADE_SHORT_LABELS } from "@/data/constants";
import { sound } from "@/lib/audio";

const CHAPTER_WORDS = [
  "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"
];

interface ChapterGroup {
  chapterIndex: number;
  chapterWord: string;
  chapterName: string;
  stages: Stage[];
}

interface SubjectGroup {
  subject: SubjectType;
  subjectMeta: {
    id: string;
    name: string;
    icon: string;
    description: string;
    color: string;
  };
  chapters: ChapterGroup[];
  totalStages: number;
}

export default function Home() {
  const [viewMode, setViewMode] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState<string>("map");
  const [selectedSubject, setSelectedSubject] = useState<string>("computer_science");
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const {
    grade,
    completedStages,
    unlockedStages,
    bestScores,
    subjectProgress,
    settings,
    setProfile,
    loadCloudProfile,
  } = useEduStore();

  const { getAllStages, getAllSubjects, syncWithSupabase } = useCurriculumStore();
  const allStages = getAllStages();
  const allSubjects = getAllSubjects();

  useEffect(() => {
    syncWithSupabase();
  }, [syncWithSupabase]);

  // Listen for Supabase Auth state changes (e.g. Email confirmation or session restore)
  useEffect(() => {
    const syncUser = async (user: any) => {
      const meta = user.user_metadata || {};
      
      // Fetch user's saved progress from Supabase profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        loadCloudProfile({
          id: user.id,
          name: profile.player_name || meta.name || "Scholar",
          avatar: profile.player_avatar || meta.avatar || "🧠",
          grade: (profile.player_grade as GradeType) || (meta.grade as GradeType) || "grade_9",
          xp: profile.xp || 0,
          currentStreak: profile.current_streak || 0,
          longestStreak: profile.longest_streak || 0,
          completedStages: profile.completed_stages_list || [],
          unlockedStages: profile.subject_progress
            ? Object.values(profile.subject_progress as Record<string, any>).flatMap((s: any) => s.unlockedStages || [])
            : [1, 7, 13, 19],
          subjectProgress: profile.subject_progress || undefined,
          unlockedAchievements: profile.unlocked_achievements || [],
          totalQuizzesAttempted: profile.quizzes_attempted || 0,
          totalQuestionsAnswered: profile.questions_answered || 0,
          totalQuestionsCorrect: profile.questions_correct || 0,
        });
      } else {
        setProfile(meta.name || "Scholar", meta.avatar || "🧠", (meta.grade as GradeType) || "grade_9");
      }
      setViewMode("app");
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUser(session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setViewMode("landing");
        return;
      }
      if (session?.user) {
        syncUser(session.user);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setProfile, loadCloudProfile]);

  // Ensure HTML has correct class on mount based on store
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (settings.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [settings.theme]);

  // Filter stages by Grade and selected Subject (Merged from base + custom stages)
  const filteredStages = useMemo(() => {
    return allStages.filter((stage) => {
      const stageGrade = stage.grade || "grade_9";
      const matchesGrade = stageGrade === grade;
      return matchesGrade && stage.subject === selectedSubject;
    });
  }, [allStages, grade, selectedSubject]);

  // Classify by Subject -> Then Chapter (e.g. Chapter One) -> Then Stages
  const subjectGroups = useMemo(() => {
    const subStages = filteredStages;
    if (subStages.length === 0) return [];

    const subKey = selectedSubject as SubjectType;
    const currentSubjectObj = allSubjects.find((s) => s.id === subKey) || {
      id: subKey,
      name: subKey.replace("_", " "),
      icon: "📚",
      description: "Curriculum Track",
      color: "#38bdf8",
    };

    const chaptersMap = new Map<string, Stage[]>();

    subStages.forEach((stage) => {
      const chap = stage.chapter || "Core Curriculum";
      if (!chaptersMap.has(chap)) {
        chaptersMap.set(chap, []);
      }
      chaptersMap.get(chap)!.push(stage);
    });

    const chapters: ChapterGroup[] = Array.from(chaptersMap.entries()).map(([chapterName, stages], idx) => ({
      chapterIndex: idx + 1,
      chapterWord: CHAPTER_WORDS[idx] || `${idx + 1}`,
      chapterName,
      stages,
    }));

    return [{
      subject: subKey,
      subjectMeta: currentSubjectObj,
      chapters,
      totalStages: subStages.length,
    }];
  }, [filteredStages, selectedSubject, allSubjects]);

  const handleNextStage = () => {
    if (!selectedStage || !selectedStage.subject) return;
    const currentSubjectStages = allStages.filter((s) => s.subject === selectedStage.subject);
    const nextStage = currentSubjectStages.find(
      (s) => s.subjectStageNumber && selectedStage.subjectStageNumber && s.subjectStageNumber === selectedStage.subjectStageNumber + 1
    );

    if (nextStage) {
      setSelectedStage(nextStage);
    } else {
      setSelectedStage(null);
    }
  };

  const openAuthModal = (mode: "signin" | "signup" = "signin") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* VIEW 1: LANDING PAGE */}
      {/* ======================================================== */}
      {viewMode === "landing" ? (
        <LandingPage
          onEnterApp={() => setViewMode("app")}
          onOpenAuth={openAuthModal}
        />
      ) : (
        /* ======================================================== */
        /* VIEW 2: STUDENT INTERACTIVE WORKSPACE */
        /* ======================================================== */
        <div className="min-h-screen bg-white dark:bg-black text-[#111827] dark:text-[#ededed] flex flex-col vercel-grid relative selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
          
          {/* Top subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 vercel-glow pointer-events-none -z-10" />

          {/* Global Navbar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenAuth={openAuthModal}
          />

          {/* Main Content Area */}
          <main className="flex-grow">
            
            {/* ======================================================== */}
            {/* TAB 1: CURRICULUM CHAIN MAP */}
            {/* ======================================================== */}
            {activeTab === "map" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-in fade-in duration-300">
                
                {/* 1. Quick Onboarding 3-Step Banner (Dismissible) */}
                <HowItWorksBanner />

                {/* 2. Sleek Next Quest Hero & Dynamic Subject Selectors */}
                <NextQuestHero
                  stages={allStages.filter((s) => (s.grade || "grade_9") === grade)}
                  selectedSubject={selectedSubject}
                  onSelectSubject={(sub) => setSelectedSubject(sub)}
                  onStartStage={(stage) => setSelectedStage(stage)}
                />

                {/* 3. Hierarchical Classification: Single Subject Header -> Chapter (e.g. Chapter One) -> Stages */}
                <div className="space-y-12">
                  {subjectGroups.length > 0 ? (
                    subjectGroups.map((group) => (
                    <section key={group.subject} className="space-y-6">
                      
                      {/* Single, Clean Subject Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-black/[0.08] dark:border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <SleekBadgeIcon name={group.subject} color={group.subjectMeta.color} size="lg" />
                          <div>
                            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                              {group.subjectMeta.name}
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                              {group.subjectMeta.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400">
                          {group.totalStages} Stages
                        </span>
                      </div>

                      {/* Chapters inside this Subject */}
                      <div className="space-y-8 pl-1 sm:pl-2">
                        {group.chapters.map((chapter) => (
                          <div key={chapter.chapterName} className="space-y-4">
                            
                            {/* Chapter Header: Like "Chapter One • Matrices and Determinants" */}
                            <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.05] dark:border-white/[0.06]">
                              <div className="flex items-center gap-2.5">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black">
                                  Chapter {chapter.chapterWord}
                                </span>
                                <h3 className="text-sm sm:text-[15px] font-semibold text-neutral-900 dark:text-white">
                                  {chapter.chapterName}
                                </h3>
                              </div>
                              <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                                {chapter.stages.length} {chapter.stages.length === 1 ? "Stage" : "Stages"}
                              </span>
                            </div>

                            {/* Stages Grid (No change to StageCard, all stages open) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {chapter.stages.map((stage) => {
                                const subProgress = (stage.subject ? subjectProgress[stage.subject] : null) || {
                                  unlockedStages: [],
                                  completedStages: [],
                                  bestScores: {},
                                };

                                const isUnlocked = true; // All chapters open to practice directly
                                const isCompleted = subProgress.completedStages.includes(stage.id) || completedStages.includes(stage.id);
                                const stageBestScore = subProgress.bestScores[stage.id] || bestScores[stage.id] || 0;

                                return (
                                  <StageCard
                                    key={stage.id}
                                    stage={stage}
                                    isUnlocked={isUnlocked}
                                    isCompleted={isCompleted}
                                    bestScore={stageBestScore}
                                    onSelect={(s) => setSelectedStage(s)}
                                  />
                                );
                              })}
                            </div>

                          </div>
                        ))}
                      </div>

                    </section>
                  ))
                ) : (
                  <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-black/10 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.01] text-center">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                      No curriculum stages found for this subject
                    </p>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto">
                      Stages and questions for this track can be added via CSV or the MCQ builder in the Admin Panel.
                    </p>
                  </div>
                )}
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: LEADERBOARD */}
            {/* ======================================================== */}
            {activeTab === "leaderboard" && <Leaderboard />}

            {/* ======================================================== */}
            {/* TAB 3: MY PROGRESS (Contains Performance Analytics & Review Errors) */}
            {/* ======================================================== */}
            {activeTab === "analytics" && <AnalyticsView />}

          </main>

          {/* Footer */}
          <footer className="border-t border-neutral-200 dark:border-white/[0.08] py-8 bg-neutral-50 dark:bg-black/90 text-center text-xs text-neutral-500 font-mono transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span>EduChain v2.0 • Easy Student Experience</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400">Next.js 15 + Supabase</span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Admin Studio ⚙️</span>
                </Link>
                <button
                  onClick={() => setViewMode("landing")}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Return to Landing Page
                </button>
              </div>
            </div>
          </footer>

          {/* Active Quiz Modal */}
          {selectedStage && (
            <QuizModal
              stage={selectedStage}
              onClose={() => setSelectedStage(null)}
              onNextStage={handleNextStage}
            />
          )}

          {/* Profile & Settings Modal (Includes Sign Out inside popup) */}
          {isProfileOpen && (
            <ProfileModal 
              onClose={() => setIsProfileOpen(false)}
              onSignOut={() => setViewMode("landing")}
              onOpenAuth={(mode) => openAuthModal(mode)}
            />
          )}

        </div>
      )}

      {/* Auth Modal (Available from both Landing and App views) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
        onSuccess={() => setViewMode("app")}
      />
    </>
  );
}
