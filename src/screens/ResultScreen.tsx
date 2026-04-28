import { CreationMetadata } from "@/src/components/CreationMetadata";
import { useCreation } from "@/src/context/CreationContext";
import { theme } from "@/src/theme/theme";
import { REFINEMENT_LABELS, RefinementType } from "@/src/types/creation";
import { shareCreation } from "@/src/utils/shareCreation";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Icon,
  IconButton,
  Surface,
  Text,
} from "react-native-paper";

export default function ResultScreen() {
  const router = useRouter();
  const {
    currentCreation,
    saveCurrentCreation,
    regenerateCurrentCreation,
    refineCurrentCreation,
  } = useCreation();

  const refinementOptions: RefinementType[] = [
    "softer",
    "darker",
    "poetic",
    "shorter",
  ];

  const handleRegenerate = () => {
    regenerateCurrentCreation?.();
  };

  const handleSave = async () => {
    await saveCurrentCreation();
  };

  const handleShare = async () => {
    if (!currentCreation) return;

    await shareCreation(currentCreation);
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
          <CreationMetadata
            format={currentCreation.format}
            mood={currentCreation.mood}
          />
        </View>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="bodyLarge" style={styles.lyrics}>
              {currentCreation.content}
            </Text>
          </Card.Content>
        </Card>
        <View style={styles.refinementSection}>
          <Text variant="titleSmall" style={styles.refinementTitle}>
            Refine with AI
          </Text>
          <View style={styles.refinementRow}>
            {refinementOptions.map((option) => (
              <Chip
                key={option}
                onPress={() => refineCurrentCreation(option)}
                style={styles.refinementChip}
              >
                {REFINEMENT_LABELS[option]}
              </Chip>
            ))}
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            testID="action-button"
            mode="contained"
            onPress={() => router.push("/edit")}
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
            <Button
              mode="outlined"
              onPress={handleShare}
              style={styles.secondaryButton}
            >
              Share
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
  card: {
    marginBottom: 32,
  },
  lyrics: {
    lineHeight: 30,
  },
  refinementSection: {
    marginBottom: 28,
  },
  refinementTitle: {
    marginBottom: 12,
    color: theme.colors.onSurfaceVariant,
  },
  refinementRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  refinementChip: {
    backgroundColor: theme.colors.surfaceVariant,
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
