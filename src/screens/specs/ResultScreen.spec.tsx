import { useCreation } from "@/src/context/CreationContext";
import ResultScreen from "@/src/screens/ResultScreen";
import { renderWithProviders } from "@/src/test/renderWithProviders";
import { shareCreation } from "@/src/utils/shareCreation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import React from "react";

const mockCreation = {
  id: "test-id",
  title: "Midnight Echo",
  content:
    "Verse 1\nI found your words beneath the city rain\nA little moonlight calling out my name\n\nChorus\nWe turn the silence into something true\nA song that starts and ends with you",
  format: "song" as const,
  mood: "dreamy" as const,
  prompt: "test prompt",
  createdAt: "2024-01-01T00:00:00.000Z",
};

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock("@/src/utils/shareCreation", () => ({
  shareCreation: jest.fn(),
}));

function renderResultScreen(withCreation = true) {
  return renderWithProviders(
    <ResultScreenWithContext creation={withCreation ? mockCreation : null} />,
  );
}

function ResultScreenWithContext({ creation }: { creation: any }) {
  const { setCurrentCreation } = useCreation();

  React.useEffect(() => {
    if (creation) {
      setCurrentCreation(creation);
    }
  }, [creation, setCurrentCreation]);

  return <ResultScreen />;
}

describe("ResultScreen", () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockReplace.mockClear();
    mockPush.mockClear();
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (shareCreation as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("when no creation exists", () => {
    it("should render the empty state", () => {
      renderResultScreen(false);

      expect(screen.getByText("Nothing here yet")).toBeTruthy();
      expect(
        screen.getByText("Create your first song or poem to see it here."),
      ).toBeTruthy();
      expect(screen.getByText("Start Creating")).toBeTruthy();
    });

    it("should navigate to home when Start Creating button is pressed", () => {
      renderResultScreen(false);

      fireEvent.press(screen.getByText("Start Creating"));

      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  describe("when creation exists", () => {
    it("should render the creation title and metadata", async () => {
      renderResultScreen(true);

      await waitFor(() => {
        expect(screen.getByText("Midnight Echo")).toBeTruthy();
        expect(screen.getByText("Song • Dreamy")).toBeTruthy();
      });
    });

    it("should render the creation content", async () => {
      renderResultScreen(true);

      await waitFor(() => {
        expect(screen.getByText(/Verse 1/)).toBeTruthy();
        expect(
          screen.getByText(/A song that starts and ends with you/),
        ).toBeTruthy();
      });
    });

    it("should call router.back when the back button is pressed", async () => {
      renderResultScreen(true);

      await waitFor(() => {
        // Find the back button by its testID
        const backButton = screen.getByTestId("icon-button");
        fireEvent.press(backButton);
      });

      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("should have Edit, Save, and Share buttons", async () => {
      renderResultScreen(true);

      await waitFor(() => {
        expect(screen.getByTestId("action-button")).toBeTruthy();
        expect(screen.getByText("Regenerate")).toBeTruthy();
        expect(screen.getByText("Save")).toBeTruthy();
        expect(screen.getByText("Share")).toBeTruthy();
      });
    });

    it("should render refinement options", async () => {
      renderResultScreen(true);

      await waitFor(() => {
        expect(screen.getByText("Refine with AI")).toBeTruthy();
        expect(screen.getByText("Make it softer")).toBeTruthy();
        expect(screen.getByText("Make it darker")).toBeTruthy();
        expect(screen.getByText("More poetic")).toBeTruthy();
        expect(screen.getByText("Shorter")).toBeTruthy();
      });
    });

    it("should refine the current creation when a refinement option is pressed", async () => {
      renderResultScreen(true);

      await waitFor(() => {
        expect(screen.getByText("More poetic")).toBeTruthy();
      });

      fireEvent.press(screen.getByText("More poetic"));

      await waitFor(() => {
        expect(screen.getByText(/More poetic version/)).toBeTruthy();
        expect(
          screen.getByText(/A song that starts and ends with you/),
        ).toBeTruthy();
      });
    });

    it("should navigate to edit screen when Edit button is pressed", async () => {
      renderResultScreen(true);

      await waitFor(() => {
        const editButton = screen.getByTestId("action-button");
        fireEvent.press(editButton);
      });

      expect(mockPush).toHaveBeenCalledWith("/edit");
    });

    it("should regenerate the current creation when Regenerate is pressed", async () => {
      jest
        .spyOn(Math, "random")
        .mockReturnValueOnce(0.99)
        .mockReturnValueOnce(0.99);

      renderResultScreen(true);

      await waitFor(() => {
        expect(screen.getByText("Midnight Echo")).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Regenerate"));

      await waitFor(() => {
        expect(screen.getByText("Paper Stars")).toBeTruthy();
        expect(
          screen.getByText(/And light the sky with one small spark/),
        ).toBeTruthy();
      });
    });

    it("should save the current creation when Save is pressed", async () => {
      renderResultScreen(true);

      await waitFor(() => {
        expect(screen.getByText("Save")).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Save"));

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          "meliqo:saved-creations",
          JSON.stringify([mockCreation]),
        );
      });
    });

    it("should share the current creation when Share is pressed", async () => {
      renderResultScreen(true);

      await waitFor(() => {
        expect(screen.getByText("Share")).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Share"));

      expect(shareCreation).toHaveBeenCalledWith(mockCreation);
    });
  });
});
