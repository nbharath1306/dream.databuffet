"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useApplicationStore, AnalysisFlag } from "@/store/application-store";
import { Activity, AlertTriangle, CheckCircle, Info, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LiveAnalysisProps {
  className?: string;
  variant?: "sidebar" | "bottom";
}

export function LiveAnalysis({
  className,
  variant = "sidebar",
}: LiveAnalysisProps) {
  const { analysisFlags, formData, currentStep } = useApplicationStore();
  const [displayFlags, setDisplayFlags] = useState<AnalysisFlag[]>([]);

  // Keep only recent flags and animate them
  useEffect(() => {
    setDisplayFlags(analysisFlags.slice(-5));
  }, [analysisFlags]);

  const getIcon = (type: AnalysisFlag["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case "success":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case "info":
        return <Info className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getBgColor = (type: AnalysisFlag["type"]) => {
    switch (type) {
      case "warning":
        return "bg-amber-500/10 border-amber-500/20";
      case "success":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "info":
        return "bg-blue-500/10 border-blue-500/20";
    }
  };

  // Calculate completion percentage
  const completedFields = Object.values(formData).filter(Boolean).length;
  const totalFields = Object.keys(formData).length;
  const completionPercent = Math.round((completedFields / totalFields) * 100);

  if (variant === "bottom") {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-t border-white/10",
          "px-4 py-3 md:hidden",
          className
        )}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Cpu className="w-5 h-5 text-white/60" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div className="text-xs">
              <div className="text-white/40 uppercase tracking-wider">
                Analysis
              </div>
              <div className="text-white/80 font-mono">{completionPercent}%</div>
            </div>
          </div>

          {/* Latest flag */}
          <AnimatePresence mode="wait">
            {displayFlags.length > 0 && (
              <motion.div
                key={displayFlags[displayFlags.length - 1].timestamp}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-md border text-xs font-mono truncate",
                  getBgColor(displayFlags[displayFlags.length - 1].type)
                )}
              >
                {displayFlags[displayFlags.length - 1].message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Sidebar variant (desktop)
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className={cn(
        "hidden lg:block w-80 bg-white/[0.02] border-l border-white/[0.05] p-6",
        "sticky top-0 h-screen overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Activity className="w-5 h-5 text-white/60" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white/80">Live Analysis</h3>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">
            Real-time Processing
          </p>
        </div>
      </div>

      {/* Progress ring */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-white/10"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="text-white"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: completionPercent / 100 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              strokeDasharray="251.2"
              strokeDashoffset={251.2 * (1 - completionPercent / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-mono font-bold text-white">
              {completionPercent}%
            </span>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              Complete
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.05] my-6" />

      {/* System Status */}
      <div className="mb-4">
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
          System Status
        </div>
        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-white/50">Step</span>
            <span className="text-white/80">{currentStep + 1}/6</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">Flags</span>
            <span className="text-white/80">{displayFlags.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">Status</span>
            <span className="text-emerald-400">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.05] my-6" />

      {/* Analysis Flags */}
      <div>
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
          Detection Log
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {displayFlags.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-white/30 italic"
              >
                Waiting for input...
              </motion.div>
            ) : (
              displayFlags.map((flag, index) => (
                <motion.div
                  key={flag.timestamp}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-start gap-2 p-2.5 rounded-md border text-xs",
                    getBgColor(flag.type)
                  )}
                >
                  <span className="flex-shrink-0 mt-0.5">{getIcon(flag.type)}</span>
                  <span className="text-white/70 leading-relaxed font-mono">
                    {flag.message}
                  </span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer status */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          PROTOCOL v2.0 — SCANNING
        </div>
      </div>
    </motion.div>
  );
}
