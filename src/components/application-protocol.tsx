"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  AlertCircle,
  MessageSquare,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useApplicationStore, ApplicationData } from "@/store/application-store";
import { LiveAnalysis } from "@/components/live-analysis";
import { FloatingTestimonial } from "@/components/testimonial-toast";
import { ProcessingAnimation } from "@/components/processing-animation";
import { VerdictView } from "@/components/verdict-view";

// Form step configuration
interface FormStep {
  id: string;
  field: keyof ApplicationData;
  label: string;
  description: string;
  icon: React.ElementType;
  type: "text" | "email" | "select" | "textarea" | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: string) => boolean;
  testimonialContext?: string;
}

const FORM_STEPS: FormStep[] = [
  {
    id: "name",
    field: "name",
    label: "What's your name?",
    description: "We'll use this to personalize your experience.",
    icon: User,
    type: "text",
    placeholder: "Enter your full name",
    validation: (v) => v.length >= 2,
  },
  {
    id: "email",
    field: "email",
    label: "Where should we send your analysis?",
    description: "Your verdict and curriculum will be emailed here.",
    icon: Mail,
    type: "email",
    placeholder: "you@example.com",
    validation: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  },
  {
    id: "cgpa",
    field: "cgpa",
    label: "What's your academic score?",
    description: "CGPA, GPA, or percentage. We don't judge—we analyze.",
    icon: GraduationCap,
    type: "text",
    placeholder: "e.g., 7.5 CGPA or 3.2 GPA",
    testimonialContext: "cgpa",
  },
  {
    id: "location",
    field: "location",
    label: "Where are you based?",
    description: "This determines your pricing tier and grant eligibility.",
    icon: MapPin,
    type: "text",
    placeholder: "City, Country",
    testimonialContext: "location",
  },
  {
    id: "situation",
    field: "currentSituation",
    label: "What's your current situation?",
    description: "This helps us customize your placement strategy.",
    icon: Briefcase,
    type: "select",
    options: [
      { value: "employed", label: "Employed (looking to switch)" },
      { value: "unemployed", label: "Currently unemployed" },
      { value: "student", label: "Student / Recent graduate" },
      { value: "career-change", label: "Career changer" },
      { value: "freelance", label: "Freelance / Contract" },
    ],
    testimonialContext: "situation",
  },
  {
    id: "failure",
    field: "failureReason",
    label: "Why do you think you haven't landed your dream role yet?",
    description: "Be honest. This is the foundation of your diagnosis.",
    icon: AlertCircle,
    type: "select",
    options: [
      { value: "interviews", label: "I freeze in interviews" },
      { value: "resume", label: "My resume gets ignored" },
      { value: "experience", label: "I don't have enough experience" },
      { value: "networking", label: "I don't know the right people" },
      { value: "skills", label: "I'm not sure what to learn" },
      { value: "confidence", label: "I don't feel qualified" },
      { value: "applications", label: "I apply but never hear back" },
    ],
    testimonialContext: "failure",
  },
  {
    id: "motivation",
    field: "motivation",
    label: "What would change if you got that $200K+ role?",
    description: "This is your 'why'. Make it personal.",
    icon: MessageSquare,
    type: "textarea",
    placeholder: "Tell us what's driving you...",
    testimonialContext: "motivation",
  },
];

