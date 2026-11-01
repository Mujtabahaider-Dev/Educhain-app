"use client";

import React, { useState } from "react";
import { X, Save, GraduationCap } from "lucide-react";
import { SchoolClass } from "@/types/curriculum";
import { useCurriculumStore } from "@/store/useCurriculumStore";
import { sound } from "@/lib/audio";

interface EditClassModalProps {
  schoolClass: SchoolClass | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (name: string) => void;
}

export const EditClassModal: React.FC<EditClassModalProps> = ({
  schoolClass,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { updateClass } = useCurriculumStore();

  if (!isOpen || !schoolClass) return null;

  return (
    <EditClassForm
      schoolClass={schoolClass}
      onClose={onClose}
      onSaved={onSaved}
      updateClass={updateClass}
    />
  );
};

function EditClassForm({
  schoolClass,
  onClose,
  onSaved,
  updateClass,
}: {
  schoolClass: SchoolClass;
  onClose: () => void;
  onSaved: (name: string) => void;
  updateClass: any;
}) {
  const [name, setName] = useState(schoolClass.name || "");
  const [icon, setIcon] = useState(schoolClass.icon || "🎓");
  const [description, setDescription] = useState(schoolClass.description || "");
  const [displayOrder, setDisplayOrder] = useState<number>(schoolClass.displayOrder ?? 1);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    sound.playClick();

    const res = await updateClass(schoolClass.id, {
      name: name.trim(),
      icon: icon.trim() || "🎓",
      description: description.trim(),
      displayOrder: Number(displayOrder) || 1,
    });

    setIsSaving(false);

    if (res.success) {
      sound.playUnlock();
      onSaved(name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-cyan-400 border border-sky-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Edit Class: {schoolClass.name}
              </h3>
              <p className="text-xs text-neutral-500">
                Update name, icon emoji, description and order priority
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-mono font-semibold uppercase mb-1">
                Class Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase mb-1">
                Icon Emoji
              </label>
              <input
                type="text"
                required
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-xs text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase mb-1">
              Description / Board Standard
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Secondary School Certificate (SSC Part I)"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase mb-1">
              Display Sequence Order (1, 2, 3...)
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-xs"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-vercel-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Update Class"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}