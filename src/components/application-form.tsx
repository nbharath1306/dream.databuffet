"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Mail, User, Briefcase, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ApplicationForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [step, setStep] = useState(1);

  return (
    <section id="apply" ref={ref} className="relative py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 rounded-full mb-6">
            Begin Protocol
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Apply for Cohort
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Submission does not guarantee acceptance. We review applications within 48 hours.
          </p>
        </motion.div>

        {/* Application form */}
        <motion.div
          className="relative p-8 md:p-12 rounded-lg border border-white/[0.08] bg-white/[0.02]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-12">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                  s <= step ? "bg-white" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <form className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3 h-3" />
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
              />
            </div>

            {/* Current Role */}
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-3 h-3" />
                Current Situation
              </label>
              <div className="relative">
                <select className="w-full h-12 px-4 bg-white/[0.03] border border-white/10 rounded-lg text-white/70 focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer">
                  <option value="">Select your current situation</option>
                  <option value="employed">Employed (looking to switch)</option>
                  <option value="unemployed">Currently unemployed</option>
                  <option value="student">Student / Recent graduate</option>
                  <option value="career-change">Career changer</option>
                  <option value="freelance">Freelance / Contract</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>
            </div>

            {/* Motivation */}
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-wider">
                Why Data Buffet?
              </label>
              <Textarea
                placeholder="What makes you think you can survive our protocol? (Be honest)"
                rows={4}
              />
            </div>

            {/* Submit */}
            <div className="pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full group uppercase tracking-wider"
              >
                <span>Submit Application</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-center text-white/20 text-xs mt-4">
                By applying, you agree to our entrance assessment. We will contact you within 48 hours.
              </p>
            </div>
          </form>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-8 text-white/20 text-xs font-mono">
            <span>🔒 256-bit Encrypted</span>
            <span>|</span>
            <span>No Spam</span>
            <span>|</span>
            <span>$0 Until Placed</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
