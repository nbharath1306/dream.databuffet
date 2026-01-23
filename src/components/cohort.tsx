"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Skull, Hammer, Rocket, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const phases = [
  {
    number: "01",
    title: "The Break",
    duration: "Week 1-2",
    icon: Skull,
    description: "We systematically dismantle everything you think you know. Your confidence will hit zero. This is by design.",
    details: [
      "24-hour assessment bootcamp",
      "Complete skill audit & gap analysis",
      "Mental model reconstruction",
      "Ego elimination protocols",
    ],
  },
  {
    number: "02", 
    title: "The Rebuild",
    duration: "Week 3-8",
    icon: Hammer,
    description: "From the ashes, we forge production-grade data engineers. Real systems. Real pressure. Real results.",
    details: [
      "Live production environment access",
      "Fortune 500 case studies",
      "1:1 mentorship with industry leads",
      "Daily code reviews & system design",
    ],
  },
  {
    number: "03",
    title: "The Placement",
    duration: "Week 9-12",
    icon: Rocket,
    description: "You don't apply for jobs. Companies apply for you. We orchestrate a bidding war.",
    details: [
      "Exclusive recruiter network access",
      "Salary negotiation war games",
      "Multiple offer orchestration",
      "Lifetime alumni network",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export function Cohort() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="cohort" ref={ref} className="relative py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 rounded-full mb-6">
            The Cohort
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            12 Weeks to Transform
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            This isn't a course. It's a complete professional reconstruction. 
            We don't teach—we forge.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent md:-translate-x-1/2" />

          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={phase.number}
                variants={itemVariants}
                className={`relative flex flex-col md:flex-row items-start gap-8 mb-16 last:mb-0 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline node */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-[#0a0a0a] border-2 border-white/30 z-10" />

                {/* Content card */}
                <div className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${isEven ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="group relative p-8 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all duration-500">
                    {/* Phase number */}
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
                      <span className="font-mono text-xs text-white/50">{phase.number}</span>
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-white/[0.05] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white/60" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl text-white">{phase.title}</h3>
                        <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                          {phase.duration}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/50 mb-6 leading-relaxed">
                      {phase.description}
                    </p>

                    {/* Details */}
                    <ul className="space-y-2">
                      {phase.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-white/40">
                          <CheckCircle2 className="w-4 h-4 text-white/20 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-[calc(50%-3rem)]" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
        >
          <div className="inline-flex flex-col items-center">
            <span className="text-white/30 text-xs font-mono uppercase tracking-wider mb-4">
              Next Cohort: March 2026 • 12 Seats Remaining
            </span>
            <a href="/apply">
              <Button size="lg" className="group uppercase tracking-wider">
                <span>Apply for Cohort</span>
                <Rocket className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <span className="text-white/20 text-xs mt-4">
              $0 upfront. Pay only when placed.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
