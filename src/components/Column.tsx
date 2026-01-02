import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";
import type { Task } from "@/types";

type ColumnProps = {
  title: string;
  color?: string;
  columnId: string;
  columnIndex?: number;
  tasks: Task[] | any[];
  projectId: string;
  updateTask: (projectId: string, taskId: string, data: any) => void;
  addTask: (projectId: string, title: string, columnId: string, description?: string) => void;
  selectedTaskId: (taskId: string) => void;
  setDeleteColTarget: (id: string) => void;
  setRenameTarget: (data: { id: string; name: string }) => void;
};

// Column color themes based on index
const columnColors = [
  { accent: 'violet', border: 'border-violet-500/30', bg: 'bg-violet-500', text: 'text-violet-300', hover: 'hover:border-violet-500/50' },
  { accent: 'cyan', border: 'border-cyan-500/30', bg: 'bg-cyan-500', text: 'text-cyan-300', hover: 'hover:border-cyan-500/50' },
  { accent: 'rose', border: 'border-rose-500/30', bg: 'bg-rose-500', text: 'text-rose-300', hover: 'hover:border-rose-500/50' },
  { accent: 'amber', border: 'border-amber-500/30', bg: 'bg-amber-500', text: 'text-amber-300', hover: 'hover:border-amber-500/50' },
  { accent: 'emerald', border: 'border-emerald-500/30', bg: 'bg-emerald-500', text: 'text-emerald-300', hover: 'hover:border-emerald-500/50' },
];

const Column = ({
  title,
  columnId,
  columnIndex = 0,
  tasks,
  projectId,
  updateTask,
  addTask,
  selectedTaskId,
  setDeleteColTarget,
  setRenameTarget,
}: ColumnProps) => {
  const colorTheme = columnColors[columnIndex % columnColors.length];
  const [active, setActive] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const filtered = tasks.filter((t) => t.columnId === columnId);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer?.getData("taskId");
    if (!taskId) return;
    updateTask(projectId, taskId, { columnId });
    setActive(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addTask(projectId, newTitle.trim(), columnId);
      setNewTitle("");
      setShowAddForm(false);
    }
  };

  // Dynamic gradient based on column theme
  const accentGradients: Record<string, string> = {
    violet: 'from-violet-500/20 to-purple-500/20',
    cyan: 'from-cyan-500/20 to-blue-500/20',
    rose: 'from-rose-500/20 to-pink-500/20',
    amber: 'from-amber-500/20 to-orange-500/20',
    emerald: 'from-emerald-500/20 to-green-500/20',
  };

  return (
    <motion.div
      layout
      onDragOver={(e) => { e.preventDefault(); setActive(true); }}
      onDragLeave={() => setActive(false)}
      onDrop={handleDrop}
      className={`w-72 flex-shrink-0 rounded-2xl p-4 transition-all duration-300 backdrop-blur-xl ${
        active
          ? `bg-gradient-to-br ${accentGradients[colorTheme.accent]} border-2 ${colorTheme.border} shadow-lg`
          : "bg-black/30 border border-white/10"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 group">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${colorTheme.bg}`} />
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 ${colorTheme.text} border ${colorTheme.border}`}>
            {filtered.length}
          </span>
        </div>

        {/* Action buttons - show on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setRenameTarget({ id: columnId, name: title })}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
            title="Rename column"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDeleteColTarget(columnId)}
            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-colors"
            title="Delete column"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 scrollbar-styled">
        <AnimatePresence mode="popLayout">
          {filtered.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <TaskCard task={task} onSelect={() => selectedTaskId(task.id)} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center text-white/30 text-sm"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl mb-2"
            >
              📋
            </motion.div>
            No tasks yet
          </motion.div>
        )}
      </div>

      {/* Add Task Section */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <AnimatePresence mode="wait">
          {!showAddForm ? (
            <motion.button
              key="add-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(true)}
              className={`w-full py-2.5 rounded-xl border border-dashed border-white/10 ${colorTheme.hover} text-white/50 hover:text-white transition-all flex items-center justify-center gap-2 group bg-white/5 hover:bg-white/10`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </motion.button>
          ) : (
            <motion.form
              key="add-form"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleAddTask}
              className="space-y-3"
            >
              <textarea
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                rows={2}
                className="w-full rounded-xl border border-white/10 focus:border-purple-500/50 bg-white/5 p-3 text-white placeholder-white/30 focus:outline-none transition-colors resize-none"
              />
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowAddForm(false); setNewTitle(""); }}
                  className="flex-1 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all font-medium text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!newTitle.trim()}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                >
                  Add Task
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Column;
