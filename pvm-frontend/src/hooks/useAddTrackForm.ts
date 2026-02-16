import { useState } from 'react';
import { timeStringToMilliseconds } from '@/utils/time.utils';
import { TimeGoal } from '@/types/mappack.types';

export function useAddTrackForm() {
  const [trackUuid, setTrackUuid] = useState("");
  const [tmxId, setTmxId] = useState("");
  const [timeGoalValues, setTimeGoalValues] = useState<Record<number, string>>({});
  const [selectedTab, setSelectedTab] = useState("search");
  const [isLoading, setIsLoading] = useState(false);

  const handleTimeGoalChange = (timeGoalId: number, value: string) => {
    setTimeGoalValues(prev => ({
      ...prev,
      [timeGoalId]: value
    }));
  };

  const getTrackId = (): string => {
    return trackUuid;
  };

  const getTimeGoalsWithValues = (timeGoals: TimeGoal[]) => {
    return timeGoals
      .filter(tg => tg.id)
      .filter(tg => timeGoalValues[tg.id!] && timeGoalValues[tg.id!].trim() !== "")
      .map(tg => ({
        time_goal_id: tg.id!,
        time: timeStringToMilliseconds(timeGoalValues[tg.id!]),
      }));
  };

  const resetForm = () => {
    setTrackUuid("");
    setTmxId("");
    setTimeGoalValues({});
  };

  const validateForm = (): { isValid: boolean; error?: string } => {
    if (!trackUuid.trim()) {
      return { isValid: false, error: "Track UUID is required" };
    }
    if (!tmxId.trim()) {
      return { isValid: false, error: "TMX ID is required" };
    }
    return { isValid: true };
  };

  return {
    trackUuid,
    tmxId,
    timeGoalValues,
    selectedTab,
    isLoading,
    setTrackUuid,
    setTmxId,
    setSelectedTab,
    setIsLoading,
    handleTimeGoalChange,
    getTrackId,
    getTimeGoalsWithValues,
    resetForm,
    validateForm,
  };
}