import type { GeneratedCreation } from "@/src/types/creation";
import {
  deleteSavedCreation,
  getSavedCreations,
  saveCreation,
} from "@/src/utils/creationStorage";
import { createMockGeneration } from "@/src/utils/mockGeneration";
import { refineMockCreation } from "@/src/utils/mockRefinement";
import { act, render } from "@testing-library/react-native";
import React from "react";
import { CreationProvider, useCreation } from "../CreationContext";

jest.mock("@/src/utils/creationStorage", () => ({
  deleteSavedCreation: jest.fn(),
  getSavedCreations: jest.fn(),
  saveCreation: jest.fn(),
}));

jest.mock("@/src/utils/mockGeneration", () => ({
  createMockGeneration: jest.fn(),
}));

jest.mock("@/src/utils/mockRefinement", () => ({
  refineMockCreation: jest.fn(),
}));

const mockCreation: GeneratedCreation = {
  id: "1",
  title: "Test Title",
  content: "Test content",
  format: "song",
  mood: "dreamy",
  prompt: "Test prompt",
  createdAt: "2024-01-01T12:00:00.000Z",
};

describe("CreationContext", () => {
  describe("CreationProvider", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (deleteSavedCreation as jest.Mock).mockResolvedValue([]);
      (createMockGeneration as jest.Mock).mockReturnValue({
        ...mockCreation,
        id: "regenerated-id",
        title: "Regenerated Title",
        content: "Regenerated content",
      });
      (refineMockCreation as jest.Mock).mockReturnValue({
        ...mockCreation,
        id: "refined-id",
        content: "Refined content",
      });
      (getSavedCreations as jest.Mock).mockResolvedValue([]);
      (saveCreation as jest.Mock).mockResolvedValue([]);
    });

    it("should provide initial null currentCreation", () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return (
          <div>Current: {contextValue.currentCreation?.title || "null"}</div>
        );
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      expect(contextValue.currentCreation).toBeNull();
    });

    it("should provide initial empty savedCreations array", () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Saved: {contextValue.savedCreations.length}</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      expect(contextValue.savedCreations).toEqual([]);
    });

    it("should allow setting currentCreation", () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return (
          <div>Current: {contextValue.currentCreation?.title || "null"}</div>
        );
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      act(() => {
        contextValue.setCurrentCreation(mockCreation);
      });
      expect(contextValue.currentCreation).toEqual(mockCreation);
    });

    it("should allow opening a saved creation as currentCreation", () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return (
          <div>Current: {contextValue.currentCreation?.title || "null"}</div>
        );
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      act(() => {
        contextValue.openCreation(mockCreation);
      });

      expect(contextValue.currentCreation).toEqual(mockCreation);
    });

    it("should allow clearing currentCreation", () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return (
          <div>Current: {contextValue.currentCreation?.title || "null"}</div>
        );
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      act(() => {
        contextValue.setCurrentCreation(mockCreation);
      });
      expect(contextValue.currentCreation).toEqual(mockCreation);

      act(() => {
        contextValue.clearCurrentCreation();
      });
      expect(contextValue.currentCreation).toBeNull();
    });

    it("should load saved creations from storage", async () => {
      const mockSavedCreations = [mockCreation];
      (getSavedCreations as jest.Mock).mockResolvedValue(mockSavedCreations);

      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Saved: {contextValue.savedCreations.length}</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      expect(contextValue.savedCreations).toEqual([]);

      await act(async () => {
        await contextValue.loadSavedCreations();
      });

      expect(getSavedCreations).toHaveBeenCalled();
      expect(contextValue.savedCreations).toEqual(mockSavedCreations);
    });

    it("should save current creation to storage", async () => {
      const mockUpdatedCreations = [mockCreation];
      (saveCreation as jest.Mock).mockResolvedValue(mockUpdatedCreations);

      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Test</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      act(() => {
        contextValue.setCurrentCreation(mockCreation);
      });

      await act(async () => {
        await contextValue.saveCurrentCreation();
      });

      expect(saveCreation).toHaveBeenCalledWith(mockCreation);
      expect(contextValue.savedCreations).toEqual(mockUpdatedCreations);
    });

    it("should not save when currentCreation is null", async () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Test</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      await act(async () => {
        await contextValue.saveCurrentCreation();
      });

      expect(saveCreation).not.toHaveBeenCalled();
    });

    it("should delete creation from saved creations", async () => {
      const updatedCreations = [mockCreation];
      (deleteSavedCreation as jest.Mock).mockResolvedValue(updatedCreations);

      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Test</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      await act(async () => {
        await contextValue.deleteCreation("2");
      });

      expect(deleteSavedCreation).toHaveBeenCalledWith("2");
      expect(contextValue.savedCreations).toEqual(updatedCreations);
    });

    it("should clear currentCreation when deleting the current creation", async () => {
      (deleteSavedCreation as jest.Mock).mockResolvedValue([]);

      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Test</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      act(() => {
        contextValue.setCurrentCreation(mockCreation);
      });

      await act(async () => {
        await contextValue.deleteCreation(mockCreation.id);
      });

      expect(deleteSavedCreation).toHaveBeenCalledWith(mockCreation.id);
      expect(contextValue.savedCreations).toEqual([]);
      expect(contextValue.currentCreation).toBeNull();
    });

    it("should keep currentCreation when deleting a different creation", async () => {
      (deleteSavedCreation as jest.Mock).mockResolvedValue([]);

      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Test</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      act(() => {
        contextValue.setCurrentCreation(mockCreation);
      });

      await act(async () => {
        await contextValue.deleteCreation("other-id");
      });

      expect(deleteSavedCreation).toHaveBeenCalledWith("other-id");
      expect(contextValue.currentCreation).toEqual(mockCreation);
    });

    it("should regenerate currentCreation with the same prompt, format, and mood", () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Test</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      act(() => {
        contextValue.setCurrentCreation(mockCreation);
      });

      act(() => {
        contextValue.regenerateCurrentCreation();
      });

      expect(createMockGeneration).toHaveBeenCalledWith({
        prompt: mockCreation.prompt,
        format: mockCreation.format,
        mood: mockCreation.mood,
      });
      expect(contextValue.currentCreation).toEqual({
        ...mockCreation,
        id: "regenerated-id",
        title: "Regenerated Title",
        content: "Regenerated content",
      });
    });

    it("should not regenerate when currentCreation is null", () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Test</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      act(() => {
        contextValue.regenerateCurrentCreation();
      });

      expect(createMockGeneration).not.toHaveBeenCalled();
      expect(contextValue.currentCreation).toBeNull();
    });

    it("should refine currentCreation with the selected refinement", () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Test</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      act(() => {
        contextValue.setCurrentCreation(mockCreation);
      });

      act(() => {
        contextValue.refineCurrentCreation("poetic");
      });

      expect(refineMockCreation).toHaveBeenCalledWith(mockCreation, "poetic");
      expect(contextValue.currentCreation).toEqual({
        ...mockCreation,
        id: "refined-id",
        content: "Refined content",
      });
    });

    it("should not refine when currentCreation is null", () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Test</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      act(() => {
        contextValue.refineCurrentCreation("shorter");
      });

      expect(refineMockCreation).not.toHaveBeenCalled();
      expect(contextValue.currentCreation).toBeNull();
    });
  });

  describe("useCreation", () => {
    it("should throw error when used outside CreationProvider", () => {
      const TestComponent = () => {
        useCreation();
        return <div>Test</div>;
      };

      expect(() => render(<TestComponent />)).toThrow(
        "useCreation must be used within a CreationProvider",
      );
    });

    it("should return context value when used inside CreationProvider", () => {
      let contextValue: any;
      const TestComponent = () => {
        contextValue = useCreation();
        return <div>Test</div>;
      };

      render(
        <CreationProvider>
          <TestComponent />
        </CreationProvider>,
      );

      expect(contextValue).toHaveProperty("currentCreation");
      expect(contextValue).toHaveProperty("setCurrentCreation");
      expect(contextValue).toHaveProperty("clearCurrentCreation");
      expect(contextValue).toHaveProperty("savedCreations");
      expect(contextValue).toHaveProperty("loadSavedCreations");
      expect(contextValue).toHaveProperty("saveCurrentCreation");
      expect(contextValue).toHaveProperty("openCreation");
      expect(contextValue).toHaveProperty("deleteCreation");
      expect(contextValue).toHaveProperty("regenerateCurrentCreation");
      expect(contextValue).toHaveProperty("refineCurrentCreation");
      expect(typeof contextValue.setCurrentCreation).toBe("function");
      expect(typeof contextValue.clearCurrentCreation).toBe("function");
      expect(typeof contextValue.loadSavedCreations).toBe("function");
      expect(typeof contextValue.saveCurrentCreation).toBe("function");
      expect(typeof contextValue.openCreation).toBe("function");
      expect(typeof contextValue.deleteCreation).toBe("function");
      expect(typeof contextValue.regenerateCurrentCreation).toBe("function");
      expect(typeof contextValue.refineCurrentCreation).toBe("function");
      expect(Array.isArray(contextValue.savedCreations)).toBe(true);
    });
  });
});
