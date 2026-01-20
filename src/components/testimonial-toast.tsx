"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Quote, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Testimonial data with context-aware mapping
export const TESTIMONIALS = {
  akhil: {
    name: "Akhil R.",
    role: "Data Engineer @ Microsoft",
    quote: "I didn't need a degree. I needed the Protocol.",
    avatar: "AR",
    linkedIn: "#",
  },
  anuj: {
    name: "Anuj K.",
    role: "ML Engineer @ Amazon",
    quote: "5 months unemployed. 3 weeks after Protocol: $180K offer.",
    avatar: "AK",
    linkedIn: "#",
  },
  aryan: {
    name: "Aryan S.",
    role: "Staff Engineer @ Stripe",
    quote: "I failed 5 times. The Protocol fixed my resume in 2 days.",
    avatar: "AS",
    linkedIn: "#",
  },
  chrissy: {
    name: "Chrissy M.",
    role: "Senior DE @ Spotify",
    quote: "I made my tuition back in 3 weeks.",
    avatar: "CM",
    linkedIn: "#",
    location: "Sweden",
  },
  priya: {
    name: "Priya D.",
    role: "Data Lead @ Google",
    quote: "From India to $250K in Silicon Valley. The Protocol works.",
    avatar: "PD",
    linkedIn: "#",
    location: "India",
  },
  marcus: {
    name: "Marcus J.",
    role: "Principal Engineer @ Netflix",
    quote: "Tutorials teach. The Protocol transforms.",
    avatar: "MJ",
    linkedIn: "#",
  },
};

// Context-based testimonial mapping
export const STEP_TESTIMONIALS: Record<string, keyof typeof TESTIMONIALS> = {
  location: "chrissy",
  cgpa: "akhil",
  failure: "aryan",
  situation: "anuj",
  motivation: "marcus",
  price: "priya",
};

interface TestimonialToastProps {
  testimonialKey?: keyof typeof TESTIMONIALS;
  stepContext?: string;
  className?: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function TestimonialToast({
  testimonialKey,
  stepContext,
  className,
  onClose,
  autoClose = true,
  autoCloseDelay = 8000,
}: TestimonialToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Determine which testimonial to show
  const key =
    testimonialKey ||
    (stepContext ? STEP_TESTIMONIALS[stepContext] : undefined);
  const testimonial = key ? TESTIMONIALS[key] : null;

  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, isVisible, onClose]);

  if (!testimonial) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg p-4 max-w-sm",
            "shadow-2xl shadow-black/50",
            className
          )}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="absolute top-2 right-2 p-1 text-white/30 hover:text-white/60 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-xs font-medium text-white/80 border border-white/10">
              {testimonial.avatar}
            </div>

            <div className="flex-1 min-w-0">
              {/* Quote */}
              <div className="flex items-start gap-1 mb-2">
                <Quote className="w-3 h-3 text-white/20 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white/60">
                  {testimonial.name}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-xs text-white/40">{testimonial.role}</span>
              </div>
            </div>
          </div>

          {/* Subtle progress bar for auto-close */}
          {autoClose && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-white/20 rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: autoCloseDelay / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Floating testimonial container for contextual display
interface FloatingTestimonialProps {
  currentStep: string;
  className?: string;
}

export function FloatingTestimonial({
  currentStep,
  className,
}: FloatingTestimonialProps) {
  const [shownSteps, setShownSteps] = useState<Set<string>>(new Set());
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    // Show testimonial for this step if not shown before
    if (currentStep && !shownSteps.has(currentStep) && STEP_TESTIMONIALS[currentStep]) {
      const timer = setTimeout(() => {
        setActiveToast(currentStep);
        setShownSteps((prev) => new Set([...prev, currentStep]));
      }, 1500); // Delay before showing

      return () => clearTimeout(timer);
    }
  }, [currentStep, shownSteps]);

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <AnimatePresence mode="wait">
        {activeToast && (
          <TestimonialToast
            key={activeToast}
            stepContext={activeToast}
            onClose={() => setActiveToast(null)}
            autoCloseDelay={6000}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
