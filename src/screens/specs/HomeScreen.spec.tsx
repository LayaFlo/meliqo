import HomeScreen from "@/src/screens/HomeScreen";
import { theme } from "@/src/theme/theme";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { PaperProvider } from "react-native-paper";

function renderHomeScreen() {
  return render(
    <PaperProvider theme={theme}>
      <HomeScreen />
    </PaperProvider>,
  );
}

describe("HomeScreen", () => {
  it("should render the create screen content", () => {
    renderHomeScreen();

    expect(screen.getByText("Meliqo")).toBeTruthy();
    expect(screen.getByText("What should we write from?")).toBeTruthy();
    expect(screen.getByText("Choose a format")).toBeTruthy();
    expect(screen.getByText("Choose a mood")).toBeTruthy();
    expect(screen.getByText("Create with AI")).toBeTruthy();
  });

  it("should render format options", () => {
    renderHomeScreen();

    expect(screen.getByText("Song")).toBeTruthy();
    expect(screen.getByText("Poem")).toBeTruthy();
    expect(screen.getByText("Rap")).toBeTruthy();
    expect(screen.getByText("Haiku")).toBeTruthy();
  });

  it("should render mood options", () => {
    renderHomeScreen();

    expect(screen.getByText("Dreamy")).toBeTruthy();
    expect(screen.getByText("Sad")).toBeTruthy();
    expect(screen.getByText("Romantic")).toBeTruthy();
    expect(screen.getByText("Funny")).toBeTruthy();
    expect(screen.getByText("Dark")).toBeTruthy();
  });

  it("should disable the generate button when input is empty", () => {
    renderHomeScreen();

    const button = screen.getByTestId("generate-button");

    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("should enable the generate button when user enters text", () => {
    renderHomeScreen();

    fireEvent.changeText(
      screen.getByPlaceholderText("moonlight, city rain, missing someone..."),
      "moon rain",
    );

    const button = screen.getByTestId("generate-button");

    expect(button.props.accessibilityState.disabled).toBe(false);
  });

  it("should keep the generate button disabled for whitespace-only input", () => {
    renderHomeScreen();

    fireEvent.changeText(
      screen.getByPlaceholderText("moonlight, city rain, missing someone..."),
      "   ",
    );

    const button = screen.getByTestId("generate-button");

    expect(button.props.accessibilityState.disabled).toBe(true);
  });
});
