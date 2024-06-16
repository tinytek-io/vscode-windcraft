import type { TailwindFieldInfo } from "../tailwindModel/lib/styleHelpers";
import type { IconType } from "react-icons";
import { CgBorderAll, CgBorderTop, CgBorderRight, CgBorderBottom, CgBorderLeft } from "react-icons/cg";
import { VscSettings } from "react-icons/vsc";

export function getBorderWidthClassName(prefix: string, width: string) {
  return width === "1" ? prefix : `${prefix}-${width}`;
}

export const borderWidthPrefixMap: Record<BorderWidthAllType, string[]> = {
  All: ["border"],
  Top: ["border-t"],
  Right: ["border-r"],
  Bottom: ["border-b"],
  Left: ["border-l"],
  Custom: ["border-t", "border-r", "border-b", "border-l"]
};

export type BorderWidthNormalType = "All" | "Top" | "Right" | "Bottom" | "Left";
export type BorderWidthAllType = BorderWidthNormalType | "Custom";
export type BorderWidthMap = Record<BorderWidthAllType, TailwindFieldInfo>;

export type BorderWidthValue = "0" | "1" | "2" | "4" | "8";
export const borderWidthValues: BorderWidthValue[] = ["0", "1", "2", "4", "8"];
export const borderWidthTypes: BorderWidthAllType[] = ["All", "Top", "Right", "Bottom", "Left", "Custom"];
export const borderWidthIconsMap: Record<BorderWidthAllType, IconType> = {
  All: CgBorderAll,
  Top: CgBorderTop,
  Right: CgBorderRight,
  Bottom: CgBorderBottom,
  Left: CgBorderLeft,
  Custom: VscSettings
};

export function isBorderWidthNormalType(type: string): type is BorderWidthAllType {
  return borderWidthTypes.includes(type as BorderWidthNormalType);
}

export const allBorderWidthStyles = ["border", "border-t", "border-r", "border-b", "border-l"].flatMap((prefix) =>
  borderWidthValues.map((v) => (v === "1" ? prefix : `${prefix}-${v}`))
);
