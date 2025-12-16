// // src/components/ProjectBoard/TaskCard.tsx
// import React from "react";
// import { motion } from "framer-motion";
// import type { Task } from "@/types";

// const TaskCard = ({ task, onSelect }: { task: Task | any; onSelect?: () => void }) => {
//   const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
//     // guard dataTransfer
//     e.dataTransfer?.setData("taskId", task.id);
//     // optional: set drag image or effect
//     e.dataTransfer!.effectAllowed = "move";
//   };

//   return (
//     <motion.div
//       layout
//       layoutId={task.id}
//       draggable
//       onClick={() => onSelect?.()}
//       onDragStart={handleDragStart as unknown as (event: MouseEvent | TouchEvent | PointerEvent, info?: any) => void}
//       className="cursor-grab rounded bg-neutral-800 p-3 text-sm text-white active:cursor-grabbing border border-neutral-700"
//     >
//       <p>{task.title}</p>
//     </motion.div>
//   );
// };

// export default TaskCard;
import React from "react";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onSelect: () => void;
}

const TaskCard = ({ task, onSelect }: TaskCardProps) => {
  return (
    <div
      className="bg-purple-900/30 backdrop-blur-md border border-purple-700 rounded-xl p-3 text-white cursor-pointer hover:scale-95 hover:bg-purple-900/50 transition transform"
      onClick={onSelect}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
    >
      <h4 className="font-medium">{task.title}</h4>
      {task.description && <p className="text-sm text-purple-300 mt-1 line-clamp-2">{task.description}</p>}
    </div>
  );
};

export default TaskCard;
