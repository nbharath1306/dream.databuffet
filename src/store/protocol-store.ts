import { create } from 'zustand';

export type ModuleType = 'math' | 'incident' | 'architecture';

interface Answer {
  math?: string;
  incidentLine?: number;
  architecture?: string;
}

interface ProtocolState {
  currentModule: ModuleType;
  startTime: number | null;
  timeRemaining: number; // in seconds
  answers: Answer;
  isFullscreen: boolean;
  isComplete: boolean;
  score: number | null;
  
  // Actions
  startTest: () => void;
  setCurrentModule: (module: ModuleType) => void;
  updateAnswer: (key: keyof Answer, value: string | number) => void;
  completeTest: () => void;
  calculateScore: () => number;
  setFullscreen: (isFullscreen: boolean) => void;
  decrementTime: () => void;
  resetTest: () => void;
}

const TOTAL_TIME = 45 * 60; // 45 minutes in seconds

export const useProtocolStore = create<ProtocolState>((set, get) => ({
  currentModule: 'math',
  startTime: null,
  timeRemaining: TOTAL_TIME,
  answers: {},
  isFullscreen: false,
  isComplete: false,
  score: null,

  startTest: () => {
    set({
      startTime: Date.now(),
      timeRemaining: TOTAL_TIME,
      currentModule: 'math',
      answers: {},
      isComplete: false,
      score: null,
    });
  },

  setCurrentModule: (module: ModuleType) => {
    set({ currentModule: module });
  },

  updateAnswer: (key: keyof Answer, value: string | number) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [key]: value,
      },
    }));
  },

  completeTest: () => {
    const score = get().calculateScore();
    set({ isComplete: true, score });
  },

  calculateScore: () => {
    const { answers } = get();
    let totalScore = 0;

    // Module 1: Math (30 points)
    if (answers.math === 'B') {
      totalScore += 30;
    }

    // Module 2: Incident (40 points)
    // Line 5 is the critical error (missing connection close)
    if (answers.incidentLine === 5 || answers.incidentLine === 6) {
      totalScore += 40;
    }

    // Module 3: Architecture (30 points)
    const archAnswer = (answers.architecture || '').toLowerCase();
    if (
      archAnswer.includes('redis') ||
      archAnswer.includes('in-memory') ||
      archAnswer.includes('in memory') ||
      (archAnswer.includes('cache') && archAnswer.includes('geospatial'))
    ) {
      totalScore += 30;
    }

    return totalScore;
  },

  setFullscreen: (isFullscreen: boolean) => {
    set({ isFullscreen });
  },

  decrementTime: () => {
    set((state) => {
      const newTime = state.timeRemaining - 1;
      if (newTime <= 0) {
        get().completeTest();
        return { timeRemaining: 0 };
      }
      return { timeRemaining: newTime };
    });
  },

  resetTest: () => {
    set({
      currentModule: 'math',
      startTime: null,
      timeRemaining: TOTAL_TIME,
      answers: {},
      isFullscreen: false,
      isComplete: false,
      score: null,
    });
  },
}));
