"use client";

import React, { useState } from "react";
import { sound } from "@/lib/audio";
import { useEduStore } from "@/store/useEduStore";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Hammer, 
  Trophy, 
  BarChart3, 
  Sun, 
  Moon, 
  Play, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Clock,
  Layers,
  ChevronRight
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: (mode?: "signin" | "signup") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenAuth,
}) => {
  const { settings, toggleTheme } = useEduStore();
  const [demoSelected, setDemoSelected] = useState<number | null>(null);
  const isDark = settings.theme === "dark";

  const handleLaunch = () => {
    sound.playClick();
    onEnterApp();
  };

  const handleAuth = (mode: "signin" | "signup") => {
    sound.playClick();
    onOpenAuth(mode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#111827] dark:text-[#ededed] flex flex-col vercel-grid selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
      
      {/* Top subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[450px] vercel-glow pointer-events-none -z-10" />

      {/* ======================================================== */}
      {/* 1. NAVBAR */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-white/[0.08] bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shadow-sm">
              ⛓️
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-neutral-900 dark:text-white text-base">EduChain</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.03]">
                v2.0
              </span>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <a href="#curriculum" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Curriculum Tracks</a>
            <a href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#mistake-forge" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Mistake Forge</a>
            <a href="#leaderboard" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Leaderboard</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => { sound.playClick(); toggleTheme(); }}
              aria-label="Toggle theme"
              className="p-1.5 rounded-md border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
            </button>

            <button
              onClick={() => handleAuth("signin")}
              className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={handleLaunch}
              className="btn-vercel-primary px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-xs font-mono text-neutral-700 dark:text-neutral-300 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span>Secondary School Curriculum Platform • Grades 9–12</span>
        </div>

        {/* Giant Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white max-w-4xl leading-[1.08] mb-6">
          Master Your Curriculum.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-400 dark:from-white dark:via-neutral-200 dark:to-neutral-500">
            One Link at a Time.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
          The gamified learning chain designed for secondary students. Conquer independent subject tracks in Mathematics, Science, English, and CS with deliberate recall, sound effects, and real-time multiplayer leaderboards.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-16">
          <button
            onClick={handleLaunch}
            className="w-full sm:w-auto btn-vercel-primary px-8 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Learning Free</span>
          </button>

          <button
            onClick={() => handleAuth("signup")}
            className="w-full sm:w-auto btn-vercel-secondary px-6 py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
          >
            <span>Create Scholar Account</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Interactive Preview Card */}
        <div className="w-full max-w-3xl rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-6 sm:p-8 shadow-xl dark:shadow-[0_0_50px_rgba(255,255,255,0.04)] text-left relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Live Interactive Sample • Mathematics Stage 1
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500">
              <Clock className="w-3.5 h-3.5" />
              <span>20s timer</span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-4">
            What is the order of a matrix having 2 rows and 3 columns?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
            {[
              { id: 0, text: "3-by-2", isCorrect: false },
              { id: 1, text: "2-by-3", isCorrect: true },
              { id: 2, text: "2-by-2", isCorrect: false },
              { id: 3, text: "3-by-3", isCorrect: false },
            ].map((item) => {
              const isSelected = demoSelected === item.id;
              let style = "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#121212] text-neutral-800 dark:text-neutral-200";
              if (demoSelected !== null) {
                if (item.isCorrect) style = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold";
                else if (isSelected) style = "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300";
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setDemoSelected(item.id);
                    if (item.isCorrect) sound.playCorrect();
                    else sound.playIncorrect();
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${style}`}
                >
                  <span className="font-mono mr-2 font-bold opacity-60">
                    {String.fromCharCode(65 + item.id)}.
                  </span>
                  {item.text}
                </button>
              );
            })}
          </div>

          {demoSelected !== null && (
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-white/[0.03] border border-sky-500/20 dark:border-white/10 text-xs text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
              <span>
                {demoSelected === 1
                  ? "✨ Correct! The order of a matrix is written as rows-by-columns (2-by-3)."
                  : "💡 Hint: The order is always stated as (rows) × (columns)."}
              </span>
              <button
                onClick={handleLaunch}
                className="btn-vercel-primary px-3 py-1 rounded-md text-[11px] font-semibold shrink-0 ml-3"
              >
                Play Full Stage
              </button>
            </div>
          )}
        </div>

      </section>

      {/* ======================================================== */}
      {/* 3. METRICS STRIP */}
      {/* ======================================================== */}
      <section className="border-y border-neutral-200 dark:border-white/[0.08] bg-neutral-50/50 dark:bg-white/[0.01] py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-neutral-900 dark:text-white">30+</div>
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1">Curriculum Stages</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-neutral-900 dark:text-white">150+</div>
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1">Board-Standard Questions</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-neutral-900 dark:text-white">4</div>
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1">Independent Subjects</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">100%</div>
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1">Free & Offline-Ready</div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. CURRICULUM TRACKS */}
      {/* ======================================================== */}
      <section id="curriculum" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-cyan-400 mb-2">
            Structured Curriculum
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            4 Independent Academic Chains
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
            No gatekeeping. Master Mathematics, Science, English, and Computer Science on your own terms. Clear stages sequentially to build confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: "📐",
              name: "Mathematics",
              color: "#38bdf8",
              topics: "Matrices, Real Numbers, Linear Algebra, Logarithms, Quadratic Equations & Geometry.",
              badge: "Class 9–12",
            },
            {
              icon: "🔬",
              name: "Science",
              color: "#34d399",
              topics: "Kinematics, Atomic Structure, Chemical Bonding, Bioenergetics & Environmental Ecology.",
              badge: "General & Pre-Med",
            },
            {
              icon: "📖",
              name: "English",
              color: "#a78bfa",
              topics: "Grammar Tenses, Active/Passive Voice, Direct/Indirect Narration & Literary Rhetoric.",
              badge: "Core SSC/HSSC",
            },
            {
              icon: "💻",
              name: "Computer Science",
              color: "#fbbf24",
              topics: "CPU Architecture, Binary Logic Gates, Flowcharts, C/Python Foundations & Database Normalization.",
              badge: "Tech Track",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] hover:border-neutral-300 dark:hover:border-white/20 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-2">{item.name}</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.topics}</p>
              </div>

              <button
                onClick={handleLaunch}
                className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/[0.06] text-xs font-semibold flex items-center justify-between text-neutral-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <span>Explore Track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. THE 4 PILLARS (FEATURES) */}
      {/* ======================================================== */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200 dark:border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-cyan-400 mb-2">
            Powerful Architecture
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Engineered for Deep Learning
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pillar 1 */}
          <div id="mistake-forge" className="p-8 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Hammer className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">The Mistake Forge</h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Never repeat an error. Every question you miss or time-out on during any quiz is automatically cataloged in your private Forge. Practice missed questions with deliberate recall until they are marked as Mastered.
            </p>
            <div className="text-xs font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Converts academic weaknesses into permanent strength</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div id="leaderboard" className="p-8 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Multi-Category Leaderboard</h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Compete across 4 distinct rankings: Total XP, Stages Conquered, Daily Streaks, and Accuracy Rate. Fair threshold rules ensure consistent high-performers are recognized fairly.
            </p>
            <div className="text-xs font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-time Postgres sync powered by Supabase</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Scientific Learning Analytics</h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              High-definition Canvas charts track your comparative accuracy in Mathematics, Science, English, and Computer Science. Export authenticated progress reports in JSON with 1 click.
            </p>
            <div className="text-xs font-mono text-sky-600 dark:text-cyan-400 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% data portability & offline backup</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-8 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Synthesized Web Audio Engine</h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Tactile audio feedback generated live in your browser using native oscillators. Delightful ascending chords for correct answers, gentle dips for misses, and celebratory fanfares.
            </p>
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero audio files to download • Instant response</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CALL TO ACTION BANNER */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl border border-neutral-200 dark:border-white/10 bg-gradient-to-b from-neutral-50 to-white dark:from-[#0f1424] dark:to-[#070b14] p-10 sm:p-14 shadow-lg dark:shadow-none">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-3">
            Ready to Begin Your Learning Chain?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
            Join hundreds of secondary school scholars. Conquer your curriculum, earn scholar badges, and ascend to Master rank.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleLaunch}
              className="btn-vercel-primary px-8 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <span>Launch Learning App</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleAuth("signup")}
              className="btn-vercel-secondary px-6 py-3.5 rounded-xl text-sm font-medium transition-all"
            >
              <span>Create Free Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FOOTER */}
      {/* ======================================================== */}
      <footer className="border-t border-neutral-200 dark:border-white/[0.08] py-10 bg-neutral-50 dark:bg-black text-xs text-neutral-500 font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-white">EduChain v2.0</span>
            <span>•</span>
            <span>Next.js 15 • Supabase • Tailwind CSS</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleLaunch} className="hover:text-black dark:hover:text-white">Launch App</button>
            <button onClick={() => handleAuth("signin")} className="hover:text-black dark:hover:text-white">Sign In</button>
            <button onClick={() => handleAuth("signup")} className="hover:text-black dark:hover:text-white">Sign Up</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
