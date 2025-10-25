"use client"
import React, { useState, useEffect, use } from "react";
import axios from "axios";
import TrackCard from "@/app/_components/TrackCard";

interface Track {
    id: string;
    name: string;
    author: string;
    thumbnailUrl: string;
}

export default function Mappack({
    params,
}: {
    params: Promise<{ mappack: string }>
}) {
    const { mappack } = use(params);
    const [tracks, setTracks] = useState([]);
    const [timeGoalsByTrack, setTimeGoalsByTrack] = useState({});
    const [timeGoalDefinitions, setTimeGoalDefinitions] = useState([]);
    const [loading, setLoading] = useState(true);
      useEffect(() => {
        const fetchData = async () => {
            try {
                const [tracksRes, timeGoalsDefsRes] = await Promise.all([
                    axios.get(`http://localhost:8080/mappacks/${mappack}/tracks`),
                    axios.get(`http://localhost:8080/mappacks/${mappack}/timegoals`)
                ]);

                const tracksData = tracksRes.data;
                setTracks(tracksData);
                setTimeGoalDefinitions(timeGoalsDefsRes.data);

                const timeGoalsPromises = tracksData.map(track =>
                    axios.get(`http://localhost:8080/mappacks/${mappack}/tracks/${track.id}/timegoals`)
                        .then(res => ({ trackId: track.id, timeGoals: res.data }))
                        .catch(err => {
                            console.log(`Error fetching time goals for track ${track.id}:`, err);
                            return { trackId: track.id, timeGoals: [] };
                        })
                );

                const timeGoalsResults = await Promise.all(timeGoalsPromises);

                const timeGoalsMap = timeGoalsResults.reduce((acc, { trackId, timeGoals }) => {
                    acc[trackId] = timeGoals;
                    return acc;
                }, {});

                setTimeGoalsByTrack(timeGoalsMap);
            } catch (err) {
                console.log('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mappack]);
  return (
    <span>
      <h1>Tracks of this mappack</h1>
      <div className="flex grid grid-cols-2 md:grid-cols-4 gap-3 p-10">
        {tracks.map((track: Track) => (
          <TrackCard 
            key={track.id} 
            track={track} 
            timeGoals={timeGoalsByTrack[track.id] || []}
            timeGoalDefinitions={timeGoalDefinitions}
            mappackId={mappack}
          />
        ))}
      </div>
    </span>
  );
}
