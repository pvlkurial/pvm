import React from "react";
import CreateMappackModal from "./CreateMappackModal";

interface Props {
  width: number;
}

export default function AddMappackCard({ width }: Props) {
  return (
    <div className="mp-add-wrap" style={{ width }}>
      <div className="mp-add-inner">
        <div className="mp-add-content">
          <span className="mp-add-icon">+</span>
          <span>Add Mappack</span>
        </div>
      </div>
      {/* Invisible full-area trigger over the card */}
      <div className="mp-add-modal-trigger">
        <CreateMappackModal />
      </div>
    </div>
  );
}