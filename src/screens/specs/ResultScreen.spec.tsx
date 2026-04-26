import { CreationProvider, useCreation } from "@/src/context/CreationContext";
import ResultScreen from "@/src/screens/ResultScreen";
import { theme } from "@/src/theme/theme";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { PaperProvider } from "react-native-paper";

// Mock expo-router
const mockBack = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
  }),
}));

function renderResultScreen(withCreation = true) {
  const mockCreation = withCreation
    ? {
        id: "test-id",
        title: "Midnight Echo",
        content:
          "Verse 1\nI found your words beneath the city rain\nA little moonlight calling out my name\n\nChorus\nWe turn the silence into something true\nA song that starts and ends with you",
        format: "song" as const,
        mood: "dreamy" as const,
        prompt: "test prompt",
        createdAt: "2024-01-01T00:00:00.000Z",
      }
    : null;

  return render(
    <PaperProvider theme={theme}>
      <CreationProvider>
        <ResultScreenWithContext creation={mockCreation} />
      </CreationProvider>
    </PaperProvider>,
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
        expect(screen.getByText("song • dreamy")).toBeTruthy();
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

    it("should have Edit, Regenerate, and Save buttons", async () => {
      renderResultScreen(true);

      await waitFor(() => {
        expect(screen.getByTestId("action-button")).toBeTruthy();
        expect(screen.getByText("Regenerate")).toBeTruthy();
        expect(screen.getByText("Save")).toBeTruthy();
      });
    });
  });
});
