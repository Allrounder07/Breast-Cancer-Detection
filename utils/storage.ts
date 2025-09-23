
/**
 * A utility for interacting with localStorage in a type-safe and robust manner.
 */
export const storage = {
  /**
   * Retrieves an item from localStorage and parses it as JSON.
   * @param key The key of the item to retrieve.
   * @param defaultValue The default value to return if the item doesn't exist or is invalid.
   * @returns The parsed item, or the default value if an error occurs.
   */
  get<T>(key: string, defaultValue: T): T {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) {
        return defaultValue;
      }
      return JSON.parse(storedValue) as T;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      // If parsing fails, it's safer to return the default value.
      return defaultValue;
    }
  },

  /**
   * Serializes a value to JSON and stores it in localStorage.
   * @param key The key under which to store the item.
   * @param value The value to store.
   */
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
      // This could happen if storage is full.
    }
  },
};
