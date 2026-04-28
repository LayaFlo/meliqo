import { type GeneratedCreation } from "@/src/types/creation";
import { Share } from "react-native";

export async function shareCreation(creation: GeneratedCreation) {
  const message = `Check out my ${creation.format} created with Meliqo!\n\nTitle: ${creation.title}\nMood: ${creation.mood}\n\n${creation.content}`;

  return Share.share({
    title: creation.title,
    message,
  });
}
