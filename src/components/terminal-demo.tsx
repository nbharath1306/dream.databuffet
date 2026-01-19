"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { Terminal, AlertCircle, Clock } from "lucide-react";

const codeLines = [
  { type: "comment", content: "# Production Error Log - CRITICAL" },
  { type: "error", content: "Traceback (most recent call last):" },
  { type: "code", content: '  File "pipeline/etl_processor.py", line 847, in execute' },
  { type: "code", content: "    result = self.transform_batch(data_chunk)" },
  { type: "code", content: '  File "pipeline/etl_processor.py", line 623, in transform_batch' },
  { type: "code", content: "    validated = schema.validate(record, strict=True)" },
  { type: "code", content: '  File "validators/schema.py", line 156, in validate', isRoot: true },
  { type: "code", content: "    raise ValidationError(f\"Type mismatch: {field}\")" },
  { type: "error", content: "ValidationError: Type mismatch: 'revenue' expected float64, got object" },
  { type: "blank", content: "" },
  { type: "warning", content: ">>> 2.3M records affected. Pipeline halted." },
  { type: "warning", content: ">>> Downstream jobs waiting: 47" },
  { type: "warning", content: ">>> Estimated revenue impact: $340K/hour" },
];

// Typewriter hook for auto-typing effect
function useTypewriter(text: string, speed: number = 30, startDelay: number = 0, enabled: boolean = true) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      setIsComplete(true);
      return;
    }

    setDisplayText("");
    setIsComplete(false);

    const startTimeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, startDelay, enabled]);

  return { displayText, isComplete };
}

function TypewriterLine({ 
  line, 
  index, 
  isHovered, 
  startDelay,
  onComplete,
  isVisible
}: { 
  line: typeof codeLines[0]; 
  index: number; 
  isHovered: boolean;
  startDelay: number;
  onComplete?: () => void;
  isVisible: boolean;
}) {
  const { displayText, isComplete } = useTypewriter(
    line.content, 
    15, 
    startDelay,
    isVisible
  );

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  const getColor = () => {
    switch (line.type) {
      case "comment":
        return "text-white/30";
      case "error":
        return "text-red-400";
      case "warning":
        return "text-amber-400";
      default:
        return "text-white/70";
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-start gap-4 py-0.5 px-4 -mx-4 rounded transition-colors ${
        isHovered && (line as typeof codeLines[0] & { isRoot?: boolean }).isRoot ? "bg-emerald-500/20 border-l-2 border-emerald-400" : 
        isHovered && line.type === "code" ? "bg-red-500/10" : ""
      }`}
    >
      <span className="text-white/20 select-none w-6 text-right flex-shrink-0 font-mono text-xs">
        {index + 1}
      </span>
      <code className={`${getColor()} font-mono text-sm`}>
        {displayText || "\u00A0"}
        {!isComplete && <span className="inline-block w-2 h-4 bg-white/50 ml-0.5 animate-pulse" />}
      </code>
    </motion.div>
  );
}

// Simple CodeLine component for non-animated display
function CodeLine({ 
  line, 
  index, 
  isHovered 
}: { 
  line: typeof codeLines[0]; 
  index: number; 
  isHovered: boolean;
}) {
  const getColor = () => {
    switch (line.type) {
      case "comment":
        return "text-white/30";
      case "error":
        return "text-red-400";
      case "warning":
        return "text-amber-400";
      default:
        return "text-white/70";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-start gap-4 py-0.5 px-4 -mx-4 rounded transition-colors ${
        isHovered && (line as typeof codeLines[0] & { isRoot?: boolean }).isRoot ? "bg-emerald-500/20 border-l-2 border-emerald-400" : 
        isHovered && line.type === "code" ? "bg-red-500/10" : ""
      }`}
    >
      <span className="text-white/20 select-none w-6 text-right flex-shrink-0 font-mono text-xs">
        {index + 1}
      </span>
      <code className={`${getColor()} font-mono text-sm`}>{line.content || "\u00A0"}</code>
    </motion.div>
  );
}

export function TerminalDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showPrompt, setShowPrompt] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const handleWrongClick = () => {
    setShowRejected(true);
    setTimeout(() => setShowRejected(false), 2000);
  };

  return (
    <section ref={ref} className="relative py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 rounded-full mb-6">
            The Entrance Protocol
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Can You Handle This?
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            This is a real production error from a Fortune 500 data pipeline. 
            Our entrance test has 47 of these. You have 60 minutes.
          </p>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          className="relative rounded-lg overflow-hidden border border-white/[0.1] bg-[#0c0c0c] shadow-2xl"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <Terminal className="w-4 h-4" />
              <span className="font-mono text-xs">production_debug.py — ssh@data-pipeline-prod-03</span>
            </div>
            <div className="w-16" />
          </div>

          {/* Terminal content */}
          <div className="p-6 min-h-[400px] relative">
            <div>
              {codeLines.map((line, index) => (
                <div
                  key={index}
                  onMouseEnter={() => line.type === "code" && setHoveredLine(index)}
                  onMouseLeave={() => setHoveredLine(null)}
                  onClick={() => line.type === "code" && handleWrongClick()}
                  className={line.type === "code" ? "cursor-pointer" : ""}
                >
                  <CodeLine line={line} index={index} isHovered={hoveredLine === index} />
                </div>
              ))}
            </div>

            {/* Prompt */}
            <AnimatePresence>
              {showPrompt && (
                <motion.div
                  className="mt-8 pt-6 border-t border-white/[0.05]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span className="font-mono text-amber-400 text-sm">
                      CHALLENGE: Fix this production error in 60 seconds
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-mono text-sm">→</span>
                    <span className="text-white/70 font-mono text-sm">
                      Click on the line containing the root cause...
                    </span>
                    <span className="inline-block w-2 h-4 bg-white/70 animate-pulse" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* REJECTED overlay */}
            <AnimatePresence>
              {showRejected && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="text-center"
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <div className="inline-block px-8 py-4 border-4 border-red-500 rounded">
                      <span className="font-mono text-4xl md:text-6xl text-red-500 font-bold tracking-widest">
                        REJECTED
                      </span>
                    </div>
                    <p className="mt-4 text-white/50 font-mono text-sm">
                      That's not the root cause. Try again.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          <p className="text-white/30 text-sm mb-4">
            98% of applicants fail this test. The 2% who pass? They're already employed.
          </p>
          <button className="text-white/60 hover:text-white text-sm font-mono uppercase tracking-wider transition-colors">
            Take the Full Test →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
