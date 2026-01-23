"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Timer,
  AlertTriangle,
  Shield,
  Eye,
  ArrowRight,
  XCircle,
  Zap,
  Lock,
  Terminal,
  Ban,
  TrendingUp,
  AlertOctagon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Test stages
type TestStage = "intro" | "handbook" | "stage1" | "stage2" | "stage3" | "processing" | "failed";

type FailureReason = "FOCUS_LOST" | "TAMPERING" | "TIME_OUT" | "WRONG_ANSWER" | "INCOMPLETE";

interface TestResults {
  speed: "Insufficient" | "Adequate" | "Excellent";
  focus: "Compromised" | "Maintained";
  logic: "Linear" | "Strategic" | "Elite";
  failureReason: FailureReason;
  failureMessage: string;
  stage1Completed: boolean;
  stage2Completed: boolean;
  stage3Completed: boolean;
}

// The Kill Switch answer (hidden in handbook)
const KILL_SWITCH_COMMAND = "status-page-maintenance-mode";

export function ProtocolTest() {
  const [stage, setStage] = useState<TestStage>("intro");
  const [timeRemaining, setTimeRemaining] = useState(7);
  const [results, setResults] = useState<TestResults | null>(null);
  
  // Stage answers
  const [stage1Answer, setStage1Answer] = useState("");
  const [stage2ClickedLine, setStage2ClickedLine] = useState<number | null>(null);
  const [stage3Answer, setStage3Answer] = useState("");
  
  // Anti-cheat states
  const [focusLost, setFocusLost] = useState(false);
  const [tamperingDetected, setTamperingDetected] = useState(false);
  const [handbookRead, setHandbookRead] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const testStartedRef = useRef(false);

  // Audio context for sounds
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play error sound
  const playErrorSound = useCallback(() => {
    if (typeof window === "undefined") return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 100;
      oscillator.type = "sawtooth";
      gainNode.gain.value = 0.3;
      
      oscillator.start(ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Fail silently
    }
  }, []);

  // Play ambient hum
  const playAmbientHum = useCallback(() => {
    if (typeof window === "undefined") return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 40;
      oscillator.type = "sine";
      gainNode.gain.value = 0.02;
      
      oscillator.start(ctx.currentTime);
      
      return () => {
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.stop(ctx.currentTime + 0.5);
      };
    } catch (e) {
      return () => {};
    }
  }, []);

  // ANTI-CHEAT: Focus Lock - Page Visibility API
  useEffect(() => {
    if (!testStartedRef.current || stage === "intro" || stage === "failed" || stage === "handbook") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setFocusLost(true);
        handleFail("FOCUS_LOST");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stage]);

  // ANTI-CHEAT: Clipboard Poison & DevTools Detection
  useEffect(() => {
    if (!testStartedRef.current || stage === "intro" || stage === "failed" || stage === "handbook") return;

    const preventCopy = (e: Event) => {
      e.preventDefault();
      setTamperingDetected(true);
      handleFail("TAMPERING");
    };

    const preventContextMenu = (e: Event) => {
      e.preventDefault();
      setTamperingDetected(true);
      handleFail("TAMPERING");
    };

    const detectDevTools = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        setTamperingDetected(true);
        handleFail("TAMPERING");
      }
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("paste", preventCopy);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", detectDevTools);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("paste", preventCopy);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", detectDevTools);
    };
  }, [stage]);

  // Timer countdown
  useEffect(() => {
    if (stage === "stage1" || stage === "stage2" || stage === "stage3") {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stage]);

  // Draw code on canvas (Stage 2)
  useEffect(() => {
    if (stage === "stage2" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const codeLines = [
        "1  async function processPayment(orderId) {",
        "2    const order = await db.orders.findById(orderId);",
        "3    const payment = await paymentService.charge(order.amount);",
        "4    await db.inventory.reserve(order.items);  // T=405ms",
        "5    await db.orders.update(orderId, { status: 'paid' });",
        "6    return payment;",
        "7  }",
        "",
        "8  // Microservice: Order Service (Port 3001)",
        "9  // Microservice: Payment Service (Port 3002)",
        "10 // Microservice: Inventory Service (Port 3003)",
        "",
        "// Race Condition: At T=405ms, which line causes DB lock?",
      ];

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#00ff00";
      ctx.textBaseline = "top";

      codeLines.forEach((line, index) => {
        ctx.fillText(line, 20, 20 + index * 22);
      });
    }
  }, [stage]);

  const handleFail = (reason: FailureReason) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    playErrorSound();
    
    testStartedRef.current = false;
    
    let failureMessage = "";
    let focus: "Compromised" | "Maintained" = "Maintained";
    
    switch (reason) {
      case "FOCUS_LOST":
        failureMessage = "Focus compromised. Did you try to switch tabs? We saw that.";
        focus = "Compromised";
        break;
      case "TAMPERING":
        failureMessage = "Tampering detected. Inspect Element will not help you here.";
        focus = "Compromised";
        break;
      case "TIME_OUT":
        failureMessage = "Time expired. Speed insufficient for production environment.";
        break;
      case "WRONG_ANSWER":
        failureMessage = "Logic error. You think like a junior.";
        break;
      case "INCOMPLETE":
        failureMessage = "Incomplete response. Executive presence requires decisiveness.";
        break;
    }
    
    setStage("processing");
    setTimeout(() => {
      setResults({
        speed: "Insufficient",
        focus,
        logic: "Linear",
        failureReason: reason,
        failureMessage,
        stage1Completed: stage !== "stage1",
        stage2Completed: stage === "stage3",
        stage3Completed: false,
      });
      setStage("failed");
    }, 1500);
  };

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    handleFail("TIME_OUT");
  };

  const startTest = () => {
    setStage("handbook");
  };

  const closeHandbook = () => {
    setHandbookRead(true);
    startStage1();
  };

  const startStage1 = () => {
    testStartedRef.current = true;
    setStage("stage1");
    setTimeRemaining(7);
    playAmbientHum();
  };

  const handleStage1Submit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Correct answer: 15, 2, 14 (following the rules)
    // 15 ends in 5 → subtract 10 = 5
    // 4 is even → halve it = 2  
    // 7 is prime → double it = 14
    const correctAnswer = "5, 2, 14";
    const userAnswer = stage1Answer.trim().replace(/\s+/g, "").toLowerCase();
    const correct = correctAnswer.replace(/\s+/g, "").toLowerCase();
    
    if (userAnswer === correct || userAnswer === "5214" || userAnswer === "[5,2,14]") {
      // Passed stage 1, move to stage 2
      setTimeout(() => startStage2(), 1000);
    } else {
      handleFail("WRONG_ANSWER");
    }
  };

  const startStage2 = () => {
    setStage("stage2");
    setTimeRemaining(15);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const lineHeight = 22;
    const lineNumber = Math.floor((y - 20) / lineHeight) + 1;
    
    setStage2ClickedLine(lineNumber);
    
    // Correct answer is line 4 (the inventory.reserve at T=405ms causes the lock)
    if (lineNumber === 4) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => startStage3(), 1000);
    } else {
      handleFail("WRONG_ANSWER");
    }
  };

  const startStage3 = () => {
    setStage("stage3");
    setTimeRemaining(20);
  };

  const handleStage3Submit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const answer = stage3Answer.toLowerCase();
    
    // Check for the kill switch command from handbook
    if (answer.includes("status") && answer.includes("page") || 
        answer.includes("maintenance") ||
        answer.includes("kill switch") ||
        answer.includes(KILL_SWITCH_COMMAND)) {
      // They passed! (almost impossible)
      setStage("processing");
      setTimeout(() => {
        setResults({
          speed: "Excellent",
          focus: "Maintained",
          logic: "Elite",
          failureReason: "WRONG_ANSWER",
          failureMessage: "Congratulations. You are in the 0.1%.",
          stage1Completed: true,
          stage2Completed: true,
          stage3Completed: true,
        });
        setStage("failed");
      }, 1500);
    } else {
      handleFail("WRONG_ANSWER");
    }
  };

  // Intro Screen
  if (stage === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center p-6"
        style={{ userSelect: "none" }}
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-8">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider">
                Anti-Cheat Enabled
              </span>
            </div>

            <h1 className="font-mono text-4xl md:text-6xl text-white mb-6 tracking-tight">
              THE IMPOSSIBLE PROTOCOL
            </h1>

            <p className="text-white/60 text-lg mb-12 leading-relaxed max-w-2xl mx-auto font-mono">
              This is not a quiz. This is a high-stress evaluation engine.
              <br />
              <span className="text-red-400">99.9% will fail.</span>
            </p>

            {/* Warning boxes */}
            <div className="grid md:grid-cols-3 gap-4 mb-12 text-left">
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <Eye className="w-6 h-6 text-red-400 mb-3" />
                <h3 className="text-white font-mono text-sm mb-2">Focus Lock</h3>
                <p className="text-white/40 text-xs font-mono">
                  Switch tabs = instant fail. We're watching.
                </p>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <Ban className="w-6 h-6 text-red-400 mb-3" />
                <h3 className="text-white font-mono text-sm mb-2">No AI Assist</h3>
                <p className="text-white/40 text-xs font-mono">
                  Clipboard disabled. DevTools blocked. Canvas rendering.
                </p>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <Timer className="w-6 h-6 text-red-400 mb-3" />
                <h3 className="text-white font-mono text-sm mb-2">Extreme Pressure</h3>
                <p className="text-white/40 text-xs font-mono">
                  7-20 seconds per stage. No room for ChatGPT.
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={startTest}
              className="group uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white font-mono"
            >
              <span>Initialize Protocol</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <p className="text-white/30 text-xs mt-6 font-mono">
              WARNING: Once started, you cannot pause, copy, or switch tabs.
            </p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Handbook Modal (Hidden Kill Switch)
  if (stage === "handbook") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center p-6"
        style={{ userSelect: "none" }}
      >
        <div className="max-w-2xl bg-white/[0.02] border border-white/10 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-mono text-white">Employee Handbook</h2>
          </div>

          <div className="space-y-4 text-white/60 font-mono text-sm mb-8 leading-relaxed">
            <p>
              Welcome to the Data Buffet Protocol. You are now under evaluation.
            </p>
            <p>
              <span className="text-white">Security Protocol:</span> This window is monitored. 
              Tab switching, copy-paste, and DevTools will result in immediate disqualification.
            </p>
            <p>
              <span className="text-white">Emergency Procedures:</span> In case of production 
              incidents, always follow the standard operating procedure:
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-4 my-4">
              <p className="text-emerald-400 font-bold mb-2">Critical: System Emergency Response</p>
              <p className="text-white/80">
                Step 1: Activate <span className="bg-black px-2 py-1 rounded text-emerald-400">status-page-maintenance-mode</span>
              </p>
              <p className="text-white/60 text-xs mt-2">
                This stops all traffic before attempting any fix. Remember: stop the bleeding first.
              </p>
            </div>
            <p>
              You have 60 seconds to read this handbook. The test begins immediately after.
            </p>
          </div>

          <Button
            onClick={closeHandbook}
            className="w-full font-mono uppercase tracking-wider"
          >
            I Understand • Begin Test
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="text-center text-white/30 text-xs mt-4 font-mono">
            This handbook will not be available during the test.
          </p>
        </div>
      </motion.div>
    );
  }

  // Stage 1: Short-Circuit (Cognitive Overload)
  if (stage === "stage1") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center p-6"
        style={{ userSelect: "none" }}
      >
        <div className="max-w-3xl w-full">
          {/* Timer - Glitchy effect */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-white/40 font-mono text-xs">
              <Lock className="w-4 h-4 text-red-400" />
              <span>STAGE 1/3 • FOCUS LOCKED</span>
            </div>
            
            <motion.div
              animate={{ scale: timeRemaining <= 3 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: timeRemaining <= 3 ? Infinity : 0 }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded border font-mono",
                timeRemaining <= 3
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-white/[0.02] border-white/10 text-white"
              )}
            >
              <Timer className="w-5 h-5" />
              <span className="text-2xl font-bold">{timeRemaining}s</span>
            </motion.div>
          </div>

          {/* Question */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-500/5 border border-red-500/20 rounded-lg p-8 mb-6"
          >
            <div className="mb-6">
              <h2 className="text-xl text-red-400 font-mono mb-4 uppercase tracking-wider">
                Cognitive Overload Test
              </h2>
              <div className="bg-black/50 border border-white/10 rounded p-4 mb-4 font-mono text-sm text-white/80">
                <p className="mb-2"><span className="text-emerald-400">RULE:</span></p>
                <ul className="space-y-1 ml-4 text-white/70">
                  <li>• If number is PRIME → double it</li>
                  <li>• If number is EVEN → halve it</li>
                  <li>• If number ENDS IN 5 → subtract 10</li>
                </ul>
              </div>
              <p className="text-2xl text-white font-mono mb-4">
                Apply to sequence: <span className="text-emerald-400">15, 4, 7</span>
              </p>
              <p className="text-white/40 text-sm font-mono">
                Enter results as: X, Y, Z
              </p>
            </div>

            <Input
              type="text"
              value={stage1Answer}
              onChange={(e) => setStage1Answer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && stage1Answer.trim()) {
                  handleStage1Submit();
                }
              }}
              placeholder="X, Y, Z"
              className="text-xl h-14 bg-black border-white/20 font-mono"
              autoFocus
            />
          </motion.div>

          <Button
            onClick={handleStage1Submit}
            disabled={!stage1Answer.trim()}
            className="w-full font-mono uppercase"
            size="lg"
          >
            Submit Answer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    );
  }

  // Stage 2: The Deadlock (System Architecture)
  if (stage === "stage2") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center p-6"
        style={{ userSelect: "none" }}
      >
        <div className="max-w-4xl w-full">
          {/* Timer */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-white/40 font-mono text-xs">
              <Lock className="w-4 h-4 text-red-400" />
              <span>STAGE 2/3 • STAGE 1 PASSED</span>
            </div>
            
            <motion.div
              animate={{ scale: timeRemaining <= 5 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: timeRemaining <= 5 ? Infinity : 0 }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded border font-mono",
                timeRemaining <= 5
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-white/[0.02] border-white/10 text-white"
              )}
            >
              <Timer className="w-5 h-5" />
              <span className="text-2xl font-bold">{timeRemaining}s</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-8 mb-6"
          >
            <h2 className="text-xl text-orange-400 font-mono mb-4 uppercase tracking-wider">
              Race Condition Detection
            </h2>
            <p className="text-white/60 font-mono text-sm mb-6">
              At T=405ms, a race condition occurs. Click the line number that causes the database lock.
            </p>

            {/* Canvas for non-copyable code */}
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              onClick={handleCanvasClick}
              className="w-full border border-white/10 rounded cursor-crosshair bg-black"
            />

            {stage2ClickedLine && (
              <p className="text-white/60 font-mono text-sm mt-4">
                Selected Line: <span className="text-white">{stage2ClickedLine}</span>
              </p>
            )}
          </motion.div>

          <p className="text-center text-white/30 font-mono text-xs">
            Click directly on the line number that causes the deadlock
          </p>
        </div>
      </motion.div>
    );
  }

  // Stage 3: Executive Kill (The Kobayashi Maru)
  if (stage === "stage3") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center p-6"
        style={{ userSelect: "none" }}
      >
        <div className="max-w-3xl w-full">
          {/* Timer */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-white/40 font-mono text-xs">
              <Lock className="w-4 h-4 text-red-400" />
              <span>STAGE 3/3 • FINAL TEST</span>
            </div>
            
            <motion.div
              animate={{ scale: timeRemaining <= 8 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: timeRemaining <= 8 ? Infinity : 0 }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded border font-mono",
                timeRemaining <= 8
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-white/[0.02] border-white/10 text-white"
              )}
            >
              <Timer className="w-5 h-5" />
              <span className="text-2xl font-bold">{timeRemaining}s</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-8 mb-6"
          >
            <div className="flex items-start gap-3 mb-6">
              <AlertOctagon className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h2 className="text-xl text-purple-400 font-mono mb-2 uppercase tracking-wider">
                  Production Crisis
                </h2>
                <p className="text-red-400 font-mono text-sm mb-4">
                  BLACK FRIDAY • $50K/MINUTE LOSS
                </p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 rounded p-6 mb-6 font-mono text-sm">
              <p className="text-white mb-4 leading-relaxed">
                You are the <span className="text-emerald-400">Lead Engineer</span>. A security patch 
                just bricked the payment gateway. Losing <span className="text-red-400 font-bold">$50,000/minute</span>.
              </p>
              <p className="text-white/70 mb-4">
                • Rolling back = 45 minutes
                <br />
                • Fixing forward = 15 minutes (but risks data corruption)
                <br />
                • CEO is screaming at you on Slack
              </p>
              <p className="text-white text-lg">
                What is your <span className="text-emerald-400">exact first command or action</span>?
              </p>
            </div>

            <Input
              type="text"
              value={stage3Answer}
              onChange={(e) => setStage3Answer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && stage3Answer.trim()) {
                  handleStage3Submit();
                }
              }}
              placeholder="Type your exact command or action..."
              className="text-lg h-14 bg-black border-white/20 font-mono"
              autoFocus
            />
          </motion.div>

          <Button
            onClick={handleStage3Submit}
            disabled={!stage3Answer.trim()}
            className="w-full font-mono uppercase"
            size="lg"
          >
            Execute Command
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    );
  }

  // Processing
  if (stage === "processing") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center p-6"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-2 border-red-500/30 border-t-red-500 rounded-full mx-auto mb-6"
          />
          <p className="text-red-400 font-mono uppercase tracking-wider text-sm">
            Analyzing Protocol Results...
          </p>
        </div>
      </motion.div>
    );
  }

  // Failed Screen - The Sales Pitch
  if (stage === "failed" && results) {
    const passed = results.stage3Completed && results.logic === "Elite";

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center p-6"
        style={{ userSelect: "text" }}
      >
        <div className="max-w-4xl w-full">
          {/* Header - Glitch Effect */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={passed ? {} : { x: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5, repeat: passed ? 0 : Infinity, repeatDelay: 2 }}
              className={cn(
                "inline-flex items-center gap-3 px-6 py-3 border-2 rounded-full mb-6 font-mono",
                passed 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              )}
            >
              <XCircle className="w-6 h-6" />
              <span className="text-xl font-bold uppercase tracking-wider">
                {passed ? "PROTOCOL PASSED" : "ACCESS DENIED"}
              </span>
            </motion.div>

            <h1 className="font-mono text-3xl md:text-5xl text-white mb-4 tracking-tight">
              {passed 
                ? "You are in the 0.1%"
                : "You are in the 99.9%"}
            </h1>

            <p className="text-white/50 text-lg max-w-2xl mx-auto font-mono">
              {passed
                ? "Congratulations. You have elite-level engineering intuition."
                : "The industry doesn't wait for you."}
            </p>
          </motion.div>

          {/* Analysis Grid */}
          {!passed && (
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-red-500/5 border border-red-500/20 rounded-lg p-6"
              >
                <h3 className="text-red-400 font-mono text-xs uppercase tracking-wider mb-2">
                  Speed
                </h3>
                <div className="text-3xl font-mono font-bold text-white mb-2">
                  {results.speed}
                </div>
                <p className="text-white/40 text-xs font-mono">
                  Processing time below production standard
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-red-500/5 border border-red-500/20 rounded-lg p-6"
              >
                <h3 className="text-red-400 font-mono text-xs uppercase tracking-wider mb-2">
                  Focus
                </h3>
                <div className="text-3xl font-mono font-bold text-white mb-2">
                  {results.focus}
                </div>
                <p className="text-white/40 text-xs font-mono">
                  {results.failureMessage}
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-red-500/5 border border-red-500/20 rounded-lg p-6"
              >
                <h3 className="text-red-400 font-mono text-xs uppercase tracking-wider mb-2">
                  Logic
                </h3>
                <div className="text-3xl font-mono font-bold text-white mb-2">
                  {results.logic}
                </div>
                <p className="text-white/40 text-xs font-mono">
                  You think like a junior engineer
                </p>
              </motion.div>
            </div>
          )}

          {/* The Pitch */}
          {!passed && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-red-500/10 via-purple-500/10 to-blue-500/10 border border-white/10 rounded-xl p-8 mb-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-mono text-white mb-3 uppercase tracking-tight">
                  The Reality
                </h2>
                <p className="text-white/70 leading-relaxed font-mono text-sm mb-4">
                  Top companies don't hire you because you know React. They hire you because you can 
                  solve problems under pressure <span className="text-red-400">without asking an AI</span>.
                </p>
                <p className="text-white/60 leading-relaxed font-mono text-sm mb-6">
                  You have raw talent. But you're not ready for the $200K+ leagues yet.
                  <br />
                  <span className="text-white/40">This is where 99% stop. You can be different.</span>
                </p>

                <div className="bg-black/50 border border-white/10 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-mono text-white mb-3">
                    The Data Buffet Cohort
                  </h3>
                  <p className="text-white/70 font-mono text-sm mb-4">
                    We don't teach you to code. We teach you to <span className="text-emerald-400">survive this test</span>.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>6-month intensive training</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>Build raw engineering intuition</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>Guaranteed re-test after graduation</span>
                    </li>
                  </ul>
                  <p className="text-emerald-400 font-mono text-lg font-bold">
                    Pass the re-test → We place you in $180K-$350K roles
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white uppercase tracking-wider font-mono"
                  onClick={() => window.location.href = '/apply'}
                >
                  Apply for Batch 12
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 uppercase tracking-wider font-mono"
                  onClick={() => window.location.href = '/'}
                >
                  Back to Home
                </Button>
              </div>

              <p className="text-center text-white/30 text-xs mt-6 font-mono">
                $0 upfront. Pay only when placed. Next cohort: March 2026.
              </p>
            </motion.div>
          )}

          {/* Success message */}
          {passed && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <p className="text-white/60 font-mono text-lg mb-8">
                You have elite-level decision-making under pressure.
                <br />
                <span className="text-emerald-400">We will be in touch within 24 hours.</span>
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = '/apply'}
                className="uppercase tracking-wider font-mono"
              >
                Complete Application
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Quote */}
          <p className="text-center text-white/30 text-sm font-mono mt-8">
            "I don't hire students who pass easy tests.
            <br />
            I hire students who fail hard tests, then come back stronger."
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
}
