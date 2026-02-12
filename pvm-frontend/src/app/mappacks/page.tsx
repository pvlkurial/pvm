"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import MappackCard from "../_components/MappackCard";
import CreateMappackModal from "../_components/CreateMappackModal";
import RequireRole from "../_components/RequireRole";
import {Mappack} from "@/types/mappack.types";


export default function Home() {
  const [mappacks, setMappacks] = useState([]);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  useEffect(() => {
  axios.get(`${API_BASE}/mappacks`)
    .then(response => setMappacks(response.data))
    .catch(err => {
    console.log('Error details:', err.message, err.config);})
  }, []);
  return (
    <span>
        <div className="flex grid grid-cols-2 md:grid-cols-4 gap-3 p-10">
        {mappacks.map((mappack: Mappack) => (
            <MappackCard key={mappack.id} mappack={mappack} />
        ))}
        </div>
        <RequireRole role="admin">
          <CreateMappackModal/>
        </RequireRole>
    </span>
  );
}
