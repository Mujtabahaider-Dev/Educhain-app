import { ScholarRank, Achievement, LeaderboardScholar } from "@/types/user";
import { GradeType, SubjectType } from "@/types/curriculum";

export const RANKS: ScholarRank[] = [
  { level: 1, name: "Novice", minXp: 0, maxXp: 499, stages: "1–6", icon: "🌱" },
  { level: 2, name: "Apprentice", minXp: 500, maxXp: 1299, stages: "7–12", icon: "⚡" },
  { level: 3, name: "Adept", minXp: 1300, maxXp: 2499, stages: "13–18", icon: "🛡️" },
  { level: 4, name: "Expert", minXp: 2500, maxXp: 3999, stages: "19–24", icon: "💎" },
  { level: 5, name: "Master", minXp: 4000, maxXp: Infinity, stages: "25+", icon: "👑" },
];

export const GRADE_LABELS: Record<GradeType, string> = {
  grade_9: "Grade 9 / Class 9 (SSC Part I)",
  grade_10: "Grade 10 / Matric (SSC Part II)",
  grade_11: "Grade 11 / 1st Year (HSSC Part I)",
  grade_12: "Grade 12 / 2nd Year (HSSC Part II)",
};

export const GRADE_SHORT_LABELS: Record<GradeType, string> = {
  grade_9: "Grade 9",
  grade_10: "Grade 10",
  grade_11: "Grade 11",
  grade_12: "Grade 12",
};

export const SUBJECT_METADATA: Record<SubjectType, {
  name: string;
  color: string;
  icon: string;
  borderColor: string;
  badgeBg: string;
  description: string;
}> = {
  mathematics: {
    name: "Mathematics",
    color: "#38bdf8",
    icon: "📐",
    borderColor: "rgba(56, 189, 248, 0.3)",
    badgeBg: "rgba(56, 189, 248, 0.1)",
    description: "Arithmetic, Matrices, Real Numbers, Algebra & Geometry",
  },
  science: {
    name: "Science",
    color: "#34d399",
    icon: "🔬",
    borderColor: "rgba(52, 211, 153, 0.3)",
    badgeBg: "rgba(52, 211, 153, 0.1)",
    description: "Physics, Chemistry, Atomic Structure & Cell Biology",
  },
  english: {
    name: "English",
    color: "#a78bfa",
    icon: "📖",
    borderColor: "rgba(167, 139, 250, 0.3)",
    badgeBg: "rgba(167, 139, 250, 0.1)",
    description: "Grammar, Tenses, Voice, Narration & Literary Rhetoric",
  },
  computer_science: {
    name: "Computer Science",
    color: "#fbbf24",
    icon: "💻",
    borderColor: "rgba(251, 191, 36, 0.3)",
    badgeBg: "rgba(251, 191, 36, 0.1)",
    description: "Hardware Architecture, Binary Logic, Algorithms & Programming",
  },
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_link", title: "First Link", desc: "Complete your first quiz stage with 70%+ score.", icon: "⛓️", xpReward: 50 },
  { id: "quick_thinker", title: "Quick Thinker", desc: "Answer a question correctly with 15+ seconds remaining.", icon: "⚡", xpReward: 50 },
  { id: "perfect_round", title: "Perfect Round", desc: "Score 100% (5/5 correct) on any stage.", icon: "🌟", xpReward: 100 },
  { id: "math_explorer", title: "Math Pioneer", desc: "Conquer at least 2 stages in the Mathematics chain.", icon: "📐", xpReward: 75 },
  { id: "science_voyager", title: "Science Voyager", desc: "Conquer at least 2 stages in the Science chain.", icon: "🔬", xpReward: 75 },
  { id: "english_scholar", title: "Linguistic Ace", desc: "Conquer at least 2 stages in the English chain.", icon: "📖", xpReward: 75 },
  { id: "cs_architect", title: "Byte Architect", desc: "Conquer at least 2 stages in the Computer Science chain.", icon: "💻", xpReward: 75 },
  { id: "polymath", title: "Universal Polymath", desc: "Complete at least one stage across all 4 independent subjects.", icon: "🧭", xpReward: 150 },
  { id: "streak_starter", title: "Streak Starter", desc: "Maintain a daily learning streak of 3 consecutive days.", icon: "🔥", xpReward: 75 },
  { id: "streak_titan", title: "Streak Titan", desc: "Maintain a daily learning streak of 7 consecutive days.", icon: "🌋", xpReward: 150 },
  { id: "mistake_forger", title: "Master Forger", desc: "Master 5 missed questions in the Mistake Forge.", icon: "🔨", xpReward: 100 },
];

export const BENCHMARK_PLAYERS: LeaderboardScholar[] = [
  { id: "bm_1", name: "Priya Sharma", avatar: "🦉", xp: 4850, rank: "Master", stages: 24, streak: 21, quizzes: 28, accuracy: 96 },
  { id: "bm_2", name: "Arjun Kumar", avatar: "⚡", xp: 3450, rank: "Expert", stages: 18, streak: 14, quizzes: 22, accuracy: 91 },
  { id: "bm_3", name: "Sophia Chen", avatar: "🚀", xp: 2980, rank: "Expert", stages: 16, streak: 12, quizzes: 18, accuracy: 94 },
  { id: "bm_4", name: "Elena Rostova", avatar: "🧬", xp: 2180, rank: "Adept", stages: 12, streak: 9, quizzes: 15, accuracy: 87 },
  { id: "bm_5", name: "Marcus Vance", avatar: "🧙‍♂️", xp: 1920, rank: "Adept", stages: 10, streak: 7, quizzes: 12, accuracy: 83 },
  { id: "bm_6", name: "Maya Lin", avatar: "🎨", xp: 1240, rank: "Apprentice", stages: 7, streak: 5, quizzes: 9, accuracy: 80 },
  { id: "bm_7", name: "Jordan Hayes", avatar: "🤖", xp: 420, rank: "Novice", stages: 3, streak: 3, quizzes: 4, accuracy: 75 },
];
