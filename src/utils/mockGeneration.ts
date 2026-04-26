import type {
  CreationFormat,
  CreationMood,
  GeneratedCreation,
} from "@/src/types/creation";

export function createMockGeneration(params: {
  prompt: string;
  format: CreationFormat;
  mood: CreationMood;
}): GeneratedCreation {
  return {
    id: Date.now().toString(),
    title: "Midnight Echo",
    prompt: params.prompt.trim(),
    format: params.format,
    mood: params.mood,
    createdAt: new Date().toISOString(),
    content: `Verse 1
I found your words beneath the city rain
A little moonlight calling out my name

Chorus
We turn the silence into something true
A song that starts and ends with you`,
  };
}
