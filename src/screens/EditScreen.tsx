import { useCreation } from "@/src/context/CreationContext";
import { theme } from "@/src/theme/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";

export default function EditScreen() {
  const router = useRouter();
  const { currentCreation, setCurrentCreation } = useCreation();

  const [content, setContent] = useState(currentCreation?.content ?? "");

  const handleSave = () => {
    if (!currentCreation) return;

    setCurrentCreation({
      ...currentCreation,
      content,
    });

    router.back();
  };

  if (!currentCreation) {
    return (
      <Surface style={styles.container}>
        <View style={styles.emptyState}>
          <Text variant="headlineSmall">Nothing to edit</Text>
          <Button mode="contained" onPress={() => router.replace("/")}>
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
        <Text variant="headlineMedium" style={styles.title}>
          Edit your creation
        </Text>
        <TextInput
          mode="outlined"
          label="Lyrics"
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          contentStyle={styles.buttonContent}
        >
          Save Changes
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
  title: {
    fontWeight: "700",
    marginBottom: 24,
  },
  input: {
    minHeight: 300,
    backgroundColor: theme.colors.surface,
  },
  saveButton: {
    marginTop: 24,
  },
  buttonContent: {
    height: 48,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 24,
  },
});
