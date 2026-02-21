import React from "react";

interface Props {
  total: number;
  active: number;
  onDotClick: (i: number) => void;
}

export default function CarouselDots({ total, active, onDotClick }: Props) {
  return (
    <div className="mp-dots">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`mp-dot${i === active ? " is-active" : ""}`}
          onClick={() => onDotClick(i)}
          aria-label={`Item ${i + 1}`}
        />
      ))}
    </div>
  );
}