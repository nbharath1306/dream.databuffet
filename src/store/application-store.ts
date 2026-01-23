import { create } from "zustand";

// Types
export interface ApplicationData {
  // Q1: European tech hub preference
  preferredTechHub: string;
  // Q2: Python & LLM comfort level (1-5)
  pythonLLMComfort: string;
  // Q3: AI project/portfolio link
  projectLink: string;
  // Q4: Graduation year
  graduationYear: string;
  // Q5: GPA/CGPA or strongest subject
  academicScore: string;
  // Q6: AI tool or paper that changed thinking
  aiInsight: string;
  // Q7: Why should you be shortlisted (2-3 sentences)
  whyShortlist: string;
  // Q8: English meeting leadership ability
  englishAbility: string;
  // Q9: Full name
  name: string;
  // Q10: WhatsApp number
  whatsappNumber: string;
  // Q11: City and country
  location: string;
  // Q12: Career barriers (honest assessment)
  careerBarriers: string;
}

export interface AnalysisFlag {
  type: "warning" | "success" | "info";
  message: string;
  timestamp: number;
}

export interface VerdictData {
  diagnosis: string;
  diagnosisDetail: string;
  basePrice: number;
  finalPrice: number;
  currency: string;
  grantApplied: boolean;
  grantType: string | null;
  cohortName: string;
  riskLevel: "low" | "medium" | "high";
  successProbability: number;
}

interface ApplicationStore {
  // Form state
  currentStep: number;
  totalSteps: number;
  formData: ApplicationData;
  analysisFlags: AnalysisFlag[];
  isProcessing: boolean;
  showVerdict: boolean;
  verdict: VerdictData | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: <K extends keyof ApplicationData>(
    field: K,
    value: ApplicationData[K]
  ) => void;
  addAnalysisFlag: (flag: Omit<AnalysisFlag, "timestamp">) => void;
  clearAnalysisFlags: () => void;
  processApplication: () => Promise<void>;
  calculateVerdict: () => VerdictData;
  resetForm: () => void;
}

// Location-based pricing
const PRICING_TIERS = {
  standard: { price: 2997, currency: "USD" },
  africa: { price: 997, currency: "USD", grant: "African Market Grant" },
  india: { price: 1497, currency: "USD", grant: "Emerging Market Grant" },
  latam: { price: 1497, currency: "USD", grant: "LATAM Development Grant" },
  sea: { price: 1497, currency: "USD", grant: "SEA Growth Grant" },
};

// Failure reason to diagnosis mapping
const DIAGNOSIS_MAP: Record<string, { diagnosis: string; detail: string }> = {
  interviews: {
    diagnosis: "Interview Anxiety Syndrome",
    detail:
      "You know the material but freeze under pressure. The Protocol's mock interview system will rewire your response patterns.",
  },
  resume: {
    diagnosis: "Resume Invisibility Complex",
    detail:
      "Your resume is getting filtered by ATS systems. The Protocol rebuilds it from scratch with proven templates.",
  },
  experience: {
    diagnosis: "Experience Gap Paralysis",
    detail:
      "You're stuck in the 'need experience to get experience' loop. The Protocol breaks this with real project portfolios.",
  },
  networking: {
    diagnosis: "Network Deficit Disorder",
    detail:
      "You have no connections in the industry. The Protocol connects you directly to hiring managers.",
  },
  skills: {
    diagnosis: "Skill-Market Mismatch",
    detail:
      "You're learning outdated technologies. The Protocol teaches only what companies are hiring for NOW.",
  },
  confidence: {
    diagnosis: "Imposter Syndrome (Severe)",
    detail:
      "You don't believe you deserve the role. The Protocol builds proof through shipped projects.",
  },
  applications: {
    diagnosis: "Application Fatigue Syndrome",
    detail:
      "You're applying to 100s of jobs with no response. The Protocol focuses on 10 targeted applications that convert.",
  },
  default: {
    diagnosis: "Undiagnosed Career Block",
    detail:
      "Your situation requires personalized analysis. The Protocol will identify and eliminate your specific blockers.",
  },
};

// Location categorization
const getLocationTier = (location: string): keyof typeof PRICING_TIERS => {
  const loc = location.toLowerCase();
  if (
    loc.includes("africa") ||
    loc.includes("nigeria") ||
    loc.includes("kenya") ||
    loc.includes("south africa") ||
    loc.includes("ghana") ||
    loc.includes("egypt")
  ) {
    return "africa";
  }
  if (
    loc.includes("india") ||
    loc.includes("pakistan") ||
    loc.includes("bangladesh") ||
    loc.includes("nepal")
  ) {
    return "india";
  }
  if (
    loc.includes("brazil") ||
    loc.includes("mexico") ||
    loc.includes("argentina") ||
    loc.includes("colombia") ||
    loc.includes("chile") ||
    loc.includes("latin") ||
    loc.includes("latam")
  ) {
    return "latam";
  }
  if (
    loc.includes("indonesia") ||
    loc.includes("vietnam") ||
    loc.includes("philippines") ||
    loc.includes("thailand") ||
    loc.includes("malaysia")
  ) {
    return "sea";
  }
  return "standard";
};

