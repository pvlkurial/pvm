"use client";
import { CreateMappackDialog } from "./CreateMappackDialog";

export function AddMappackCard() {
  return (
    <CreateMappackDialog>
      <button
        type="button"
        className="flex aspect-[16/11] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-muted-foreground transition-colors outline-none hover:border-muted-foreground/60 hover:bg-surface-1 hover:text-foreground focus-visible:border-foreground"
      >
        <span className="font-display text-display-m leading-none">+</span>
        <span className="text-small">Add Mappack</span>
      </button>
    </CreateMappackDialog>
  );
}
