"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCurriculumStore, CustomSubject } from "@/store/useCurriculumStore";
import { Question, Stage, SubjectType } from "@/types/curriculum";
import { sound } from "@/lib/audio";
import { 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  ExternalLink, 
  Database, 
  BookOpen, 
  Layers, 
  Sparkles, 
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  FileText,
  HelpCircle
} from "lucide-react";

const COLOR_PRESETS = [
  { label: "Sky Blue", value: "#38bdf8" },
  { label: "Emerald Green", value: "#34d399" },
  { label: "Amber Yellow", value: "#fbbf24" },
  { label: "Purple", value: "#a78bfa" },
  { label: "Rose Pink", value: "#f43f5e" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Orange", value: "#f97316" },
];

const SUPABASE_SQL_SCRIPT = `-- Run this in Supabase SQL Editor (supabase.com/dashboard) to enable cloud storage for custom MCQs:

CREATE TABLE IF NOT EXISTS public.custom_subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📚',
  description TEXT,
  color TEXT DEFAULT '#38bdf8',
  badge_bg TEXT,
  border_color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.custom_stages (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  subject_stage_number INTEGER DEFAULT 1,
  grade TEXT DEFAULT 'grade_9',
  chapter TEXT NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  learning_objective TEXT,
  difficulty TEXT DEFAULT 'Medium',
  xp_reward INTEGER DEFAULT 100,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and public policies
ALTER TABLE public.custom_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read custom_subjects" ON public.custom_subjects FOR SELECT USING (true);
CREATE POLICY "Allow public read custom_stages" ON public.custom_stages FOR SELECT USING (true);
CREATE POLICY "Allow public write custom_subjects" ON public.custom_subjects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write custom_stages" ON public.custom_stages FOR ALL USING (true) WITH CHECK (true);
`;

export default function AdminPage() {
  const { 
    customSubjects, 
    customStages, 
    getAllSubjects, 
    getAllStages, 
    addSubject, 
    addStage, 
    deleteStage, 
    deleteSubject,
    syncWithSupabase 
  } = useCurriculumStore();

  const [activeTab, setActiveTab] = useState<"csv" | "upload" | "subjects" | "manage" | "sql">("csv");
  const [copiedSql, setCopiedSql] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const allSubjects = getAllSubjects();

  // Manual Form State
  const [subjectId, setSubjectId] = useState<string>(allSubjects[0]?.id || "computer_science");
  const [chapter, setChapter] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [grade, setGrade] = useState<string>("grade_9");
  const [xpReward, setXpReward] = useState<number>(100);
  const [learningObjective, setLearningObjective] = useState<string>("");
  const [questions, setQuestions] = useState<Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    tags: string;
  }>>([
    {
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
      tags: "",
    },
  ]);

  // CSV Upload State (For specific stage of specific chapter of subject)
  const [csvSubjectId, setCsvSubjectId] = useState<string>(allSubjects[0]?.id || "computer_science");
  const [csvChapter, setCsvChapter] = useState<string>("");
  const [csvTopic, setCsvTopic] = useState<string>("");
  const [csvTitle, setCsvTitle] = useState<string>("");
  const [csvDifficulty, setCsvDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [csvGrade, setCsvGrade] = useState<string>("grade_9");
  const [csvXpReward, setCsvXpReward] = useState<number>(100);
  const [csvLearningObjective, setCsvLearningObjective] = useState<string>("");
  const [csvFileName, setCsvFileName] = useState<string>("");
  const [csvParsedQuestions, setCsvParsedQuestions] = useState<Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    tags: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for New Subject Modal/Section
  const [newSubId, setNewSubId] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubIcon, setNewSubIcon] = useState("📚");
  const [newSubDesc, setNewSubDesc] = useState("");
  const [newSubColor, setNewSubColor] = useState("#38bdf8");

  useEffect(() => {
    syncWithSupabase();
  }, [syncWithSupabase]);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Robust CSV parser function
  const parseCSVContent = (text: string) => {
    const lines: string[] = [];
    let currentLine = "";
    let insideQuote = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        insideQuote = !insideQuote;
        currentLine += char;
      } else if ((char === '\n' || char === '\r') && !insideQuote) {
        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }
        currentLine = "";
      } else {
        currentLine += char;
      }
    }
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    if (lines.length < 2) return [];

    const parseRow = (rowStr: string): string[] => {
      const cells: string[] = [];
      let cell = "";
      let inQuotes = false;
      for (let j = 0; j < rowStr.length; j++) {
        const c = rowStr[j];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          cells.push(cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          cell = "";
        } else {
          cell += c;
        }
      }
      cells.push(cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
      return cells;
    };

    const header = parseRow(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ''));

    const qIdx = header.findIndex((h) => h.includes("question"));
    const aIdx = header.findIndex((h) => h === "option_a" || h === "optiona" || h === "a" || h === "option_1");
    const bIdx = header.findIndex((h) => h === "option_b" || h === "optionb" || h === "b" || h === "option_2");
    const cIdx = header.findIndex((h) => h === "option_c" || h === "optionc" || h === "c" || h === "option_3");
    const dIdx = header.findIndex((h) => h === "option_d" || h === "optiond" || h === "d" || h === "option_4");
    const ansIdx = header.findIndex((h) => h.includes("correct") || h.includes("answer"));
    const expIdx = header.findIndex((h) => h.includes("explanation"));
    const tagIdx = header.findIndex((h) => h.includes("tag"));

    const result = [];

    for (let k = 1; k < lines.length; k++) {
      const row = parseRow(lines[k]);
      if (row.length < 5) continue;

      const qText = qIdx >= 0 ? row[qIdx] : row[0];
      const optA = aIdx >= 0 ? row[aIdx] : row[1];
      const optB = bIdx >= 0 ? row[bIdx] : row[2];
      const optC = cIdx >= 0 ? row[cIdx] : row[3];
      const optD = dIdx >= 0 ? row[dIdx] : row[4];
      const ansVal = ansIdx >= 0 ? (row[ansIdx] || "").trim() : "";
      const explanation = expIdx >= 0 ? (row[expIdx] || "") : "";
      const tagsStr = tagIdx >= 0 ? (row[tagIdx] || "") : "";

      let correctIndex = 0;
      const cleanAns = ansVal.toUpperCase();
      if (cleanAns === "A" || cleanAns === "1" || cleanAns === "OPTION_A" || cleanAns === (optA || "").toUpperCase()) {
        correctIndex = 0;
      } else if (cleanAns === "B" || cleanAns === "2" || cleanAns === "OPTION_B" || cleanAns === (optB || "").toUpperCase()) {
        correctIndex = 1;
      } else if (cleanAns === "C" || cleanAns === "3" || cleanAns === "OPTION_C" || cleanAns === (optC || "").toUpperCase()) {
        correctIndex = 2;
      } else if (cleanAns === "D" || cleanAns === "4" || cleanAns === "OPTION_D" || cleanAns === (optD || "").toUpperCase()) {
        correctIndex = 3;
      }

      if (qText && optA && optB) {
        result.push({
          question: qText,
          options: [optA, optB, optC || "None of the above", optD || "All of the above"],
          correctIndex,
          explanation: explanation || "The chosen option is the correct answer according to curriculum standards.",
          tags: tagsStr.replace(/;/g, ","),
        });
      }
    }

    return result;
  };

  // Handle CSV file selection
  const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseCSVContent(content);
      if (parsed.length > 0) {
        setCsvParsedQuestions(parsed);
        sound.playUnlock();
        showNotification(`Successfully extracted ${parsed.length} MCQs from ${file.name}!`);
        // If title is empty, generate from file name
        if (!csvTitle) {
          const autoTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
          setCsvTitle(autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1));
        }
      } else {
        sound.playIncorrect();
        showNotification("Could not parse MCQs. Please ensure CSV matches the required columns.", "error");
      }
    };
    reader.readAsText(file);
  };

  // Download sample CSV template
  const handleDownloadSampleCSV = () => {
    const sampleData = `question,option_a,option_b,option_c,option_d,correct_answer,explanation,tags
"Which component of the CPU coordinates and directs all operations within the computer?","Arithmetic Logic Unit (ALU)","Control Unit (CU)","Cache Memory","Accumulator Register","B","The Control Unit generates timing and control signals to direct operations.","cpu;control-unit;hardware"
"What is the binary representation of decimal number 13?","1101","1011","1110","1001","A","13 = 8 + 4 + 1, which corresponds to binary 1101.","binary;number-systems"
"Which memory type is volatile and loses its contents when power is turned off?","ROM","RAM","Hard Disk Drive","Optical Flash Storage","B","RAM (Random Access Memory) requires constant power to maintain stored data.","memory;ram;volatile"
"What is the time complexity of binary search on a sorted array?","O(n)","O(log n)","O(n^2)","O(1)","B","Binary search divides the search space in half at each iteration, giving logarithmic time O(log n).","algorithms;binary-search"
"Which logic gate outputs 1 only when both of its inputs are 1?","OR Gate","AND Gate","XOR Gate","NOT Gate","B","An AND gate produces high output (1) exclusively when all inputs are high (1).","digital-logic;gates;boolean"`;

    const blob = new Blob([sampleData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `educhain_${csvSubjectId}_sample_mcqs.csv`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playClick();
  };

  // Save CSV Stage
  const handleSaveCSVStage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!csvChapter.trim()) {
      showNotification("Chapter name is required (e.g. Chapter One: Computer Systems).", "error");
      return;
    }
    if (!csvTopic.trim()) {
      showNotification("Topic name is required (e.g. CPU Architecture & Memory).", "error");
      return;
    }
    if (!csvTitle.trim()) {
      showNotification("Stage title is required.", "error");
      return;
    }
    if (csvParsedQuestions.length === 0) {
      showNotification("Please select a valid CSV file containing MCQs.", "error");
      return;
    }

    const selectedSubjectObj = allSubjects.find((s) => s.id === csvSubjectId) || allSubjects[0];

    const formattedQuestions: Question[] = csvParsedQuestions.map((q, i) => ({
      id: `q_${csvSubjectId}_${Date.now()}_${i}`,
      question: q.question.trim(),
      options: q.options.map((opt) => opt.trim()),
      correctIndex: q.correctIndex,
      explanation: q.explanation.trim() || "The chosen option is the correct answer according to curriculum standards.",
      tags: q.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
    }));

    const newStage: Stage = {
      id: `custom_stage_${Date.now()}`,
      subject: csvSubjectId as SubjectType,
      subjectName: selectedSubjectObj.name,
      subjectStageNumber: customStages.filter((s) => s.subject === csvSubjectId).length + 1,
      grade: csvGrade as any,
      chapter: csvChapter.trim(),
      topic: csvTopic.trim(),
      title: csvTitle.trim(),
      description: csvLearningObjective.trim() || `Quiz stage covering ${csvTopic.trim()}`,
      learningObjective: csvLearningObjective.trim() || `Master core principles of ${csvTopic.trim()}`,
      difficulty: csvDifficulty,
      xpReward: Number(csvXpReward) || 100,
      questions: formattedQuestions,
    };

    const res = await addStage(newStage);
    if (res.success) {
      sound.playUnlock();
      showNotification(`Successfully published stage "${newStage.title}" with ${formattedQuestions.length} MCQs from CSV!`);
      // Reset CSV form
      setCsvChapter("");
      setCsvTopic("");
      setCsvTitle("");
      setCsvLearningObjective("");
      setCsvFileName("");
      setCsvParsedQuestions([]);
      setActiveTab("manage");
    }
  };

  // Manual Form Handlers
  const handleAddQuestionRow = () => {
    sound.playClick();
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: "",
        tags: "",
      },
    ]);
  };

  const handleRemoveQuestionRow = (idx: number) => {
    sound.playClick();
    if (questions.length <= 1) {
      showNotification("A stage must contain at least 1 MCQ question.", "error");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === "question") updated[idx].question = value;
    if (field === "correctIndex") updated[idx].correctIndex = Number(value);
    if (field === "explanation") updated[idx].explanation = value;
    if (field === "tags") updated[idx].tags = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  const handleSaveStage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chapter.trim()) {
      showNotification("Chapter name is required (e.g. Chapter One: Computer Systems).", "error");
      return;
    }
    if (!topic.trim()) {
      showNotification("Topic name is required (e.g. CPU Architecture & Memory).", "error");
      return;
    }
    if (!title.trim()) {
      showNotification("Stage title is required.", "error");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        showNotification(`Question #${i + 1} text is empty.`, "error");
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          showNotification(`Option ${String.fromCharCode(65 + j)} for Question #${i + 1} is empty.`, "error");
          return;
        }
      }
    }

    const selectedSubjectObj = allSubjects.find((s) => s.id === subjectId) || allSubjects[0];

    const formattedQuestions: Question[] = questions.map((q, i) => ({
      id: `q_${subjectId}_${Date.now()}_${i}`,
      question: q.question.trim(),
      options: q.options.map((opt) => opt.trim()),
      correctIndex: q.correctIndex,
      explanation: q.explanation.trim() || "The chosen option is the correct answer according to curriculum standards.",
      tags: q.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
    }));

    const newStage: Stage = {
      id: `custom_stage_${Date.now()}`,
      subject: subjectId as SubjectType,
      subjectName: selectedSubjectObj.name,
      subjectStageNumber: customStages.filter((s) => s.subject === subjectId).length + 1,
      grade: grade as any,
      chapter: chapter.trim(),
      topic: topic.trim(),
      title: title.trim(),
      description: learningObjective.trim() || `Quiz stage covering ${topic.trim()}`,
      learningObjective: learningObjective.trim() || `Master core principles of ${topic.trim()}`,
      difficulty,
      xpReward: Number(xpReward) || 100,
      questions: formattedQuestions,
    };

    const res = await addStage(newStage);
    if (res.success) {
      sound.playUnlock();
      showNotification(`Successfully published stage "${newStage.title}" with ${formattedQuestions.length} MCQs!`);
      setChapter("");
      setTopic("");
      setTitle("");
      setLearningObjective("");
      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctIndex: 0,
          explanation: "",
          tags: "",
        },
      ]);
      setActiveTab("manage");
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) {
      showNotification("Subject name is required.", "error");
      return;
    }
    const slug = newSubId.trim() || newSubName.toLowerCase().replace(/[^a-z0-9]/g, "_");

    const newSubject: CustomSubject = {
      id: slug,
      name: newSubName.trim(),
      icon: newSubIcon.trim() || "📚",
      description: newSubDesc.trim() || `${newSubName.trim()} curriculum tracks`,
      color: newSubColor,
    };

    await addSubject(newSubject);
    sound.playUnlock();
    showNotification(`New Subject "${newSubject.name}" created successfully!`);
    setCsvSubjectId(newSubject.id);
    setSubjectId(newSubject.id);
    setNewSubName("");
    setNewSubId("");
    setNewSubDesc("");
    setActiveTab("csv");
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    sound.playClick();
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
              title="Return to Student Portal"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">EduChain Studio</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold uppercase">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Curriculum Content & MCQ Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
            >
              <span>Student App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium border animate-in slide-in-from-bottom-3 ${
          notification.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-500/30"
            : "bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-500/30"
        }`}>
          {notification.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8 pb-4 border-b border-neutral-200 dark:border-white/10">
          {[
            { id: "csv", label: "Upload via CSV File", icon: FileSpreadsheet },
            { id: "upload", label: "Manual Form MCQ Builder", icon: Plus },
            { id: "subjects", label: "Create / Manage Subjects", icon: Layers },
            { id: "manage", label: `Manage Stages (${customStages.length} Custom)`, icon: BookOpen },
            { id: "sql", label: "Supabase Cloud Setup", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                    : "bg-white dark:bg-[#0a0a0a] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/10 hover:text-black dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TAB 0: UPLOAD VIA CSV FILE (FOR SPECIFIC STAGE OF SPECIFIC CHAPTER OF SUBJECT) */}
        {/* ======================================================== */}
        {activeTab === "csv" && (
          <form onSubmit={handleSaveCSVStage} className="space-y-8 animate-in fade-in duration-200">
            
            {/* Header info & Template download */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-neutral-100 dark:border-white/5">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Upload MCQs via CSV to Specific Chapter</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Select the subject, enter the chapter and topic, then import your spreadsheet of questions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadSampleCSV}
                  className="btn-vercel-secondary text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 self-start sm:self-auto shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample CSV Template</span>
                </button>
              </div>

              {/* Classification Fields: Subject, Chapter & Topic (REQUIRED) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Subject Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase">
                      Target Subject <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab("subjects")}
                      className="text-[11px] text-sky-600 dark:text-cyan-400 hover:underline"
                    >
                      + New Subject
                    </button>
                  </div>
                  <select
                    value={csvSubjectId}
                    onChange={(e) => setCsvSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs font-semibold focus:outline-none"
                  >
                    {allSubjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.icon} {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter Name Input (REQUIRED) */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                    Specific Chapter Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter One: Fundamentals of Computer"
                    value={csvChapter}
                    onChange={(e) => setCsvChapter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">Classifies stage under this chapter header</p>
                </div>

                {/* Topic Name Input (REQUIRED) */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                    Specific Topic Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Von Neumann Architecture & CPU Registers"
                    value={csvTopic}
                    onChange={(e) => setCsvTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">Specific topic covered in this stage</p>
                </div>

              </div>

              {/* Stage Title, Difficulty, Grade, XP */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-white/5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                    Stage Quest Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CPU Architecture Mastery Quest"
                    value={csvTitle}
                    onChange={(e) => setCsvTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={csvDifficulty}
                    onChange={(e) => setCsvDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                    XP Reward
                  </label>
                  <input
                    type="number"
                    value={csvXpReward}
                    onChange={(e) => setCsvXpReward(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                  Learning Objective (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Understand the difference between ALU, Control Unit and System Buses."
                  value={csvLearningObjective}
                  onChange={(e) => setCsvLearningObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

            </div>

            {/* CSV File Upload Dropzone */}
            <div className="p-8 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-white/15 bg-white dark:bg-[#0a0a0a] text-center shadow-sm">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCSVFileChange}
                accept=".csv"
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>

              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                {csvFileName ? `Selected: ${csvFileName}` : "Click or Drag & Drop your MCQs CSV file here"}
              </h4>
              <p className="text-xs text-neutral-500 mb-4 max-w-md mx-auto">
                CSV must include columns: <code>question, option_a, option_b, option_c, option_d, correct_answer</code>
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-vercel-secondary text-xs px-5 py-2.5 rounded-xl font-semibold"
              >
                {csvFileName ? "Choose a Different CSV File" : "Select CSV File"}
              </button>
            </div>

            {/* Live Preview of Parsed Questions */}
            {csvParsedQuestions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Extracted MCQs Preview ({csvParsedQuestions.length} Questions)
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">
                    Ready to attach to {allSubjects.find(s => s.id === csvSubjectId)?.name}
                  </span>
                </div>

                <div className="border border-neutral-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0a0a0a] divide-y divide-neutral-100 dark:divide-white/[0.04]">
                  {csvParsedQuestions.map((q, idx) => {
                    const letters = ["A", "B", "C", "D"];
                    return (
                      <div key={idx} className="p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="font-semibold text-xs text-neutral-900 dark:text-white flex items-start gap-2">
                            <span className="font-mono text-neutral-400">Q{idx + 1}.</span>
                            <span>{q.question}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setCsvParsedQuestions(csvParsedQuestions.filter((_, i) => i !== idx));
                            }}
                            className="text-neutral-400 hover:text-rose-500 p-1"
                            title="Remove question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 4 Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = q.correctIndex === oIdx;
                            return (
                              <div
                                key={oIdx}
                                className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between ${
                                  isCorrect
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold"
                                    : "bg-neutral-50/50 dark:bg-white/[0.02] border-neutral-200/60 dark:border-white/5 text-neutral-600 dark:text-neutral-400"
                                }`}
                              >
                                <span>{letters[oIdx]}. {opt}</span>
                                {isCorrect && <Check className="w-3 h-3 text-emerald-500" />}
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="text-[11px] text-neutral-500 italic pl-5">
                            💡 Explanation: {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Publish Action Button */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/10">
                  <span className="text-xs text-neutral-500">
                    Will be created in <strong>{csvChapter || "Chapter"}</strong> as <strong>{csvTitle || "New Stage"}</strong>
                  </span>

                  <button
                    type="submit"
                    className="btn-vercel-primary text-xs px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Publish Stage with {csvParsedQuestions.length} CSV MCQs</span>
                  </button>
                </div>
              </div>
            )}

          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 1: MANUAL FORM MCQ BUILDER */}
        {/* ======================================================== */}
        {activeTab === "upload" && (
          <form onSubmit={handleSaveStage} className="space-y-8 animate-in fade-in duration-200">
            
            {/* Step 1: Subject, Chapter & Topic (REQUIRED FIELDS) */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100 dark:border-white/5">
                <span className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Curriculum Hierarchy & Classification
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Subject Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab("subjects")}
                      className="text-[11px] text-sky-600 dark:text-cyan-400 hover:underline"
                    >
                      + New Subject
                    </button>
                  </div>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs font-semibold focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                  >
                    {allSubjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.icon} {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter Name Input (REQUIRED) */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                    Chapter Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter One: Computer Systems"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">Groups stages under this chapter header</p>
                </div>

                {/* Topic Name Input (REQUIRED) */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                    Topic Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Von Neumann Architecture & CPU Buses"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">Specific syllabus subtopic</p>
                </div>

              </div>

              {/* Stage Details (Title, Difficulty, Grade, XP) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-white/5">
                
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                    Stage Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Internal Processor Architecture"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                    XP Reward
                  </label>
                  <input
                    type="number"
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs focus:outline-none"
                  />
                </div>

              </div>

              <div className="mt-4">
                <label className="block text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase mb-1.5">
                  Learning Objective (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Understand how the Control Unit and ALU execute instructions."
                  value={learningObjective}
                  onChange={(e) => setLearningObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

            </div>

            {/* Step 2: Multiple Choice Questions (MCQs) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Multiple Choice Questions ({questions.length})
                    </h3>
                    <p className="text-xs text-neutral-500">Provide 4 options and mark the correct answer radio button.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddQuestionRow}
                  className="btn-vercel-secondary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Question</span>
                </button>
              </div>

              {/* Question Cards */}
              {questions.map((q, qIdx) => (
                <div 
                  key={qIdx}
                  className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-white/5">
                    <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      Question #{qIdx + 1}
                    </span>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestionRow(qIdx)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Question</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400 uppercase mb-1.5">
                      Question Text <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Which register holds the address of the next instruction to be fetched from memory?"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIdx, "question", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  {/* 4 Options Grid */}
                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400 uppercase mb-2">
                      Options & Select Correct Answer <span className="text-rose-500">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctIndex === optIdx;
                        const letters = ["A", "B", "C", "D"];

                        return (
                          <div 
                            key={optIdx}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                              isCorrect 
                                ? "border-emerald-500/50 bg-emerald-500/[0.04] ring-1 ring-emerald-500/30"
                                : "border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.02]"
                            }`}
                          >
                            <label className="cursor-pointer flex items-center gap-1.5 shrink-0">
                              <input
                                type="radio"
                                name={`correct_${qIdx}`}
                                checked={isCorrect}
                                onChange={() => handleQuestionChange(qIdx, "correctIndex", optIdx)}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              <span className={`text-xs font-mono font-bold ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-500"}`}>
                                {letters[optIdx]}
                              </span>
                            </label>

                            <input
                              type="text"
                              required
                              placeholder={`Option ${letters[optIdx]}`}
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              className="w-full bg-transparent text-xs text-neutral-900 dark:text-white focus:outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation & Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-neutral-500 uppercase mb-1">
                        Explanation (Shown after answering)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. The Program Counter (PC) stores the address of the next instruction."
                        value={q.explanation}
                        onChange={(e) => handleQuestionChange(qIdx, "explanation", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-500 uppercase mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. cpu, memory, registers"
                        value={q.tags}
                        onChange={(e) => handleQuestionChange(qIdx, "tags", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs text-neutral-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/10">
              <button
                type="button"
                onClick={handleAddQuestionRow}
                className="btn-vercel-secondary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>

              <button
                type="submit"
                className="btn-vercel-primary text-xs px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Publish Stage & MCQs</span>
              </button>
            </div>

          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CREATE / MANAGE SUBJECTS */}
        {/* ======================================================== */}
        {activeTab === "subjects" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Create Subject Form */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                Create New Academic Subject
              </h3>
              <p className="text-xs text-neutral-500 mb-6">
                Add new disciplines (e.g., Physics, Urdu, Islamic Studies, Pakistan Studies) to the learning platform.
              </p>

              <form onSubmit={handleCreateSubject} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase mb-1.5">
                      Subject Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Physics"
                      value={newSubName}
                      onChange={(e) => {
                        setNewSubName(e.target.value);
                        if (!newSubId) {
                          setNewSubId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_"));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase mb-1.5">
                      Subject ID (Slug)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. physics"
                      value={newSubId}
                      onChange={(e) => setNewSubId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase mb-1.5">
                      Icon / Emoji
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ⚡ or 🔬 or 📖"
                      value={newSubIcon}
                      onChange={(e) => setNewSubIcon(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs focus:outline-none"
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kinematics, Forces, Waves & Modern Physics"
                    value={newSubDesc}
                    onChange={(e) => setNewSubDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#141414] text-xs focus:outline-none"
                  />
                </div>

                {/* Color Preset Picker */}
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase mb-2">
                    Theme Color Accent
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewSubColor(color.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          newSubColor === color.value 
                            ? "border-black dark:border-white ring-2 ring-black/20 dark:ring-white/20 font-bold" 
                            : "border-neutral-200 dark:border-white/10"
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.value }} />
                        <span>{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-vercel-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Subject</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of Existing Subjects */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
                Active Subjects ({allSubjects.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allSubjects.map((sub) => {
                  const isCustom = customSubjects.some((cs) => cs.id === sub.id);
                  const stageCount = getAllStages().filter((s) => s.subject === sub.id).length;

                  return (
                    <div 
                      key={sub.id}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.02] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{sub.icon}</span>
                          <span 
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                            style={{ backgroundColor: `${sub.color}20`, color: sub.color }}
                          >
                            {stageCount} Stages
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          {sub.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">
                          {sub.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-neutral-400">
                          {isCustom ? "Custom Added" : "Core System"}
                        </span>
                        {isCustom && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete subject "${sub.name}" and all its custom stages?`)) {
                                deleteSubject(sub.id);
                                sound.playClick();
                                showNotification(`Subject "${sub.name}" deleted.`);
                              }
                            }}
                            className="text-xs text-rose-500 hover:text-rose-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MANAGE STAGES */}
        {/* ======================================================== */}
        {activeTab === "manage" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Curriculum Stage Catalog
                </h3>
                <p className="text-xs text-neutral-500">
                  {customStages.length} custom uploaded stages, {getAllStages().length} total stages in system.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("csv")}
                  className="btn-vercel-secondary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Upload CSV</span>
                </button>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="btn-vercel-primary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manual Form</span>
                </button>
              </div>
            </div>

            {/* Stages Table */}
            <div className="border border-neutral-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0a0a0a]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-500 font-mono">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Chapter</th>
                    <th className="py-3 px-4">Stage Title / Topic</th>
                    <th className="py-3 px-4 text-center">MCQs</th>
                    <th className="py-3 px-4 text-center">Difficulty</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.04]">
                  {getAllStages().map((stage) => {
                    const isCustom = customStages.some((cs) => String(cs.id) === String(stage.id));

                    return (
                      <tr key={stage.id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-mono font-semibold text-neutral-800 dark:text-neutral-200 capitalize">
                          {stage.subjectName || stage.subject?.replace("_", " ")}
                        </td>
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                          {stage.chapter}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-neutral-900 dark:text-white">{stage.title}</div>
                          <div className="text-[11px] text-neutral-500">{stage.topic}</div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-amber-600 dark:text-amber-400">
                          {stage.questions.length} Qs
                        </td>
                        <td className="py-3 px-4 text-center font-mono">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            stage.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-600" :
                            stage.difficulty === "Medium" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"
                          }`}>
                            {stage.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isCustom ? (
                            <button
                              onClick={() => {
                                if (confirm(`Delete custom stage "${stage.title}"?`)) {
                                  deleteStage(stage.id);
                                  sound.playClick();
                                  showNotification(`Stage "${stage.title}" deleted.`);
                                }
                              }}
                              className="text-xs font-mono text-rose-500 hover:text-rose-700"
                            >
                              Delete
                            </button>
                          ) : (
                            <span className="text-[11px] font-mono text-neutral-400">Built-in</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SUPABASE CLOUD SETUP SQL */}
        {/* ======================================================== */}
        {activeTab === "sql" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Supabase Cloud Sync Migration
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Run this SQL script in your Supabase Dashboard SQL Editor to store custom subjects & MCQs in your PostgreSQL cloud database.
                  </p>
                </div>

                <button
                  onClick={copySql}
                  className="btn-vercel-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? "Copied SQL!" : "Copy SQL Script"}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
                  {SUPABASE_SQL_SCRIPT}
                </pre>
              </div>

              <div className="mt-4 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>
                  <strong>Dual Sync Active:</strong> Any stages or subjects created in this Admin Panel are immediately saved in this browser and synced with Supabase!
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
