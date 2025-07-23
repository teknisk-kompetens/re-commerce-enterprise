
"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Users, Globe } from "lucide-react";

interface MagicalLoadingProps {
  isVisible: boolean;
  progress: number;
}

export default function MagicalLoading({ isVisible, progress }: MagicalLoadingProps) {
  const icons = [Sparkles, Zap, Users, Globe];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      <div className="text-center text-white space-y-8 max-w-md mx-auto px-6">
        {/* Animated logo */}
        <motion.div
          className="relative mx-auto w-24 h-24 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-80" />
          <Sparkles className="w-12 h-12 text-white relative z-10" />
          
          {/* Orbiting icons */}
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute w-8 h-8 flex items-center justify-center"
              animate={{
                rotate: [0, 360],
                x: [0, Math.cos((index * Math.PI) / 2) * 40, 0],
                y: [0, Math.sin((index * Math.PI) / 2) * 40, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.5,
                ease: "linear",
              }}
            >
              <Icon className="w-6 h-6 text-yellow-400" />
            </motion.div>
          ))}
        </motion.div>

        {/* Loading text */}
        <div className="space-y-4">
          <motion.h1
            className="text-4xl font-bold gradient-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            re:Commerce Enterprise
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Förbereder din magiska upplevelse...
          </motion.p>
        </div>

        {/* Progress bar */}
        <motion.div
          className="w-full max-w-xs mx-auto space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between text-sm text-gray-400">
            <span>Laddar</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          className="flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
