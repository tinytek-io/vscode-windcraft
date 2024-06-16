import { TailwindStyle } from "../lib/styleHelpers";

/**
 * We compress the tailwind styles to their shortest form
 * e.g.
 * "p-l-2" and "p-r-2" results in "p-x-2"
 * "p-x-2" and "p-y-2" results in "p-2"
 *
 * The UI should be able to handle the shortest form of tailwind styles
 */
export function CompressTailwindStyles(styles: TailwindStyle[]): TailwindStyle[] {
  return styles;
}
