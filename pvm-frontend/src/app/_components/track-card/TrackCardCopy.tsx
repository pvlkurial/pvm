import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { FiCopy, FiCheck } from "react-icons/fi";

interface TrackCardCopyProps {
  tmxId: number | string;
}

export function TrackCardCopy({ tmxId }: TrackCardCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(String(tmxId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={`Copy TMX ID: ${tmxId}`}
      className="absolute cursor-pointer top-0 left-0 z-20 flex items-center gap-1 px-3 py-1.5 rounded-br-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
      style={{
        background: "rgba(0,0,0,0.5)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      <span className="relative w-3 h-3">
        <FaCopy
          className="absolute inset-0 w-3 h-3 transition-opacity duration-300 text-neutral-500"
          style={{
            opacity: copied ? 0 : 1,
          }}
        />
        <FaCheck
          className="absolute inset-0 w-3 h-3 transition-opacity duration-300 text-blue-200"
          style={{
            opacity: copied ? 1 : 0,
          }}
        />
      </span>
    </button>
  );
}
