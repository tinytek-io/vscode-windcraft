import { CompressTailwindStyles } from "../CompressTailwindStyles/CompressTailwindStyles";
import { DecompressTailwindStyles } from "../DecompressTailwindStyles/DecompressTailwindStyles";
import { isTailwindStyle } from "./isTailwindStyle";
import { uniqueArray } from "../../lib/uniqueArray";
import { type DeviceMode, deviceModes } from "../../components/sections/DynamicSection";
import { sortClassList } from "../designSystem";

/**
 * StyleState is a representation of the current state of the styles applied to an element.
 * e.g. "dark", "dark:hover", "md:dark:focus"
 */
export type TailwindModifierState = string;
/**
 * TailwindValue is a representation of the value of a tailwind style.
 * e.g. "md:bg-red-500" -> "bg-red-500"
 */
export type TailwindValue = string;
/**
 * TailwindStyle is a representation of a single tailwind style.
 * e.g. "bg-red-500", "dark:focus:bg-red-900"
 */
export type TailwindStyle = string;
/**
 * CustomStyle is a representation of a custom style.
 * e.g. "my-custom-style"
 */
export type CustomStyle = string;

/**
 * Tailwind value map used in the tailwind field info
 */
export type ValueMap = {
  [key: string]: TailwindValue;
};

/**
 * Tailwind field info
 * Used to map a value to a tailwind class and provide a list of possible values
 * for input fields
 */
export type TailwindFieldInfo = {
  /**
   * Default none value
   */
  none: string;
  /**
   * Map of values to tailwind classes
   * e.g. { none: "bg-none", red: "bg-red-500" }
   */
  valueMap: ValueMap;
};

export interface StyleStateResult {
  customStyles: CustomStyle[];
  tailwindStyles: TailwindStyle[];
}

export function createStyleState(className: string | undefined): StyleStateResult {
  const styles = className?.split(" ") ?? [];
  return {
    customStyles: styles.filter((style) => !isTailwindStyle(style)),
    tailwindStyles: DecompressTailwindStyles(styles.filter((style) => isTailwindStyle(style)))
  };
}

export function createScopedStyleState(scopeClassNames: string[]): TailwindStyle[][] {
  return scopeClassNames.map(createStyleState).map((s) => s.tailwindStyles);
}

export function createClassName(styleState: StyleStateResult): string {
  // TODO: Compress and sort tailwind styles
  return sortClassList(
    [...styleState.customStyles, ...CompressTailwindStyles(styleState.tailwindStyles)].filter(Boolean)
  ).join(" ");
}

export function getCurrentTailwindStyles(tailwindStyles: TailwindStyle[]): TailwindStyle[] {
  // TODO: Filter out unused tailwind styles
  return tailwindStyles;
}

/**
 * Match TailwindStyle against exact current tailwind modifier state.
 * e.g. "dark:hover:bg-red-500" matches "dark:hover" but not "dark"
 */
export function currentTailwindStylesFilter(modifierState: TailwindModifierState) {
  return (s: TailwindStyle) => getTailwindState(s) === modifierState;
}

export function sortAppliedTailwindStylesByModifier(a: TailwindModifierState, b: TailwindModifierState): -1 | 0 | 1 {
  const aIndex = deviceModes.indexOf(getDeviceModeFromModifierState(a));
  const bIndex = deviceModes.indexOf(getDeviceModeFromModifierState(b));
  if (aIndex < bIndex) {
    return 1;
  }
  if (aIndex > bIndex) {
    return -1;
  }
  const aSpecificity = a.split("-").length;
  const bSpecificity = b.split("-").length;

  if (aSpecificity < bSpecificity) {
    return 1;
  }
  if (aSpecificity > bSpecificity) {
    return -1;
  }

  // TODO: Improve sorting - for now just sort by string
  if (a < b) {
    return 1;
  }
  if (a > b) {
    return -1;
  }
  return 0;
}

export function scopeTailwindStylesFilter(modifierState: TailwindModifierState): (s: TailwindStyle) => boolean {
  return (s) => {
    if (isCascadedTailwindStyle(s) === false) {
      // This style should not be inherited
      return false;
    }
    if (s.includes(":")) {
      // This is a modifier state and all states should be applied
      // And if the current device mode is a subset of the applied device mode
      return isAppliedTailwindStyle(modifierState, s) && isDeviceAppliedTailwindStyle(modifierState, s);
    }

    return true;
  };
}

/**
 * Match TailwindStyle against current tailwind modifier state.
 * e.g. "dark:hover:bg-red-500" matches "dark" and "hover", but not "dark:hover"
 * if the modifier state is "dark:hover" then
 * "bg-red-500", "dark:bg-red-500", "hover:bg-red-500" are all matched
 * but "dark:hover:bg-red-500" is not matched as it match the exact current state
 */
export function appliedTailwindStylesFilter(modifierState: TailwindModifierState): (s: TailwindStyle) => boolean {
  const isCurrentTailwindStyle = currentTailwindStylesFilter(modifierState);
  return (s) => {
    if (isCurrentTailwindStyle(s)) {
      // This is currently applied
      return false;
    }

    if (s.includes(":")) {
      // This is a modifier state and all states should be applied
      // And if the current device mode is a subset of the applied device mode
      return isAppliedTailwindStyle(modifierState, s) && isDeviceAppliedTailwindStyle(modifierState, s);
    }

    return true;
  };
}

