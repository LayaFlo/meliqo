import { theme } from "@/src/theme/theme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Surface, Text } from "react-native-paper";
import { createMockGeneration } from "../utils/mockGeneration";

export default function ResultScreen() {
  const router = useRouter();

  const creation = createMockGeneration({
    prompt: "moonlight, city rain, missing someone",
    format: "song",
    mood: "dreamy",
  });

  const handleEdit = () => {
    console.log("Edit creation");
  };

  const handleRegenerate = () => {
    console.log("Regenerate creation");
  };

  const handleSave = () => {
    console.log("Save creation");
  };

  return (
    <Surface style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={theme.colors.onBackground}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {creation.title}
          </Text>
          <Text variant="bodyMedium" style={styles.metadata}>
            {creation.format} • {creation.mood}
          </Text>
        </View>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="bodyLarge" style={styles.lyrics}>
              {creation.content}
            </Text>
          </Card.Content>
        </Card>
        <View style={styles.actions}>
          <Button
            testID="action-button"
            mode="contained"
            onPress={handleEdit}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
          >
            Edit
          </Button>
          <View style={styles.secondaryActions}>
            <Button
              mode="outlined"
              onPress={handleRegenerate}
              style={styles.secondaryButton}
            >
              Regenerate
            </Button>

            <Button
              mode="outlined"
              onPress={handleSave}
              style={styles.secondaryButton}
            >
              Save
            </Button>
          </View>
        </View>
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
    flexGrow: 1,
    padding: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  backButton: {
    marginLeft: -8,
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: "700",
    marginBottom: 8,
  },
  metadata: {
    color: theme.colors.onSurfaceVariant,
  },
  card: {
    marginBottom: 32,
  },
  lyrics: {
    lineHeight: 30,
  },
  actions: {
    marginTop: "auto",
  },
  primaryButton: {
    marginBottom: 16,
  },
  buttonContent: {
    height: 48,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
  },
});
