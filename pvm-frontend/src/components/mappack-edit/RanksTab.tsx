import { MappackRank } from "@/types/mappack.types";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/SectionHeading";
import { RankEditor, RankFieldUpdate } from "./RankEditor";

interface RanksTabProps {
  ranks: MappackRank[];
  onAdd: () => void;
  onUpdate: RankFieldUpdate;
  onRemove: (id: number | undefined) => void;
}

export function RanksTab({ ranks, onAdd, onUpdate, onRemove }: RanksTabProps) {
  return (
    <div className="space-y-4">
      <SectionHeading>Player Ranks</SectionHeading>
      <p className="text-small text-muted-foreground">
        Ranks are awarded to players based on their total points. Customize the
        appearance of each rank.
      </p>

      <div className="space-y-2">
        {ranks.map((rank, index) => (
          <RankEditor
            key={rank.id || `new-${index}`}
            rank={rank}
            index={index}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>

      <Button variant="outline" onClick={onAdd}>
        Add Rank
      </Button>
    </div>
  );
}
