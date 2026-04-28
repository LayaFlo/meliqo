import { useCreation } from "@/src/context/CreationContext";
import SavedScreen from "@/src/screens/SavedScreen";
import { renderWithProviders } from "@/src/test/renderWithProviders";
import type { GeneratedCreation } from "@/src/types/creation";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

jest.mock("@/src/context/CreationContext", () => ({
  ...jest.requireActual("@/src/context/CreationContext"),
  useCreation: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("SavedScreen", () => {
  const mockCreation1: GeneratedCreation = {
    id: "creation-1",
    title: "Moonlight Sonnet",
    content: "Beneath the moon so bright...",
    format: "poem",
    mood: "dreamy",
    prompt: "moonlight and dreams",
    createdAt: "2024-01-01T10:00:00.000Z",
  };

  const mockCreation2: GeneratedCreation = {
    id: "creation-2",
    title: "City Nights Rap",
    content: "Yeah, the city never sleeps...",
    format: "rap",
    mood: "dark",
    prompt: "urban life",
    createdAt: "2024-01-02T15:30:00.000Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  function mockUseCreation({
    savedCreations,
    loadSavedCreations = jest.fn(),
    openCreation = jest.fn(),
  }: {
    savedCreations: GeneratedCreation[];
    loadSavedCreations?: jest.Mock;
    openCreation?: jest.Mock;
  }) {
    (useCreation as jest.Mock).mockReturnValue({
      savedCreations,
      loadSavedCreations,
      openCreation,
    });

    return { loadSavedCreations, openCreation };
  }

  it("should render the title", () => {
    mockUseCreation({
      savedCreations: [],
    });

    renderWithProviders(<SavedScreen />);

    expect(screen.getByText("Saved creations")).toBeTruthy();
  });

  it("should call loadSavedCreations on mount", async () => {
    const mockLoadSavedCreations = jest.fn();
    mockUseCreation({
      savedCreations: [],
      loadSavedCreations: mockLoadSavedCreations,
    });

    renderWithProviders(<SavedScreen />);

    await waitFor(() => {
      expect(mockLoadSavedCreations).toHaveBeenCalled();
    });
  });

  it("should render no saved creation titles when no saved creations exist", () => {
    mockUseCreation({
      savedCreations: [],
    });

    renderWithProviders(<SavedScreen />);

    expect(screen.getByText("Saved creations")).toBeTruthy();
    expect(screen.queryByText(mockCreation1.title)).toBeNull();
    expect(screen.queryByText(mockCreation2.title)).toBeNull();
  });

  it("should render a single saved creation", () => {
    mockUseCreation({
      savedCreations: [mockCreation1],
    });

    renderWithProviders(<SavedScreen />);

    expect(screen.getByText("Moonlight Sonnet")).toBeTruthy();
    expect(screen.getByText("poem • dreamy")).toBeTruthy();
  });

  it("should render multiple saved creations", () => {
    mockUseCreation({
      savedCreations: [mockCreation1, mockCreation2],
    });

    renderWithProviders(<SavedScreen />);

    // Check first creation
    expect(screen.getByText("Moonlight Sonnet")).toBeTruthy();
    expect(screen.getByText("poem • dreamy")).toBeTruthy();

    // Check second creation
    expect(screen.getByText("City Nights Rap")).toBeTruthy();
    expect(screen.getByText("rap • dark")).toBeTruthy();
  });

  it("should open a saved creation and navigate to result when pressed", () => {
    const mockOpenCreation = jest.fn();
    mockUseCreation({
      savedCreations: [mockCreation1],
      openCreation: mockOpenCreation,
    });

    renderWithProviders(<SavedScreen />);

    fireEvent.press(screen.getByText(mockCreation1.title));

    expect(mockOpenCreation).toHaveBeenCalledWith(mockCreation1);
    expect(mockPush).toHaveBeenCalledWith("/result");
  });
});
