"use client";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

interface BackButtonProps {
  href?: string;
  className?: string;
}

export function BackButton({ href, className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        btn-ghost
        ${className}
      `}
      aria-label="Go back"
    >
      <IoArrowBack className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
    </button>
  );
}