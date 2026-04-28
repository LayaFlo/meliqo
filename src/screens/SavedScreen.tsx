import { useCreation } from "@/src/context/CreationContext";
import { theme } from "@/src/theme/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Card, Surface, Text } from "react-native-paper";

export default function SavedScreen() {
  const router = useRouter();
  const { savedCreations, loadSavedCreations, openCreation } = useCreation();

  useEffect(() => {
    loadSavedCreations();
  }, [loadSavedCreations]);

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Saved creations
        </Text>
        {savedCreations.map((creation) => (
          <Card
            key={creation.id}
            onPress={() => {
              openCreation(creation);
              router.push("/result");
            }}
            style={styles.card}
          >
            <Card.Content>
              <Text variant="titleMedium">{creation.title}</Text>
              <Text variant="bodyMedium" style={styles.meta}>
                {creation.format} • {creation.mood}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 72,
  },
  title: {
    fontWeight: "700",
    marginBottom: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    marginBottom: 14,
  },
  meta: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
});
