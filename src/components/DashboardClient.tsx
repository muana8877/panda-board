// src/components/DashboardClient.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/useProjectStore';
import { Project } from '@/types';

function ProjectCard({ project, onOpen, onDelete }: { project: Project; onOpen: (id: string) => void; onDelete: (id: string) => void; }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3 w-full">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <div className="text-xs text-gray-500">Tasks: {project.tasks.length}</div>
        </div>
        <div className="flex gap-2">
          <button
            className="text-sm px-3 py-1 rounded bg-indigo-600 text-white"
            onClick={() => onOpen(project.id)}
          >
            Open
          </button>
          <button
            className="text-sm px-3 py-1 rounded bg-red-100 text-red-600"
            onClick={() => onDelete(project.id)}
            aria-label="Delete project"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
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
    // open immediately
    router.push(`/projects/${p.id}`);
  };

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">PandaBoard 🐼</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={() => setShowModal(true)}>
            + New Project
          </button>
        </div>
      </header>

      <section>
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No projects yet — create one to get started.</p>
            <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={() => setShowModal(true)}>Create project</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onOpen={openProject} onDelete={deleteProject} />
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-lg shadow p-6 z-10 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">New Project</h2>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Project title (e.g. Daily Tasks)"
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded border" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
