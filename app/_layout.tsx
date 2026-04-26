import { CreationProvider } from "@/src/context/CreationContext";
import { theme } from "@/src/theme/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, Surface } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <CreationProvider>
        <Surface style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </Surface>

        <StatusBar style="light" />
      </CreationProvider>
    </PaperProvider>
  );
}
