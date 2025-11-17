export type TaskStatus = string;

export type Task = {
    id: string;
    title: string;
    description?: string;
    columnId: string; 
    createdAt: number;
    dueDate?:string | null;
};

export type Column = {
    id: string;
    title: string;
    color?: string;
    createdAt: number;
}

export type Project = {
    id: string;
    title: string;
    createdAt: number;
    color?: string;
    columns: Column[]; 
    tasks: Task[];
}