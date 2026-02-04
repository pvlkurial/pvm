"use client";
import React, { useState, useEffect, use } from "react";
import axios from "axios";
import RecordsTable from "@/app/_components/RecordsTable";
import { Card, CardBody, Divider, Image, Chip } from "@heroui/react";
import { FaRoute } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";
import { FaTrophy, FaClock } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa";
import { toTimeFromMilliseconds } from "@/app/_utils/converters";
import { FormattedText } from "@/app/_utils/textConverter";

interface Player {
  ID: string;
  name: string;
}

interface TimeGoal {
  name: string;
  time: number;
}

interface MappackTier {
  id?: number;
  name: string;
  mappack_id: string;
  points: number;
  color: string;
}

interface Record {
  mapRecordId: string;
  score: number;
  updatedAt: string;
  zoneName: string;
  position: number;
  timestamp: number;
  player: Player;
}

interface Track {
  id: string;
  mapId: string;
  mapUid: string;
  name: string;
  author: string;
  authorName: string;
  submitter: string;
  authorScore: number;
  goldScore: number;
  silverScore: number;
  bronzeScore: number;
  collectionName: string;
  filename: string;
  mapType: string;
  mapStyle: string;
  isPlayable: boolean;
  createdWithGamepadEditor: boolean;
  createdWithSimpleEditor: boolean;
  timestamp: string;
  fileUrl: string;
  thumbnailUrl: string;
  time: number;
  tier: MappackTier;
  updatedAt: string;
  records: Record[];
  timegoals: TimeGoal[];
  dominantColor: string;
}

const millisecondsToTimeString = (ms: number): string => {
  if (!ms || ms === 0) return "";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  return `${minutes}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
};

export default function Track({
  params,
}: {
  params: Promise<{ mappack: string; track: string }>;
}) {
  const { mappack, track: trackId } = use(params);
  const [trackData, setTrackData] = useState<Track | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/mappacks/${mappack}/tracks/${trackId}`)
      .then((response) => setTrackData(response.data))
      .catch((err) => {
        console.log("Error details:", err.message, err.config);
      });
  }, [mappack, trackId]);

  if (!trackData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-ruigslay text-white/70 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[90rem] mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid lg:grid-cols-[500px_1fr] gap-6 mb-8">
        {/* Track Image - Square, matches right side height */}
        <div className="relative group w-full h-full">
          <div
            className="relative rounded-2xl overflow-hidden aspect-square w-full h-full"
            style={{
              boxShadow: `0 25px 100px 0px rgba(${parseInt(
                trackData.dominantColor.slice(0, 2),
                16,
              )}, ${parseInt(
                trackData.dominantColor.slice(2, 4),
                16,
              )}, ${parseInt(trackData.dominantColor.slice(4, 6), 16)}, 0.9)`,
            }}
          >
            <Image
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              alt="Track Thumbnail"
              src={trackData.thumbnailUrl}
              removeWrapper
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
        </div>

        {/* Info Cards */}
        <div className="flex flex-col gap-6">
          {/* Track Name Card with Gradient */}
          <Card
            className="relative overflow-hidden border border-white/10"
            style={{
              background: `linear-gradient(135deg, #${trackData.dominantColor}, #${trackData.dominantColor}10)`,
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[size:20px_20px]" />
            <FaRoute className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 text-white/5 rotate-12" />

            <CardBody className="p-8 relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    <FormattedText text={trackData.name} />
                  </h1>
                  <p className="text-xl text-neutral-400 font-ruigslay flex items-center gap-2">
                    <span className="text-white/50">by</span>{" "}
                    {trackData.authorName}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Tier Card - First iteration style */}
            <Card
              className="relative overflow-hidden border-2"
              style={{
                borderColor: `${trackData.tier?.color || "#666"}40`,
                background: `linear-gradient(135deg, #${trackData.dominantColor}20, ${trackData.tier?.color || "#666"}20)`,
              }}
            >
              <IoDiamond className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 rotate-45" />
              <CardBody className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <IoDiamond className="w-5 h-5 opacity-70" />
                  <p className="text-sm uppercase tracking-wider text-white/70 font-semibold">
                    Difficulty Tier
                  </p>
                </div>
                <h2 className="text-4xl font-bold font-ruigslay">
                  {trackData.tier?.name || "Unranked"}
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  {trackData.tier?.points || 0} points
                </p>
              </CardBody>
            </Card>

            {/* Records Card */}
            <Card className="bg-neutral-800 relative overflow-hidden">
              <FaDatabase className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 opacity-30" />
              <CardBody className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <FaDatabase className="w-4 h-4 opacity-70" />
                  <p className="text-sm uppercase tracking-wider text-white/70 font-semibold">
                    Records Tracked
                  </p>
                </div>
                <h2 className="text-4xl font-bold font-ruigslay">
                  {trackData.records?.length || 0}
                </h2>
                <p className="text-sm text-white/50 mt-1">Total submissions</p>
              </CardBody>
            </Card>
          </div>

          {/* Time Goals Card */}
          <Card className="bg-neutral-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[size:16px_16px]" />
            <FaTrophy className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 text-white/10 opacity-30" />

            <CardBody className="p-6 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <FaTrophy className="w-5 h-5 text-yellow-500/70" />
                <h3 className="text-2xl font-ruigslay font-bold">Time Goals</h3>
              </div>

              {trackData.timegoals.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {trackData.timegoals.map((goal, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-105"
                    >
                      <p className="text-xs uppercase tracking-wider text-white/60 mb-2 font-semibold">
                        {goal.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <FaClock className="w-3 h-3 text-white/40" />
                        <p className="text-xl font-bold font-mono">
                          {millisecondsToTimeString(goal.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/50 text-lg">
                    No time goals set for this track
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Records Table Section */}
      <Card className="bg-neutral-800">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaDatabase className="w-6 h-6 text-blue-500/70" />
            <h3 className="text-3xl font-ruigslay font-bold">Leaderboard</h3>
          </div>
          <RecordsTable records={trackData.records} />
        </CardBody>
      </Card>
    </div>
  );
}
