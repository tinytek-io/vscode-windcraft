import { TailwindFieldInfo } from "../tailwindModel/lib/styleHelpers";

export type BackdropEffectType =
  | "Blur"
  | "Brightness"
  | "Contrast"
  | "Grayscale"
  | "HueRotate"
  | "Invert"
  | "Opacity"
  | "Saturate"
  | "Sepia";

export const backdropEffectMap: Record<BackdropEffectType, TailwindFieldInfo> = {
  Blur: {
    none: "none",
    valueMap: {
      none: "backdrop-blur-none",
      sm: "backdrop-blur-sm",
      rg: "backdrop-blur",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
      "2xl": "backdrop-blur-2xl",
      "3xl": "backdrop-blur-3xl"
    }
  },
  Brightness: {
    none: "100",
    valueMap: {
      "0": "backdrop-brightness-0",
      "50": "backdrop-brightness-50",
      "75": "backdrop-brightness-75",
      "90": "backdrop-brightness-90",
      "95": "backdrop-brightness-95",
      "100": "backdrop-brightness-100",
      "105": "backdrop-brightness-105",
      "110": "backdrop-brightness-110",
      "125": "backdrop-brightness-125",
      "150": "backdrop-brightness-150",
      "200": "backdrop-brightness-200"
    }
  },
  Contrast: {
    none: "100",
    valueMap: {
      "0": "backdrop-contrast-0",
      "50": "backdrop-contrast-50",
      "75": "backdrop-contrast-75",
      "100": "backdrop-contrast-100",
      "125": "backdrop-contrast-125",
      "150": "backdrop-contrast-150",
      "200": "backdrop-contrast-200"
    }
  },
  Grayscale: {
    none: "0",
    valueMap: {
      "0": "backdrop-grayscale-0",
      "100": "backdrop-grayscale"
    }
  },
  HueRotate: {
    none: "0",
    valueMap: {
      "0": "backdrop-hue-rotate-0",
      "15": "backdrop-hue-rotate-15",
      "30": "backdrop-hue-rotate-30",
      "60": "backdrop-hue-rotate-60",
      "90": "backdrop-hue-rotate-90",
      "180": "backdrop-hue-rotate-180"
    }
  },
  Invert: {
    none: "0",
    valueMap: {
      "0": "backdrop-invert-0",
      "100": "backdrop-invert"
    }
  },
  Opacity: {
    none: "0",
    valueMap: {
      "0": "backdrop-opacity-0",
      "5": "backdrop-opacity-5",
      "10": "backdrop-opacity-10",
      "15": "backdrop-opacity-15",
      "20": "backdrop-opacity-20",
      "25": "backdrop-opacity-25",
      "30": "backdrop-opacity-30",
      "35": "backdrop-opacity-35",
      "40": "backdrop-opacity-40",
      "45": "backdrop-opacity-45",
      "50": "backdrop-opacity-50",
      "55": "backdrop-opacity-55",
      "60": "backdrop-opacity-60",
      "65": "backdrop-opacity-65",
      "70": "backdrop-opacity-70",
      "75": "backdrop-opacity-75",
      "80": "backdrop-opacity-80",
      "85": "backdrop-opacity-85",
      "90": "backdrop-opacity-90",
      "95": "backdrop-opacity-95",
      "100": "backdrop-opacity-100"
    }
  },
  Saturate: {
    none: "100",
    valueMap: {
      "0": "backdrop-saturate-0",
      "50": "backdrop-saturate-50",
      "100": "backdrop-saturate-100",
      "150": "backdrop-saturate-150",
      "200": "backdrop-saturate-200"
    }
  },
  Sepia: {
    none: "0",
    valueMap: {
      "0": "backdrop-sepia-0",
      "100": "backdrop-sepia"
    }
  }
};

export const backdropEffects: BackdropEffectType[] = Object.keys(backdropEffectMap) as BackdropEffectType[];

export function isBackdropEffect(value: string): value is BackdropEffectType {
  return backdropEffects.includes(value as BackdropEffectType);
}
