// src/components/ProjectBoard/BurnBarrel.tsx
import React, { useState } from "react";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";

const BurnBarrel = ({ setDeleteTarget }: { setDeleteTarget: (id: string | null) => void }) => {
  const [active, setActive] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer?.getData("taskId");
    if (!taskId) {
      setActive(false);
      return;
    }
    setDeleteTarget(taskId);
    setActive(false);
  };

  return (
    <div
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={handleDrop}
      className={` grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl transition-colors ${
        active ? "border-red-800 bg-red-800/20 text-red-500" : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};
export default BurnBarrel;
