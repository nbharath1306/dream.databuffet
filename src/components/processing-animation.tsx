"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProcessingAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
  className?: string;
}

// Terminal-style processing messages
const PROCESSING_STAGES = [
  { text: "Initializing Protocol Engine...", duration: 600 },
  { text: "Connecting to verification servers...", duration: 500 },
  { text: "Parsing application data...", duration: 400 },
  { text: "Analyzing academic history...", duration: 500 },
  { text: "Cross-referencing failure patterns...", duration: 600 },
  { text: "Calculating success probability...", duration: 500 },
  { text: "Determining pricing tier...", duration: 400 },
  { text: "Checking grant eligibility...", duration: 500 },
  { text: "Generating candidate profile...", duration: 400 },
  { text: "Building personalized curriculum...", duration: 500 },
  { text: "Compiling final analysis...", duration: 600 },
  { text: "VERDICT READY", duration: 500 },
];

export function ProcessingAnimation({
  isActive,
  onComplete,
  className,
}: ProcessingAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setCurrentStage(0);
      setDisplayedText("");
      setLogs([]);
      return;
    }

    const processStage = async () => {
      for (let i = 0; i < PROCESSING_STAGES.length; i++) {
        setCurrentStage(i);
        setIsTyping(true);

        const stage = PROCESSING_STAGES[i];
        const text = stage.text;

        // Type out the text
        for (let j = 0; j <= text.length; j++) {
          await new Promise((resolve) => setTimeout(resolve, 20));
          setDisplayedText(text.slice(0, j));
        }

        setIsTyping(false);

        // Add to logs
        setLogs((prev) => [...prev.slice(-6), `[${new Date().toISOString().split("T")[1].split(".")[0]}] ${text}`]);

        // Wait before next stage
        await new Promise((resolve) => setTimeout(resolve, stage.duration));
      }

      // Complete
      onComplete?.();
    };

    processStage();
  }, [isActive, onComplete]);

  const progress = ((currentStage + 1) / PROCESSING_STAGES.length) * 100;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6",
            className
          )}
        >
          {/* Scanlines effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
              }}
            />
          </div>

          {/* Glitch overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: [0, 0.02, 0, 0.01, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,255,0,0.1), transparent)",
            }}
          />

          {/* Main terminal container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl"
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/[0.08] border-b-0 rounded-t-lg">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="flex-1 text-center text-xs font-mono text-white/40">
                protocol-engine — analysis
              </span>
            </div>

            {/* Terminal body */}
            <div className="bg-black/80 backdrop-blur-sm border border-white/[0.08] rounded-b-lg p-6 font-mono text-sm">
              {/* ASCII Art Header */}
              <pre className="text-emerald-500/70 text-[10px] leading-tight mb-6 hidden sm:block">
{`╔═══════════════════════════════════════════════════════════════╗
║  ████████╗██╗  ██╗███████╗    ██████╗ ██████╗  ██████╗ ████████╗ ║
║  ╚══██╔══╝██║  ██║██╔════╝    ██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝ ║
║     ██║   ███████║█████╗      ██████╔╝██████╔╝██║   ██║   ██║    ║
║     ██║   ██╔══██║██╔══╝      ██╔═══╝ ██╔══██╗██║   ██║   ██║    ║
║     ██║   ██║  ██║███████╗    ██║     ██║  ██║╚██████╔╝   ██║    ║
║     ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ║
╚═══════════════════════════════════════════════════════════════╝`}
              </pre>

              {/* Status */}
              <div className="flex items-center gap-2 mb-4 text-white/60">
                <span className="text-emerald-400">$</span>
                <span>protocol-analyze --verbose --candidate</span>
              </div>

              {/* Log output */}
              <div className="space-y-1 mb-4 text-white/40 text-xs h-40 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {logs.map((log, i) => (
                    <motion.div
                      key={`${log}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Current operation */}
              <div className="flex items-center gap-2 text-white/80 mb-6">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-emerald-400"
                >
                  ▶
                </motion.span>
                <span>{displayedText}</span>
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-2 h-4 bg-white/80 inline-block"
                  />
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>PROCESSING</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Matrix-style decoration */}
              <div className="mt-6 flex justify-between text-[10px] text-white/20 font-mono">
                <span>MEM: 2.4GB</span>
                <span>CPU: 94%</span>
                <span>NET: 1.2MB/s</span>
                <span>QUEUE: 0</span>
              </div>
            </div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-500/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 10,
              }}
              animate={{
                y: -10,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
