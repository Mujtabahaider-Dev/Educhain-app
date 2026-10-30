"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useEduStore } from "@/store/useEduStore";
import { GradeType } from "@/types/curriculum";
import { GRADE_LABELS } from "@/data/constants";
import { sound } from "@/lib/audio";
import { X, Lock, Mail, User, Sparkles, ArrowRight, CheckCircle2, AlertCircle, MailCheck } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
  onSuccess?: () => void;
}

const AVATARS = ["🧠", "🦉", "🚀", "⚡", "🧬", "🧙‍♂️", "🎨", "🤖", "🛡️", "💎"];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "signin",
  onSuccess,
}) => {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<GradeType>("grade_9");
  const [avatar, setAvatar] = useState("🧠");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState<string | null>(null);

  const { setProfile, setGuestSession } = useEduStore();

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        // Fallback or demo simulation if Supabase account doesn't exist
        if (error.message.includes("Invalid login credentials")) {
          // If the user entered valid format, let them sign in as local simulation or inform them
          setErrorMsg("Invalid email or password. Need an account? Click 'Sign Up' below.");
        } else {
          setErrorMsg(error.message);
        }
        sound.playIncorrect();
      } else if (data?.user) {
        sound.playUnlock();
        setSuccessMsg("Welcome back, Scholar!");
        
        // Fetch profile from supabase if available
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profile) {
          setProfile(
            profile.player_name || data.user.email?.split("@")[0] || "Scholar",
            profile.player_avatar || "🧠",
            (profile.player_grade as GradeType) || "grade_9"
          );
        }

        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 800);
      }
    } catch {
      setErrorMsg("Connection issue. Please check your network or continue as Guest.");
      sound.playIncorrect();
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      sound.playIncorrect();
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}` : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name.trim() || "Scholar",
            avatar,
            grade,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        sound.playIncorrect();
      } else {
        sound.playUnlock();

        // If Supabase requires email verification (session is null or identities exist)
        if (!data.session) {
          setPendingConfirmationEmail(email.trim());
          return;
        }

        // Otherwise if auto-confirmed
        setSuccessMsg("Account created successfully!");
        setProfile(name.trim() || email.split("@")[0] || "Scholar", avatar, grade);

        if (data.user) {
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              player_name: name.trim() || "Scholar",
              player_avatar: avatar,
              player_grade: grade,
            });
          } catch {}
        }

        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1000);
      }
    } catch {
      setErrorMsg("Sign up error. You can continue as a Guest.");
      sound.playIncorrect();
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    sound.playClick();
    setGuestSession();
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden transition-colors duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => { sound.playClick(); onClose(); }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================= */}
        {/* VIEW: EMAIL CONFIRMATION REQUIRED SCREEN */}
        {/* ========================================================= */}
        {pendingConfirmationEmail ? (
          <div className="flex flex-col items-center text-center py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl mb-4 shadow-sm">
              <MailCheck className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
              Check Your Email!
            </h2>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm mb-4">
              We sent a verification link to:
              <span className="block font-mono font-semibold text-neutral-900 dark:text-white mt-1 break-all bg-neutral-100 dark:bg-white/[0.04] p-2 rounded-lg border border-neutral-200 dark:border-white/5">
                {pendingConfirmationEmail}
              </span>
            </p>

            <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-500/20 text-xs text-sky-800 dark:text-sky-300 text-left mb-6 leading-relaxed">
              👉 Click the <strong>confirmation link in your inbox</strong> to activate your scholar account and immediately start learning!
            </div>

            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  setPendingConfirmationEmail(null);
                  setMode("signin");
                  sound.playClick();
                }}
                className="w-full btn-vercel-primary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>Back to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleGuestContinue}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white py-1 transition-colors"
              >
                Explore as Guest meanwhile
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Brand Icon & Heading */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xl mb-3 shadow-md">
                ⛓️
              </div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {mode === "signin" ? "Welcome Back to EduChain" : "Create Your Scholar Account"}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
                {mode === "signin"
                  ? "Sign in to sync your quiz progress, badges, and rankings across devices."
                  : "Join the learning chain, track your accuracy, and conquer your curriculum."}
              </p>
            </div>

            {/* Tab Switcher: Sign In vs Sign Up */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/5 mb-6">
              <button
                type="button"
                onClick={() => { setMode("signin"); setErrorMsg(null); setSuccessMsg(null); sound.playClick(); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === "signin"
                    ? "bg-white dark:bg-white/15 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setErrorMsg(null); setSuccessMsg(null); sound.playClick(); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === "signup"
                    ? "bg-white dark:bg-white/15 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="scholar@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-vercel-primary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Scholar Hub"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                Scholar Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayesha Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="ayesha@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                  Grade / Class
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeType)}
                  className="w-full px-2.5 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-neutral-900 dark:text-white text-xs focus:outline-none"
                >
                  {Object.entries(GRADE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label.split("(")[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                  Avatar
                </label>
                <div className="flex items-center gap-1 overflow-x-auto py-1">
                  {AVATARS.slice(0, 5).map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                        avatar === av
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-black scale-105"
                          : "bg-neutral-100 dark:bg-[#181818]"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-vercel-primary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>{loading ? "Creating Account..." : "Create Free Account"}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Guest Option Divider */}
        <div className="mt-5 pt-4 border-t border-neutral-200/70 dark:border-white/[0.08] text-center">
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2">
            Just exploring or judging the demo?
          </p>
          <button
            type="button"
            onClick={handleGuestContinue}
            className="w-full py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] hover:bg-neutral-100 dark:hover:bg-white/10 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Continue as Guest / Evaluator
          </button>
        </div>
        </>
      )}

      </div>
    </div>
  );
};
