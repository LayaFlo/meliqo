import type { GeneratedCreation } from "@/src/types/creation";
import { act, render } from "@testing-library/react-native";
import React from "react";
import { CreationProvider, useCreation } from "../CreationContext";

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
      expect(typeof contextValue.setCurrentCreation).toBe("function");
      expect(typeof contextValue.clearCurrentCreation).toBe("function");
    });
  });
});
