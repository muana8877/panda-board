export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type Task = {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    createdAt: number;
    dueDate?:string | null;
};

export type Project = {
    id: string;
    title: string;
    createdAt: number;
    color?: string;
    tasks: Task[];
}