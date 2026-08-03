"use client";
import React, { useRef } from "react";
import CreateMappackModal from "../CreateMappackModal";

export default function AddMappackCard() {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    modalRef.current
      ?.querySelector<HTMLElement>("button, [role='button']")
      ?.click();
  };

  return (
    <div
      className="mp-card mp-add"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="mp-add-content">
        <span className="mp-add-icon">+</span>
        <span>Add Mappack</span>
      </div>
      <div
        ref={modalRef}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <CreateMappackModal />
      </div>
    </div>
  );
}
