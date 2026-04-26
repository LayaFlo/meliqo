import { CreationProvider } from "@/src/context/CreationContext";
import { theme } from "@/src/theme/theme";
import { render } from "@testing-library/react-native";
import { ReactNode } from "react";
import { PaperProvider } from "react-native-paper";

export function renderWithProviders(ui: ReactNode) {
  return render(
    <PaperProvider theme={theme}>
      <CreationProvider>{ui}</CreationProvider>
    </PaperProvider>,
  );
}
