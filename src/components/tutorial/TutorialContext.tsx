import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TutorialState {
  isActive: boolean;
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
  skipped: boolean;
}

interface TutorialContextType {
  state: TutorialState;
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  closeTutorial: () => void;
  totalSteps: number;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const STORAGE_KEY = 'bxl-vault-tutorial-state';
const TOTAL_STEPS = 7;

const defaultState: TutorialState = {
  isActive: false,
  currentStep: 0,
  completedSteps: [],
  isCompleted: false,
  skipped: false,
};

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TutorialState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startTutorial = () => {
    setState((prev) => ({
      ...prev,
      isActive: true,
      // Resume from last step if available, otherwise start from step 1
      currentStep: prev.currentStep > 0 ? prev.currentStep : 1,
    }));
  };

  const nextStep = () => {
    setState((prev) => {
      const newCompletedSteps = prev.completedSteps.includes(prev.currentStep)
        ? prev.completedSteps
        : [...prev.completedSteps, prev.currentStep];
      
      if (prev.currentStep >= TOTAL_STEPS) {
        return {
          ...prev,
          isActive: false,
          isCompleted: true,
          completedSteps: newCompletedSteps,
        };
      }

      return {
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: newCompletedSteps,
      };
    });
  };

  const previousStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
    }));
  };

  const goToStep = (step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(TOTAL_STEPS, step)),
    }));
  };

  const skipTutorial = () => {
    setState({
      ...defaultState,
      skipped: true,
    });
  };

  const completeTutorial = () => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      isCompleted: true,
    }));
  };

  const closeTutorial = () => {
    setState((prev) => ({
      ...prev,
      isActive: false,
    }));
  };

  return (
    <TutorialContext.Provider
      value={{
        state,
        startTutorial,
        nextStep,
        previousStep,
        goToStep,
        skipTutorial,
        completeTutorial,
        closeTutorial,
        totalSteps: TOTAL_STEPS,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
};
