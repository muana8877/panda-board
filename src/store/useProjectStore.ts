// Zustand Store for managing project state

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Project, Task, TaskStatus } from '@/types';

type ProjectState = {
    projects: Project[];
    createProject: (title: string) => Project;
    updateProject: (id: string, data: Partial<Project>) => void;
    deleteProject: (id: string) => void;

    // Task management
    addTask: (projectId: string, title: string, description?: string) => Task | undefined;
    updateTask: (projectId: string, taskId: string, data: Partial<Task>) => void;
    deleteTask: (projectId: string, taskId: string) => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],

            createProject: (title: string) => {
                const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
                const newProject: Project = {id, title, createdAt: Date.now(), tasks: []};
                set(state => ({ projects: [...state.projects, newProject] }));
                return newProject;
            },

            updateProject: (id, data) =>{
                set(state => ({
                    projects: state.projects.map(p => p.id === id ? {...p, ...data} : p)
                }))
            },

            deleteProject: id =>{
                set(state => ({
                    projects: state.projects.filter(p => p.id !== id)
                }))
            },

                  // tasks
            addTask: (projectId, title, description = '') => {
                const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
                const task: Task = { id, title, description, status: 'todo' as TaskStatus, createdAt: Date.now() };
                set(state => ({
                projects: state.projects.map(p => (p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p)),
                }));
                const project = get().projects.find(p => p.id === projectId);
                return project?.tasks.slice(-1)[0];
            },

            updateTask: (projectId, taskId, data) => {
                set(state => ({
                projects: state.projects.map(p =>
                    p.id === projectId
                    ? { ...p, tasks: p.tasks.map(t => (t.id === taskId ? { ...t, ...data } : t)) }
                    : p
                ),
                }));
            },

            deleteTask: (projectId, taskId) => {
                set(state => ({
                projects: state.projects.map(p => (p.id === projectId ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) } : p)),
                }));
            },
        }),

        {
            name: 'panda-board-projects', // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);