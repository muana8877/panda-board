"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectStore } from "@/store/useProjectStore";
import Column from "./Column";
import BurnBarrel from "./BurnBarrel";
import ConfirmModal from "./ConfirmModal";
import TaskDetail from "./TaskDetail";
import AnimatedBackground from "./AnimatedBackground";
import { useRouter } from "next/navigation";

export default function ProjectBoard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId));
  const addColumn = useProjectStore((s) => s.addColumn);
  const renameColumn = useProjectStore((s) => s.renameColumn);
  const deleteColumn = useProjectStore((s) => s.deleteColumn);

  const updateTask = useProjectStore((s) => s.updateTask);
  const addTask = useProjectStore((s) => s.addTask);
  const { deleteTask } = useProjectStore();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [deleteColTarget, setDeleteColTarget] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground particleCount={60} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🔍
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Project not found</h2>
          <p className="text-purple-300/60 mb-6">This project may have been deleted or moved.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-purple-500/30"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(t =>
    project.columns.find(c => c.title.toLowerCase() === 'done')?.id === t.columnId
  ).length;

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden">
      {/* Interactive animated background */}
      <AnimatedBackground particleCount={50} connectionDistance={120} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center justify-between p-6 border-b border-white/5 backdrop-blur-md bg-black/20"
      >
        <motion.button
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-300 group-hover:text-white transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-purple-200 group-hover:text-white transition-colors font-medium">Projects</span>
        </motion.button>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {project.title}
            </h1>
            {totalTasks > 0 && (
              <p className="text-sm text-purple-300/60">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            )}
          </div>

          {/* Mini progress ring */}
          {totalTasks > 0 && (
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/10"
                />
                <motion.circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  fill="transparent"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 151" }}
                  animate={{ strokeDasharray: `${(completedTasks / totalTasks) * 151} 151` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {Math.round((completedTasks / totalTasks) * 100)}%
              </span>
            </div>
          )}
        </div>
      </motion.header>

      {/* Columns Container */}
      <div className="flex-1 flex gap-5 overflow-x-auto p-6 scrollbar-styled relative z-10">
        {/* Burn Barrel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-shrink-0"
        >
          <BurnBarrel setDeleteTarget={setDeleteTarget} />
        </motion.div>

        {/* Existing Columns */}
        <AnimatePresence mode="popLayout">
          {project.columns.map((col, index) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
              className="flex-shrink-0"
            >
              <Column
                title={col.title}
                color="text-purple-400"
                columnId={col.id}
                tasks={project.tasks}
                projectId={projectId}
                updateTask={updateTask}
                addTask={addTask}
                selectedTaskId={(id) => setSelectedTaskId(id)}
                setDeleteColTarget={setDeleteColTarget}
                setRenameTarget={setRenameTarget}
                columnIndex={index}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Column */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-72 flex-shrink-0"
        >
          <AnimatePresence mode="wait">
            {!showAddColumn ? (
              <motion.button
                key="add-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddColumn(true)}
                className="w-full rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-500/50 bg-white/5 hover:bg-white/10 py-4 text-purple-300 hover:text-white transition-all flex items-center justify-center gap-2 group backdrop-blur-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Column
              </motion.button>
            ) : (
              <motion.form
                key="add-form"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newColName.trim()) return;
                  addColumn(projectId, newColName.trim());
                  setNewColName("");
                  setShowAddColumn(false);
                }}
                className="rounded-2xl p-4 bg-black/40 backdrop-blur-xl border border-white/10"
              >
                <input
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="Column title"
                  autoFocus
                  className="w-full rounded-xl border border-white/10 focus:border-purple-500/50 bg-white/5 p-3 text-white placeholder-white/30 focus:outline-none transition-colors"
                />
                <div className="flex gap-2 mt-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddColumn(false)}
                    className="flex-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 py-2.5 transition-all font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white py-2.5 font-medium shadow-lg shadow-purple-500/30"
                  >
                    Add
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modals & Task Drawer */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            useProjectStore.getState().deleteTask(projectId, deleteTarget);
            setDeleteTarget(null);
          }
        }}
        title="Delete this task?"
        description="Are you sure you want to permanently delete this task?"
      />

      <ConfirmModal
        open={!!deleteColTarget}
        onClose={() => setDeleteColTarget(null)}
        onConfirm={() => {
          if (deleteColTarget) deleteColumn(projectId, deleteColTarget);
          setDeleteColTarget(null);
        }}
        title="Delete column?"
        description="Deleting this column will also remove all tasks inside it. This cannot be undone."
      />

      <ConfirmModal
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        onConfirm={() => {
          if (renameTarget) {
            renameColumn(projectId, renameTarget.id, renameTarget.name);
            setRenameTarget(null);
          }
        }}
        title="Rename column"
        description=""
      >
        <div className="mt-2">
          <input
            value={renameTarget?.name || ""}
            onChange={(e) =>
              setRenameTarget((r) => (r ? { ...r, name: e.target.value } : r))
            }
            placeholder="New column name"
            className="w-full rounded-xl border-2 border-purple-500/30 focus:border-purple-500 bg-black/30 p-3 text-white placeholder-purple-400/50 focus:outline-none transition-colors"
          />
        </div>
      </ConfirmModal>

      <TaskDetail
        task={project.tasks.find((t) => t.id === selectedTaskId) || null}
        onClose={() => setSelectedTaskId(null)}
        updateTask={updateTask}
        deleteTask={deleteTask}
        projectId={projectId}
      />
    </div>
  );
}
