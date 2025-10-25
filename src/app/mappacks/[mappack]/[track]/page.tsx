"use client"
import React, { useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";
import RecordsTable from "@/app/_components/RecordsTable";
import {Card, Image} from "@heroui/react";

interface Track {
    id: string;
    name: string;
    author: string;
    thumbnailUrl: string;
}
interface Record {
    mapRecordId: string;
    score: number;
    accountId: string;
}

export default function Track({
    params,
}: {
    params: Promise<{ mappack: string , track: string}>
}) {
const { mappack, track: trackId } = use(params);
const [records, setRecords] = useState([]);
const [track, setTrack] = useState(null);

useEffect(() => {
    axios.get(`http://localhost:8080/tracks/${trackId}/records`)
        .then(response => setRecords(response.data))
        .catch(err => {
            console.log('Error details:', err.message, err.config);
        });
    axios.get(`http://localhost:8080/tracks/${trackId}`)
        .then(response => setTrack(response.data))
        .catch(err => {
            console.log('Error details:', err.message, err.config);
        });
}, [trackId]);
    if (!track) {
        return <div>Loading...</div>;
    }

  return (
    <span>
      <h1>Records of track</h1>
      <div className="flex relative gap-4 p-10 max-xl:flex-col">
        <div className="w-full md:w-1/3 xl:pl-15">
        <Image className="w-full h-full object-cover
                          transition-transform hover:scale-110 duration-300 hover:z-20 transform-gpu" 
          alt="Track Thumbnail"
          src={track.thumbnailUrl}
          width={500}/>
          </div>
          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="sm:col-span-2 bg-gray-800 p-6 rounded-lg">
              <h1 className="text-3xl font-bold">{track.name}</h1>
              <p className="text-gray-400">By: {track.author}</p>
            </Card>
            <Card className="bg-red-900 p-6 rounded-lg">
              <p className="text-sm">Tier</p>
              <h2 className="text-4xl font-bold">S CLASS</h2>
            </Card>
            <Card className="bg-gray-800 p-6 rounded-lg">
              <p className="text-md">Records Tracked</p>
              <h2 className="text-2xl font-bold">{records.length}</h2>
            </Card>
            <Card className="md:col-span-2 bg-gray-800 p-6 rounded-lg">
              <p className="text-sm">Reached Time</p>
              <h2 className="text-4xl font-bold">ALIEN TIME</h2>
            </Card>
          </div>
      </div>
      <div className="flex grid grid-col-1m p-10">
      <RecordsTable records={records}></RecordsTable>
      </div>
    </span>
  );
}
