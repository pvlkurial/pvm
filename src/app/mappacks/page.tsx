"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Mappack {
  id: string;
  name: string;
}

export default function Home() {
    const [mappacks, setMappacks] = useState([]);
  useEffect(() => {
  axios.get('http://localhost:8080/mappacks')
    .then(response => setMappacks(response.data))
    .catch(err => {
    console.log('Error details:', err.message, err.config);})
  }, []);
  return (
    <span>
      <h1>Welcome to the Mappack Manager</h1>
      <ul>
        {mappacks.map((mappack: Mappack) => (
          <Link key={mappack.id} href={"/mappacks/" + mappack.id} className="">{mappack.name}</Link>
        ))}
      </ul>
    </span>
  );
}
