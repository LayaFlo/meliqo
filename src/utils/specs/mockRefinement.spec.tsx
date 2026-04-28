import type { GeneratedCreation, RefinementType } from "@/src/types/creation";
import { refineMockCreation } from "../mockRefinement";

const mockCreation: GeneratedCreation = {
  id: "original-id",
  title: "Midnight Echo",
  content: "Original content",
  format: "song",
  mood: "dreamy",
  prompt: "city rain",
  createdAt: "2024-01-01T00:00:00.000Z",
};

describe("mockRefinement", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2024-01-02T12:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should return a refined creation with a new id, timestamp, and prefixed content", () => {
    const result = refineMockCreation(mockCreation, "poetic");

    expect(result).toEqual({
      ...mockCreation,
      id: "1704196800000",
      content: `More poetic version

Original content`,
      createdAt: "2024-01-02T12:00:00.000Z",
    });
  });

  it.each([
    ["softer", "Softened version"],
    ["darker", "Darker version"],
    ["shorter", "Shorter version"],
  ] as [RefinementType, string][])(
    "should use the %s refinement prefix",
    (refinement, prefix) => {
      const result = refineMockCreation(mockCreation, refinement);

      expect(result.content).toBe(`${prefix}

Original content`);
    },
  );

  it("should preserve creation metadata", () => {
    const result = refineMockCreation(mockCreation, "softer");

    expect(result.title).toBe(mockCreation.title);
    expect(result.format).toBe(mockCreation.format);
    expect(result.mood).toBe(mockCreation.mood);
    expect(result.prompt).toBe(mockCreation.prompt);
  });
});
