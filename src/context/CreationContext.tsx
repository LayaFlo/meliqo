import type { GeneratedCreation } from "@/src/types/creation";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type CreationContextValue = {
  currentCreation: GeneratedCreation | null;
  setCurrentCreation: (creation: GeneratedCreation) => void;
  clearCurrentCreation: () => void;
};

const CreationContext = createContext<CreationContextValue | null>(null);

type CreationProviderProps = {
  children: ReactNode;
};

export function CreationProvider({ children }: CreationProviderProps) {
  const [currentCreation, setCurrentCreation] =
    useState<GeneratedCreation | null>(null);

  const clearCurrentCreation = () => {
    setCurrentCreation(null);
  };

  const value: CreationContextValue = useMemo(
    () => ({
      currentCreation,
      setCurrentCreation,
      clearCurrentCreation,
    }),
    [currentCreation],
  );

  return (
    <CreationContext.Provider value={value}>
      {children}
    </CreationContext.Provider>
  );
}

export function useCreation() {
  const context = useContext(CreationContext);

  if (!context) {
    throw new Error("useCreation must be used within a CreationProvider");
  }
  return context;
}
