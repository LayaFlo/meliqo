import type { GeneratedCreation } from "@/src/types/creation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  deleteSavedCreation,
  getSavedCreations,
  saveCreation,
} from "../creationStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockCreation: GeneratedCreation = {
  id: "test-id-1",
  title: "Test Song",
  content: "Test lyrics content",
  format: "song",
  mood: "dreamy",
  prompt: "test prompt",
  createdAt: "2024-01-01T00:00:00.000Z",
};

const mockCreation2: GeneratedCreation = {
  id: "test-id-2",
  title: "Test Poem",
  content: "Test poem content",
  format: "poem",
  mood: "sad",
  prompt: "another prompt",
  createdAt: "2024-01-02T00:00:00.000Z",
};

describe("creationStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockClear();
    (AsyncStorage.setItem as jest.Mock).mockClear();
  });

  describe("getSavedCreations", () => {
    it("should return empty array when no saved creations exist", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getSavedCreations();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "meliqo:saved-creations",
      );
      expect(result).toEqual([]);
    });

    it("should return parsed creations when they exist", async () => {
      const storedCreations = [mockCreation, mockCreation2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(storedCreations),
      );

      const result = await getSavedCreations();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "meliqo:saved-creations",
      );
      expect(result).toEqual(storedCreations);
    });

    it("should throw when stored JSON is invalid", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("invalid json");

      await expect(getSavedCreations()).rejects.toThrow();
    });
  });

  describe("saveCreation", () => {
    it("should save creation when no existing creations exist", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await saveCreation(mockCreation);

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "meliqo:saved-creations",
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "meliqo:saved-creations",
        JSON.stringify([mockCreation]),
      );
      expect(result).toEqual([mockCreation]);
    });

    it("should prepend new creation to existing creations", async () => {
      const existingCreations = [mockCreation2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingCreations),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await saveCreation(mockCreation);

      const expectedCreations = [mockCreation, mockCreation2];
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "meliqo:saved-creations",
        JSON.stringify(expectedCreations),
      );
      expect(result).toEqual(expectedCreations);
    });

    it("should replace existing creation with same ID", async () => {
      const existingCreations = [mockCreation, mockCreation2];
      const updatedCreation = {
        ...mockCreation,
        title: "Updated Title",
        content: "Updated content",
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingCreations),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await saveCreation(updatedCreation);

      const expectedCreations = [updatedCreation, mockCreation2];
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "meliqo:saved-creations",
        JSON.stringify(expectedCreations),
      );
      expect(result).toEqual(expectedCreations);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(updatedCreation);
      expect(result[1]).toEqual(mockCreation2);
    });

    it("should handle multiple creations with different IDs", async () => {
      const existingCreations = [mockCreation];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingCreations),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await saveCreation(mockCreation2);

      const expectedCreations = [mockCreation2, mockCreation];
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "meliqo:saved-creations",
        JSON.stringify(expectedCreations),
      );
      expect(result).toEqual(expectedCreations);
    });

    it("should maintain order when saving existing creation", async () => {
      const existingCreations = [mockCreation2, mockCreation];
      const updatedCreation = {
        ...mockCreation,
        title: "Updated Song",
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingCreations),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await saveCreation(updatedCreation);

      const expectedCreations = [updatedCreation, mockCreation2];
      expect(result).toEqual(expectedCreations);
      expect(result[0].id).toBe("test-id-1");
      expect(result[1].id).toBe("test-id-2");
    });
  });

  describe("deleteSavedCreation", () => {
    it("should delete a saved creation by ID", async () => {
      const existingCreations = [mockCreation, mockCreation2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingCreations),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await deleteSavedCreation(mockCreation.id);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "meliqo:saved-creations",
        JSON.stringify([mockCreation2]),
      );
      expect(result).toEqual([mockCreation2]);
    });

    it("should keep saved creations unchanged when deleting an unknown ID", async () => {
      const existingCreations = [mockCreation, mockCreation2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingCreations),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await deleteSavedCreation("missing-id");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "meliqo:saved-creations",
        JSON.stringify(existingCreations),
      );
      expect(result).toEqual(existingCreations);
    });

    it("should return empty array after deleting the only saved creation", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([mockCreation]),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await deleteSavedCreation(mockCreation.id);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "meliqo:saved-creations",
        JSON.stringify([]),
      );
      expect(result).toEqual([]);
    });
  });
});
