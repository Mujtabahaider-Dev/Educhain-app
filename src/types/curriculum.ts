export type SubjectType = "mathematics" | "science" | "english" | "computer_science";

export type GradeType = "grade_9" | "grade_10" | "grade_11" | "grade_12";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags: string[];
}

export interface Stage {
  id: number | string;
  subject?: SubjectType;
  subjectName?: string;
  subjectStageNumber?: number;
  grade?: GradeType;
  gradeLabel?: string;
  level?: number;
  levelName?: string;
  chapter?: string;
  topic?: string;
  learningObjective?: string;
  title: string;
  description: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  xpReward: number;
  questions: Question[];
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  subject: SubjectType;
  stageId: number | string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  missedAt: string;
  mastered: boolean;
  timesMissed: number;
}

export interface QuizAttemptRecord {
  stageId: number | string;
  subject: SubjectType;
  score: number;
  total: number;
  accuracy: number;
  xpEarned: number;
  completedAt: string;
}