const initialFormData: ApplicationData = {
  preferredTechHub: "",
  pythonLLMComfort: "",
  projectLink: "",
  graduationYear: "",
  academicScore: "",
  aiInsight: "",
  whyShortlist: "",
  englishAbility: "",
  name: "",
  whatsappNumber: "",
  location: "",
  careerBarriers: "",
};

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  currentStep: 0,
  totalSteps: 12,
  formData: initialFormData,
  analysisFlags: [],
  isProcessing: false,
  showVerdict: false,
  verdict: null,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  updateFormData: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));

    // Trigger analysis based on field
    const { addAnalysisFlag } = get();

    if (field === "pythonLLMComfort" && value) {
      const level = parseInt(value as string);
      if (level <= 2) {
        addAnalysisFlag({
          type: "warning",
          message: "⚠️ Technical Gap Detected. Intensive training required.",
        });
      } else if (level >= 4) {
        addAnalysisFlag({
          type: "success",
          message: "✓ Strong Technical Profile. Partner-ready skills.",
        });
      }
    }

    if (field === "projectLink" && value) {
      addAnalysisFlag({
        type: "success",
        message: "✓ Proof of Work submitted. Reviewing repository...",
      });
    }

    if (field === "location" && value) {
      const tier = getLocationTier(value as string);
      if (tier === "africa") {
        addAnalysisFlag({
          type: "success",
          message: "🌍 African Market Grant Unlocked. 67% discount applied.",
        });
      } else if (tier === "india") {
        addAnalysisFlag({
          type: "success",
          message: "🇮🇳 Emerging Market Grant Unlocked. 50% discount applied.",
        });
      } else if (tier === "latam") {
        addAnalysisFlag({
          type: "success",
          message: "🌎 LATAM Development Grant Unlocked. 50% discount applied.",
        });
      } else if (tier === "sea") {
        addAnalysisFlag({
          type: "success",
          message: "🌏 SEA Growth Grant Unlocked. 50% discount applied.",
        });
      }
    }

    if (field === "graduationYear" && value) {
      const year = parseInt(value as string);
      if (year >= 2024) {
        addAnalysisFlag({
          type: "info",
          message: "🎓 Fresh Talent Track Activated. High-velocity profile.",
        });
      }
    }

    if (field === "englishAbility") {
      if (value === "native" || value === "fluent") {
        addAnalysisFlag({
          type: "success",
          message: "✓ Communication Ready. European partner compatible.",
        });
      } else if (value === "basic" || value === "intermediate") {
        addAnalysisFlag({
          type: "warning",
          message: "⚠️ English coaching will be prioritized in training.",
        });
      }
    }

    if (field === "preferredTechHub" && value) {
      addAnalysisFlag({
        type: "info",
        message: `🌐 Matching with ${(value as string).charAt(0).toUpperCase() + (value as string).slice(1)} ecosystem partners...`,
      });
    }
  },

  addAnalysisFlag: (flag) => {
    set((state) => ({
      analysisFlags: [
        ...state.analysisFlags,
        { ...flag, timestamp: Date.now() },
      ],
    }));
  },

  clearAnalysisFlags: () => set({ analysisFlags: [] }),

  calculateVerdict: () => {
    const { formData } = get();
    const locationTier = getLocationTier(formData.location);
    const pricingInfo = PRICING_TIERS[locationTier];

    // Generate diagnosis based on career barriers
    const barriersDiagnosis = formData.careerBarriers.length > 50 
      ? {
          diagnosis: "Career Pathway Analysis Complete",
          detail: "Based on your honest assessment, we've identified specific gaps that our 3-4 month training will address. Your self-awareness is the first step to transformation."
        }
      : DIAGNOSIS_MAP.default;

    // Calculate risk and success probability based on new fields
    let successProbability = 70;
    let riskLevel: "low" | "medium" | "high" = "medium";

    // Python/LLM comfort level (1-5)
    const pythonLevel = parseInt(formData.pythonLLMComfort);
    if (!isNaN(pythonLevel)) {
      successProbability += (pythonLevel - 3) * 5; // +/- based on level
    }

    // Project link shows proof of work
    if (formData.projectLink && formData.projectLink.includes("github")) {
      successProbability += 10;
    }

    // English ability
    if (formData.englishAbility === "native" || formData.englishAbility === "fluent") {
      successProbability += 8;
      riskLevel = "low";
    } else if (formData.englishAbility === "basic") {
      successProbability -= 5;
    }

    // Graduation year - fresh talent bonus
    const gradYear = parseInt(formData.graduationYear);
    if (gradYear >= 2024) {
      successProbability += 5;
    }

    // Why shortlist response quality
    if (formData.whyShortlist.length > 100) {
      successProbability += 5;
    }

    successProbability = Math.min(95, Math.max(60, successProbability));

    if (successProbability >= 85) riskLevel = "low";
    else if (successProbability < 70) riskLevel = "high";

    return {
      diagnosis: barriersDiagnosis.diagnosis,
      diagnosisDetail: barriersDiagnosis.detail,
      basePrice: PRICING_TIERS.standard.price,
      finalPrice: pricingInfo.price,
      currency: pricingInfo.currency,
      grantApplied: locationTier !== "standard",
      grantType: "grant" in pricingInfo ? pricingInfo.grant : null,
      cohortName: `Protocol Cohort ${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
      riskLevel,
      successProbability,
    };
  },

  processApplication: async () => {
    set({ isProcessing: true });

    // Simulate processing with dramatic pauses
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const verdict = get().calculateVerdict();
    set({ verdict, isProcessing: false, showVerdict: true });
  },

  resetForm: () =>
    set({
      currentStep: 0,
      formData: initialFormData,
      analysisFlags: [],
      isProcessing: false,
      showVerdict: false,
      verdict: null,
    }),
}));
