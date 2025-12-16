// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import type { Task } from "@/types";
// import ConfirmModal from "./ConfirmModal";

// interface TaskDetailProps {
//   task: Task | null;
//   onClose: () => void;
//   updateTask: (projectId: string, taskId: string, data: any) => void;
//   deleteTask: (projectId: string, taskId: string) => void;
//   projectId: string;
// }

// const TaskDetail = ({ task, onClose, updateTask, deleteTask, projectId }: TaskDetailProps) => {
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");
//     // State for delete confirmation modal

//     const [confirmDelete, setConfirmDelete] = useState(false);

//   // Load task data when selected
//   useEffect(() => {
//     if (task) {
//       setTitle(task.title);
//       setDesc(task.description || "");
//     }
//   }, [task]);

//   const handleSave = () => {
//     if (!task) return;
//     updateTask(projectId, task.id, { title, description: desc });
//   };

//   const handleDelete = () => {
//     if (!task) return;
//     deleteTask(projectId, task.id);
//     onClose();
//   };

//   return (
//     <AnimatePresence>
//       {task && (
//         <>
//           {/* Background overlay */}
//           <motion.div
//             onClick={onClose}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.4 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black backdrop-blur-sm z-40"
//           />

//           {/* Sliding drawer */}
//           <motion.div
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ type: "tween", duration: 0.25 }}
//             className="fixed right-0 top-0 h-full w-[420px] bg-neutral-900 border-l border-neutral-700 z-50 p-5 flex flex-col"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-medium text-white">Task Details</h2>
//               <button onClick={onClose} className="text-neutral-400 hover:text-white">✕</button>
//             </div>

//             {/* Title */}
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               onBlur={handleSave}
//               placeholder="Task title"
//               className="w-full border border-neutral-700 bg-neutral-800 text-white p-2 rounded mb-4 focus:outline-none"
//             />

//             {/* Description */}
//             <textarea
//               value={desc}
//               onChange={(e) => setDesc(e.target.value)}
//               onBlur={handleSave}
//               rows={10}
//               placeholder="Description..."
//               className="w-full border border-neutral-700 bg-neutral-800 text-white p-2 rounded focus:outline-none"
//             />

//             {/* Footer buttons */}
//             <div className="mt-auto flex justify-between pt-6">
//               <button
//                 onClick={() => setConfirmDelete(true)}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//                 >
//                 Delete
//                 </button>


//               <button
//                 onClick={handleSave}
//                 className="bg-neutral-200 hover:bg-white text-black px-4 py-2 rounded"
//               >
//                 Save
//               </button>
//             </div>
//                   <ConfirmModal
//         open={confirmDelete}
//         onClose={() => setConfirmDelete(false)}
//         onConfirm={() => {
//             if (!task) return;
//             deleteTask(projectId, task.id);
//             setConfirmDelete(false);
//             onClose();
//         }}
//         title="Delete Task"
//         description="Are you sure you want to delete this task? This action cannot be undone."
//         />
//           </motion.div>
//         </>
//       )}

//     </AnimatePresence>
    
//   );
// };

// export default TaskDetail;
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task } from "@/types";
import { useProjectStore } from "@/store/useProjectStore";
import ConfirmModal from "./ConfirmModal";

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
  updateTask: (projectId: string, taskId: string, data: any) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  projectId: string;
}

