// src/store/useProjectStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Project, Task, Column, Subtask } from "@/types";

type ProjectState = {
  projects: Project[];

  // projects
  createProject: (title: string) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // columns (per-project)
  addColumn: (projectId: string, title: string, color?: string) => Column | undefined;
  renameColumn: (projectId: string, columnId: string, newTitle: string) => void;
  deleteColumn: (projectId: string, columnId: string) => void;

  // tasks
  addTask: (projectId: string, title: string, columnId: string, description?: string) => Task | undefined;
  updateTask: (projectId: string, taskId: string, data: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;

  // subtasks
  addSubtask: (projectId: string, taskId: string, title: string) => Subtask | undefined;
  toggleSubtask: (projectId: string, taskId: string, subtaskId: string) => void;
  deleteSubtask: (projectId: string, taskId: string, subtaskId: string) => void;
};

function genId(prefix = "") {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${prefix}${Date.now()}-${Math.random()}`;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],

      // CREATE project with default 3 columns
      createProject: (title: string) => {
        const id = genId("project-");
        const now = Date.now();
        const defaultCols: Column[] = [
          { id: genId("col-"), title: "Backlog", color: "bg-neutral-200", createdAt: now },
          { id: genId("col-"), title: "Todo", color: "bg-yellow-200", createdAt: now },
          { id: genId("col-"), title: "Done", color: "bg-emerald-200", createdAt: now },
        ];
        const newProject: Project = { id, title, createdAt: now, columns: defaultCols, tasks: [] };
        set((s) => ({ projects: [...s.projects, newProject] }));
        return newProject;
      },

      updateProject: (id, data) => {
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)) }));
      },

      deleteProject: (id) => {
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
      },

      // Columns
      addColumn: (projectId, title, color = "bg-neutral-200") => {
        const id = genId("col-");
        const col: Column = { id, title, color, createdAt: Date.now() };
        set((s) => ({
          projects: s.projects.map((p) => (p.id === projectId ? { ...p, columns: [...p.columns, col] } : p)),
        }));
        const project = get().projects.find((p) => p.id === projectId);
        return project?.columns.slice(-1)[0];
      },

      renameColumn: (projectId, columnId, newTitle) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, columns: p.columns.map((c) => (c.id === columnId ? { ...c, title: newTitle } : c)) } : p
          ),
        }));
      },

      // Delete a column AND remove tasks that belonged to it
      deleteColumn: (projectId, columnId) => {
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== projectId) return p;
            const nextCols = p.columns.filter((c) => c.id !== columnId);
            const nextTasks = p.tasks.filter((t) => t.columnId !== columnId); // remove tasks in that column
            return { ...p, columns: nextCols, tasks: nextTasks };
          }),
        }));
      },

      // Tasks
      addTask: (projectId, title, columnId, description = "") => {
        const id = genId("task-");
        const task: Task = { id, title, description, columnId, createdAt: Date.now(), subtasks: [] };
        set((s) => ({
          projects: s.projects.map((p) => (p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p)),
        }));
        const project = get().projects.find((p) => p.id === projectId);
        return project?.tasks.slice(-1)[0];
      },

      updateTask: (projectId, taskId, data) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...data } : t)) } : p
          ),
        }));
      },

      deleteTask: (projectId, taskId) => {
        set((s) => ({
          projects: s.projects.map((p) => (p.id === projectId ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) } : p)),
        }));
      },

      // Subtasks
      addSubtask: (projectId, taskId, title) => {
        const subtaskId = genId("subtask-");
        const subtask: Subtask = { id: subtaskId, title, completed: false, createdAt: Date.now() };
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.map((t) =>
                    t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), subtask] } : t
                  ),
                }
              : p
          ),
        }));
        const project = get().projects.find((p) => p.id === projectId);
        const task = project?.tasks.find((t) => t.id === taskId);
        return task?.subtasks?.slice(-1)[0];
      },

      toggleSubtask: (projectId, taskId, subtaskId) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.map((t) =>
                    t.id === taskId
                      ? {
                          ...t,
                          subtasks: (t.subtasks || []).map((st) =>
                            st.id === subtaskId ? { ...st, completed: !st.completed } : st
                          ),
                        }
                      : t
                  ),
                }
              : p
          ),
        }));
      },

      deleteSubtask: (projectId, taskId, subtaskId) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.map((t) =>
                    t.id === taskId
                      ? {
                          ...t,
                          subtasks: (t.subtasks || []).filter((st) => st.id !== subtaskId),
                        }
                      : t
                  ),
                }
              : p
          ),
        }));
      },
    }),
    {
      name: "panda-board-projects",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
