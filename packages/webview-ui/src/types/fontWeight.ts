export type FontWeight =
  | "Thin"
  | "Extra light"
  | "Light"
  | "Normal"
  | "Medium"
  | "Semibold"
  | "Bold"
  | "Extrabold"
  | "Black";

export const fontWeightNone: FontWeight = "Normal";
export const fontWeightMap: Record<FontWeight, string> = {
  Thin: "font-thin",
  "Extra light": "font-extralight",
  Light: "font-light",
  Normal: "font-normal",
  Medium: "font-medium",
  Semibold: "font-semibold",
  Bold: "font-bold",
  Extrabold: "font-extrabold",
  Black: "font-black"
};

export const fontWeightClasses = [...Object.values(fontWeightMap)];
export const fontWeightOptions = Object.keys(fontWeightMap);

export const classFontWeightMap: Record<string, FontWeight> = Object.entries(fontWeightMap).reduce(
  (acc, [key, value]) => {
    acc[value] = key as FontWeight;
    return acc;
  },
  {} as Record<string, FontWeight>
);

export function isFontWeight(value: string): value is FontWeight {
  return value in fontWeightMap;
}

export function getFontWeightOption(fontWeight: string): FontWeight {
  return classFontWeightMap[fontWeight] ?? "Normal";
}
