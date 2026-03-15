import { useMemo } from "react";
import { parseTmTags } from "tmtags";

interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className = "" }: FormattedTextProps) {
  const html = useMemo(() => parseTmTags(text), [text]);

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function useFormattedText(text: string) {
  return useMemo(() => parseTmTags(text), [text]);
}
