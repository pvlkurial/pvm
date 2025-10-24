"use client"
import React, { useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";

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
  useEffect(() => {
  axios.get('http://localhost:8080/mappacks/' + mappack + '/tracks')
    .then(response => setTracks(response.data))
    .catch(err => {
    console.log('Error details:', err.message, err.config);})
  }, []);
  return (
    <span>
      <h1>Welcome to the Mappack Manager</h1>
      <ul>
        {tracks.map((track: Track) => (
          <Link key={track.id} href={track.id} className="">{track.name}
            <img src={track.thumbnailUrl} alt={track.name} />
          </Link>
        ))}
      </ul>
    </span>
  );
}
