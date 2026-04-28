import type { GeneratedCreation } from "@/src/types/creation";
import { Share } from "react-native";
import { shareCreation } from "../shareCreation";

jest.mock("react-native", () => ({
  Share: {
    share: jest.fn(),
  },
}));

const mockCreation: GeneratedCreation = {
  id: "test-id",
  title: "Midnight Echo",
  content: "Line one\nLine two",
  format: "song",
  mood: "dreamy",
  prompt: "city rain",
  createdAt: "2024-01-01T00:00:00.000Z",
};

describe("shareCreation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Share.share as jest.Mock).mockResolvedValue({ action: "sharedAction" });
  });

  it("should share a creation with formatted title and message", async () => {
    await shareCreation(mockCreation);

    expect(Share.share).toHaveBeenCalledWith({
      title: "Midnight Echo",
      message:
        "Check out my song created with Meliqo!\n\nTitle: Midnight Echo\nMood: dreamy\n\nLine one\nLine two",
    });
  });

  it("should return the native share result", async () => {
    const result = await shareCreation(mockCreation);

    expect(result).toEqual({ action: "sharedAction" });
  });

  it("should include the provided format and mood values", async () => {
    await shareCreation({
      ...mockCreation,
      title: "Night Verse",
      format: "rap",
      mood: "dark",
    });

    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(
          "Check out my rap created with Meliqo!",
        ),
      }),
    );
    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Mood: dark"),
      }),
    );
  });
});
