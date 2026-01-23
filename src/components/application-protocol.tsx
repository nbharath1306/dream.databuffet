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
  Home,
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
  // Q1: European tech hub preference
  {
    id: "tech-hub",
    field: "preferredTechHub",
    label: "Which European tech hub would you most like to work for remotely?",
    description: "Our partners are remote-first—we need to know which ecosystem aligns with your career goals.",
    icon: MapPin,
    type: "select",
    options: [
      { value: "berlin", label: "Berlin" },
      { value: "london", label: "London" },
      { value: "amsterdam", label: "Amsterdam" },
      { value: "paris", label: "Paris" },
    ],
  },
  // Q2: Python & LLM comfort level
  {
    id: "python-llm",
    field: "pythonLLMComfort",
    label: "On a scale of 1–5, how comfortable are you building with Python and LLM APIs?",
    description: "Technical competence in the AI stack is the primary \"hard signal\" our partners require for remote engineering roles.",
    icon: Briefcase,
    type: "select",
    options: [
      { value: "1", label: "1 – Beginner" },
      { value: "2", label: "2 – Some exposure" },
      { value: "3", label: "3 – Comfortable with basics" },
      { value: "4", label: "4 – Proficient" },
      { value: "5", label: "5 – Expert" },
    ],
    testimonialContext: "python",
  },
  // Q3: AI project/portfolio link
  {
    id: "project-link",
    field: "projectLink",
    label: "Link an AI project, a RAG pipeline, or a GitHub repository that proves your logic.",
    description: "Our partners value \"Proof of Work\" over years of experience—they look for logic and potential, even if the product isn't 100% finished.",
    icon: Briefcase,
    type: "text",
    placeholder: "https://github.com/yourusername/project",
    testimonialContext: "project",
  },
  // Q4: Graduation year
  {
    id: "graduation",
    field: "graduationYear",
    label: "When did you (or will you) graduate from your latest degree?",
    description: "We specialize in launching fresh talent; our partners specifically look for \"high-velocity\" learners in the 2021–2026 window.",
    icon: GraduationCap,
    type: "select",
    options: [
      { value: "2021", label: "2021" },
      { value: "2022", label: "2022" },
      { value: "2023", label: "2023" },
      { value: "2024", label: "2024" },
      { value: "2025", label: "2025" },
      { value: "2026", label: "2026" },
    ],
    testimonialContext: "graduation",
  },
  // Q5: GPA/CGPA or strongest subject
  {
    id: "academic-score",
    field: "academicScore",
    label: "What was your final GPA / CGPA? (Or your strongest academic subject)",
    description: "Your academic background helps us understand your baseline discipline and where you excel.",
    icon: GraduationCap,
    type: "text",
    placeholder: "e.g., 3.8 GPA or \"Algorithms & Data Structures\"",
    testimonialContext: "academic",
  },
  // Q6: AI tool or paper that changed thinking
  {
    id: "ai-insight",
    field: "aiInsight",
    label: "What is one AI tool or research paper that changed how you think this month?",
    description: "The AI field moves daily; our partners hire for \"Learning Velocity\" rather than static knowledge.",
    icon: AlertCircle,
    type: "text",
    placeholder: "e.g., \"Attention Is All You Need\" or Claude's tool use",
    testimonialContext: "insight",
  },
  // Q7: Why should you be shortlisted
  {
    id: "why-shortlist",
    field: "whyShortlist",
    label: "We only shortlist 5% of applicants. In 2–3 sentences, why should you be one of them?",
    description: "Communication is a non-negotiable \"hard signal\"; you must be able to prove to our partners why you are elite.",
    icon: MessageSquare,
    type: "textarea",
    placeholder: "Tell us why you stand out...",
    testimonialContext: "shortlist",
  },
  // Q8: English meeting leadership ability
  {
    id: "english-ability",
    field: "englishAbility",
    label: "How would you describe your ability to lead a technical meeting in English?",
    description: "Our partners require high-level verbal English to collaborate effectively with their distributed European teams.",
    icon: MessageSquare,
    type: "select",
    options: [
      { value: "native", label: "Native speaker" },
      { value: "fluent", label: "Fluent – can lead meetings confidently" },
      { value: "professional", label: "Professional – can participate well" },
      { value: "intermediate", label: "Intermediate – working on fluency" },
      { value: "basic", label: "Basic – still developing" },
    ],
    testimonialContext: "english",
  },
  // Q9: Full name
  {
    id: "name",
    field: "name",
    label: "What is your Full Name?",
    description: "This is required to begin the formal vetting and background verification requested by our partners.",
    icon: User,
    type: "text",
    placeholder: "Enter your full name",
    validation: (v) => v.length >= 2,
  },
  // Q10: WhatsApp number
  {
    id: "whatsapp",
    field: "whatsappNumber",
    label: "What is your WhatsApp Number?",
    description: "Rapid communication is key in startup culture; we and our partners use WhatsApp for real-time logistics.",
    icon: Mail,
    type: "text",
    placeholder: "+1 234 567 8900",
    validation: (v) => v.length >= 8,
  },
  // Q11: City and country
  {
    id: "location",
    field: "location",
    label: "Which City and Country are you currently based in?",
    description: "This helps us and our partners manage regional logistics, payment compliance, and time-zone coordination.",
    icon: MapPin,
    type: "text",
    placeholder: "City, Country",
    testimonialContext: "location",
  },
  // Q12: Career barriers
  {
    id: "career-barriers",
    field: "careerBarriers",
    label: "Why do you think you haven't landed your dream role yet? Be honest.",
    description: "Identifying your current barriers—whether it's skills, networking, or communication—allows us to tailor your 3–4 month training to bridge the gap.",
    icon: AlertCircle,
    type: "textarea",
    placeholder: "This is the foundation of your career diagnosis...",
    testimonialContext: "barriers",
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
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <a href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-white/40 hover:text-white">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Button>
        </a>
      </div>

      {/* Main form area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.05]">
          <div className="max-w-2xl mx-auto">
            {/* Welcome message on first step */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="font-serif text-3xl md:text-4xl text-white mb-3">
                  Application Protocol
                </h1>
                <p className="text-white/40 text-sm max-w-lg mx-auto">
                  Welcome to the Data Buffet entrance protocol. This application takes 8-10 minutes.
                  <br />
                  <span className="text-white/60">Your responses help us match you with the right European partners.</span>
                </p>
              </motion.div>
            )}
            
            <div className="flex items-center justify-between">
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