const TaskDetail = ({ task, onClose, updateTask, deleteTask, projectId }: TaskDetailProps) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [deleteSubtaskTarget, setDeleteSubtaskTarget] = useState<string | null>(null);
  const [subtaskMenuOpen, setSubtaskMenuOpen] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);

  const addSubtask = useProjectStore((s) => s.addSubtask);
  const toggleSubtask = useProjectStore((s) => s.toggleSubtask);
  const deleteSubtaskStore = useProjectStore((s) => s.deleteSubtask);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.description || "");
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;
    updateTask(projectId, task.id, { title, description: desc });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newSubtask.trim()) return;
    addSubtask(projectId, task.id, newSubtask.trim());
    setNewSubtask("");
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (!task) return;
    toggleSubtask(projectId, task.id, subtaskId);
  };

  const handleDeleteSubtask = () => {
    if (!task || !deleteSubtaskTarget) return;
    deleteSubtaskStore(projectId, task.id, deleteSubtaskTarget);
    setDeleteSubtaskTarget(null);
    setSubtaskMenuOpen(null);
  };

  const completedCount = (task?.subtasks || []).filter((st) => st.completed).length;
  const totalSubtasks = (task?.subtasks || []).length;

  const handleGenerateSubtasks = async () => {
    setAiError(null);
    setAiSuccess(null);
    setAiLoading(true);

    try {
      const res = await fetch("/api/generate-subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate subtasks");

      const subtasks: string[] = data.subtasks || [];

      // Add each generated subtask
      let addedCount = 0;
      for (const subtaskTitle of subtasks) {
        addSubtask(projectId, task!.id, subtaskTitle);
        addedCount++;
      }

      setAiSuccess(`✓ Added ${addedCount} subtasks from AI`);
      setTimeout(() => setAiSuccess(null), 3000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to generate subtasks";
      setAiError(errorMsg);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Background overlay */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sliding drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 h-full w-[420px] bg-gradient-to-b from-purple-900/80 via-black/70 to-purple-800/70 backdrop-blur-md border-l border-purple-700 z-50 p-6 flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 sticky top-0 bg-gradient-to-b from-purple-900/80 to-transparent py-2">
              <h2 className="text-xl font-semibold text-white">Task Details</h2>
              <button onClick={onClose} className="text-purple-300 hover:text-white transition">
                ✕
              </button>
            </div>

            {/* Title */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              placeholder="Task title"
              className="w-full border border-purple-700 bg-black/30 text-white p-3 rounded-lg mb-4 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Description */}
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onBlur={handleSave}
              rows={8}
              placeholder="Description..."
              className="w-full border border-purple-700 bg-black/30 text-white p-3 rounded-lg placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
            />

            {/* Subtasks Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-purple-300">Subtasks</h3>
                {totalSubtasks > 0 && (
                  <span className="text-sm text-purple-400">
                    {completedCount}/{totalSubtasks}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {totalSubtasks > 0 && (
                <div className="w-full bg-black/40 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / totalSubtasks) * 100}%` }}
                  />
                </div>
              )}

              {/* Subtasks List */}
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {(task?.subtasks || []).map((subtask) => (
                  <motion.div
                    key={subtask.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between bg-black/30 hover:bg-black/40 p-3 rounded-lg border border-purple-700/50 group transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(subtask.id)}
                        className="w-5 h-5 rounded border-purple-500 bg-black/50 cursor-pointer accent-purple-500"
                      />
                      <span
                        className={`text-sm transition ${
                          subtask.completed
                            ? "text-purple-400 line-through"
                            : "text-white"
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>

                    {/* Three-dot menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setSubtaskMenuOpen(
                            subtaskMenuOpen === subtask.id ? null : subtask.id
                          )
                        }
                        className="text-purple-400 hover:text-purple-300 opacity-0 group-hover:opacity-100 transition p-1"
                        title="Options"
                      >
                        ⋮
                      </button>

                      {subtaskMenuOpen === subtask.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute right-0 top-full mt-1 bg-black/80 border border-purple-700 rounded-lg shadow-lg z-50"
                        >
                          <button
                            onClick={() => {
                              setDeleteSubtaskTarget(subtask.id);
                              setSubtaskMenuOpen(null);
                            }}
                            className="block w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-950/30 text-sm rounded-lg transition"
                          >
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Subtask Form */}
              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add a subtask..."
                  className="flex-1 border border-purple-700 bg-black/30 text-white p-2 rounded-lg text-sm placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition font-medium"
                >
                  +
                </button>
              </form>
            </div>

            {/* AI Subtask Generation Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-purple-700/50 space-y-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-purple-300">✨ Generate with AI</span>
              </div>

              {/* AI Status Messages */}
              {aiError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-sm text-red-300"
                >
                  {aiError}
                </motion.div>
              )}

              {aiSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-sm text-green-300"
                >
                  {aiSuccess}
                </motion.div>
              )}

              <button
                onClick={handleGenerateSubtasks}
                disabled={aiLoading || !title.trim() || !desc.trim()}
                className={`w-full py-2 px-4 rounded-lg font-medium transition text-sm ${
                  aiLoading || !title.trim() || !desc.trim()
                    ? "bg-purple-600/40 text-purple-300/60 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                }`}
              >
                {aiLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"
                    />
                    Generating...
                  </span>
                ) : (
                  "Generate Subtasks"
                )}
              </button>

              <p className="text-xs text-purple-400/70 text-center">
                Requires a detailed task description
              </p>
            </motion.div>

            {/* Footer buttons */}
            <div className="flex justify-between gap-3 pt-6 border-t border-purple-700/50 mt-6">
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Delete Task
              </button>

              <button
                onClick={handleSave}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Save
              </button>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
              open={confirmDelete}
              onClose={() => setConfirmDelete(false)}
              onConfirm={() => {
                if (!task) return;
                deleteTask(projectId, task.id);
                setConfirmDelete(false);
                onClose();
              }}
              title="Delete Task"
              description="Are you sure you want to delete this task? This action cannot be undone."
            />

            {/* Confirm Delete Subtask Modal */}
            <ConfirmModal
              open={!!deleteSubtaskTarget}
              onClose={() => setDeleteSubtaskTarget(null)}
              onConfirm={handleDeleteSubtask}
              title="Delete Subtask"
              description="Are you sure you want to delete this subtask?"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetail;
