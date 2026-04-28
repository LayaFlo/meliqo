import { useCreation } from "@/src/context/CreationContext";
import SavedScreen from "@/src/screens/SavedScreen";
import { renderWithProviders } from "@/src/test/renderWithProviders";
import type { GeneratedCreation } from "@/src/types/creation";
import { screen, waitFor } from "@testing-library/react-native";

jest.mock("@/src/context/CreationContext", () => ({
  ...jest.requireActual("@/src/context/CreationContext"),
  useCreation: jest.fn(),
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
  });

  it("should render the title", () => {
    (useCreation as jest.Mock).mockReturnValue({
      savedCreations: [],
      loadSavedCreations: jest.fn(),
    });

    renderWithProviders(<SavedScreen />);

    expect(screen.getByText("Saved creations")).toBeTruthy();
  });

  it("should call loadSavedCreations on mount", async () => {
    const mockLoadSavedCreations = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      savedCreations: [],
      loadSavedCreations: mockLoadSavedCreations,
    });

    renderWithProviders(<SavedScreen />);

    await waitFor(() => {
      expect(mockLoadSavedCreations).toHaveBeenCalled();
    });
  });

  it("should render no saved creation titles when no saved creations exist", () => {
    (useCreation as jest.Mock).mockReturnValue({
      savedCreations: [],
      loadSavedCreations: jest.fn(),
    });

    renderWithProviders(<SavedScreen />);

    expect(screen.getByText("Saved creations")).toBeTruthy();
    expect(screen.queryByText(mockCreation1.title)).toBeNull();
    expect(screen.queryByText(mockCreation2.title)).toBeNull();
  });

  it("should render a single saved creation", () => {
    (useCreation as jest.Mock).mockReturnValue({
      savedCreations: [mockCreation1],
      loadSavedCreations: jest.fn(),
    });

    renderWithProviders(<SavedScreen />);

    expect(screen.getByText("Moonlight Sonnet")).toBeTruthy();
    expect(screen.getByText("poem • dreamy")).toBeTruthy();
  });

  it("should render multiple saved creations", () => {
    (useCreation as jest.Mock).mockReturnValue({
      savedCreations: [mockCreation1, mockCreation2],
      loadSavedCreations: jest.fn(),
    });

    renderWithProviders(<SavedScreen />);

    // Check first creation
    expect(screen.getByText("Moonlight Sonnet")).toBeTruthy();
    expect(screen.getByText("poem • dreamy")).toBeTruthy();

    // Check second creation
    expect(screen.getByText("City Nights Rap")).toBeTruthy();
    expect(screen.getByText("rap • dark")).toBeTruthy();
  });

  it("should display format and mood metadata correctly", () => {
    (useCreation as jest.Mock).mockReturnValue({
      savedCreations: [mockCreation1],
      loadSavedCreations: jest.fn(),
    });

    renderWithProviders(<SavedScreen />);

    expect(screen.getByText("poem • dreamy")).toBeTruthy();
  });

  it("should handle different formats and moods", () => {
    const creationWithDifferentFormat: GeneratedCreation = {
      ...mockCreation1,
      format: "song",
      mood: "romantic",
    };

    (useCreation as jest.Mock).mockReturnValue({
      savedCreations: [creationWithDifferentFormat],
      loadSavedCreations: jest.fn(),
    });

    renderWithProviders(<SavedScreen />);

    expect(screen.getByText("song • romantic")).toBeTruthy();
  });

  it("should render all creation titles from savedCreations array", () => {
    const creations = [
      { ...mockCreation1, id: "id-1", title: "Creation One" },
      { ...mockCreation1, id: "id-2", title: "Creation Two" },
      { ...mockCreation1, id: "id-3", title: "Creation Three" },
    ];

    (useCreation as jest.Mock).mockReturnValue({
      savedCreations: creations,
      loadSavedCreations: jest.fn(),
    });

    renderWithProviders(<SavedScreen />);

    expect(screen.getByText("Creation One")).toBeTruthy();
    expect(screen.getByText("Creation Two")).toBeTruthy();
    expect(screen.getByText("Creation Three")).toBeTruthy();
  });
});
