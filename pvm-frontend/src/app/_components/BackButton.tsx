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
        w-10 h-10 
        flex items-center justify-center 
        bg-white/5 hover:bg-white/10 
        border border-white/10 hover:border-white/20
        rounded-lg 
        transition-all duration-200 
        hover:scale-105 
        active:scale-95
        cursor-pointer
        group
        ${className}
      `}
      aria-label="Go back"
    >
      <IoArrowBack className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
    </button>
  );
}