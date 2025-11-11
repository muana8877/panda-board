// src/components/ProjectBoard.tsx
"use client";

import React, { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore"; // make sure file is named useProjectStore.ts
import Column from "../components/Column";
import BurnBarrel from "../components/BurnBarrel";
import ConfirmModal from "../components/ConfirmModal";
import { TaskStatus } from "@/types";

type ProjectBoardProps = {
  projectId: string;
};

const COLUMNS = [
  { key: "backlog", title: "Backlog", color: "text-neutral-500" },
  { key: "todo", title: "Todo", color: "text-yellow-200" },
  { key: "doing", title: "Doing", color: "text-blue-200" },
  { key: "done", title: "Done", color: "text-emerald-200" },
] as const;

export default function ProjectBoard({ projectId }: ProjectBoardProps) {
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId));
  const updateTask = useProjectStore((s) => s.updateTask);
  const deleteTask = useProjectStore((s) => s.deleteTask);
  const addTask = useProjectStore((s) => s.addTask);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  if (!project) return <div className="p-6">Project not found.</div>;

  const tasks = project.tasks;

  return (
    <div className="flex h-full w-full gap-4 overflow-x-auto p-6">
      {COLUMNS.map((col) => (
        <Column
          key={col.key}
          title={col.title}
          color={col.color}
          column={col.key as TaskStatus}
          tasks={tasks}
          projectId={projectId}
          updateTask={updateTask}
          addTask={addTask}
        />
      ))}

      <BurnBarrel setDeleteTarget={setDeleteTarget} />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteTask(projectId, deleteTarget);
          setDeleteTarget(null);
        }}
        title="Delete this task?"
        description="This action cannot be undone. Are you sure?"
      />
    </div>
  );
}
