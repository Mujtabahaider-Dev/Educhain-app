"use client";

import React from "react";
import {
  Terminal,
  Cpu,
  Atom,
  FlaskConical,
  Calculator,
  Languages,
  BookOpen,
  GraduationCap,
  Sparkles,
  Zap,
  Shield,
  Crown,
  Award,
  Trophy,
  Flame,
  Globe,
  Dna,
  Compass,
  Boxes,
  Code2,
  BookMarked,
  LucideIcon,
  HelpCircle,
  FileText,
  Target
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  // Subjects
  computer_science: Terminal,
  cs: Terminal,
  coding: Code2,
  cpu: Cpu,
  binary: Terminal,
  "💻": Terminal,
  "🖥️": Terminal,

  science: Atom,
  physics: Compass,
  chemistry: FlaskConical,
  biology: Dna,
  "🧬": Dna,
  "🔬": FlaskConical,
  "⚗️": FlaskConical,

  mathematics: Calculator,
  math: Calculator,
  maths: Calculator,
  algebra: Calculator,
  geometry: Compass,
  "📐": Calculator,
  "📊": Calculator,
  "🔢": Calculator,

  english: Languages,
  urdu: Languages,
  language: Languages,
  languages: Languages,
  literature: BookOpen,
  "📖": BookOpen,
  "📚": BookOpen,
  "✍️": BookOpen,

  pak_studies: Globe,
  history: Globe,
  geography: Globe,
  "🌍": Globe,

  islamiat: BookMarked,
  islamic_studies: BookMarked,
  ethics: BookMarked,

  // Classes & Standards
  grade_9: Sparkles,
  class_9: Sparkles,
  "🌱": Sparkles,

  grade_10: Zap,
  class_10: Zap,
  "⚡": Zap,

  grade_11: Shield,
  class_11: Shield,
  "🛡️": Shield,

  grade_12: Crown,
  class_12: Crown,
  "👑": Crown,

  class_8: GraduationCap,
  class_7: GraduationCap,
  class_6: GraduationCap,
  "🎒": GraduationCap,
  "🎓": GraduationCap,

  // Ranks & Achievements
  novice: Sparkles,
  apprentice: Zap,
  adept: Shield,
  expert: Award,
  master: Crown,
  "💎": Award,
  "🔥": Flame,
  "💯": Trophy,
  "🎯": Target,
};

interface SleekIconProps {
  name?: string;
  fallback?: LucideIcon;
  className?: string;
  size?: number;
  color?: string;
}

export const SleekIcon: React.FC<SleekIconProps> = ({
  name = "",
  fallback = Boxes,
  className = "w-4 h-4",
  size,
  color,
}) => {
  const cleanKey = name.toLowerCase().trim();
  const IconComponent = ICON_MAP[cleanKey] || fallback;

  return <IconComponent className={className} size={size} color={color} strokeWidth={1.8} />;
};

/**
 * Renders an icon inside a refined micro-badge container
 */
export const SleekBadgeIcon: React.FC<{
  name?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ name = "", color, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 rounded-lg text-xs",
    md: "w-8 h-8 rounded-xl text-sm",
    lg: "w-10 h-10 rounded-2xl text-base",
  }[size];

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  return (
    <div
      className={`shrink-0 flex items-center justify-center border transition-all ${sizeClasses} ${className}`}
      style={{
        backgroundColor: color ? `${color}14` : "rgba(0, 0, 0, 0.04)",
        borderColor: color ? `${color}33` : "rgba(0, 0, 0, 0.08)",
        color: color || "currentColor",
      }}
    >
      <SleekIcon name={name} className={iconSizes} />
    </div>
  );
};

/**
 * Modern Minimalist Scholar Avatar (clean monogram or glyph)
 */
export const ScholarAvatar: React.FC<{
  name?: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ name = "Scholar", avatar = "", size = "sm", className = "" }) => {
  const sizeClass = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-12 h-12 text-sm",
  }[size];

  // If avatar matches a known glyph key
  const cleanAv = avatar.toLowerCase().trim();
  const Glyph = ICON_MAP[cleanAv];

  // Otherwise generate elegant 2-letter initials
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "S";

  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center font-mono font-bold border border-black/10 dark:border-white/10 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 text-neutral-800 dark:text-neutral-200 shadow-xs ${sizeClass} ${className}`}
    >
      {Glyph ? (
        <Glyph className={size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6"} strokeWidth={2} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};