
"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface EnhancedNavigationProps {
  currentLevel: number;
  totalLevels: number;
  onLevelChange: (level: number) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

export default function EnhancedNavigation({
  currentLevel,
  totalLevels,
  onLevelChange,
  isAutoPlaying,
  onToggleAutoPlay
}: EnhancedNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const levels = [
    { name: "VERKTYGSLÅDA", color: "blue" },
    { name: "HJÄLTEN", color: "amber" },
    { name: "IMPERIUM", color: "purple" },
    { name: "ONESTOPSHOP", color: "slate" }
  ];

  return (
    <motion.div
      className="fixed top-6 right-6 z-40"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
        animate={{ height: isExpanded ? "auto" : "60px" }}
        transition={{ duration: 0.3 }}
      >
        {/* Current level display */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-left">
            <div className="text-sm opacity-80">Nivå {currentLevel + 1}</div>
            <div className="font-semibold">{levels[currentLevel]?.name}</div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>

        {/* Expanded navigation */}
        <motion.div
          className="border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {levels.map((level, index) => (
            <motion.button
              key={index}
              onClick={() => {
                onLevelChange(index);
                setIsExpanded(false);
              }}
              className={`w-full px-6 py-3 text-left hover:bg-white/10 transition-colors ${
                index === currentLevel ? "bg-white/20" : ""
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    index === currentLevel
                      ? `bg-${level.color}-400`
                      : "bg-white/40"
                  }`}
                />
                <div>
                  <div className="text-sm text-white/80">Nivå {index + 1}</div>
                  <div className="text-white font-medium">{level.name}</div>
                </div>
              </div>
            </motion.button>
          ))}

          {/* Auto-play toggle */}
          <div className="border-t border-white/20 p-4">
            <motion.button
              onClick={onToggleAutoPlay}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                isAutoPlaying
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-white/10 text-white/80 border border-white/20"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isAutoPlaying ? "Auto-Play: PÅ" : "Auto-Play: AV"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        className="mt-4 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex space-x-1">
          {levels.map((_, index) => (
            <motion.div
              key={index}
              className={`w-8 h-2 rounded-full transition-all duration-300 ${
                index === currentLevel
                  ? "bg-white"
                  : index < currentLevel
                  ? "bg-white/60"
                  : "bg-white/20"
              }`}
              whileHover={{ scale: 1.1 }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
