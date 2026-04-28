import {
  CREATION_FORMAT_LABELS,
  CREATION_MOOD_LABELS,
  type CreationFormat,
  type CreationMood,
} from "@/src/types/creation";
import { StyleProp, TextStyle } from "react-native";
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
    <Text variant="bodyMedium" style={style}>
      {CREATION_FORMAT_LABELS[format]} • {CREATION_MOOD_LABELS[mood]}
    </Text>
  );
}
