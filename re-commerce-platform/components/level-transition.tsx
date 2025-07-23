
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LevelTransitionProps {
  isVisible: boolean;
  currentLevel: number;
  nextLevel: number;
}

export default function LevelTransition({ isVisible, currentLevel, nextLevel }: LevelTransitionProps) {
  const getLevelName = (level: number) => {
    const names = ["VERKTYGSLÅDA", "HJÄLTEN", "IMPERIUM", "ONESTOPSHOP"];
    return names[level] || "";
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      <motion.div
        className="text-center text-white space-y-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Animated sparkles */}
        <motion.div
          className="relative mx-auto w-32 h-32 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-16 h-16 text-yellow-400" />
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: `${Math.cos((i * Math.PI) / 4) * 40}px ${Math.sin((i * Math.PI) / 4) * 40}px`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Level transition text */}
        <div className="space-y-4">
          <motion.p
            className="text-xl text-gray-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Övergår till
          </motion.p>
          <motion.h2
            className="text-6xl font-bold gradient-text"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            NIVÅ {nextLevel + 1}
          </motion.h2>
          <motion.h3
            className="text-3xl font-semibold text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {getLevelName(nextLevel)}
          </motion.h3>
        </div>

        {/* Loading bar */}
        <motion.div
          className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto"
          initial={{ width: 0 }}
          animate={{ width: 256 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.7, duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
