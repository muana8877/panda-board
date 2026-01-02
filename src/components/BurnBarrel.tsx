import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={handleDrop}
      className={`relative grid h-64 w-64 shrink-0 place-content-center rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden backdrop-blur-xl ${
        active
          ? "border-red-500 bg-gradient-to-b from-red-900/40 to-orange-900/40 shadow-lg shadow-red-500/30"
          : "border-white/10 bg-white/5 hover:border-red-500/30 hover:bg-red-500/5"
      }`}
    >
      {/* Animated background glow when active */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Fire particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 100, opacity: 0, scale: 0 }}
                animate={{
                  y: [-20, -60, -100],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
                className="absolute bottom-10 text-orange-500"
                style={{ left: `${20 + i * 10}%` }}
              >
                🔥
              </motion.div>
            ))}

            {/* Glowing backdrop */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-red-500/10 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon container */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key="fire"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [-5, 5, -5],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <FaFire className="text-5xl text-orange-500 drop-shadow-lg" style={{ filter: "drop-shadow(0 0 10px rgba(251, 146, 60, 0.5))" }} />
              </motion.div>
              {/* Secondary fire glow */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="absolute inset-0 blur-xl"
              >
                <FaFire className="text-5xl text-red-500 opacity-50" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="trash"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <FiTrash className="text-4xl text-white/40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Label */}
        <motion.span
          animate={{ opacity: active ? 1 : 0.6 }}
          className={`text-sm font-medium ${active ? "text-red-400" : "text-white/40"}`}
        >
          {active ? "Release to delete" : "Drop here to delete"}
        </motion.span>
      </div>

      {/* Border glow effect when active */}
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: "inset 0 0 30px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.2)",
          }}
        />
      )}
    </motion.div>
  );
};

export default BurnBarrel;
