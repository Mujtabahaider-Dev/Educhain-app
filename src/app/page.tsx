"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StageCard } from "@/components/StageCard";
import { QuizModal } from "@/components/QuizModal";
import { MistakeForge } from "@/components/MistakeForge";
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
import { GradeType, Stage } from "@/types/curriculum";
import { GRADE_SHORT_LABELS, SUBJECT_METADATA, STREAM_DOMAINS, SUBJECT_TO_STREAM } from "@/data/constants";
import { sound } from "@/lib/audio";
import { Layers, ChevronRight, BookOpen, Compass } from "lucide-react";

export default function Home() {
  const [viewMode, setViewMode] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState<string>("map");
  const [selectedStream, setSelectedStream] = useState<string>("all");
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

  // Filter stages by Grade, Stream Domain, and Subject
  const filteredStages = useMemo(() => {
    return STAGES_DATA.filter((stage) => {
      const matchesGrade = stage.grade === grade || (grade === "grade_9" && stage.grade === "grade_9");
      const stageStream = stage.subject ? SUBJECT_TO_STREAM[stage.subject] : null;
      const matchesStream = selectedStream === "all" || stageStream === selectedStream;
      const matchesSubject = selectedSubject === "all" || stage.subject === selectedSubject;
      return matchesGrade && matchesStream && matchesSubject;
    });
  }, [grade, selectedStream, selectedSubject]);

  // Group filtered stages by Chapter / Topic unit for clean hierarchical display
  const groupedByChapter = useMemo(() => {
    const groups: { chapter: string; stages: Stage[] }[] = [];
    filteredStages.forEach((stage) => {
      const chapterTitle = stage.chapter || "Core Curriculum";
      const existing = groups.find((g) => g.chapter === chapterTitle);
      if (existing) {
        existing.stages.push(stage);
      } else {
        groups.push({ chapter: chapterTitle, stages: [stage] });
      }
    });
    return groups;
  }, [filteredStages]);

  const activeStreamMeta = STREAM_DOMAINS.find((d) => d.id === selectedStream);
  const activeSubjectMeta = selectedSubject !== "all" ? SUBJECT_METADATA[selectedSubject as keyof typeof SUBJECT_METADATA] : null;

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
            onOpenLanding={() => setViewMode("landing")}
            onOpenAuth={openAuthModal}
            onSignOut={() => setViewMode("landing")}
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

                {/* 2. Hero Next Recommended Quest & Hierarchical Streams */}
                <NextQuestHero
                  stages={STAGES_DATA.filter((s) => s.grade === grade || (grade === "grade_9" && s.grade === "grade_9"))}
                  selectedStream={selectedStream}
                  onSelectStream={(stream) => setSelectedStream(stream)}
                  selectedSubject={selectedSubject}
                  onSelectSubject={(sub) => setSelectedSubject(sub)}
                  onStartStage={(stage) => setSelectedStage(stage)}
                />

                {/* 3. Interactive Breadcrumb Navigation */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 px-3.5 py-2.5 rounded-xl bg-neutral-100/70 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/[0.06] text-xs font-mono">
                  <span className="text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Track:</span>
                  </span>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedStream("all");
                      setSelectedSubject("all");
                    }}
                    className={`hover:text-black dark:hover:text-white transition-colors ${
                      selectedStream === "all" && selectedSubject === "all"
                        ? "text-neutral-900 dark:text-white font-bold"
                        : "text-neutral-500"
                    }`}
                  >
                    All Disciplines
                  </button>

                  {selectedStream !== "all" && activeStreamMeta && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <button
                        onClick={() => {
                          sound.playClick();
                          setSelectedSubject("all");
                        }}
                        className={`hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 ${
                          selectedSubject === "all"
                            ? "text-neutral-900 dark:text-white font-bold"
                            : "text-neutral-500"
                        }`}
                      >
                        <span>{activeStreamMeta.icon}</span>
                        <span>{activeStreamMeta.name}</span>
                      </button>
                    </>
                  )}

                  {selectedSubject !== "all" && activeSubjectMeta && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="text-sky-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                        <span>{activeSubjectMeta.icon}</span>
                        <span>{activeSubjectMeta.name}</span>
                      </span>
                    </>
                  )}

                  {(selectedStream !== "all" || selectedSubject !== "all") && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        setSelectedStream("all");
                        setSelectedSubject("all");
                      }}
                      className="ml-auto text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline underline-offset-4"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-200 dark:border-white/[0.08]">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>
                        {selectedSubject !== "all" && activeSubjectMeta
                          ? `${activeSubjectMeta.name} Chain`
                          : selectedStream !== "all" && activeStreamMeta
                          ? `${activeStreamMeta.name} Quests`
                          : "All Curriculum Stages"}
                      </span>
                      <span className="text-xs font-mono font-normal text-neutral-500 dark:text-neutral-400">
                        ({filteredStages.length} Stages in {groupedByChapter.length} Units)
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {selectedSubject !== "all" && activeSubjectMeta
                        ? `Follow this specialized ${activeSubjectMeta.name} track sequentially from Unit 1.`
                        : "Browse curriculum units grouped by chapter and topic. Complete stages to unlock the next link."}
                    </p>
                  </div>
                </div>

                {/* 4. Stages Grouped Hierarchically by Unit / Chapter */}
                <div className="space-y-8">
                  {groupedByChapter.map((group, gIdx) => (
                    <div key={group.chapter} className="space-y-3.5">
                      
                      {/* Chapter / Topic Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200/50 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded bg-neutral-100 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400">
                            <BookOpen className="w-3.5 h-3.5" />
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <span>Unit {gIdx + 1}: {group.chapter}</span>
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                          {group.stages.length} {group.stages.length === 1 ? "Stage" : "Stages"}
                        </span>
                      </div>

                      {/* Grid of Stage Cards for this Unit */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.stages.map((stage) => {
                          const subProgress = (stage.subject ? subjectProgress[stage.subject] : null) || {
                            unlockedStages: [],
                            completedStages: [],
                            bestScores: {},
                          };

                          const isUnlocked = subProgress.unlockedStages.includes(stage.id) || unlockedStages.includes(stage.id);
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

              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: MISTAKE FORGE */}
            {/* ======================================================== */}
            {activeTab === "forge" && <MistakeForge />}

            {/* ======================================================== */}
            {/* TAB 3: LEADERBOARD */}
            {/* ======================================================== */}
            {activeTab === "leaderboard" && <Leaderboard />}

            {/* ======================================================== */}
            {/* TAB 4: ANALYTICS */}
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

          {/* Profile & Settings Modal */}
          {isProfileOpen && (
            <ProfileModal onClose={() => setIsProfileOpen(false)} />
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
