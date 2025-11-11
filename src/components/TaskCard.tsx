// src/components/ProjectBoard/TaskCard.tsx
import React from "react";
import { motion } from "framer-motion";
import type { Task } from "@/types";

const TaskCard = ({ task }: { task: Task | any }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // guard dataTransfer
    e.dataTransfer?.setData("taskId", task.id);
    // optional: set drag image or effect
    e.dataTransfer!.effectAllowed = "move";
  };

  return (
    <motion.div
      layout
      layoutId={task.id}
      draggable
      onDragStart={handleDragStart as unknown as (event: MouseEvent | TouchEvent | PointerEvent, info?: any) => void}
      className="cursor-grab rounded bg-neutral-800 p-3 text-sm text-white active:cursor-grabbing border border-neutral-700"
    >
      <p>{task.title}</p>
    </motion.div>
  );
};

export default TaskCard;
