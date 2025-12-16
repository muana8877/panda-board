// // src/components/ProjectBoard/Column.tsx
// import React, { useState } from "react";
// import TaskCard from "./TaskCard";
// import type { Task } from "@/types";

// type ColumnProps = {
//   title: string;
//   color?: string;
//   columnId: string;
//   tasks: Task[] | any[];
//   projectId: string;
//   updateTask: (projectId: string, taskId: string, data: any) => void;
//   addTask: (projectId: string, title: string, columnId: string, description?: string) => void;
//   selectedTaskId: (taskId: string) => void;
// };

// const Column = ({ title, color, columnId, tasks, projectId, updateTask, addTask, selectedTaskId }: ColumnProps) => {
//   const [active, setActive] = useState(false);
//   const [newTitle, setNewTitle] = useState("");
//   const filtered = tasks.filter((t) => t.columnId === columnId);

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const taskId = e.dataTransfer?.getData("taskId");
//     if (!taskId) return;
//     updateTask(projectId, taskId, { columnId });
//     setActive(false);
//   };

//   return (
//     <div
//       onDragOver={(e) => {
//         e.preventDefault();
//         setActive(true);
//       }}
//       onDragLeave={() => setActive(false)}
//       onDrop={handleDrop}
//       className={`w-64 flex-shrink-0 rounded-lg p-3 transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/20"}`}
//     >
//       <div className="mb-2 flex items-center justify-between">
//         <h3 className={`font-medium ${color || ""}`}>{title}</h3>
//         <span className="text-sm text-neutral-400">{filtered.length}</span>
//       </div>

//       <div className="space-y-2">
//         {filtered.map((task) => (
//           <TaskCard key={task.id} task={task} onSelect={() => selectedTaskId(task.id)} />
//         ))}
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           if (newTitle.trim()) {
//             addTask(projectId, newTitle.trim(), columnId);
//             setNewTitle("");
//           }
//         }}
//         className="mt-2"
//       >
//         <textarea
//           value={newTitle}
//           onChange={(e) => setNewTitle(e.target.value)}
//           placeholder="Add new task..."
//           className="w-full rounded bg-neutral-700 p-2 text-sm text-white placeholder-neutral-400 focus:outline-none"
//         />
//         <button type="submit" className="mt-1 w-full rounded bg-neutral-200 py-1 text-sm text-black hover:bg-neutral-300">
//           Add
//         </button>
//       </form>
//     </div>
//   );
// };
// export default Column;
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
  selectedTaskId: (taskId: string) => void;
  setDeleteColTarget: (id: string) => void; // for delete modal
  setRenameTarget: (data: { id: string; name: string }) => void; // for rename modal
};

const Column = ({
  title,
  color,
  columnId,
  tasks,
  projectId,
  updateTask,
  addTask,
  selectedTaskId,
  setDeleteColTarget,
  setRenameTarget,
}: ColumnProps) => {
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
      onDragOver={(e) => { e.preventDefault(); setActive(true); }}
      onDragLeave={() => setActive(false)}
      onDrop={handleDrop}
      className={`w-64 flex-shrink-0 rounded-xl p-3 transition transform hover:scale-105 backdrop-blur-md ${active ? "bg-purple-900/40 border-purple-700 border" : "bg-purple-900/20 border border-purple-800 overflow-y-auto h-fit"}`}
    >
      {/* Column Header with Edit + Delete */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className={`font-semibold text-white`}>{title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setRenameTarget({ id: columnId, name: title })}
            className="text-xs px-2 py-1 rounded border border-purple-600 text-purple-300 hover:text-white transition"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteColTarget(columnId)}
            className="text-xs px-2 py-1 rounded border border-red-600 text-red-500 hover:text-red-400 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Tasks container with vertical scroll */}
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-900">
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} onSelect={() => selectedTaskId(task.id)} />
        ))}
      </div>

      {/* Add Task */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTitle.trim()) {
            addTask(projectId, newTitle.trim(), columnId);
            setNewTitle("");
          }
        }}
        className="mt-3"
      >
        <textarea
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add new task..."
          className="w-full rounded-lg bg-black/30 backdrop-blur-sm p-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button type="submit" className="mt-1 w-full rounded-xl bg-purple-600 hover:bg-purple-700 py-1 text-white transition">
          Add
        </button>
      </form>
    </div>
  );
};

export default Column;
