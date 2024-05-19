import { TailwindStyle } from "../lib/styleHelpers";

/**
 * We decompress the tailwind styles to their full form
 * e.g.
 * "p-2" results in "p-x-2" and "p-y-2"
 * "p-y-2" results in "p-l-2" and "p-r-2"
 *
 * The UI should be able to handle the full form of tailwind styles
 */
export function DecompressTailwindStyles(
  styles: TailwindStyle[]
): TailwindStyle[] {
  // TODO: Decompress tailwind styles
  return styles;
}
