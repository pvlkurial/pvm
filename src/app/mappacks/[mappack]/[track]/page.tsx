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
    const { mappack, track } = use(params);
    const [records, setRecords] = useState([]);
  useEffect(() => {
  axios.get('http://localhost:8080/tracks/' + track + '/records')
    .then(response => setRecords(response.data))
    .catch(err => {
    console.log('Error details:', err.message, err.config);})
  }, []);
  return (
    <span>
      <h1>Records of track</h1>
      <ul>
        {records.map((records: Record) => (
          <li key={records.mapRecordId} className="">
            {records.score + ' by: ' + records.accountId}
          </li>
        ))}
      </ul>
    </span>
  );
}
