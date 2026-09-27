"use client";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href?: string;
}

export function BackButton({ href }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => (href ? router.push(href) : router.back())}
      aria-label="Go back"
    >
      <IoArrowBack className="size-5" />
    </Button>
  );
}
