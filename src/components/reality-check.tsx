"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Zap, Clock, Target, DollarSign } from "lucide-react";

function AnimatedCounter({ value, prefix = "", suffix = "", duration = 2 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

interface StatCardProps {
  label: string;
  ourValue: string | number;
  theirValue: string | number;
  icon: React.ReactNode;
  positive?: boolean;
}

function StatCard({ label, ourValue, theirValue, icon, positive = true }: StatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative p-6 rounded-lg border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm hover:border-white/20 transition-all duration-500"
    >
      {/* Glassmorphism overlay on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/40 text-xs uppercase tracking-wider">{label}</span>
          <div className="text-white/30">{icon}</div>
        </div>
        
        <div className="space-y-3">
          {/* Our stat */}
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-2xl font-mono text-white">{ourValue}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider">Data Buffet</div>
            </div>
          </div>
          
          {/* Their stat */}
          <div className="flex items-center gap-3 opacity-50">
            <TrendingDown className="w-4 h-4 text-red-400/60" />
            <div>
              <div className="text-lg font-mono text-white/40 line-through decoration-red-400/40">{theirValue}</div>
              <div className="text-[10px] text-white/20 uppercase tracking-wider">Industry Avg</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function RealityCheck() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 rounded-full mb-6">
            Reality Check
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            The Numbers Don't Lie
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            See how our alumni compare to traditional bootcamp graduates
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <StatCard
            label="Starting Salary"
            ourValue="$187,000"
            theirValue="$65,000"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatCard
            label="Time to Placement"
            ourValue="14 Days"
            theirValue="6+ Months"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            label="Interview Rate"
            ourValue="94%"
            theirValue="12%"
            icon={<Target className="w-5 h-5" />}
          />
          
          {/* Large featured card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-2 relative p-8 rounded-lg border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Success Metric</span>
                <div className="text-5xl md:text-6xl font-mono text-white mb-2">
                  <AnimatedCounter value={98} suffix="%" />
                </div>
                <p className="text-white/50">
                  of our graduates receive multiple competing offers
                </p>
              </div>
              <div className="flex-shrink-0">
                <Zap className="w-16 h-16 text-white/10" />
              </div>
            </div>
          </motion.div>

          <StatCard
            label="FAANG Placement"
            ourValue="67%"
            theirValue="3%"
            icon={<Target className="w-5 h-5" />}
          />
        </motion.div>

        {/* Bottom disclaimer */}
        <motion.p
          className="text-center text-white/20 text-xs mt-12 font-mono"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          * Based on verified 2024-2025 placement data. Results vary.
        </motion.p>
      </div>
    </section>
  );
}
