// src/components/ProjectBoard.tsx
"use client";

import React, { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import Column from "./Column";
import BurnBarrel from "./BurnBarrel";
import ConfirmModal from "./ConfirmModal";
import TaskDetail from "./TaskDetail";
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

  if (!project) return <div className="p-6 text-white">Project not found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-purple-950 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
        >
          ← Back to Projects
        </button>
        <h2 className="text-2xl font-bold">{project.title}</h2>
      </div>

      {/* Columns Container */}
      <div
        className="flex-1 flex gap-6 overflow-x-auto p-6 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-900"
        style={{ maxHeight: "calc(100vh - 96px)" }} // header + padding = ~96px
      >
        {/* Burn Barrel as first column */}
        <div className="w-64 flex-shrink-0">
          <BurnBarrel setDeleteTarget={setDeleteTarget} />
        </div>

        {/* Existing Columns */}
        {project.columns.map((col) => (
          <Column
            key={col.id}
            title={col.title}
            color="text-purple-400"
            columnId={col.id}
            tasks={project.tasks}
            projectId={projectId}
            updateTask={updateTask}
            addTask={addTask}
            selectedTaskId={(id) => setSelectedTaskId(id)}
                setDeleteColTarget={setDeleteColTarget}    // <-- add this
    setRenameTarget={setRenameTarget}  
          />
        ))}

        {/* Add Column */}
        <div className="w-64 flex-shrink-0">
          {!showAddColumn ? (
            <button
              onClick={() => setShowAddColumn(true)}
              className="w-full rounded-xl border border-purple-700 bg-purple-900/20 hover:bg-purple-900/40 py-3 text-white transition"
            >
              + Add column
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newColName.trim()) return;
                addColumn(projectId, newColName.trim());
                setNewColName("");
                setShowAddColumn(false);
              }}
            >
              <input
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder="Column title"
                className="w-full rounded-lg border border-purple-600 bg-black/30 p-2 mb-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddColumn(false)}
                  className="flex-1 rounded-xl border border-purple-600 text-purple-300 hover:text-white hover:border-purple-400 py-2 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white py-2 transition"
                >
                  Add
                </button>
              </div>
            </form>
          )}
        </div>
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
            className="w-full rounded-lg border border-purple-600 bg-black/30 p-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
