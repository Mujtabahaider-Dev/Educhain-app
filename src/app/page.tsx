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
import { GRADE_SHORT_LABELS, SUBJECT_METADATA } from "@/data/constants";
import { sound } from "@/lib/audio";
import { Layers } from "lucide-react";

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
  } = useEduStore();

  // Listen for Supabase Auth state changes (e.g. Email confirmation or session restore)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        if (meta.name || meta.grade) {
          setProfile(meta.name || "Scholar", meta.avatar || "🧠", (meta.grade as GradeType) || "grade_9");
        }
        setViewMode("app");
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setViewMode("landing");
        return;
      }
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        if (meta.name || meta.grade) {
          setProfile(meta.name || "Scholar", meta.avatar || "🧠", (meta.grade as GradeType) || "grade_9");
        }
        setViewMode("app");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setProfile]);

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

  // Filter stages by Grade and Subject
  const filteredStages = useMemo(() => {
    return STAGES_DATA.filter((stage) => {
      const matchesGrade = stage.grade === grade || (grade === "grade_9" && stage.grade === "grade_9");
      const matchesSubject = selectedSubject === "all" || stage.subject === selectedSubject;
      return matchesGrade && matchesSubject;
    });
  }, [grade, selectedSubject]);

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

                {/* 2. Hero Next Recommended Quest & Subject Hubs */}
                <NextQuestHero
                  stages={STAGES_DATA.filter((s) => s.grade === grade || (grade === "grade_9" && s.grade === "grade_9"))}
                  selectedSubject={selectedSubject}
                  onSelectSubject={(sub) => setSelectedSubject(sub)}
                  onStartStage={(stage) => setSelectedStage(stage)}
                />

                {/* 3. Stage Cards Section Header */}
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-neutral-200 dark:border-white/[0.08]">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>
                        {selectedSubject === "all"
                          ? "All Learning Stages"
                          : `${SUBJECT_METADATA[selectedSubject as keyof typeof SUBJECT_METADATA]?.name || "Subject"} Chain`}
                      </span>
                      <span className="text-xs font-mono font-normal text-neutral-500 dark:text-neutral-400">
                        ({filteredStages.length} Stages)
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {selectedSubject === "all"
                        ? "Complete stages sequentially to unlock the next link in your learning chain."
                        : `Follow this track from Stage 1 to Master ${SUBJECT_METADATA[selectedSubject as keyof typeof SUBJECT_METADATA]?.name}.`}
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
                      Clear Filter
                    </button>
                  )}
                </div>

                {/* 4. Stages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStages.map((stage) => {
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
