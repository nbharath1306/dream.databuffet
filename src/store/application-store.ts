import { create } from "zustand";

// Types
export interface ApplicationData {
  name: string;
  email: string;
  cgpa: string;
  location: string;
  currentSituation: string;
  failureReason: string;
  motivation: string;
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
  name: "",
  email: "",
  cgpa: "",
  location: "",
  currentSituation: "",
  failureReason: "",
  motivation: "",
};

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  currentStep: 0,
  totalSteps: 6,
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

    if (field === "cgpa" && value) {
      const cgpaValue = parseFloat(value as string);
      if (!isNaN(cgpaValue)) {
        if (cgpaValue < 7) {
          addAnalysisFlag({
            type: "warning",
            message: "⚠️ Academic Flag Detected. Protocol will compensate.",
          });
        } else if (cgpaValue >= 8.5) {
          addAnalysisFlag({
            type: "success",
            message: "✓ Strong Academic Profile. Interview focus required.",
          });
        }
      }
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

    if (field === "currentSituation") {
      if (value === "unemployed") {
        addAnalysisFlag({
          type: "info",
          message: "📊 Priority Queue Activated. Faster placement track.",
        });
      } else if (value === "student") {
        addAnalysisFlag({
          type: "info",
          message: "🎓 Student Mode Enabled. Campus hiring strategy unlocked.",
        });
      }
    }

    if (field === "failureReason" && value) {
      addAnalysisFlag({
        type: "info",
        message: `🔍 Analyzing failure pattern: ${(value as string).replace("-", " ")}...`,
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

    const diagnosisInfo =
      DIAGNOSIS_MAP[formData.failureReason] || DIAGNOSIS_MAP.default;

    // Calculate risk and success probability
    let successProbability = 75;
    let riskLevel: "low" | "medium" | "high" = "medium";

    const cgpa = parseFloat(formData.cgpa);
    if (!isNaN(cgpa)) {
      if (cgpa >= 8) successProbability += 10;
      else if (cgpa < 6) successProbability -= 5;
    }

    if (formData.currentSituation === "employed") {
      successProbability += 5;
      riskLevel = "low";
    } else if (formData.currentSituation === "unemployed") {
      successProbability += 8; // Higher motivation
    }

    if (formData.motivation.length > 100) {
      successProbability += 5;
    }

    successProbability = Math.min(95, Math.max(60, successProbability));

    if (successProbability >= 85) riskLevel = "low";
    else if (successProbability < 70) riskLevel = "high";

    return {
      diagnosis: diagnosisInfo.diagnosis,
      diagnosisDetail: diagnosisInfo.detail,
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
