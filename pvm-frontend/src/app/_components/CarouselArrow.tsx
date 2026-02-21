import React from "react";

interface Props {
  direction: "prev" | "next";
  onClick: () => void;
}

export default function CarouselArrow({ direction, onClick }: Props) {
  const isPrev = direction === "prev";
  return (
    <button
      className="mp-arrow"
      style={{ [isPrev ? "left" : "right"]: 12 }}
      onClick={onClick}
      aria-label={isPrev ? "Previous" : "Next"}
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
        {isPrev
          ? <polyline points="10,2 4,8 10,14" />
          : <polyline points="6,2 12,8 6,14" />
        }
      </svg>
    </button>
  );
}