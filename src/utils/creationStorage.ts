import type { GeneratedCreation } from "@/src/types/creation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVED_CREATIONS_KEY = "meliqo:saved-creations";

export async function getSavedCreations(): Promise<GeneratedCreation[]> {
  const value = await AsyncStorage.getItem(SAVED_CREATIONS_KEY);

  if (!value) {
    return [];
  }

  return JSON.parse(value) as GeneratedCreation[];
}

export async function saveCreation(
  creation: GeneratedCreation,
): Promise<GeneratedCreation[]> {
  const existingCreations = await getSavedCreations();

  const updatedCreations = [
    creation,
    ...existingCreations.filter((item) => item.id !== creation.id),
  ];

  await AsyncStorage.setItem(
    SAVED_CREATIONS_KEY,
    JSON.stringify(updatedCreations),
  );

  return updatedCreations;
}

export async function deleteSavedCreation(
  id: string,
): Promise<GeneratedCreation[]> {
  const existingCreations = await getSavedCreations();

  const updatedCreations = existingCreations.filter((item) => item.id !== id);

  await AsyncStorage.setItem(
    SAVED_CREATIONS_KEY,
    JSON.stringify(updatedCreations),
  );

  return updatedCreations;
}
