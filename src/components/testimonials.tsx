"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Linkedin } from "lucide-react";

const alumni = [
  {
    name: "Sarah Chen",
    image: "SC",
    previousRole: "Uber Driver",
    currentRole: "Staff Data Engineer",
    company: "Spotify",
    salary: "$245K",
    linkedIn: "#",
  },
  {
    name: "Marcus Johnson",
    image: "MJ",
    previousRole: "Barista",
    currentRole: "Senior ML Engineer", 
    company: "Meta",
    salary: "$312K",
    linkedIn: "#",
  },
  {
    name: "Priya Patel",
    image: "PP",
    previousRole: "Retail Manager",
    currentRole: "Data Lead",
    company: "Stripe",
    salary: "$287K",
    linkedIn: "#",
  },
  {
    name: "James Wright",
    image: "JW",
    previousRole: "Teacher",
    currentRole: "Principal Engineer",
    company: "Netflix",
    salary: "$340K",
    linkedIn: "#",
  },
  {
    name: "Elena Rodriguez",
    image: "ER",
    previousRole: "Waitress",
    currentRole: "Data Architect",
    company: "Airbnb",
    salary: "$275K",
    linkedIn: "#",
  },
  {
    name: "David Kim",
    image: "DK",
    previousRole: "Call Center Rep",
    currentRole: "Staff Engineer",
    company: "Apple",
    salary: "$298K",
    linkedIn: "#",
  },
  {
    name: "Aisha Mohammed",
    image: "AM",
    previousRole: "Bank Teller",
    currentRole: "Senior Data Scientist",
    company: "Google",
    salary: "$325K",
    linkedIn: "#",
  },
  {
    name: "Tom Anderson",
    image: "TA",
    previousRole: "Warehouse Worker",
    currentRole: "Engineering Manager",
    company: "Amazon",
    salary: "$380K",
    linkedIn: "#",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

function AlumniCard({ person }: { person: typeof alumni[0] }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative p-6 rounded-lg border border-white/[0.08] bg-[#0c0c0c] hover:border-white/20 transition-all duration-500"
    >
      {/* Top section */}
      <div className="flex items-start justify-between mb-6">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center">
          <span className="font-mono text-lg text-white/60">{person.image}</span>
        </div>
        
        {/* LinkedIn */}
        <a 
          href={person.linkedIn}
          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-colors"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </div>

      {/* Name & Company */}
      <h3 className="font-medium text-lg text-white mb-1">{person.name}</h3>
      <p className="text-sm text-white/60 mb-4">
        {person.currentRole} <span className="text-white/30">@</span> {person.company}
      </p>

      {/* Transformation */}
      <div className="pt-4 border-t border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30 uppercase tracking-wider">From:</span>
              <span className="text-sm text-white/40 line-through">{person.previousRole}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30 uppercase tracking-wider">To:</span>
              <span className="text-sm text-white/70">{person.currentRole}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl text-white">{person.salary}</span>
            <span className="block text-[10px] text-white/30 uppercase">Total Comp</span>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="alumni" ref={ref} className="relative py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 rounded-full mb-6">
            The Alumni
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Wall of Excellence
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            These are not testimonials. These are verified placement records.
            <br />
            <span className="text-white/60">Real people. Real transformations. Real salaries.</span>
          </p>
        </motion.div>

        {/* Masonry grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {alumni.map((person, index) => (
            <AlumniCard key={person.name} person={person} />
          ))}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-20 pt-12 border-t border-white/[0.05]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-mono text-3xl md:text-4xl text-white mb-2">847</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Alumni Placed</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl text-white mb-2">$187K</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Avg. Starting</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl text-white mb-2">14 Days</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Avg. Time to Offer</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl text-white mb-2">3.2x</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Avg. Salary Increase</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
