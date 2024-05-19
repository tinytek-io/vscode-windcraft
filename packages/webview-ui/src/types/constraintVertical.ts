import { CurrentAppliedType } from "./general";

export type VerticalConstraintsState = {
  top: CurrentAppliedType<boolean>;
  bottom: CurrentAppliedType<boolean>;
  insetY: CurrentAppliedType<boolean>;
};

export type VerticalConstraints = {
  top: CurrentAppliedType<string | undefined>;
  bottom: CurrentAppliedType<string | undefined>;
  insetY: CurrentAppliedType<string | undefined>;
};

export const verticalConstraintNone = "Scale";
export type VerticalConstraintOption =
  | "Top"
  | "Bottom"
  | "Top and Bottom"
  | "Center"
  | "Scale";
export const verticalConstraintOptions: VerticalConstraintOption[] = [
  "Top",
  "Bottom",
  "Top and Bottom",
  "Center",
  "Scale",
];

export type VerticalSelectValue =
  | "top"
  | "bottom"
  | "insetY"
  | "top-bottom"
  | "scale-y";

export function isVerticalConstraintOption(
  value: string
): value is VerticalConstraintOption {
  return verticalConstraintOptions.includes(value as VerticalConstraintOption);
}
