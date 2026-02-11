import { useState } from 'react';
import { timeStringToMilliseconds } from '@/utils/time.utils';
import { TimeGoal } from '@/types/mappack.types';

export function useAddTrackForm() {
  const [trackUuid, setTrackUuid] = useState("");
  const [tmxId, setTmxId] = useState("");
  const [tierId, setTierId] = useState<number | null>(null);
  const [mapStyleName, setMapStyleName] = useState("");
  const [timeGoalValues, setTimeGoalValues] = useState<Record<number, string>>({});
  const [selectedTab, setSelectedTab] = useState("uuid");
  const [isLoading, setIsLoading] = useState(false);

  const handleTimeGoalChange = (timeGoalId: number, value: string) => {
    setTimeGoalValues(prev => ({
      ...prev,
      [timeGoalId]: value
    }));
  };

  const getTrackId = (): string => {
    return selectedTab === "uuid" ? trackUuid : tmxId;
  };

  const getTimeGoalsWithValues = (timeGoals: TimeGoal[]) => {
    return timeGoals
      .filter(tg => tg.id) // Filter out items without id
      .filter(tg => timeGoalValues[tg.id!] && timeGoalValues[tg.id!].trim() !== "")
      .map(tg => ({
        time_goal_id: tg.id!,
        time: timeStringToMilliseconds(timeGoalValues[tg.id!]),
      }));
  };

  const resetForm = () => {
    setTrackUuid("");
    setTmxId("");
    setTierId(null);
    setMapStyleName("");
    setTimeGoalValues({});
  };

  const validateForm = (): { isValid: boolean; error?: string } => {
    const trackId = getTrackId();
    if (!trackId) {
      return { isValid: false, error: "Track ID is required" };
    }
    if (!mapStyleName) {
      return { isValid: false, error: "Map Style is required" };
    }
    return { isValid: true };
  };

  return {
    trackUuid,
    tmxId,
    tierId,
    mapStyleName,
    timeGoalValues,
    selectedTab,
    isLoading,
    setTrackUuid,
    setTmxId,
    setTierId,
    setMapStyleName,
    setSelectedTab,
    setIsLoading,
    handleTimeGoalChange,
    getTrackId,
    getTimeGoalsWithValues,
    resetForm,
    validateForm,
  };
}