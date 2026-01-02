'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '@/store/useProjectStore';
import { Project } from '@/types';
import AnimatedBackground from './AnimatedBackground';

function ProjectCard({
  project,
  onOpen,
  onDelete,
  index
}: {
  project: Project;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}) {
  const completedTasks = project.tasks.filter(t =>
    project.columns.find(c => c.title.toLowerCase() === 'done')?.id === t.columnId
  ).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Generate a unique gradient for each card based on index
  const gradients = [
    'from-violet-600/20 via-purple-600/10 to-fuchsia-600/20',
    'from-cyan-600/20 via-blue-600/10 to-indigo-600/20',
    'from-rose-600/20 via-pink-600/10 to-purple-600/20',
    'from-amber-600/20 via-orange-600/10 to-red-600/20',
    'from-emerald-600/20 via-teal-600/10 to-cyan-600/20',
  ];
  const borderGradients = [
    'from-violet-500 via-purple-500 to-fuchsia-500',
    'from-cyan-500 via-blue-500 to-indigo-500',
    'from-rose-500 via-pink-500 to-purple-500',
    'from-amber-500 via-orange-500 to-red-500',
    'from-emerald-500 via-teal-500 to-cyan-500',
  ];
  const accentColors = [
    'violet',
    'cyan',
    'rose',
    'amber',
    'emerald',
  ];

  const gradientIndex = index % gradients.length;
  const accent = accentColors[gradientIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{
        scale: 1.03,
        y: -8,
        transition: { duration: 0.25 }
      }}
      className="group relative cursor-pointer"
      onClick={() => onOpen(project.id)}
    >
      {/* Subtle animated border gradient - reduced intensity */}
      <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${borderGradients[gradientIndex]} opacity-0 group-hover:opacity-40 transition-all duration-500 blur-[2px]`} />

      {/* Card content - added darker background on hover for text contrast */}
      <div className={`relative rounded-2xl bg-gradient-to-br ${gradients[gradientIndex]} backdrop-blur-xl border border-white/10 group-hover:border-white/20 p-6 h-full overflow-hidden group-hover:bg-black/40`}>
        {/* Dark overlay on hover for better text readability */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-2xl" />

        {/* Shine effect on hover - reduced intensity */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header with title and actions */}
          <div className="flex justify-between items-start gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white truncate group-hover:text-white transition-colors drop-shadow-sm group-hover:drop-shadow-md">
                {project.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${accent}-500/20 text-${accent}-300 border border-${accent}-500/30`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onOpen(project.id); }}
                className={`p-2 rounded-xl bg-${accent}-500/30 hover:bg-${accent}-500/50 text-white transition-all shadow-lg`}
                aria-label="Open project"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                className="p-2 rounded-xl bg-red-500/30 hover:bg-red-500/50 text-red-300 hover:text-white transition-all shadow-lg"
                aria-label="Delete project"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Progress section */}
          {totalTasks > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">Progress</span>
                <span className={`text-xs font-semibold ${progress === 100 ? 'text-emerald-400' : 'text-white/70 group-hover:text-white/90'} transition-colors`}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-1.5 bg-white/10 group-hover:bg-white/15 rounded-full overflow-hidden transition-colors">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    progress === 100
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                      : `bg-gradient-to-r ${borderGradients[gradientIndex]}`
                  }`}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors">{completedTasks} completed</span>
                <span className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors">{totalTasks - completedTasks} remaining</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-white/5 group-hover:border-white/10 flex items-center justify-between transition-colors">
            <span className="text-[11px] text-white/30 group-hover:text-white/50 flex items-center gap-1.5 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(project.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="text-[11px] text-white/30 group-hover:text-white/70 transition-colors flex items-center gap-1">
              Open
              <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Decorative corner accent - reduced on hover */}
        <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${borderGradients[gradientIndex]} rounded-full opacity-20 blur-2xl group-hover:opacity-25 transition-opacity duration-500`} />
      </div>
    </motion.div>
  );
}

export default function DashboardClient() {
  const projects = useProjectStore(s => s.projects);
  const createProject = useProjectStore(s => s.createProject);
  const deleteProject = useProjectStore(s => s.deleteProject);
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');

  const openProject = (id: string) => {
    router.push(`/projects/${id}`);
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    const p = createProject(title.trim());
    setTitle('');
    setShowModal(false);
    router.push(`/projects/${p.id}`);
  };

  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce((acc, p) => {
    return acc + p.tasks.filter(t =>
      p.columns.find(c => c.title.toLowerCase() === 'done')?.id === t.columnId
    ).length;
  }, 0);

  return (
    <div className="min-h-screen text-white relative">
      {/* Interactive canvas background */}
      <AnimatedBackground particleCount={60} connectionDistance={120} mouseInteraction={true} />

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Navigation bar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/5"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  className="text-4xl filter drop-shadow-lg"
                >
                  🐼
                </motion.div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                      Panda
                    </span>
                    <span className="text-white">Board</span>
                  </h1>
                  <p className="text-[11px] text-white/40 -mt-0.5">Task Management</p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center gap-4">
                {/* Quick stats */}
                {projects.length > 0 && (
                  <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{projects.length}</div>
                      <div className="text-[10px] text-white/40">Projects</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{totalTasks}</div>
                      <div className="text-[10px] text-white/40">Tasks</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-400">{completedTasks}</div>
                      <div className="text-[10px] text-white/40">Done</div>
                    </div>
                  </div>
                )}

                {/* New Project Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className="group relative px-5 py-2.5 rounded-xl font-semibold text-sm overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Project
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          <AnimatePresence mode="wait">
            {projects.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-[120px] mb-4 filter drop-shadow-2xl"
                >
                  🎯
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-3">Start Your Journey</h2>
                <p className="text-white/50 mb-8 max-w-md text-sm leading-relaxed">
                  Create your first project and organize your tasks like never before.
                  Your productivity adventure begins here.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className="group relative px-8 py-4 rounded-2xl font-semibold overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white to-transparent" />
                  </div>
                  <span className="relative z-10 flex items-center gap-2 text-white text-lg">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create First Project
                  </span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Section header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-1">Your Projects</h2>
                  <p className="text-white/40 text-sm">Select a project to continue working</p>
                </motion.div>

                {/* Projects grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                    {projects.map((p, index) => (
                      <ProjectCard
                        key={p.id}
                        project={p}
                        onOpen={openProject}
                        onDelete={deleteProject}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative w-full max-w-md pointer-events-auto">
                {/* Gradient border effect */}
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-75" />

                {/* Modal content */}
                <div className="relative rounded-3xl bg-[#0f0a1e] p-8 overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fuchsia-500/20 to-transparent rounded-full blur-2xl" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
                        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Create Project</h2>
                        <p className="text-white/40 text-xs">Start organizing your tasks</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-2">Project Name</label>
                        <input
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleCreate()}
                          autoFocus
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500/50 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                          placeholder="e.g., Website Redesign"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowModal(false)}
                          className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all font-medium"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCreate}
                          disabled={!title.trim()}
                          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Create
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
