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

  afterEach(() => {
    jest.restoreAllMocks();
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

    jest.spyOn(Math, "random").mockReturnValue(0);

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

  it("should choose mock title and content based on random values", () => {
    jest
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99);

    const result = createMockGeneration({
      prompt: "stars",
      format: "song" as CreationFormat,
      mood: "romantic" as CreationMood,
    });

    expect(result.title).toBe("Paper Stars");
    expect(result.content).toBe(`Verse 1
The night was humming in your hands
Like broken dreams and distant bands

Chorus
We make a rhythm from the dark
And light the sky with one small spark`);
  });
});
