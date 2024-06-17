import type { TailwindFieldInfo } from "../tailwindModel/lib/styleHelpers";

export type LayerEffectType =
  | "Blur"
  | "Brightness"
  | "Contrast"
  | "DropShadow"
  | "Grayscale"
  | "HueRotate"
  | "Invert"
  | "Saturate"
  | "Sepia";

export const layerEffectMap: Record<LayerEffectType, TailwindFieldInfo> = {
  Blur: {
    none: "none",
    valueMap: {
      none: "blur-none",
      sm: "blur-sm",
      rg: "blur",
      md: "blur-md",
      lg: "blur-lg",
      xl: "blur-xl",
      "2xl": "blur-2xl",
      "3xl": "blur-3xl"
    }
  },
  Brightness: {
    none: "100",
    valueMap: {
      "0": "brightness-0",
      "50": "brightness-50",
      "75": "brightness-75",
      "90": "brightness-90",
      "95": "brightness-95",
      "100": "brightness-100",
      "105": "brightness-105",
      "110": "brightness-110",
      "125": "brightness-125",
      "150": "brightness-150",
      "200": "brightness-200"
    }
  },
  Contrast: {
    none: "100",
    valueMap: {
      "0": "contrast-0",
      "50": "contrast-50",
      "75": "contrast-75",
      "100": "contrast-100",
      "125": "contrast-125",
      "150": "contrast-150",
      "200": "contrast-200"
    }
  },
  DropShadow: {
    none: "none",
    valueMap: {
      none: "drop-shadow-none",
      sm: "drop-shadow-sm",
      rg: "drop-shadow",
      md: "drop-shadow-md",
      lg: "drop-shadow-lg",
      xl: "drop-shadow-xl",
      "2xl": "drop-shadow-2xl"
    }
  },
  Grayscale: {
    none: "0",
    valueMap: {
      "0": "grayscale-0",
      "100": "grayscale"
    }
  },
  HueRotate: {
    none: "0",
    valueMap: {
      "0": "hue-rotate-0",
      "15": "hue-rotate-15",
      "30": "hue-rotate-30",
      "60": "hue-rotate-60",
      "90": "hue-rotate-90",
      "180": "hue-rotate-180"
    }
  },
  Invert: {
    none: "0",
    valueMap: {
      "0": "invert-0",
      "100": "invert"
    }
  },
  Saturate: {
    none: "100",
    valueMap: {
      "0": "saturate-0",
      "50": "saturate-50",
      "100": "saturate-100",
      "150": "saturate-150",
      "200": "saturate-200"
    }
  },
  Sepia: {
    none: "0",
    valueMap: {
      "0": "sepia-0",
      "100": "sepia"
    }
  }
};

export const layerEffects: LayerEffectType[] = Object.keys(layerEffectMap) as LayerEffectType[];

export function isLayerEffect(value: string): value is LayerEffectType {
  return layerEffects.includes(value as LayerEffectType);
}
