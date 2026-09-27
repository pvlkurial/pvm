import { useState } from "react";

/**
 * State mirrored to localStorage under `key`. Values are stored as plain strings
 * (String(value)), and setting null removes the key.
 */
export function useStoredState<T>(
  key: string,
  fallback: T,
  parse: (raw: string) => T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return fallback;
    const stored = localStorage.getItem(key);
    return stored !== null ? parse(stored) : fallback;
  });

  const setStoredValue = (next: T) => {
    setValue(next);
    if (next === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, String(next));
    }
  };

  return [value, setStoredValue];
}
