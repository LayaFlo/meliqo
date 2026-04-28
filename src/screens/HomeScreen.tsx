import { useCreation } from "@/src/context/CreationContext";
import { theme } from "@/src/theme/theme";
import {
  CREATION_FORMAT_LABELS,
  CREATION_FORMATS,
  CREATION_MOOD_LABELS,
  CREATION_MOODS,
  type CreationFormat,
  type CreationMood,
} from "@/src/types/creation";
import { createMockGeneration } from "@/src/utils/mockGeneration";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, Surface, Text, TextInput } from "react-native-paper";

export default function HomeScreen() {
  const router = useRouter();
  const { setCurrentCreation } = useCreation();
  const [userInput, setUserInput] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<CreationFormat>("song");
  const [selectedMood, setSelectedMood] = useState<CreationMood>("dreamy");

  const isGenerateDisabled = userInput.trim() === "";

  const handleGenerate = () => {
    const creation = createMockGeneration({
      prompt: userInput,
      format: selectedFormat,
      mood: selectedMood,
    });

    setCurrentCreation(creation);

    router.push("/result");
  };

  return (
    <Surface style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text variant="headlineLarge" style={styles.title}>
              Meliqo
            </Text>
            <Button compact onPress={() => router.push("/saved")}>
              Saved
            </Button>
          </View>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Turn scattered thoughts into songs, poems, and lyrical stories.
          </Text>
        </View>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            What should we write from?
          </Text>
          <TextInput
            mode="outlined"
            label="Your words or thoughts"
            placeholder="moonlight, city rain, missing someone..."
            value={userInput}
            onChangeText={setUserInput}
            multiline
            numberOfLines={5}
            style={styles.input}
          />
        </View>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Choose a format
          </Text>
          <View style={styles.chipRow}>
            {CREATION_FORMATS.map((format) => (
              <Chip
                key={format}
                selected={selectedFormat === format}
                onPress={() => setSelectedFormat(format)}
                style={[
                  styles.chip,
                  selectedFormat === format && styles.selectedChip,
                ]}
              >
                {CREATION_FORMAT_LABELS[format]}
              </Chip>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Choose a mood
          </Text>
          <View style={styles.chipRow}>
            {CREATION_MOODS.map((mood) => (
              <Chip
                key={mood}
                selected={selectedMood === mood}
                onPress={() => setSelectedMood(mood)}
                style={[
                  styles.chip,
                  selectedMood === mood && styles.selectedChip,
                ]}
              >
                {CREATION_MOOD_LABELS[mood]}
              </Chip>
            ))}
          </View>
        </View>
        <Button
          testID="generate-button"
          mode="contained"
          disabled={isGenerateDisabled}
          onPress={handleGenerate}
          style={styles.generateButton}
          contentStyle={styles.generateButtonContent}
        >
          Create with AI
        </Button>
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
    paddingTop: 72,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    minHeight: 140,
    backgroundColor: theme.colors.surface,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  generateButton: {
    marginTop: "auto",
  },
  generateButtonContent: {
    height: 48,
  },
});
