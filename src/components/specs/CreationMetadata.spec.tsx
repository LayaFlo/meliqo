import { CreationMetadata } from "@/src/components/CreationMetadata";
import { renderWithProviders } from "@/src/test/renderWithProviders";
import { theme } from "@/src/theme/theme";
import { screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

describe("CreationMetadata", () => {
  it("should render formatted creation metadata labels", () => {
    renderWithProviders(<CreationMetadata format="song" mood="dreamy" />);

    expect(screen.getByText("Song • Dreamy")).toBeTruthy();
  });

  it("should render labels for different format and mood values", () => {
    renderWithProviders(<CreationMetadata format="rap" mood="dark" />);

    expect(screen.getByText("Rap • Dark")).toBeTruthy();
  });

  it("should use the standard metadata color", () => {
    renderWithProviders(<CreationMetadata format="haiku" mood="sad" />);

    expect(
      StyleSheet.flatten(screen.getByText("Haiku • Sad").props.style),
    ).toEqual(
      expect.objectContaining({ color: theme.colors.onSurfaceVariant }),
    );
  });

  it("should pass custom styles to the metadata text", () => {
    renderWithProviders(
      <CreationMetadata
        format="poem"
        mood="romantic"
        style={{ marginTop: 4 }}
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByText("Poem • Romantic").props.style),
    ).toEqual(expect.objectContaining({ marginTop: 4 }));
  });
});