export function ApplicationProtocol() {
  const {
    currentStep,
    totalSteps,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    isProcessing,
    showVerdict,
    processApplication,
    setStep,
  } = useApplicationStore();

  const [isValid, setIsValid] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStepConfig = FORM_STEPS[currentStep];
  const currentValue = currentStepConfig ? formData[currentStepConfig.field] : "";

  // Validate current step
  useEffect(() => {
    if (!currentStepConfig) return;

    if (currentStepConfig.validation) {
      setIsValid(currentStepConfig.validation(currentValue));
    } else if (currentStepConfig.type === "textarea") {
      // Textarea (motivation) is optional - always valid
      setIsValid(true);
    } else {
      setIsValid(currentValue.length > 0);
    }
  }, [currentValue, currentStepConfig]);

  // Focus input on step change (without scrolling)
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Handle step navigation
  const handleNext = () => {
    if (currentStep === FORM_STEPS.length - 1) {
      // Final step - process application
      processApplication();
    } else {
      nextStep();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid && currentStepConfig?.type !== "textarea") {
      e.preventDefault();
      handleNext();
    }
  };

  // Show verdict view after processing
  if (showVerdict) {
    return <VerdictView />;
  }

  // Show processing animation
  if (isProcessing) {
    return <ProcessingAnimation isActive={isProcessing} />;
  }

  // Update the actual total steps count
  const actualTotalSteps = FORM_STEPS.length;

  return (
    <section
      id="apply"
      ref={containerRef}
      className="relative py-20 lg:py-32 flex bg-black border-t border-white/[0.05]"
    >
      {/* Main form area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.05]">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/40">
                Step {currentStep + 1}/{actualTotalSteps}
              </span>
              <div className="flex gap-1">
                {FORM_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-8 h-1 rounded-full transition-all duration-300",
                      i < currentStep
                        ? "bg-emerald-500"
                        : i === currentStep
                          ? "bg-white"
                          : "bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Step indicator */}
            <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 rounded-full">
              The Protocol
            </span>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center p-6 pb-24 lg:pb-6">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Question */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 text-white/30"
                  >
                    {currentStepConfig && (
                      <currentStepConfig.icon className="w-4 h-4" />
                    )}
                    <span className="text-xs font-mono uppercase tracking-wider">
                      {currentStepConfig?.id}
                    </span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight"
                  >
                    {currentStepConfig?.label}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/40 text-lg"
                  >
                    {currentStepConfig?.description}
                  </motion.p>
                </div>

                {/* Input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {currentStepConfig?.type === "select" ? (
                    <div className="space-y-2">
                      {currentStepConfig.options?.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            updateFormData(currentStepConfig.field as keyof ApplicationData, option.value);
                            // Auto-advance after selection with a small delay for visual feedback
                            setTimeout(() => {
                              if (currentStep === FORM_STEPS.length - 1) {
                                processApplication();
                              } else {
                                nextStep();
                              }
                            }, 300);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 text-left",
                            currentValue === option.value
                              ? "bg-white/[0.08] border-white/30 text-white"
                              : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05] hover:border-white/20"
                          )}
                        >
                          <span>{option.label}</span>
                          {currentValue === option.value && (
                            <Check className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : currentStepConfig?.type === "textarea" ? (
                    <Textarea
                      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                      value={currentValue}
                      onChange={(e) =>
                        updateFormData(currentStepConfig.field as keyof ApplicationData, e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                      placeholder={currentStepConfig.placeholder}
                      rows={4}
                      className="text-lg"
                    />
                  ) : (
                    <Input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type={currentStepConfig?.type || "text"}
                      value={currentValue}
                      onChange={(e) =>
                        updateFormData(currentStepConfig!.field as keyof ApplicationData, e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                      placeholder={currentStepConfig?.placeholder}
                      className="text-xl h-14"
                    />
                  )}
                </motion.div>

                {/* Navigation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between pt-4"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={cn(
                      "gap-2",
                      currentStep === 0 && "opacity-0 pointer-events-none"
                    )}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  <div className="flex items-center gap-4">
                    {currentStepConfig?.type !== "select" && (
                      <span className="text-xs text-white/30 hidden sm:block">
                        Press Enter ↵
                      </span>
                    )}

                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!isValid}
                      className="gap-2 min-w-[140px]"
                    >
                      {currentStep === FORM_STEPS.length - 1 ? (
                        <>
                          <span>Submit</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-6 pt-8 text-white/20 text-xs font-mono"
                >
                  <span>🔒 Encrypted</span>
                  <span>•</span>
                  <span>No Spam</span>
                  <span>•</span>
                  <span>$0 Until Placed</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Live Analysis Sidebar (Desktop) */}
      <LiveAnalysis variant="sidebar" />

      {/* Live Analysis Bottom Bar (Mobile) */}
      <LiveAnalysis variant="bottom" />

      {/* Floating Testimonials */}
      <FloatingTestimonial
        currentStep={currentStepConfig?.testimonialContext || ""}
      />
    </section>
  );
}
