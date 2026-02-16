// components/TmxButton.tsx
import React from "react";
import Image from "next/image";
import { FaMap } from "react-icons/fa";

interface TmxButtonProps {
  tmxId: string;
  className?: string;
}

export const TmxButton: React.FC<TmxButtonProps> = ({
  tmxId,
  className = "",
}) => {
  const handleClick = () => {
    window.open(`https://trackmania.exchange/mapshow/${tmxId}`, "_blank");
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
      aria-label="View on TrackMania Exchange"
      title="View on TrackMania Exchange"
    >
      <FaMap></FaMap>
    </button>
  );
};