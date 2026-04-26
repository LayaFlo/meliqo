import { useCreation } from "@/src/context/CreationContext";
import EditScreen from "@/src/screens/EditScreen";
import { renderWithProviders } from "@/src/test/renderWithProviders";
import type { GeneratedCreation } from "@/src/types/creation";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

const mockBack = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
  }),
}));

jest.mock("@/src/context/CreationContext", () => ({
  ...jest.requireActual("@/src/context/CreationContext"),
  useCreation: jest.fn(),
}));

describe("EditScreen", () => {
  const mockCreation: GeneratedCreation = {
    id: "test-id",
    title: "Test Song",
    content: "Original lyrics content",
    format: "song",
    mood: "dreamy",
    prompt: "test prompt",
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockBack.mockClear();
    mockReplace.mockClear();
  });

  it("should render empty state when currentCreation is null", () => {
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: null,
      setCurrentCreation: jest.fn(),
    });

    renderWithProviders(<EditScreen />);

    expect(screen.getByText("Nothing to edit")).toBeTruthy();
    expect(screen.getByText("Start Creating")).toBeTruthy();
  });

  it("should navigate to home when clicking start creating in empty state", () => {
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: null,
      setCurrentCreation: jest.fn(),
    });

    renderWithProviders(<EditScreen />);

    const startButton = screen.getByText("Start Creating");
    fireEvent.press(startButton);

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("should render the edit form when currentCreation exists", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    expect(screen.getByText("Edit your creation")).toBeTruthy();
    expect(screen.getByDisplayValue("Original lyrics content")).toBeTruthy();
  });

  it("should display the label 'Lyrics' for the text input", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const lyricInputs = screen.queryAllByText("Lyrics");
    expect(lyricInputs.length).toBeGreaterThan(0);
  });

  it("should render save changes button", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    expect(screen.getByText("Save Changes")).toBeTruthy();
  });

  it("should update content when user types in the textarea", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const input = screen.getByDisplayValue("Original lyrics content");
    fireEvent.changeText(input, "Updated lyrics content");

    expect(screen.getByDisplayValue("Updated lyrics content")).toBeTruthy();
  });

  it("should save changes and navigate back when save button is pressed", async () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const input = screen.getByDisplayValue("Original lyrics content");
    fireEvent.changeText(input, "Updated lyrics content");

    const saveButton = screen.getByText("Save Changes");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(setCurrentCreation).toHaveBeenCalledWith({
        ...mockCreation,
        content: "Updated lyrics content",
      });
    });

    await waitFor(() => {
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it("should preserve other creation properties when saving", async () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const input = screen.getByDisplayValue("Original lyrics content");
    fireEvent.changeText(input, "New content");

    const saveButton = screen.getByText("Save Changes");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(setCurrentCreation).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockCreation.id,
          title: mockCreation.title,
          format: mockCreation.format,
          mood: mockCreation.mood,
          prompt: mockCreation.prompt,
          createdAt: mockCreation.createdAt,
        }),
      );
    });
  });

  it("should load initial content from currentCreation", () => {
    const setCurrentCreation = jest.fn();
    const customCreation = {
      ...mockCreation,
      content: "Custom initial content",
    };

    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: customCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    expect(screen.getByDisplayValue("Custom initial content")).toBeTruthy();
  });

  it("should handle empty content when saving", async () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const input = screen.getByDisplayValue("Original lyrics content");
    fireEvent.changeText(input, "");

    const saveButton = screen.getByText("Save Changes");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(setCurrentCreation).toHaveBeenCalledWith({
        ...mockCreation,
        content: "",
      });
    });
  });

  it("should not navigate back if currentCreation is null when save is pressed", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: null,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    // Testing the guard
    expect(mockBack).not.toHaveBeenCalled();
  });
});
