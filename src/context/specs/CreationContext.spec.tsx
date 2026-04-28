import type { GeneratedCreation } from "@/src/types/creation";
import {
  deleteSavedCreation,
  getSavedCreations,
  saveCreation,
} from "@/src/utils/creationStorage";
import { act, render } from "@testing-library/react-native";
import React from "react";
import { CreationProvider, useCreation } from "../CreationContext";

jest.mock("@/src/utils/creationStorage", () => ({
  deleteSavedCreation: jest.fn(),
  getSavedCreations: jest.fn(),
  saveCreation: jest.fn(),
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

    it("should memoize the context value based on currentCreation", () => {
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

      const initialContextValue = contextValue;

      // Setting creation should create new context value
      act(() => {
        contextValue.setCurrentCreation(mockCreation);
      });
      expect(contextValue).not.toBe(initialContextValue); // Should be different reference

      const updatedContextValue = contextValue;

      // Setting the same creation again should not create new context value
      act(() => {
        contextValue.setCurrentCreation(mockCreation);
      });
      expect(contextValue).toBe(updatedContextValue); // Should be same reference
    });

    it("should update context value when savedCreations change", async () => {
      const mockSavedCreations = [mockCreation];
      (getSavedCreations as jest.Mock).mockResolvedValue(mockSavedCreations);

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

      const initialContextValue = contextValue;

      await act(async () => {
        await contextValue.loadSavedCreations();
      });

      expect(contextValue).not.toBe(initialContextValue); // Should be different reference due to savedCreations change
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
      expect(typeof contextValue.setCurrentCreation).toBe("function");
      expect(typeof contextValue.clearCurrentCreation).toBe("function");
      expect(typeof contextValue.loadSavedCreations).toBe("function");
      expect(typeof contextValue.saveCurrentCreation).toBe("function");
      expect(typeof contextValue.openCreation).toBe("function");
      expect(typeof contextValue.deleteCreation).toBe("function");
      expect(Array.isArray(contextValue.savedCreations)).toBe(true);
    });
  });
});
