import { useCreation } from "@/src/context/CreationContext";
import { theme } from "@/src/theme/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, IconButton, Surface, Text } from "react-native-paper";

export default function SavedScreen() {
  const router = useRouter();
  const { savedCreations, loadSavedCreations, openCreation } = useCreation();

  useEffect(() => {
    loadSavedCreations();
  }, [loadSavedCreations]);

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={theme.colors.onBackground}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text variant="headlineMedium" style={styles.title}>
          Saved creations
        </Text>
        {savedCreations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              No saved creations yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              Save a song or poem to find it here later.
            </Text>
          </View>
        ) : (
          savedCreations.map((creation) => (
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
          ))
        )}
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
  backButton: {
    marginLeft: -8,
    marginBottom: 24,
  },
  title: {
    fontWeight: "700",
    marginBottom: 24,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 120,
  },
  emptyTitle: {
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    color: theme.colors.onSurfaceVariant,
    lineHeight: 24,
    textAlign: "center",
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
