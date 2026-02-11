import { Image } from "@heroui/react";

interface TrackHeroProps {
  thumbnailUrl: string;
  dominantColor: string;
}

export function TrackHero({ thumbnailUrl, dominantColor }: TrackHeroProps) {
  const rgbColor = {
    r: parseInt(dominantColor.slice(0, 2), 16),
    g: parseInt(dominantColor.slice(2, 4), 16),
    b: parseInt(dominantColor.slice(4, 6), 16),
  };

  return (
    <div className="relative group w-full h-full">
      <div
        className="relative rounded-2xl overflow-hidden aspect-square w-full h-full"
        style={{
          boxShadow: `0 10px 20px 5px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`,
        }}
      >
        <Image
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt="Track Thumbnail"
          src={thumbnailUrl}
          removeWrapper
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>
    </div>
  );
}