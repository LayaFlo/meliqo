export type CreationFormat = "song" | "poem" | "rap" | "haiku";

export type CreationMood = "dreamy" | "sad" | "romantic" | "funny" | "dark";

export const CREATION_FORMATS: CreationFormat[] = [
  "song",
  "poem",
  "rap",
  "haiku",
];

export const CREATION_MOODS: CreationMood[] = [
  "dreamy",
  "sad",
  "romantic",
  "funny",
  "dark",
];

export const CREATION_FORMAT_LABELS: Record<CreationFormat, string> = {
  song: "Song",
  poem: "Poem",
  rap: "Rap",
  haiku: "Haiku",
};

export const CREATION_MOOD_LABELS: Record<CreationMood, string> = {
  dreamy: "Dreamy",
  sad: "Sad",
  romantic: "Romantic",
  funny: "Funny",
  dark: "Dark",
};

export type GeneratedCreation = {
  id: string;
  title: string;
  content: string;
  format: CreationFormat;
  mood: CreationMood;
  prompt: string;
  createdAt: string;
};

export type RefinementType = "softer" | "darker" | "poetic" | "shorter";

export const REFINEMENT_LABELS: Record<RefinementType, string> = {
  softer: "Make it softer",
  darker: "Make it darker",
  poetic: "More poetic",
  shorter: "Shorter",
};
