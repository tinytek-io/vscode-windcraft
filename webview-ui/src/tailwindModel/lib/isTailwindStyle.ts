import { getTailwindState, getTailwindValue } from "./styleHelpers";

export function isTailwindStyle(style: string): boolean {
  const state = getTailwindState(style);
  const stateParts = state.split(":");
  const value = getTailwindValue(style);

  if (value === "") {
    return false;
  }

  // Check for tailwind modifier classes
  if (
    state !== "" &&
    tailwindModifiers.some((m) => stateParts.includes(m)) === false
  ) {
    return false;
  }

  if (tailwindValues.some((v) => value === v)) {
    return true;
  }

  if (
    tailwindValuePrefixes.some(
      // Positive and negative prefixes
      (p) => value.startsWith(`${p}-`) || value.startsWith(`-${p}-`)
    )
  ) {
    return true;
  }

  return false;
}

const tailwindValues = [
  "border",
  "flex",
  // Position
  "static",
  "fixed",
  "absolute",
  "relative",
  "sticky",
  // Visibility
  "visible",
  "invisible",
  "collapse",
  // Display
  "block",
  "hidden",
  "inline",
  "grid",
  "inline",
  "grow",
  "shrink",
  // Border
  "rounded",
  // Font
  "italic",
  "not-italic",
  "antialiased",
  "subpixel-antialiased",
  // Text
  "uppercase",
  "overline",
  "line-through",
  "no-underline",
  // Text transform
  "uppercase",
  "lowercase",
  "capitalize",
  "normal-case",
  // Text overflow
  "truncate",
  // Font variant numeric
  "normal-nums",
  "ordinal",
  "slashed-zero",
  "lining-nums",
  "oldstyle-nums",
  "proportional-nums",
  "tabular-nums",
  "diagonal-fractions",
  "stacked-fractions",
  // Layer effects
  "blur",
  "brightness",
  "contrast",
  "drop-shadow",
  "grayscale",
  "hue-rotate",
  "invert",
  "saturate",
  "sepia",
  // Backdrop effects
  "backdrop-blur",
  "backdrop-brightness",
  "backdrop-contrast",
  "backdrop-grayscale",
  "backdrop-hue-rotate",
  "backdrop-invert",
  "backdrop-opacity",
  "backdrop-saturate",
  "backdrop-sepia",
  // Debug
  "!outline",
];

const tailwindValuePrefixes = [
  "text",
  "bg",
  // Border
  "border",
  "rounded",
  // Gradient
  "from",
  "via",
  "to",
  // General
  "overflow",
  "z",
  // Display
  "inline",
  // Padding
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  // Margin
  "m",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "ms",
  "me",
  // Space
  "space",
  // Width
  "w",
  "min-w",
  "max-w",
  // Height
  "h",
  "min-h",
  "max-h",
  "aspect",
  // Font
  "font",
  "tracking",
  "line",
  "leading",
  "indent",
  "align",
  "whitespace",
  "break",
  "hyphens",
  "content",
  // Text decoration
  "decoration",
  "underline",
  // List
  "list",
  // Transform
  "shadow",
  "opacity",
  "rotate",
  // Placement
  "top",
  "right",
  "bottom",
  "left",
  "inset",
  "start",
  "end",
  // Flex
  "flex",
  "gap",
  "grow",
  "shrink",
  "justify",
  "items",
  "content",
  "place",
  // Grid (TODO: Add more grid prefixes)
  "grid",
  // Border
  "rounded",
  "shadow",
  // Mix blend
  "mix-blend",
  // Layer effects
  "blur",
  "brightness",
  "contrast",
  "drop-shadow",
  "grayscale",
  "hue-rotate",
  "invert",
  "saturate",
  "sepia",
  // Backdrop effects
  "backdrop-blur",
  "backdrop-brightness",
  "backdrop-contrast",
  "backdrop-grayscale",
  "backdrop-hue-rotate",
  "backdrop-invert",
  "backdrop-opacity",
  "backdrop-saturate",
  "backdrop-sepia",
  // Debug
  "!outline",
];

const tailwindModifiers = [
  // ThemeMode
  "dark",
  // Responsive
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  // Pseudo classes
  "hover",
  "focus",
  "active",
  "visited",
  // Form pseudo classes
  "checked",
  "enabled",
  "disabled",
  "required",
  "valid",
  "invalid",
];
