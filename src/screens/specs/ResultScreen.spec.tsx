import ResultScreen from "@/src/screens/ResultScreen";
import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("ResultScreen", () => {
  beforeEach(() => {
    mockBack.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });
  });

  it("should render the creation title and metadata", () => {
    const { getByText } = render(<ResultScreen />);

    expect(getByText("Midnight Echo")).toBeTruthy();
    expect(getByText("song • dreamy")).toBeTruthy();
  });

  it("should render the creation content", () => {
    const { getByText } = render(<ResultScreen />);

    expect(getByText(/Verse 1/)).toBeTruthy();
    expect(getByText(/A song that starts and ends with you/)).toBeTruthy();
  });

  it("should call router.back when the back button is pressed", () => {
    const { getAllByRole } = render(<ResultScreen />);
    const buttons = getAllByRole("button");

    fireEvent.press(buttons[0]);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("should call the edit handler when Edit button is pressed", () => {
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    const { getByText } = render(<ResultScreen />);

    fireEvent.press(getByText("Edit"));

    expect(consoleLogSpy).toHaveBeenCalledWith("Edit creation");
    consoleLogSpy.mockRestore();
  });

  it("should call the regenerate and save handlers when their buttons are pressed", () => {
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    const { getByText } = render(<ResultScreen />);

    fireEvent.press(getByText("Regenerate"));
    fireEvent.press(getByText("Save"));

    expect(consoleLogSpy).toHaveBeenNthCalledWith(1, "Regenerate creation");
    expect(consoleLogSpy).toHaveBeenNthCalledWith(2, "Save creation");
    consoleLogSpy.mockRestore();
  });
});
