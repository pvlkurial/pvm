import { Button } from "@heroui/react";
import { MappackRank } from "@/types/mappack.types";
import { RankEditor } from "./RankEditor";
import { ADMIN_BUTTON } from "@/constants/button-styles";
import { SectionHeading } from "@/app/_components/SectionHeading";

interface RanksTabProps {
  ranks: MappackRank[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof MappackRank, value: string | number | boolean | null) => void;
  onRemove: (id: number | undefined) => void;
  inputClassNames: any;
}

export function RanksTab({ ranks, onAdd, onUpdate, onRemove, inputClassNames }: RanksTabProps) {
  return (
    <div className="space-y-4">
      <SectionHeading>Player Ranks</SectionHeading>
      <p className="text-sm text-gray-400">
        Ranks are awarded to players based on their total points. Customize the appearance of each rank.
      </p>

      <div className="space-y-2">
        {ranks.map((rank, index) => (
          <RankEditor
            key={rank.id || `new-${index}`}
            rank={rank}
            index={index}
            onUpdate={onUpdate}
            onRemove={onRemove}
            inputClassNames={inputClassNames}
          />
        ))}
      </div>

      <Button className={ADMIN_BUTTON} onPress={onAdd}>
        Add Rank
      </Button>
    </div>
  );
}