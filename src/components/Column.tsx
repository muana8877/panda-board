// src/components/ProjectBoard/Column.tsx
import React, { useState } from "react";
import TaskCard from "./TaskCard";
import type { Task } from "@/types";

type ColumnProps = {
  title: string;
  color?: string;
  columnId: string;
  tasks: Task[] | any[];
  projectId: string;
  updateTask: (projectId: string, taskId: string, data: any) => void;
  addTask: (projectId: string, title: string, columnId: string, description?: string) => void;
};

const Column = ({ title, color, columnId, tasks, projectId, updateTask, addTask }: ColumnProps) => {
  const [active, setActive] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const filtered = tasks.filter((t) => t.columnId === columnId);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer?.getData("taskId");
    if (!taskId) return;
    updateTask(projectId, taskId, { columnId });
    setActive(false);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={handleDrop}
      className={`w-64 flex-shrink-0 rounded-lg p-3 transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/20"}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className={`font-medium ${color || ""}`}>{title}</h3>
        <span className="text-sm text-neutral-400">{filtered.length}</span>
      </div>

      <div className="space-y-2">
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTitle.trim()) {
            addTask(projectId, newTitle.trim(), columnId);
            setNewTitle("");
          }
        }}
        className="mt-2"
      >
        <textarea
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add new task..."
          className="w-full rounded bg-neutral-700 p-2 text-sm text-white placeholder-neutral-400 focus:outline-none"
        />
        <button type="submit" className="mt-1 w-full rounded bg-neutral-200 py-1 text-sm text-black hover:bg-neutral-300">
          Add
        </button>
      </form>
    </div>
  );
};
export default Column;
