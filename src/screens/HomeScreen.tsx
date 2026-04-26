import { theme } from "@/src/theme/theme";
import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";

export default function HomeScreen() {
  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium">Meliqo</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
