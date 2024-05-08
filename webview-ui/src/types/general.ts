import { TailwindStyle } from "../tailwindModel/lib/styleHelpers";

/**
 * UIValue is a string that represents a UI value, it also acts as a key in a KeySuffixMap
 */

export type UIValue = string;
/**
 * TailwindSuffix is a string that represents a tailwind class suffix
 */
export type TailwindSuffix = string;
/**
 * A map of UI values to tailwind class suffixes
 *
 * Example:
 *
 * const borderRadiusMap: KeySuffixMap = new Map([
 *   // uiValue, tailwindValue
 *   ["none", "-none"],
 *   ["sm", "-sm"],
 *   ["rg", ""],
 *   ["md", "-md"],
 *   ["lg", "-lg"],
 *   ["xl", "-xl"],
 *   ["2xl", "-2xl"],
 *   ["3xl", "-3xl"],
 *   ["full", "-full"],
 *  ]);
 */
export type KeySuffixMap = Map<UIValue, TailwindSuffix>;

export type OptionalTailwindStyle = TailwindStyle | undefined | null | false;

export type CurrentAppliedType<T> = {
  current: T;
  applied: T;
};

export function getCurrentAppliedType<T>(value: T): CurrentAppliedType<T> {
  return {
    current: value,
    applied: value,
  };
}
