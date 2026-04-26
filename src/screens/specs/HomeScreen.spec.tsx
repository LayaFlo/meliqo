import { useCreation } from "@/src/context/CreationContext";
import HomeScreen from "@/src/screens/HomeScreen";
import { renderWithProviders } from "@/src/test/renderWithProviders";
import * as mockGenerationModule from "@/src/utils/mockGeneration";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("HomeScreen", () => {
  it("should render the create screen content", () => {
    renderWithProviders(<HomeScreen />);

    expect(screen.getByText("Meliqo")).toBeTruthy();
    expect(screen.getByText("What should we write from?")).toBeTruthy();
    expect(screen.getByText("Choose a format")).toBeTruthy();
    expect(screen.getByText("Choose a mood")).toBeTruthy();
    expect(screen.getByText("Create with AI")).toBeTruthy();
  });

  it("should render format options", () => {
    renderWithProviders(<HomeScreen />);

    expect(screen.getByText("Song")).toBeTruthy();
    expect(screen.getByText("Poem")).toBeTruthy();
    expect(screen.getByText("Rap")).toBeTruthy();
    expect(screen.getByText("Haiku")).toBeTruthy();
  });

  it("should render mood options", () => {
    renderWithProviders(<HomeScreen />);

    expect(screen.getByText("Dreamy")).toBeTruthy();
    expect(screen.getByText("Sad")).toBeTruthy();
    expect(screen.getByText("Romantic")).toBeTruthy();
    expect(screen.getByText("Funny")).toBeTruthy();
    expect(screen.getByText("Dark")).toBeTruthy();
  });

  it("should disable the generate button when input is empty", () => {
    renderWithProviders(<HomeScreen />);

    const button = screen.getByTestId("generate-button");

    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("should enable the generate button when user enters text", () => {
    renderWithProviders(<HomeScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("moonlight, city rain, missing someone..."),
      "moon rain",
    );

    const button = screen.getByTestId("generate-button");

    expect(button.props.accessibilityState.disabled).toBe(false);
  });

  it("should keep the generate button disabled for whitespace-only input", () => {
    renderWithProviders(<HomeScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("moonlight, city rain, missing someone..."),
      "   ",
    );

    const button = screen.getByTestId("generate-button");

    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("should generate creation and navigate to result when button is pressed", async () => {
    const mockCreation = {
      id: "test-id",
      title: "Test Creation",
      content: "Test content",
      format: "song" as const,
      mood: "dreamy" as const,
      prompt: "test prompt",
      createdAt: "2024-01-01T00:00:00.000Z",
    };

    const spy = jest
      .spyOn(mockGenerationModule, "createMockGeneration")
      .mockReturnValue(mockCreation);

    renderWithProviders(<HomeScreen />);

    // Enter text
    fireEvent.changeText(
      screen.getByPlaceholderText("moonlight, city rain, missing someone..."),
      "test prompt",
    );

    // Select different format and mood
    fireEvent.press(screen.getByText("Poem"));
    fireEvent.press(screen.getByText("Sad"));

    // Click generate
    fireEvent.press(screen.getByTestId("generate-button"));

    // Verify generation was called with correct parameters
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        prompt: "test prompt",
        format: "poem",
        mood: "sad",
      });
    });

    // Verify navigation occurred
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/result");
    });

    spy.mockRestore();
  });

  it("should set the created generation in context", async () => {
    const mockCreation = {
      id: "test-id",
      title: "Test Creation",
      content: "Test content",
      format: "song" as const,
      mood: "dreamy" as const,
      prompt: "test prompt",
      createdAt: "2024-01-01T00:00:00.000Z",
    };

    const spy = jest
      .spyOn(mockGenerationModule, "createMockGeneration")
      .mockReturnValue(mockCreation);

    let contextValue: any;
    const TestWrapper = () => {
      contextValue = useCreation();
      return <HomeScreen />;
    };

    renderWithProviders(<TestWrapper />);

    // Enter text and generate
    fireEvent.changeText(
      screen.getByPlaceholderText("moonlight, city rain, missing someone..."),
      "test prompt",
    );
    fireEvent.press(screen.getByTestId("generate-button"));

    // Verify context was updated
    await waitFor(() => {
      expect(contextValue.currentCreation).toEqual(mockCreation);
    });

    spy.mockRestore();
  });
});
