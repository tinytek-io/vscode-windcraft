import { CurrentAppliedType } from "./general";

export type HorizontalConstraintsState = {
  left: CurrentAppliedType<boolean>;
  right: CurrentAppliedType<boolean>;
  insetX: CurrentAppliedType<boolean>;
};

export type HorizontalConstraints = {
  left: CurrentAppliedType<string | undefined>;
  right: CurrentAppliedType<string | undefined>;
  insetX: CurrentAppliedType<string | undefined>;
};

export const horizontalConstraintNone = "Scale";
export type HorizontalConstraintOption = "Left" | "Right" | "Left and Right" | "Center" | "Scale";
export const horizontalConstraintOptions: HorizontalConstraintOption[] = [
  "Left",
  "Right",
  "Left and Right",
  "Center",
  "Scale"
];

export type HorizontalSelectValue = "right" | "left" | "insetX" | "left-right" | "scale-x";

export function isHorizontalConstraintOption(value: string): value is HorizontalConstraintOption {
  return horizontalConstraintOptions.includes(value as HorizontalConstraintOption);
}
