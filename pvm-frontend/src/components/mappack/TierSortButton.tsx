import { BiSortDown, BiSortUp } from "react-icons/bi";
import { Button } from "@/components/ui/button";

export type SortOrder = "asc" | "desc";

interface TierSortButtonProps {
  order: SortOrder;
  onChange: (order: SortOrder) => void;
}

export function TierSortButton({ order, onChange }: TierSortButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Reverse tier order"
      onClick={() => onChange(order === "asc" ? "desc" : "asc")}
    >
      {order === "asc" ? (
        <BiSortUp className="size-5" />
      ) : (
        <BiSortDown className="size-5" />
      )}
    </Button>
  );
}
