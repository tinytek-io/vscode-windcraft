import { CurrentAppliedType } from "./general";

/**
 * Check if the value is a MixBlendInputValue
 */
export function isMixBlendInputValue(value: string | MixBlendInputValue): value is MixBlendInputValue {
  return mixBlendInputMap[value as MixBlendInputValue] !== undefined;
}

/**
 * Get the class name for the mix-blend-mode value
 * e.g. "Normal" -> "mix-blend-normal"
 */
export function getMixBlendClassName(value: CurrentAppliedType<MixBlendInputValue>): CurrentAppliedType<string> {
  return {
    current: `mix-blend-${mixBlendInputMap[value.current]}`,
    applied: `mix-blend-${mixBlendInputMap[value.applied]}`
  };
}

/**
 * Get the mix-blend-mode value from the class value
 * e.g. normal -> "Normal"
 * @param classValue The class value without the prefix "mix-blend-"
 */
export function getMixBlendInputValue(
  classValue: CurrentAppliedType<string | undefined>
): CurrentAppliedType<MixBlendInputValue> {
  return {
    current: getMixBlendInputValueHelper(classValue.current ?? classValue.applied),
    applied: getMixBlendInputValueHelper(classValue.applied)
  };
}

export function getMixBlendInputValueHelper(classValue?: string): MixBlendInputValue {
  if (!classValue) {
    return mixBlendNone;
  }
  for (const [key, value] of Object.entries(mixBlendInputMap)) {
    if (classValue === value) {
      return key as MixBlendInputValue;
    }
  }
  return mixBlendNone;
}

export type MixBlendInputValue = keyof typeof mixBlendInputMap;
export const mixBlendNone: MixBlendInputValue = "Normal";
export const mixBlendInputMap = {
  Normal: "normal",
  Multiply: "multiply",
  Screen: "screen",
  Overlay: "overlay",
  Darken: "darken",
  Lighten: "lighten",
  "Color dodge": "color-dodge",
  "Color burn": "color-burn",
  "Hard light": "hard-light",
  "Soft light": "soft-light",
  Difference: "difference",
  Exclusion: "exclusion",
  Hue: "hue",
  Saturation: "saturation",
  Color: "color",
  Luminosity: "luminosity",
  "Plus darker": "plus-darker",
  "Plus lighter": "plus-lighter"
};
export const mixBlendInputValues = Object.keys(mixBlendInputMap) as MixBlendInputValue[];

export type OpacityValue = string;
export const opacityNone: OpacityValue = "100";
export const opacityValues = [
  "0",
  "5",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
  "60",
  "65",
  "70",
  "75",
  "80",
  "85",
  "90",
  "95",
  "100"
];