/**
 * Check if a tailwind style is applied given the current modifier state.
 * e.g.
 * "bg-red-500" is applied in all greater device modes
 * "md:bg-red-500" is applied in "md" and greater device modes and higher rank
 * than "bg-red-500"
 *
 * Note: Other modifiers are ignored - supply with `isAppliedTailwindStyle`
 */
export function isDeviceAppliedTailwindStyle(
  modifierState: TailwindModifierState,
  tailwindStyle: TailwindStyle
): boolean {
  const currentIndex = deviceModes.indexOf(getDeviceModeFromModifierState(modifierState));
  const appliedIndex = deviceModes.indexOf(getDeviceModeFromModifierState(tailwindStyle));

  return appliedIndex <= currentIndex;
}

function getDeviceModeFromModifierState(modifierState: TailwindModifierState): DeviceMode {
  if (modifierState === "") {
    return "xs";
  }
  return (modifierState.split(":").find((mod) => deviceModes.includes(mod)) as DeviceMode) ?? "xs";
}

/**
 * Check if a tailwind style is applied given the current modifier state.
 * e.g.
 * "dark:*" is applied if the modifier state is "dark" but not if state is "dark:hover"
 * "dark:*" and "md:dark:*" are both applied if the modifier state is "dark"
 *
 * Note: Device modes are ignored - supply with `isDeviceAppliedTailwindStyle`
 */
export function isAppliedTailwindStyle(modifierState: TailwindModifierState, tailwindStyle: TailwindStyle): boolean {
  const appliedState = modifierState.split(":");
  return getTailwindState(tailwindStyle)
    .split(":")
    .filter((s) => !deviceModes.includes(s)) // Ignore device modes
    .every((state) => appliedState.includes(state));
}

/**
 * Check if a tailwind style is cascaded or not.
 * Some styles should not be inherited from parent elements.
 *
 * e.g. "flex" should not be inherited
 */
export function isCascadedTailwindStyle(tailwindStyle: TailwindStyle): boolean {
  const value = getTailwindValue(tailwindStyle);
  // Match on prefix
  if (
    ["flex", "rotate", "gap", "p", "w", "h", "rounded", "top", "bottom", "left", "right", "inset", "overflow"].find(
      (prefix) => value.startsWith(`${prefix}-`)
    )
  ) {
    return false;
  }
  // Match on exact value
  if (["flex", "rounded", "absolute", "relative", "fixed", "sticky"].find((exact) => value === exact)) {
    return false;
  }

  return true;
}

/**
 * Get the state of a tailwind style.
 * e.g. "dark:bg-red-500" -> "dark"
 * e.g. "md:dark:bg-red-500" -> "md:dark"
 */
export function getTailwindState(tailwindStyle: TailwindStyle): TailwindModifierState {
  return tailwindStyle.split(":").slice(0, -1).join(":");
}

/**
 * Get the value of a tailwind style.
 * e.g. "dark:bg-red-500" -> "bg-red-500"
 * e.g. "md:dark:bg-red-500" -> "bg-red-500"
 */
export function getTailwindValue(tailwindStyle: TailwindStyle): TailwindValue {
  const value = tailwindStyle.split(":").pop();
  if (value === undefined) {
    throw new Error("Tailwind style does not have a value");
  }
  return value;
}

/**
 * Get the tailwind modifier states from a class name.
 * Returns a list of unique tailwind modifier states.
 *
 * e.g. "dark:bg-red-500 hover:bg-red-500 md:dark:bg-black" -> ["dark", "hover", "md:dark"]
 */
export function getAllTailwindModifierStates(className: string): TailwindModifierState[] {
  return [...new Set(className.split(" ").filter(isTailwindStyle).map(getTailwindState))];
}

/**
 * Add list of styles to the current styles.
 * e.g. ["bg-red-500", "hover:bg-red-500"] + ["dark:bg-red-500"] -> ["bg-red-500", "hover:bg-red-500", "dark:bg-red-500"]
 */
export function addStylesToCurrent(
  currentStyles: TailwindStyle[],
  styles: TailwindStyle[],
  modifierState: TailwindModifierState
): TailwindStyle[] {
  return uniqueArray([...currentStyles, ...styles.map((s) => (modifierState === "" ? s : `${modifierState}:${s}`))]);
}

/**
 * Remove list of styles from the current styles.
 * e.g. ["bg-red-500", "hover:bg-red-500", "dark:bg-red-500"] - ["dark:bg-red-500"] -> ["bg-red-500", "hover:bg-red-500"]
 */
export function removeStylesFromCurrent(
  currentStyles: TailwindStyle[],
  styles: TailwindStyle[],
  modifierState: TailwindModifierState
): TailwindStyle[] {
  return currentStyles.filter(
    (style) => !styles.map((s) => (modifierState === "" ? s : `${modifierState}:${s}`)).includes(style)
  );
}

/**
 * Remove all styles with a prefix from the current styles.
 * e.g. ["bg-red-500", "hover:bg-red-500", "dark:bg-red-500"] - "dark" -> ["bg-red-500", "hover:bg-red-500"]
 */
export function removeStylesFromCurrentByPrefix(currentStyles: TailwindStyle[], prefix: string): TailwindStyle[] {
  return currentStyles.filter((style) => !style.startsWith(prefix));
}
