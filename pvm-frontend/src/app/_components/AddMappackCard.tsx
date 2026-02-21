"use client"
import React, { useRef } from "react";
import CreateMappackModal from "./CreateMappackModal";

interface Props {
  width: number;
}

export default function AddMappackCard({ width }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    modalRef.current?.querySelector<HTMLElement>("button, [role='button']")?.click();
  };

  return (
    <div className="mp-add-wrap" style={{ width }} onClick={handleClick}>
      <div className="mp-add-inner">
        <div className="mp-add-content">
          <span className="mp-add-icon">+</span>
          <span>Add Mappack</span>
        </div>
      </div>
      {/* Hidden — just mounts the modal trigger so we can click it */}
      <div ref={modalRef} style={{ position: "absolute", opacity: 0, pointerEvents: "none", zIndex: -1 }}>
        <CreateMappackModal />
      </div>
    </div>
  );
}