"use client"
import React, { useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";
import RecordsTable from "@/app/_components/RecordsTable";
import { Card, CardBody, Divider, Image } from "@heroui/react";
import { FaRoute } from 'react-icons/fa';
import { IoDiamond } from "react-icons/io5";
import { FaTrophy } from "react-icons/fa";
import { FaDatabase } from 'react-icons/fa';
import { toTimeFromMilliseconds } from "@/app/_utils/converters";

interface TimeGoal {
  name: string;
  time: number;
}

interface Record {
  mapRecordId: string;
  score: number;
  updatedAt: string;
  zoneName: string;
  position: number;
  timestamp: number;
  playerName: string;
}

interface Track {
  id: string;
  mapId: string;
  mapUid: string;
  name: string;
  author: string;
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
  tier: string;
  updatedAt: string;
  records: Record[];
  timegoals: TimeGoal[];
}

export default function Track({
  params,
}: {
  params: Promise<{ mappack: string, track: string }>
}) {
  const { mappack, track: trackId } = use(params);
  const [trackData, setTrackData] = useState<Track | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/mappacks/${mappack}/tracks/${trackId}`)
      .then(response => setTrackData(response.data))
      .catch(err => {
        console.log('Error details:', err.message, err.config);
      });
  }, [mappack, trackId]);

  if (!trackData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:max-w-[80%] mx-auto">
      <div className="flex relative gap-4 p-2 md:p-6 max-xl:flex-col">
        <div className="w-full md:w-1/3 xl:pl-0 pl-5">
          <Image
            className="w-full h-full object-cover transition-transform hover:scale-110 duration-300 hover:z-20 transform-gpu"
            alt="Track Thumbnail"
            src={trackData.thumbnailUrl}
            width={500}
          />
        </div>
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <Card className="sm:col-span-2 relative bg-neutral-800 p-6 rounded-lg bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:12px_12px] z-2">
            <FaRoute className="absolute inset-0 w-1/3 h-full text-white-300/50 opacity-30 p-2 items-start rotate-3 scale-130 z-5" />
            <div className="relative z-10">
              <h1 className="text-4xl font-bold">{trackData.name}</h1>
              <p className="text-neutral-400 font-ruigslay ">{trackData.author}</p>
            </div>
          </Card>
          <Card className="bg-linear-to-r to-neutral-800 from-lime-900 p-6 rounded-lg justify-between">
            <IoDiamond className="absolute inset-0 w-1/3 h-full text-white-300/50 opacity-30 p-2 items-end rotate-0 scale-150" />
            <p className="text-sm">Tier</p>
            <h2 className="text-4xl font-bold font-ruigslay">{trackData.tier || 'N/A'}</h2>
          </Card>
          <Card className="bg-neutral-800 p-6 rounded-lg justify-between">
            <FaDatabase className="absolute inset-0 w-1/3 h-full text-white-300/50 opacity-30 p-2 items-start" />
            <p className="text-sm">Records Tracked</p>
            <h2 className="text-4xl font-bold font-ruigslay">{trackData.records.length}</h2>
          </Card>
          <Card className="md:col-span-2 bg-neutral-800 p-6 rounded-lg justify-between rounded-lg bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:12px_12px] z-2">
            <FaTrophy className="absolute inset-0 w-1/3 h-full text-white-300/50 opacity-30 p-2 items-start rotate-0 scale-140" />
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <p className="text-4xl font-ruigslay">Time Goals</p>
              <div className="flex-1 h-[10px] bg-neutral-300"></div>
            </div>
            <div className="flex gap-0 justify-between">
              {trackData.timegoals.length > 0 ? (
                trackData.timegoals.map((goal, index) => (
                  <div key={index} className="text-center">
                    <p className="text-md font-bold">{goal.name}</p>
                    <h2 className="lg:text-2xl text-lg font-bold">{toTimeFromMilliseconds(goal.time)}</h2>
                  </div>
                ))
              ) : (
                <h2 className="text-2xl font-bold">No time goals set</h2>
              )}
            </div>
          </Card>
        </div>
      </div>
      <div className="flex grid grid-col-1 md:p-5 p-0 lg:p-5">
        <RecordsTable records={trackData.records}></RecordsTable>
      </div>
    </div>
  );
}