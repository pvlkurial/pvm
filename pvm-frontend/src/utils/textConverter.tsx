import { useMemo } from 'react';

interface TextStyle {
  color?: string;
  bold: boolean;
  italic: boolean;
  wide: boolean;
  narrow: boolean;
  uppercase: boolean;
  shadow: boolean;
}

interface TextSegment {
  text: string;
  style: TextStyle;
  link?: string;
}

function createDefaultStyle(): TextStyle {
  return {
    color: undefined,
    bold: false,
    italic: false,
    wide: false,
    narrow: false,
    uppercase: false,
    shadow: false,
  };
}

function parseFormattedText(input: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let currentStyle = createDefaultStyle();
  let currentText = '';
  let currentLink: string | undefined = undefined;
  let i = 0;

  const pushSegment = () => {
    if (currentText) {
      segments.push({
        text: currentText,
        style: { ...currentStyle },
        link: currentLink,
      });
      currentText = '';
    }
  };

  while (i < input.length) {
    if (input[i] === '$' && i + 1 < input.length) {
      const nextChar = input[i + 1];
      const nextCharLower = nextChar.toLowerCase();

      if (i + 3 < input.length && /^[0-9a-fA-F]{3}$/.test(input.slice(i + 1, i + 4))) {
        pushSegment();
        const hex = input.slice(i + 1, i + 4);
        currentStyle.color = `#${hex}`;
        i += 4;
        continue;
      }

      if (nextChar === '$') {
        currentText += '$';
        i += 2;
        continue;
      }

      if (nextCharLower === 'z') {
        pushSegment();
        currentStyle = createDefaultStyle();
        i += 2;
        continue;
      }

      if (nextCharLower === 'g') {
        pushSegment();
        currentStyle.color = undefined;
        i += 2;
        continue;
      }

      if (nextCharLower === 'o') {
        pushSegment();
        currentStyle.bold = true;
        i += 2;
        continue;
      }

      if (nextCharLower === 'i') {
        pushSegment();
        currentStyle.italic = true;
        i += 2;
        continue;
      }

      if (nextCharLower === 'w') {
        pushSegment();
        currentStyle.wide = true;
        currentStyle.narrow = false;
        i += 2;
        continue;
      }

      if (nextCharLower === 'n') {
        pushSegment();
        currentStyle.narrow = true;
        currentStyle.wide = false;
        i += 2;
        continue;
      }

      if (nextCharLower === 'm') {
        pushSegment();
        currentStyle.wide = false;
        currentStyle.narrow = false;
        i += 2;
        continue;
      }

      if (nextCharLower === 't') {
        pushSegment();
        currentStyle.uppercase = true;
        i += 2;
        continue;
      }

      if (nextCharLower === 's') {
        pushSegment();
        currentStyle.shadow = true;
        i += 2;
        continue;
      }

      if (nextCharLower === 'l') {
        pushSegment();
        i += 2;

        if (currentLink !== undefined) {
          currentLink = undefined;
          continue;
        }

        if (i < input.length && input[i] === '[') {
          const closeBracket = input.indexOf(']', i);
          if (closeBracket !== -1) {
            currentLink = input.slice(i + 1, closeBracket);
            i = closeBracket + 1;
          }
        } else {
          const endLink = input.toLowerCase().indexOf('$l', i);
          if (endLink !== -1) {
            currentLink = input.slice(i, endLink);
            currentText = currentLink;
            i = endLink;
          } else {
            currentLink = input.slice(i);
            currentText = currentLink;
            i = input.length;
          }
        }
        continue;
      }
    }

    currentText += input[i];
    i++;
  }

  pushSegment();
  return segments;
}

interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className = '' }: FormattedTextProps) {
  const segments = useMemo(() => parseFormattedText(text), [text]);

  return (
    <span className={className}>
      {segments.map((segment, index) => (
        <span
          key={index}
          style={{ color: segment.style.color }}
          className={segment.style.bold ? 'font-bold' : ''}
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
}

export function useFormattedText(text: string) {
  return useMemo(() => parseFormattedText(text), [text]);
}