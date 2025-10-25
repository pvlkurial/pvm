"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import MappackCard from "../_components/MappackCard";

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
        <div className="flex grid grid-cols-2 md:grid-cols-4 gap-3 p-10">
        {mappacks.map((mappack: Mappack) => (
            <MappackCard key={mappack.id} mappack={mappack} />
        ))}
        </div>
    </span>
  );
}
