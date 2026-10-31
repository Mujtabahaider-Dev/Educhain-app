"use client";

import React, { useEffect } from "react";
import { 
  Clock, 
  Flame, 
  Heart, 
  Swords, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  ChevronRight
} from "lucide-react";
import { useMultiplayerStore } from "@/store/useMultiplayerStore";
import { sound } from "@/lib/audio";

export const BattleArena: React.FC = () => {
  const {
    currentRoom,
    players,
    localPlayerId,
    localPlayerName,
    localPlayerAvatar,
    currentQuestionIndex,
    selectedOptionIndex,
    isAnswerSubmitted,
    questionTimeRemaining,
    opponentEventNotification,
    myScore,
    myStreak,
    myHealth,
    submitAnswer,
    advanceQuestion,
    gameStatus,
    countdownSeconds,
  } = useMultiplayerStore();

  if (!currentRoom) return null;

  const currentQ = currentRoom.questions[currentQuestionIndex];
  const totalQuestions = currentRoom.questions.length;

  // Find opponent in 1v1 duel
  const opponent = Object.values(players).find((p) => p.id !== localPlayerId);

  // Timer countdown hook
  useEffect(() => {
    if (gameStatus !== "playing") return;

    const timer = setInterval(() => {
      const remaining = useMultiplayerStore.getState().questionTimeRemaining;
      if (remaining > 1) {
        useMultiplayerStore.setState({ questionTimeRemaining: remaining - 1 });
      } else {
        // Time expired! Auto submit wrong answer if not submitted
        const state = useMultiplayerStore.getState();
        if (!state.isAnswerSubmitted) {
          state.submitAnswer(-1);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, currentQuestionIndex]);

  // If countdown overlay is active
  if (gameStatus === "countdown") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="text-center space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
            Battle Starting In
          </div>
          <div className="text-8xl sm:text-9xl font-extrabold font-mono text-white animate-bounce">
            {countdownSeconds}
          </div>
          <div className="text-sm font-medium text-neutral-400">
            Get ready to answer fast!
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Real-time Opponent Attack Notification */}
      {opponentEventNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500 text-black font-extrabold text-xs shadow-2xl animate-bounce flex items-center gap-2">
          <span>{opponentEventNotification}</span>
        </div>
      )}

      {/* Top Combat HUD (Split Screen HP & Scores) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-xl">
        
        {/* Left: You */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">{localPlayerAvatar || "🧠"}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="truncate text-neutral-900 dark:text-white">
                {localPlayerName} (You)
              </span>
              <span className="font-mono text-amber-600 dark:text-amber-400">
                {myScore} pts
              </span>
            </div>
            
            {/* Health Bar */}
            <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${myHealth}%` }}
              />
            </div>

            {/* Streak Counter */}
            {myStreak > 1 && (
              <div className="flex items-center gap-1 text-[11px] font-mono text-amber-500 font-bold mt-1">
                <Flame className="w-3 h-3 fill-current" />
                <span>{myStreak}x Streak Combo!</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Round Timer & Progress */}
        <div className="flex flex-col items-center justify-center py-2 border-y md:border-y-0 md:border-x border-neutral-100 dark:border-white/5 px-4 text-center">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>

          <div className={`text-2xl font-mono font-extrabold flex items-center gap-1.5 ${
            questionTimeRemaining <= 5 ? "text-rose-500 animate-pulse" : "text-neutral-900 dark:text-white"
          }`}>
            <Clock className="w-4 h-4" />
            <span>{questionTimeRemaining}s</span>
          </div>

          <div className="w-full bg-neutral-100 dark:bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Opponent */}
        <div className="flex items-center gap-3">
          {opponent ? (
            <>
              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">
                    {opponent.score} pts
                  </span>
                  <span className="truncate text-neutral-900 dark:text-white">
                    {opponent.name}
                  </span>
                </div>

                {/* Opponent Health Bar */}
                <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 transition-all duration-300 ml-auto"
                    style={{ width: `${opponent.health}%` }}
                  />
                </div>

                {opponent.streak > 1 && (
                  <div className="flex items-center justify-end gap-1 text-[11px] font-mono text-cyan-500 font-bold mt-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{opponent.streak}x Combo</span>
                  </div>
                )}
              </div>
              <span className="text-3xl">{opponent.avatar || "🥷"}</span>
            </>
          ) : (
            <div className="text-center w-full text-xs text-neutral-400">
              Solo Match
            </div>
          )}
        </div>

      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-xl space-y-6">
        
        {/* Category tags */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="font-mono font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {currentRoom.subjectName} • {currentRoom.chapter || "Quick Battle"}
          </span>
          <span className="font-mono">
            Time limit: {currentRoom.timePerQuestion}s
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white leading-relaxed">
          {currentQ.question}
        </h3>

        {/* 4 Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {currentQ.options.map((option, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const isSelected = selectedOptionIndex === optIdx;
            const isCorrectOption = optIdx === currentQ.correctIndex;

            let buttonStyle = "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04]";

            if (isAnswerSubmitted) {
              if (isCorrectOption) {
                buttonStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/40";
              } else if (isSelected) {
                buttonStyle = "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/40";
              } else {
                buttonStyle = "border-neutral-200 dark:border-white/5 opacity-40 text-neutral-400";
              }
            }

            return (
              <button
                key={optIdx}
                disabled={isAnswerSubmitted}
                onClick={() => submitAnswer(optIdx)}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-150 disabled:cursor-not-allowed ${buttonStyle}`}
              >
                <span className="w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-neutral-300 dark:border-white/20 bg-white dark:bg-black">
                  {letter}
                </span>
                <span className="text-xs sm:text-sm font-medium mt-0.5 leading-snug">
                  {option}
                </span>

                {isAnswerSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0 mt-0.5" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="w-4 h-4 text-rose-500 ml-auto shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Question Button */}
        {isAnswerSubmitted && (
          <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="text-xs text-neutral-500 leading-relaxed max-w-lg">
              <strong className="text-neutral-800 dark:text-neutral-200">Explanation: </strong>
              {currentQ.explanation || "Correct answer verified by curriculum."}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                advanceQuestion();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold btn-vercel-primary flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{currentQuestionIndex + 1 < totalQuestions ? "Next Question" : "View Final Results"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
