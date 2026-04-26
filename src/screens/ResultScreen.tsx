import { useCreation } from "@/src/context/CreationContext";
import { theme } from "@/src/theme/theme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Icon,
  IconButton,
  Surface,
  Text,
} from "react-native-paper";

export default function ResultScreen() {
  const router = useRouter();
  const { currentCreation } = useCreation();

  const handleEdit = () => {
    console.log("Edit creation");
  };

  const handleRegenerate = () => {
    console.log("Regenerate creation");
  };

  const handleSave = () => {
    console.log("Save creation");
  };

  if (!currentCreation) {
    return (
      <Surface style={styles.container}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Icon
              source="music-note-outline"
              size={56}
              color={theme.colors.primary}
            />
          </View>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Nothing here yet
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtitle}>
            Create your first song or poem to see it here.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.replace("/")}
            style={styles.emptyButton}
          >
            Start Creating
          </Button>
        </View>
      </Surface>
    );
  }

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
            {currentCreation.title}
          </Text>
          <Text variant="bodyMedium" style={styles.metadata}>
            {currentCreation.format} • {currentCreation.mood}
          </Text>
        </View>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="bodyLarge" style={styles.lyrics}>
              {currentCreation.content}
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },
  emptyButton: {
    borderRadius: 999,
    minWidth: 180,
  },
});
