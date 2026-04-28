import type {
  CreationFormat,
  CreationMood,
  GeneratedCreation,
} from "@/src/types/creation";

const MOCK_TITLES = [
  "Midnight Echo",
  "Neon Moon",
  "City Rain",
  "Soft Static",
  "Paper Stars",
];

const MOCK_CONTENT = [
  `Verse 1
I found your words beneath the city rain
A little moonlight calling out my name

Chorus
We turn the silence into something true
A song that starts and ends with you`,

  `Verse 1
Your thoughts were sparks against the blue
A quiet storm I wandered through

Chorus
Say it softly, let it grow
Every word becomes a glow`,

  `Verse 1
The night was humming in your hands
Like broken dreams and distant bands

Chorus
We make a rhythm from the dark
And light the sky with one small spark`,
];

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createMockGeneration(params: {
  prompt: string;
  format: CreationFormat;
  mood: CreationMood;
}): GeneratedCreation {
  return {
    id: Date.now().toString(),
    title: getRandomItem(MOCK_TITLES),
    prompt: params.prompt.trim(),
    format: params.format,
    mood: params.mood,
    createdAt: new Date().toISOString(),
    content: getRandomItem(MOCK_CONTENT),
  };
}
