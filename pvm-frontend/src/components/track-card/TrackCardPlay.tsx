import { FaPlay } from "react-icons/fa6";

/** Opens the track in-game through Openplanet. */
export function TrackCardPlay({ trackId }: { trackId: string }) {
  const handlePlay = (e: React.MouseEvent | React.KeyboardEvent) => {
    // The card behind this navigates on click and Enter.
    e.stopPropagation();
    window.location.href = `trackmania://openplanet/play/nadeo/${trackId}`;
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      onKeyDown={(e) => e.key === "Enter" && e.stopPropagation()}
      title="Play in Trackmania"
      aria-label="Play in Trackmania"
      className="absolute top-0 left-0 z-20 flex cursor-pointer items-center rounded-br-xl bg-black/50 px-3 py-1.5 text-muted-foreground opacity-0 backdrop-blur-md transition-all duration-200 hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
    >
      <FaPlay className="size-3" />
    </button>
  );
}
