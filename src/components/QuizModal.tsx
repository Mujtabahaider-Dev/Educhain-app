"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Stage, Question } from "@/types/curriculum";
import { useEduStore } from "@/store/useEduStore";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import { 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  ArrowRight
} from "lucide-react";

interface QuizModalProps {
  stage: Stage;
  onClose: () => void;
  onNextStage?: () => void;
}

const QUESTION_TIMER_SECONDS = 20;

export const QuizModal: React.FC<QuizModalProps> = ({ stage, onClose, onNextStage }) => {
  const { recordQuizAttempt } = useEduStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER_SECONDS);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [missedList, setMissedList] = useState<Question[]>([]);

  const questions = stage.questions;
  const currentQ = questions[currentIdx];

  const handleFinish = useCallback(() => {
    setIsFinished(true);
    const finalAccuracy = Math.round((score / questions.length) * 100);
    const xpEarned = Math.round((score / questions.length) * stage.xpReward);

    if (finalAccuracy >= 70) {
      sound.playUnlock();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#000000", "#38bdf8", "#34d399", "#fbbf24"],
      });
    } else {
      sound.playIncorrect();
    }

    recordQuizAttempt({
      stageId: stage.id,
      subject: stage.subject || "science",
      score,
      total: questions.length,
      accuracy: finalAccuracy,
      xpEarned,
      missedQuestions: missedList,
    });
  }, [score, questions.length, stage, missedList, recordQuizAttempt]);

  const handleSelectAnswer = useCallback((idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 1);
    } else {
      sound.playIncorrect();
      setMissedList((m) => [...m, currentQ]);
    }
  }, [isAnswered, currentQ]);

  // Countdown Timer
  useEffect(() => {
    if (isAnswered || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          sound.playTimeUp();
          setIsAnswered(true);
          setSelectedOption(null); // Time out
          setMissedList((m) => [...m, currentQ]);
          return 0;
        }
        if (prev <= 5) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnswered, isFinished, currentQ]);

  // Keyboard shortcut listener (1, 2, 3, 4, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (!isAnswered) {
        if (["1", "2", "3", "4"].includes(e.key)) {
          const index = parseInt(e.key, 10) - 1;
          if (index < currentQ.options.length) {
            handleSelectAnswer(index);
          }
        }
      } else {
        if (e.key === "Enter" || e.key === " ") {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnswered, isFinished, currentQ, handleSelectAnswer]);

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(QUESTION_TIMER_SECONDS);
    } else {
      handleFinish();
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(QUESTION_TIMER_SECONDS);
    setScore(0);
    setIsFinished(false);
    setMissedList([]);
  };

  const finalAccuracy = Math.round((score / questions.length) * 100);
  const passed = finalAccuracy >= 70;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.01]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {stage.subjectName || "Challenge"}{stage.subjectStageNumber ? ` • Stage ${stage.subjectStageNumber}` : ""}
              </span>
              {stage.chapter && (
                <>
                  <span className="text-neutral-300 dark:text-white/20">•</span>
                  <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    {stage.chapter}
                  </span>
                </>
              )}
            </div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">
              {stage.title}
            </h2>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: ACTIVE QUIZ */}
        {/* ========================================================= */}
        {!isFinished ? (
          <div className="p-6 flex flex-col flex-grow">
            
            {/* Progress & Timer Bar */}
            <div className="flex items-center justify-between mb-4 text-xs font-mono">
              <div className="text-neutral-500 dark:text-neutral-400">
                Question <span className="text-neutral-900 dark:text-white font-semibold">{currentIdx + 1}</span> of {questions.length}
              </div>

              <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-colors ${
                timeLeft <= 5 
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse" 
                  : "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-700 dark:text-neutral-300"
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full h-1 bg-neutral-200 dark:bg-white/[0.06] rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-black dark:from-cyan-400 dark:to-white transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* 4 Answer Options */}
            <div className="grid grid-cols-1 gap-2.5 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const optionLetter = String.fromCharCode(65 + idx);

                let btnStyles = "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#121212] hover:bg-neutral-100 dark:hover:bg-[#181818] hover:border-neutral-300 dark:hover:border-white/20 text-neutral-800 dark:text-neutral-200";

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyles = "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
                  } else if (isSelected) {
                    btnStyles = "border-rose-500/50 bg-rose-500/10 text-rose-800 dark:text-rose-300";
                  } else {
                    btnStyles = "border-neutral-200/50 dark:border-white/5 bg-neutral-100 dark:bg-[#0d0d0d] text-neutral-400 dark:text-neutral-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all group ${btnStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-neutral-200 dark:bg-white/[0.06] flex items-center justify-center text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {optionLetter}
                      </span>
                      <span className="text-sm font-medium">{opt}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box (Revealed on Answer) */}
            {isAnswered && (
              <div className="p-4 rounded-xl border border-sky-500/20 dark:border-white/10 bg-sky-50/50 dark:bg-white/[0.02] mb-6 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-cyan-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curriculum Insight</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Bottom Button Action */}
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-white/[0.06]">
              <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                Press [1-4] or Click Option
              </div>

              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="btn-vercel-primary px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:gap-2 transition-all"
                >
                  <span>{currentIdx + 1 < questions.length ? "Next Question" : "View Results"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: RESULTS SCREEN */
          /* ========================================================= */
          <div className="p-8 text-center flex flex-col items-center">
            
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 flex items-center justify-center text-3xl mb-4 shadow-sm dark:shadow-[0_0_30px_rgba(255,255,255,0.06)]">
              {passed ? "👑" : "📚"}
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-1">
              {passed ? "Stage Conquered!" : "Keep Striving!"}
            </h3>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-6 leading-relaxed">
              {passed 
                ? `Outstanding performance. You have mastered ${stage.title} and unlocked the next link in the chain.`
                : "You scored under 70%. Review the questions, master your missed concepts in the Mistake Forge, and try again!"}
            </p>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-8">
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]">
                <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">Score</div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">{score}/{questions.length}</div>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]">
                <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">Accuracy</div>
                <div className={`text-xl font-bold mt-1 ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {finalAccuracy}%
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]">
                <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">XP Earned</div>
                <div className="text-xl font-bold text-amber-600 dark:text-amber-300 mt-1">
                  +{Math.round((score / questions.length) * stage.xpReward)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
              <button
                onClick={handleRestart}
                className="btn-vercel-secondary flex-1 py-2.5 px-4 rounded-lg text-xs font-medium flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Challenge</span>
              </button>

              {passed && onNextStage ? (
                <button
                  onClick={() => { sound.playClick(); onNextStage(); }}
                  className="btn-vercel-primary flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Next Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => { sound.playClick(); onClose(); }}
                  className="btn-vercel-primary flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Return to Map</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
