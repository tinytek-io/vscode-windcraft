import { ImSubscript2, ImSuperscript2 } from "react-icons/im";
import type { IconType } from "react-icons";
import { MdVerticalAlignCenter } from "react-icons/md";
import { AiOutlineVerticalAlignTop, AiOutlineVerticalAlignBottom } from "react-icons/ai";
import { RxAlignBaseline, RxTextAlignTop, RxTextAlignBottom } from "react-icons/rx";

export type VerticalAlign = "baseline" | "top" | "middle" | "bottom" | "text-top" | "text-bottom" | "sub" | "super";
export const verticalAlignMap: Record<VerticalAlign, string> = {
  top: "align-top",
  middle: "align-middle",
  bottom: "align-bottom",
  baseline: "align-baseline",
  sub: "align-sub",
  super: "align-super",
  "text-top": "align-text-top",
  "text-bottom": "align-text-bottom"
};
export const verticalAlignClasses = [...Object.values(verticalAlignMap)];
export const verticalAlignValues = Object.keys(verticalAlignMap);
export const classVerticalAlignMap: Record<string, VerticalAlign> = Object.entries(verticalAlignMap).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);
export function isVerticalAlign(value: string): value is VerticalAlign {
  return value in verticalAlignMap;
}
export const verticalAlignIcons: Record<VerticalAlign, IconType> = {
  top: AiOutlineVerticalAlignTop,
  middle: MdVerticalAlignCenter,
  bottom: AiOutlineVerticalAlignBottom,
  baseline: RxAlignBaseline,
  sub: ImSubscript2,
  super: ImSuperscript2,
  "text-top": RxTextAlignTop,
  "text-bottom": RxTextAlignBottom
};

export function getVerticalAlign(value: string): VerticalAlign {
  return classVerticalAlignMap[value] ?? "top";
}
