import { FaPlay } from "react-icons/fa6";

interface TrackCardPlayProps {
  trackId: string;
}

export function TrackCardPlay({ trackId }: TrackCardPlayProps) {
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `trackmania://openplanet/play/nadeo/${trackId}`;
  };

  return (
    <button
      onClick={handlePlay}
      title="Play in Trackmania"
      className="absolute cursor-pointer top-0 left-0 z-20 flex items-center gap-1 px-3 py-1.5 rounded-br-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
      style={{
        background: "rgba(0,0,0,0.5)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      <FaPlay className="w-3 h-3 text-neutral-500 hover:text-blue-200 transition-colors duration-300" />
    </button>
  );
}