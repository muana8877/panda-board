import React from "react";
import { motion } from "framer-motion";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onSelect: () => void;
}

const TaskCard = ({ task, onSelect }: TaskCardProps) => {
  const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
  const totalSubtasks = (task.subtasks || []).length;
  const hasSubtasks = totalSubtasks > 0;
  const progress = hasSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/40 rounded-xl p-4 text-white cursor-pointer transition-all duration-300 overflow-hidden"
      onClick={onSelect}
      draggable
      onDragStart={handleDragStart as any}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-cyan-500/50 blur-sm" />
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-xl">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
      </div>

      {/* Inner background */}
      <div className="absolute inset-[1px] rounded-xl bg-gradient-to-br from-slate-900/90 to-black/90 group-hover:from-slate-900/95 group-hover:to-purple-950/30 transition-colors duration-300" />

      {/* Content */}
      <div className="relative z-10">
        <h4 className="font-semibold text-white/90 group-hover:text-white transition-colors line-clamp-2">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-sm text-white/40 mt-2 line-clamp-2 group-hover:text-white/60 transition-colors">
            {task.description}
          </p>
        )}

        {/* Subtasks progress indicator */}
        {hasSubtasks && (
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Subtasks
              </span>
              <span className={`font-medium ${completedSubtasks === totalSubtasks ? 'text-emerald-400' : 'text-purple-300'}`}>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${
                  completedSubtasks === totalSubtasks
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                    : 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500'
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Drag indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
    </motion.div>
  );
};

export default TaskCard;
