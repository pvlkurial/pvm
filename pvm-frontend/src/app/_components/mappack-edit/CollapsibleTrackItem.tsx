import { useState } from "react";
import { Input, Image, Button } from "@heroui/react";
import { MappackTrack, TimeGoal } from "@/types/mappack.types";
import { FormattedText } from "@/utils/textConverter";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";

interface CollapsibleTrackItemProps {
  track: MappackTrack;
  timeGoals: TimeGoal[];
  timeInputValues: Record<string, Record<number, string>>;
  onTimeGoalChange: (trackId: string, timeGoalId: number, value: string) => void;
  onMapStyleChange: (trackId: string, value: string) => void;
  onDelete: (trackId: string, trackName: string) => void;
  inputClassNames: any;
}

export function CollapsibleTrackItem({
  track,
  timeGoals,
  timeInputValues,
  onTimeGoalChange,
  onMapStyleChange,
  onDelete,
  inputClassNames,
}: CollapsibleTrackItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-neutral-700">
      {/* Header - Always Visible */}
      <div className="flex items-center gap-3 p-4 bg-neutral-800">
        <Image
          removeWrapper
          alt="Track thumbnail"
          className="w-16 h-16 object-cover rounded flex-shrink-0"
          src={track.track.thumbnailUrl}
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-white truncate">
            <FormattedText text={track.track.name} />
          </h3>
          <p className="text-sm text-gray-400">by {track.track.author}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="danger"
            variant="flat"
            isIconOnly
            onPress={() => onDelete(track.track_id, track.track.name)}
          >
            <FaTrash className="w-3 h-3" />
          </Button>
          
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onPress={() => setIsOpen(!isOpen)}
            className="text-white"
          >
            {isOpen ? (
              <FaChevronUp className="w-4 h-4" />
            ) : (
              <FaChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 space-y-4">
          <Input
            label="Map Style"
            variant="bordered"
            value={track.mapStyle || ""}
            onValueChange={(value) => onMapStyleChange(track.track_id, value)}
            classNames={inputClassNames}
          />

          <div className="space-y-2">
            <p className="text-sm font-semibold text-white">
              Time Goals (format: minutes:seconds:milliseconds)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {timeGoals
                .filter((tg) => tg.id)
                .map((timeGoal) => {
                  const inputValue = timeInputValues[track.track_id]?.[timeGoal.id!] || "";

                  return (
                    <Input
                      key={timeGoal.id}
                      label={`${timeGoal.name} (×${timeGoal.multiplier})`}
                      placeholder="1:03:942"
                      variant="bordered"
                      value={inputValue}
                      onValueChange={(value) =>
                        onTimeGoalChange(track.track_id, timeGoal.id!, value)
                      }
                      classNames={inputClassNames}
                      description="Format: MM:SS:mmm"
                    />
                  );
                })}
            </div>
            {timeGoals.filter((tg) => tg.id).length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No time goals available. Create and save time goals first.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}