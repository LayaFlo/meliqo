import type { GeneratedCreation, RefinementType } from "@/src/types/creation";
import {
  deleteSavedCreation,
  getSavedCreations,
  saveCreation,
} from "@/src/utils/creationStorage";
import { createMockGeneration } from "@/src/utils/mockGeneration";
import { refineMockCreation } from "@/src/utils/mockRefinement";
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
  deleteCreation: (id: string) => Promise<void>;
  regenerateCurrentCreation?: () => void;
  refineCurrentCreation: (refinement: RefinementType) => void;
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

  const deleteCreation = useCallback(
    async (id: string) => {
      const creations = await deleteSavedCreation(id);
      setSavedCreations(creations);

      if (currentCreation?.id === id) {
        setCurrentCreation(null);
      }
    },
    [currentCreation?.id],
  );

  const regenerateCurrentCreation = useCallback(() => {
    if (!currentCreation) return;

    const nextCreation = createMockGeneration({
      prompt: currentCreation.prompt,
      format: currentCreation.format,
      mood: currentCreation.mood,
    });

    setCurrentCreation(nextCreation);
  }, [currentCreation]);

  const refineCurrentCreation = useCallback(
    (refinement: RefinementType) => {
      if (!currentCreation) return;

      setCurrentCreation(refineMockCreation(currentCreation, refinement));
    },
    [currentCreation],
  );

  const value: CreationContextValue = useMemo(
    () => ({
      currentCreation,
      setCurrentCreation,
      clearCurrentCreation,
      savedCreations,
      loadSavedCreations,
      saveCurrentCreation,
      openCreation,
      deleteCreation,
      regenerateCurrentCreation,
      refineCurrentCreation,
    }),
    [
      currentCreation,
      deleteCreation,
      loadSavedCreations,
      openCreation,
      refineCurrentCreation,
      regenerateCurrentCreation,
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
