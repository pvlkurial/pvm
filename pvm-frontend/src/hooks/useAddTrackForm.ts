import { useState } from "react";
import { timeStringToMilliseconds } from "@/utils/time.utils";
import { TimeGoal } from "@/types/mappack.types";

export function useAddTrackForm() {
  const [trackUuid, setTrackUuid] = useState("");
  const [tmxId, setTmxId] = useState("");
  const [timeGoalValues, setTimeGoalValues] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleTimeGoalChange = (timeGoalId: number, value: string) => {
    setTimeGoalValues((prev) => ({ ...prev, [timeGoalId]: value }));
  };

  /** The entered goal times in milliseconds, skipping goals left blank. */
  const getTimeGoalsWithValues = (timeGoals: TimeGoal[]) =>
    timeGoals
      .filter((tg) => tg.id && timeGoalValues[tg.id]?.trim())
      .map((tg) => ({
        time_goal_id: tg.id!,
        time: timeStringToMilliseconds(timeGoalValues[tg.id!]),
      }));

  const resetForm = () => {
    setTrackUuid("");
    setTmxId("");
    setTimeGoalValues({});
  };

  /** Returns an error message, or null when the form can be submitted. */
  const validate = (): string | null => {
    if (!trackUuid.trim()) return "Track UUID is required";
    if (!tmxId.trim()) return "TMX ID is required";
    return null;
  };

  return {
    trackUuid,
    tmxId,
    timeGoalValues,
    isLoading,
    setTrackUuid,
    setTmxId,
    setIsLoading,
    handleTimeGoalChange,
    getTimeGoalsWithValues,
    resetForm,
    validate,
  };
}
