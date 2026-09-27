import { Mappack } from "@/types/mappack.types";
import { SectionHeading } from "@/components/common/SectionHeading";
import { MappackCard } from "./MappackCard";
import { AddMappackCard } from "./AddMappackCard";

interface MappackGridProps {
  title: string;
  mappacks: Mappack[];
  /** Appends the create card at the end of the grid. */
  showAddCard?: boolean;
  isLoading: boolean;
  emptyMessage: string;
}

export function MappackGrid({
  title,
  mappacks,
  showAddCard = false,
  isLoading,
  emptyMessage,
}: MappackGridProps) {
  const isEmpty = mappacks.length === 0 && !showAddCard;

  return (
    <section>
      <SectionHeading size="lg" className="mb-8">
        {title}
      </SectionHeading>

      {isEmpty ? (
        <p className="py-12 text-center text-body text-muted-foreground">
          {isLoading ? "Loading..." : emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(clamp(240px,26vw,320px),1fr))] gap-5">
          {mappacks.map((mappack) => (
            <MappackCard key={mappack.id} mappack={mappack} />
          ))}
          {showAddCard && <AddMappackCard />}
        </div>
      )}
    </section>
  );
}
