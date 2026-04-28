import { theme } from "@/src/theme/theme";
import {
  CREATION_FORMAT_LABELS,
  CREATION_MOOD_LABELS,
  type CreationFormat,
  type CreationMood,
} from "@/src/types/creation";
import { type StyleProp, StyleSheet, type TextStyle } from "react-native";
import { Text } from "react-native-paper";

type CreationMetadataProps = {
  format: CreationFormat;
  mood: CreationMood;
  style?: StyleProp<TextStyle>;
};

export function CreationMetadata({
  format,
  mood,
  style,
}: CreationMetadataProps) {
  return (
    <Text variant="bodyMedium" style={[styles.metadata, style]}>
      {CREATION_FORMAT_LABELS[format]} • {CREATION_MOOD_LABELS[mood]}
    </Text>
  );
}

const styles = StyleSheet.create({
  metadata: {
    color: theme.colors.onSurfaceVariant,
  },
});
