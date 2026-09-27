export function TrackHero({ thumbnailUrl }: { thumbnailUrl: string }) {
  return (
    <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailUrl}
        alt="Track thumbnail"
        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
  );
}
