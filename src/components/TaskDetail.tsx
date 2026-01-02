import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task } from "@/types";
import { useProjectStore } from "@/store/useProjectStore";
import ConfirmModal from "./ConfirmModal";

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
  updateTask: (projectId: string, taskId: string, data: any) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  projectId: string;
}

const TaskDetail = ({ task, onClose, updateTask, deleteTask, projectId }: TaskDetailProps) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [deleteSubtaskTarget, setDeleteSubtaskTarget] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);

  const addSubtask = useProjectStore((s) => s.addSubtask);
  const toggleSubtask = useProjectStore((s) => s.toggleSubtask);
  const deleteSubtaskStore = useProjectStore((s) => s.deleteSubtask);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.description || "");
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;
    updateTask(projectId, task.id, { title, description: desc });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newSubtask.trim()) return;
    addSubtask(projectId, task.id, newSubtask.trim());
    setNewSubtask("");
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (!task) return;
    toggleSubtask(projectId, task.id, subtaskId);
  };

  const handleDeleteSubtask = () => {
    if (!task || !deleteSubtaskTarget) return;
    deleteSubtaskStore(projectId, task.id, deleteSubtaskTarget);
    setDeleteSubtaskTarget(null);
  };

  const completedCount = (task?.subtasks || []).filter((st) => st.completed).length;
  const totalSubtasks = (task?.subtasks || []).length;

  const handleGenerateSubtasks = async () => {
    setAiError(null);
    setAiSuccess(null);
    setAiLoading(true);

    try {
      const res = await fetch("/api/generate-subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate subtasks");

      const subtasks: string[] = data.subtasks || [];

      // Add each generated subtask
      let addedCount = 0;
      for (const subtaskTitle of subtasks) {
        addSubtask(projectId, task!.id, subtaskTitle);
        addedCount++;
      }

      setAiSuccess(`✓ Added ${addedCount} subtasks from AI`);
      setTimeout(() => setAiSuccess(null), 3000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to generate subtasks";
      setAiError(errorMsg);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Background overlay */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          />

          {/* Sliding drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[460px] max-w-full glass-dark border-l border-purple-500/30 z-50 flex flex-col shadow-2xl shadow-purple-500/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Task Details</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-purple-500/20 text-purple-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-styled">
              {/* Title input */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-purple-300/70 mb-2">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSave}
                  placeholder="What's the task?"
                  className="w-full border-2 border-purple-500/30 focus:border-purple-500 bg-black/30 text-white p-3 rounded-xl placeholder-purple-400/50 focus:outline-none transition-colors text-lg font-medium"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-purple-300/70 mb-2">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  onBlur={handleSave}
                  rows={5}
                  placeholder="Add more details about this task..."
                  className="w-full border-2 border-purple-500/30 focus:border-purple-500 bg-black/30 text-white p-3 rounded-xl placeholder-purple-400/50 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Subtasks Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Subtasks</h3>
                  </div>
                  {totalSubtasks > 0 && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      completedCount === totalSubtasks
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {completedCount}/{totalSubtasks}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                {totalSubtasks > 0 && (
                  <div className="w-full h-2 bg-purple-900/50 rounded-full mb-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedCount / totalSubtasks) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        completedCount === totalSubtasks
                          ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                    />
                  </div>
                )}

                {/* Subtasks List */}
                <div className="space-y-2 mb-4 max-h-56 overflow-y-auto scrollbar-styled">
                  <AnimatePresence mode="popLayout">
                    {(task?.subtasks || []).map((subtask, index) => (
                      <motion.div
                        key={subtask.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="flex items-center justify-between bg-black/20 hover:bg-black/30 p-3 rounded-xl border border-purple-500/20 group transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              onChange={() => handleToggleSubtask(subtask.id)}
                              className="w-5 h-5 rounded-md border-2 border-purple-500/50 bg-black/50 cursor-pointer accent-purple-500 checked:bg-purple-500"
                            />
                          </motion.div>
                          <span
                            className={`text-sm transition-all ${
                              subtask.completed
                                ? "text-purple-400/60 line-through"
                                : "text-white"
                            }`}
                          >
                            {subtask.title}
                          </span>
                        </div>

                        {/* Delete button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteSubtaskTarget(subtask.id)}
                          className="p-1.5 rounded-lg bg-red-500/0 hover:bg-red-500/20 text-red-400/0 group-hover:text-red-400 transition-all"
                          title="Delete subtask"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {totalSubtasks === 0 && (
                    <div className="text-center py-6 text-purple-400/40 text-sm">
                      <div className="text-2xl mb-2">📝</div>
                      No subtasks yet
                    </div>
                  )}
                </div>

                {/* Add Subtask Form */}
                <form onSubmit={handleAddSubtask} className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask..."
                    className="flex-1 border-2 border-purple-500/30 focus:border-purple-500 bg-black/30 text-white p-2.5 rounded-xl text-sm placeholder-purple-400/50 focus:outline-none transition-colors"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!newSubtask.trim()}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.button>
                </form>
              </div>

              {/* AI Subtask Generation Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">✨</span>
                  <span className="text-sm font-semibold text-white">AI Subtask Generator</span>
                </div>
                <p className="text-xs text-purple-300/60 mb-4">
                  Let AI analyze your task and suggest relevant subtasks
                </p>

                {/* AI Status Messages */}
                <AnimatePresence>
                  {aiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {aiError}
                    </motion.div>
                  )}

                  {aiSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-sm text-green-300 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {aiSuccess}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateSubtasks}
                  disabled={aiLoading || !title.trim() || !desc.trim()}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all text-sm flex items-center justify-center gap-2 ${
                    aiLoading || !title.trim() || !desc.trim()
                      ? "bg-purple-500/20 text-purple-300/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20"
                  }`}
                >
                  {aiLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Subtasks
                    </>
                  )}
                </motion.button>

                {(!title.trim() || !desc.trim()) && (
                  <p className="text-xs text-purple-400/50 text-center mt-2">
                    Add a title and description to enable AI generation
                  </p>
                )}
              </motion.div>
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-purple-500/20 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setConfirmDelete(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 font-medium transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  handleSave();
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </motion.button>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
              open={confirmDelete}
              onClose={() => setConfirmDelete(false)}
              onConfirm={() => {
                if (!task) return;
                deleteTask(projectId, task.id);
                setConfirmDelete(false);
                onClose();
              }}
              title="Delete Task"
              description="Are you sure you want to delete this task? This action cannot be undone."
            />

            {/* Confirm Delete Subtask Modal */}
            <ConfirmModal
              open={!!deleteSubtaskTarget}
              onClose={() => setDeleteSubtaskTarget(null)}
              onConfirm={handleDeleteSubtask}
              title="Delete Subtask"
              description="Are you sure you want to delete this subtask?"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetail;
