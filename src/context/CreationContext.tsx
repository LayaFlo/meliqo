import type { GeneratedCreation } from "@/src/types/creation";
import { getSavedCreations, saveCreation } from "@/src/utils/creationStorage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type CreationContextValue = {
  currentCreation: GeneratedCreation | null;
  setCurrentCreation: (creation: GeneratedCreation) => void;
  clearCurrentCreation: () => void;
  savedCreations: GeneratedCreation[];
  loadSavedCreations: () => Promise<void>;
  saveCurrentCreation: () => Promise<void>;
  openCreation: (creation: GeneratedCreation) => void;
};

const CreationContext = createContext<CreationContextValue | null>(null);

type CreationProviderProps = {
  children: ReactNode;
};

export function CreationProvider({ children }: CreationProviderProps) {
  const [currentCreation, setCurrentCreation] =
    useState<GeneratedCreation | null>(null);
  const [savedCreations, setSavedCreations] = useState<GeneratedCreation[]>([]);

  const clearCurrentCreation = () => {
    setCurrentCreation(null);
  };

  const loadSavedCreations = useCallback(async () => {
    const creations = await getSavedCreations();
    setSavedCreations(creations);
  }, []);

  const saveCurrentCreation = useCallback(async () => {
    if (!currentCreation) return;

    const creations = await saveCreation(currentCreation);
    setSavedCreations(creations);
  }, [currentCreation]);

  const openCreation = useCallback((creation: GeneratedCreation) => {
    setCurrentCreation(creation);
  }, []);

  const value: CreationContextValue = useMemo(
    () => ({
      currentCreation,
      setCurrentCreation,
      clearCurrentCreation,
      savedCreations,
      loadSavedCreations,
      saveCurrentCreation,
      openCreation,
    }),
    [
      currentCreation,
      loadSavedCreations,
      openCreation,
      saveCurrentCreation,
      savedCreations,
    ],
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
