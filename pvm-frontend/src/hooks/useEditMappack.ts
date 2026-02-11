// hooks/useEditMappack.ts
import { useState, useEffect } from 'react';
import { Mappack, TimeGoal, MappackTier, MappackRank } from '@/types/mappack.types';
import { timeStringToMilliseconds } from '@/utils/time.utils';

export function useEditMappack(mappack: Mappack | null, isOpen: boolean) {
  const [editData, setEditData] = useState<Mappack | null>(null);
  const [timeInputValues, setTimeInputValues] = useState<Record<string, Record<number, string>>>({});

  useEffect(() => {
    if (isOpen && mappack) {
      const deepCopy = JSON.parse(JSON.stringify(mappack));
      
      const sanitizedData = {
        ...deepCopy,
        timeGoals: deepCopy.timeGoals || [],
        mappackTiers: deepCopy.mappackTiers || [],
        mappackRanks: deepCopy.mappackRanks || [],
        MappackTrack: (deepCopy.MappackTrack || []).map((track: any) => ({
          ...track,
          timeGoalMappackTrack: track.timeGoalMappackTrack || [],
          tier: track.tier || null,
          mapStyle: track.mapStyle || null,
          tier_id: track.tier_id || null,
        })),
      };

      setEditData(sanitizedData);
    }
  }, [isOpen, mappack]);

  const addTimeGoal = () => {
    if (!editData) return;
    setEditData({
      ...editData,
      timeGoals: [
        ...editData.timeGoals,
        {
          name: "",
          mappack_id: editData.id,
          multiplier: 1,
        },
      ],
    });
  };

  const updateTimeGoal = (index: number, field: keyof TimeGoal, value: string | number) => {
    if (!editData) return;
    setEditData({
      ...editData,
      timeGoals: editData.timeGoals.map((tg, i) =>
        i === index ? { ...tg, [field]: value } : tg
      ),
    });
  };

  const removeTimeGoalFromState = (id: number | undefined) => {
    if (!editData) return;
    if (!id) {
      setEditData({
        ...editData,
        timeGoals: editData.timeGoals.slice(0, -1),
      });
    } else {
      setEditData({
        ...editData,
        timeGoals: editData.timeGoals.filter((tg) => tg.id !== id),
        MappackTrack: editData.MappackTrack.map((track) => ({
          ...track,
          timeGoalMappackTrack: track.timeGoalMappackTrack.filter(
            (tgmt) => tgmt.time_goal_id !== id
          ),
        })),
      });
    }
  };

  const addTier = () => {
    if (!editData) return;
    const newTier: MappackTier = {
      name: "",
      mappack_id: editData.id,
      points: 0,
      color: "#ffffff",
    };
    setEditData({
      ...editData,
      mappackTiers: [...editData.mappackTiers, newTier],
    });
  };

  const updateTier = (index: number, field: keyof MappackTier, value: string | number) => {
    if (!editData) return;
    const updatedTiers = editData.mappackTiers.map((tier, i) =>
      i === index ? { ...tier, [field]: value } : tier
    );
    setEditData({
      ...editData,
      mappackTiers: updatedTiers,
    });
  };

  const removeTierFromState = (id: number | undefined) => {
    if (!editData) return;
    if (!id) {
      setEditData({
        ...editData,
        mappackTiers: editData.mappackTiers.slice(0, -1),
      });
    } else {
      setEditData({
        ...editData,
        mappackTiers: editData.mappackTiers.filter((t) => t.id !== id),
        MappackTrack: editData.MappackTrack.map((track) =>
          track.tier_id === id
            ? { ...track, tier_id: null, tier: null }
            : track
        ),
      });
    }
  };

  const addRank = () => {
    if (!editData) return;
    const newRank: MappackRank = {
      name: "",
      mappack_id: editData.id,
      pointsNeeded: 0,
      color: "#ffffff",
      backgroundGlow: false,
      invertedColor: false,
      textShadow: false,
      glowIntensity: 50,
      borderWidth: 2,
      borderColor: null,
      symbolsAround: null,
      animationType: "none",
      cardStyle: "normal",
      backgroundPattern: "none",
      fontSize: "normal",
      fontWeight: "normal",
    };
    setEditData({
      ...editData,
      mappackRanks: [...editData.mappackRanks, newRank],
    });
  };

  const updateRank = (
    index: number,
    field: keyof MappackRank,
    value: string | number | boolean | null
  ) => {
    if (!editData) return;
    const updatedRanks = editData.mappackRanks.map((rank, i) =>
      i === index ? { ...rank, [field]: value } : rank
    );
    setEditData({
      ...editData,
      mappackRanks: updatedRanks,
    });
  };

  const removeRankFromState = (id: number | undefined) => {
    if (!editData) return;
    if (!id) {
      setEditData({
        ...editData,
        mappackRanks: editData.mappackRanks.slice(0, -1),
      });
    } else {
      setEditData({
        ...editData,
        mappackRanks: editData.mappackRanks.filter((r) => r.id !== id),
      });
    }
  };

  const assignTierToTrack = (trackId: string, tierId: number | null) => {
    if (!editData) return;
    const tier = tierId
      ? editData.mappackTiers.find((t) => t.id === tierId)
      : null;
    setEditData({
      ...editData,
      MappackTrack: editData.MappackTrack.map((track) =>
        track.track_id === trackId
          ? { ...track, tier_id: tierId, tier: tier || null }
          : track
      ),
    });
  };

  const updateTrackTime = (trackId: string, timeGoalId: number, timeString: string) => {
    if (!editData) return;
    
    setTimeInputValues((prev) => ({
      ...prev,
      [trackId]: {
        ...(prev[trackId] || {}),
        [timeGoalId]: timeString,
      },
    }));

    const milliseconds = timeStringToMilliseconds(timeString);

    setEditData({
      ...editData,
      MappackTrack: editData.MappackTrack.map((track) => {
        if (track.track_id !== trackId) return track;

        const existingIndex = track.timeGoalMappackTrack.findIndex(
          (tgmt) => tgmt.time_goal_id === timeGoalId
        );

        if (existingIndex >= 0) {
          return {
            ...track,
            timeGoalMappackTrack: track.timeGoalMappackTrack.map((tgmt, i) =>
              i === existingIndex ? { ...tgmt, time: milliseconds } : tgmt
            ),
          };
        } else {
          return {
            ...track,
            timeGoalMappackTrack: [
              ...track.timeGoalMappackTrack,
              {
                track_id: trackId,
                mappack_id: editData.id,
                time_goal_id: timeGoalId,
                time: milliseconds,
              },
            ],
          };
        }
      }),
    });
  };

  const updateMapStyle = (trackId: string, mapStyle: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      MappackTrack: editData.MappackTrack.map((t) =>
        t.track_id === trackId
          ? { ...t, mapStyle: mapStyle || null }
          : t
      ),
    });
  };

  const removeTrackFromState = (trackId: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      MappackTrack: editData.MappackTrack.filter((t) => t.track_id !== trackId),
    });
  };

  return {
    editData,
    setEditData,
    timeInputValues,
    addTimeGoal,
    updateTimeGoal,
    removeTimeGoalFromState,
    addTier,
    updateTier,
    removeTierFromState,
    addRank,
    updateRank,
    removeRankFromState,
    assignTierToTrack,
    updateTrackTime,
    updateMapStyle,
    removeTrackFromState,
  };
}