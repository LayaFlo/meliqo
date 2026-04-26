import { MD3DarkTheme, type MD3Theme } from "react-native-paper";

export const theme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 8,

  colors: {
    ...MD3DarkTheme.colors,

    primary: "#8B5CF6",
    secondary: "#3B82F6",
    tertiary: "#EC4899",

    background: "#09090B",
    surface: "#111218",
    surfaceVariant: "#1A1C24",

    onBackground: "#FAFAFA",
    onSurface: "#F4F4F5",
    onSurfaceVariant: "#B8BCC8",

    outline: "#2A2D38",
    error: "#F43F5E",

    elevation: {
      level0: "#09090B",
      level1: "#111218",
      level2: "#1A1C24",
      level3: "#222430",
      level4: "#2A2D38",
      level5: "#343846",
    },
  },
};
