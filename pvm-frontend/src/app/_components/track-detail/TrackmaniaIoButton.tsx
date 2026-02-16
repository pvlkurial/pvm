import React from "react";
import Image from "next/image";
import { FaHeartbeat } from "react-icons/fa";

interface TrackmaniaIoButtonProps {
  mapUID: string;
  className?: string;
}

export const TrackmaniaIoButton: React.FC<TrackmaniaIoButtonProps> = ({
  mapUID,
  className = "",
}) => {
  const handleClick = () => {
    window.open(`https://trackmania.io/#/leaderboard/${mapUID}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-10 h-10 
        flex items-center justify-center 
        bg-white/5 hover:bg-white/10 
        border border-white/10 hover:border-white/20
        rounded-lg 
        transition-all duration-200 
        hover:scale-105 
        active:scale-95
        cursor-pointer
        group
        ${className}
      `}
      aria-label="View on Trackmania.io"
      title="View on Trackmania.io"
    >
      <FaHeartbeat></FaHeartbeat>
    </button>
  );
};