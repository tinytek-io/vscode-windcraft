export type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";
export const fontSizeNone: FontSize = "base";
export const fontSizeMap: Record<FontSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl"
};
export const fontSizeClasses = [...Object.values(fontSizeMap)];
export const fontSizeValues = Object.keys(fontSizeMap);
export const classFontSizeMap: Record<string, FontSize> = Object.entries(fontSizeMap).reduce(
  (acc, [key, value]) => {
    acc[value] = key as FontSize;
    return acc;
  },
  {} as Record<string, FontSize>
);
export function isFontSize(value: string): value is FontSize {
  return value in fontSizeMap;
}

export function getFontSizeOption(fontSize: string): FontSize {
  return classFontSizeMap[fontSize] ?? "base";
}
