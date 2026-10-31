"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { useEduStore } from "@/store/useEduStore";
import { STAGES_DATA } from "@/data/curriculum";
import { supabase } from "@/lib/supabase/client";
import { GradeType, Stage, SubjectType } from "@/types/curriculum";
import { GRADE_SHORT_LABELS, SUBJECT_METADATA } from "@/data/constants";
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
  subjectMeta: typeof SUBJECT_METADATA[SubjectType];
  chapters: ChapterGroup[];
  totalStages: number;
}

export default function Home() {
  const [viewMode, setViewMode] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState<string>("map");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
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

  // Filter stages by Grade and selected Subject
  const filteredStages = useMemo(() => {
    return STAGES_DATA.filter((stage) => {
      const matchesGrade = stage.grade === grade || (grade === "grade_9" && stage.grade === "grade_9");
      const matchesSubject = selectedSubject === "all" || stage.subject === selectedSubject;
      return matchesGrade && matchesSubject;
    });
  }, [grade, selectedSubject]);

  // Classify by Subject -> Then Chapter (e.g. Chapter One) -> Then Stages
  const subjectGroups = useMemo(() => {
    const subjectsOrder: SubjectType[] = ["computer_science", "science", "mathematics", "english"];
    const subjectsToInclude: SubjectType[] = selectedSubject === "all"
      ? subjectsOrder
      : [selectedSubject as SubjectType];

    return subjectsToInclude
      .map((subKey) => {
        const subStages = filteredStages.filter((s) => s.subject === subKey);
        if (subStages.length === 0) return null;

        // Group stages by chapter in order
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

        return {
          subject: subKey,
          subjectMeta: SUBJECT_METADATA[subKey],
          chapters,
          totalStages: subStages.length,
        };
      })
      .filter(Boolean) as SubjectGroup[];
  }, [filteredStages, selectedSubject]);

  const activeSubjectMeta = selectedSubject !== "all" 
    ? SUBJECT_METADATA[selectedSubject as keyof typeof SUBJECT_METADATA] 
    : null;

  const handleNextStage = () => {
    if (!selectedStage || !selectedStage.subject) return;
    const currentSubjectStages = STAGES_DATA.filter((s) => s.subject === selectedStage.subject);
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

                {/* 2. Sleek Next Quest Hero & 1-Click Subject Filter */}
                <NextQuestHero
                  stages={STAGES_DATA.filter((s) => s.grade === grade || (grade === "grade_9" && s.grade === "grade_9"))}
                  selectedSubject={selectedSubject}
                  onSelectSubject={(sub) => setSelectedSubject(sub)}
                  onStartStage={(stage) => setSelectedStage(stage)}
                />

                {/* 3. Section Header */}
                <div className="flex items-center justify-between mb-6 pt-3 pb-2 border-b border-neutral-200 dark:border-white/[0.08]">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>
                        {activeSubjectMeta ? `${activeSubjectMeta.name} Chapters` : "All Curriculum Chapters"}
                      </span>
                      <span className="text-xs font-mono font-normal text-neutral-500 dark:text-neutral-400">
                        ({filteredStages.length} Total Stages)
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {activeSubjectMeta 
                        ? `Explore chapters in ${activeSubjectMeta.name}. Practice any chapter directly.` 
                        : "Curriculum structured by Subject and Chapter. Practice any chapter directly."}
                    </p>
                  </div>

                  {selectedSubject !== "all" && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        setSelectedSubject("all");
                      }}
                      className="text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline underline-offset-4"
                    >
                      Show All Subjects
                    </button>
                  )}
                </div>

                {/* 4. Hierarchical Classification: Subject -> Chapter (e.g. Chapter One) -> Stages */}
                <div className="space-y-12">
                  {subjectGroups.map((group) => (
                    <section key={group.subject} className="space-y-6">
                      
                      {/* Subject Header */}
                      <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-200 dark:border-white/10">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{group.subjectMeta.icon}</span>
                          <div>
                            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                              {group.subjectMeta.name}
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
                              {group.subjectMeta.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-400">
                          {group.totalStages} Stages
                        </span>
                      </div>

                      {/* Chapters inside this Subject */}
                      <div className="space-y-8 pl-1 sm:pl-2">
                        {group.chapters.map((chapter) => (
                          <div key={chapter.chapterName} className="space-y-3.5">
                            
                            {/* Chapter Header: Like "Chapter One • Matrices and Determinants" */}
                            <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-white/[0.06]">
                              <div className="flex items-center gap-2.5">
                                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black shadow-xs">
                                  Chapter {chapter.chapterWord}
                                </span>
                                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                                  {chapter.chapterName}
                                </h3>
                              </div>
                              <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                                {chapter.stages.length} {chapter.stages.length === 1 ? "Stage" : "Stages"}
                              </span>
                            </div>

                            {/* Stages Grid (No change to StageCard) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {chapter.stages.map((stage) => {
                                const subProgress = (stage.subject ? subjectProgress[stage.subject] : null) || {
                                  unlockedStages: [],
                                  completedStages: [],
                                  bestScores: {},
                                };

                                const isUnlocked = true; // All chapters and stages are open to practice directly
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
                  ))}
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
