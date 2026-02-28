import { Button } from "@heroui/react";
import { MappackRank } from "@/types/mappack.types";
import { RankEditor } from "./RankEditor";

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
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <p className="text-xl font-ruigslay">Player Ranks</p>
        <div className="flex-1 h-[5px] bg-neutral-300" />
      </div>
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

      <Button color="default" onPress={onAdd}>
        Add Rank
      </Button>
    </div>
  );
}