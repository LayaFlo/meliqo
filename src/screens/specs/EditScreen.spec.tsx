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
    expect(screen.getByText("Save")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
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

    const saveButton = screen.getByText("Save");
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

    const saveButton = screen.getByText("Save");
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

    const saveButton = screen.getByText("Save");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(setCurrentCreation).toHaveBeenCalledWith({
        ...mockCreation,
        content: "",
      });
    });
  });

  it("should render back button when currentCreation exists", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const backButton = screen.getByTestId("icon-button");
    expect(backButton).toBeTruthy();
  });

  it("should navigate back when back button is pressed", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const backButton = screen.getByTestId("icon-button");
    fireEvent.press(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("should render Cancel button when currentCreation exists", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  it("should navigate back when Cancel button is pressed", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.press(cancelButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("should disable Save button when there are no changes", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton.props.accessibilityState.disabled).toBe(true);
  });

  it("should enable Save button when content has changed", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const input = screen.getByDisplayValue("Original lyrics content");
    fireEvent.changeText(input, "Updated lyrics content");

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton.props.accessibilityState.disabled).toBe(false);
  });

  it("should disable Save button when content is changed back to original", () => {
    const setCurrentCreation = jest.fn();
    (useCreation as jest.Mock).mockReturnValue({
      currentCreation: mockCreation,
      setCurrentCreation,
    });

    renderWithProviders(<EditScreen />);

    const input = screen.getByDisplayValue("Original lyrics content");
    fireEvent.changeText(input, "Updated lyrics content");
    fireEvent.changeText(input, "Original lyrics content");

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton.props.accessibilityState.disabled).toBe(true);
  });
});
