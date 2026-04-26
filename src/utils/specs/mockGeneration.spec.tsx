import type {
  CreationFormat,
  CreationMood,
  GeneratedCreation,
} from "@/src/types/creation";
import { createMockGeneration } from "../mockGeneration";

describe("mockGeneration", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2024-01-01T12:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should return a generated creation object with expected shape", () => {
    const params = {
      prompt: "  In the quiet corners of the night  ",
      format: "rap" as CreationFormat,
      mood: "dark" as CreationMood,
    };

    const result = createMockGeneration(params);

    expect(result).toEqual({
      id: "1704110400000",
      title: "Midnight Echo",
      prompt: "In the quiet corners of the night",
      format: params.format,
      mood: params.mood,
      createdAt: "2024-01-01T12:00:00.000Z",
      content: `Verse 1
I found your words beneath the city rain
A little moonlight calling out my name

Chorus
We turn the silence into something true
A song that starts and ends with you`,
    } as GeneratedCreation);
  });

  it("should trim whitespace from the prompt", () => {
    const result = createMockGeneration({
      prompt: "   lonely highway   ",
      format: "rap" as CreationFormat,
      mood: "dark" as CreationMood,
    });

    expect(result.prompt).toBe("lonely highway");
  });

  it("should preserve the provided format and mood values", () => {
    const format = "haiku" as CreationFormat;
    const mood = "sad" as CreationMood;

    const result = createMockGeneration({
      prompt: "road",
      format,
      mood,
    });

    expect(result.format).toBe(format);
    expect(result.mood).toBe(mood);
  });
});
