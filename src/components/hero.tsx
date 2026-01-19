"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Animated grid lines */}
    <div className="absolute inset-0 animate-grid">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    {/* Floating particles */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />
    {/* Center glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-3xl" />
    {/* Secondary glow */}
    <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-3xl" />
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-24 overflow-hidden">
      <GridBackground />
      
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm">
            <Shield className="w-4 h-4 text-white/60" />
            <span className="text-xs font-mono tracking-widest text-white/60 uppercase">
              Acceptance Rate: 2.3%
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-[0.95] tracking-tight mb-8"
        >
          <span className="text-gradient">The Industry Doesn't</span>
          <br />
          <span className="text-gradient">Need More Analysts.</span>
          <br />
          <span className="text-white">It Needs The Top 1%.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          98% of candidates fail our entrance protocol. 
          <span className="text-white/70"> If you pass, we place you.</span>
          <br />
          <span className="text-white/40">If you fail, we train you.</span>
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <a href="#test">
            <Button size="lg" className="group uppercase tracking-wider">
              <span>Initiate Protocol</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          variants={itemVariants}
          className="mt-20 pt-8 border-t border-white/10"
        >
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
            <div className="text-center">
              <div className="font-mono text-2xl md:text-3xl text-white mb-1">$187K</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Avg. Salary</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl md:text-3xl text-white mb-1">94%</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl md:text-3xl text-white mb-1">14 Days</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">To First Offer</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
