/**
 * Removes Trackmania formatting codes ($fff colours, $o/$i/$z styles and so on)
 * for places that need plain text, such as page titles. "$$" is a literal "$".
 */
export function stripFormatting(text: string): string {
  return text
    .replace(/\$\$/g, "\u0000")
    .replace(/\$([0-9a-f]{1,3}|[a-z<>])/gi, "")
    .replace(/\u0000/g, "$")
    .trim();
}
