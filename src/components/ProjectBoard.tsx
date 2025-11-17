// src/components/ProjectBoard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import Column from "./Column";
import BurnBarrel from "./BurnBarrel";
import ConfirmModal from "./ConfirmModal";


export default function ProjectBoard({ projectId }: { projectId: string }) {
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

  if (!project) return <div className="p-6">Project not found.</div>;

  return (
    <div className="flex gap-4 overflow-x-auto p-6">
      {/* columns come from project.columns */}
      {project.columns.map((col) => (
        <div key={col.id} className="flex flex-col">
          {/* Column header with edit + delete */}
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-medium">{col.title}</h3>
            <button
              className="text-xs px-2 py-1 rounded border"
              onClick={() => setRenameTarget({ id: col.id, name: col.title })}
              aria-label="Rename column"
            >
              Edit
            </button>
            <button
              className="text-xs px-2 py-1 rounded border text-red-600"
              onClick={() => setDeleteColTarget(col.id)}
              aria-label="Delete column"
            >
              Delete
            </button>
          </div>

          <Column
            title={col.title}
            color={col.color || "bg-neutral-200"}
            columnId={col.id}
            tasks={project.tasks}
            projectId={projectId}
            updateTask={updateTask}
            addTask={addTask}
          />
        </div>
      ))}

      {/* Add Column area */}
      <div className="w-64 flex-shrink-0 p-3">
        {!showAddColumn ? (
          <button onClick={() => setShowAddColumn(true)} className="w-full rounded border px-3 py-2">
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
              className="w-full rounded border px-2 py-1"
            />
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => setShowAddColumn(false)} className="px-3 py-1 rounded border">
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 rounded bg-indigo-600 text-white">
                Add
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Burn Barrel (drag tasks here to delete) */}
      <div className="flex justify-center items-center mt-8">
        <BurnBarrel setDeleteTarget={setDeleteTarget} />
      </div>
{/* Delete task confirmation modal */}
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


      {/* Delete column confirmation (removes tasks in that column too) */}
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

      {/* Rename column modal */}
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
        {/* custom children: input for rename */}
        <div className="mt-2">
          <input
            value={renameTarget?.name || ""}
            onChange={(e) => setRenameTarget((r) => (r ? { ...r, name: e.target.value } : r))}
            placeholder="New column name"
            className="w-full rounded border px-2 py-1"
          />
        </div>
      </ConfirmModal>
    </div>
  );
}
