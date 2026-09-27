import { useState, useEffect } from "react";

export function useCooldown(key: string, cooldownSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  useEffect(() => {
    const cooldownEnd = localStorage.getItem(key);
    if (cooldownEnd) {
      const timeLeft = Math.max(0, parseInt(cooldownEnd) - Date.now());
      if (timeLeft > 0) {
        setSecondsLeft(Math.ceil(timeLeft / 1000));
        setIsOnCooldown(true);
      } else {
        localStorage.removeItem(key);
      }
    }
  }, [key]);

  useEffect(() => {
    if (!isOnCooldown || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsOnCooldown(false);
          localStorage.removeItem(key);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOnCooldown, secondsLeft, key]);

  /** Starts the cooldown, optionally for a length other than the default (e.g. one the server sent). */
  const startCooldown = (seconds: number = cooldownSeconds) => {
    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem(key, endTime.toString());
    setSecondsLeft(seconds);
    setIsOnCooldown(true);
  };

  return { isOnCooldown, secondsLeft, startCooldown };
}
