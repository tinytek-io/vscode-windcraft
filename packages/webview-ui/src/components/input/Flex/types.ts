import { IconType } from "react-icons";
import { FlexDirection } from "../../hooks/useFlex";

export type LayoutGridType = "row" | "row-auto" | "column" | "column-auto" | "wrap" | "wrap-auto";

export type LayoutGridValue =
  | "items-start"
  | "items-center"
  | "items-end"
  | "justify-start"
  | "justify-center"
  | "justify-end"
  | "justify-between";

export type LayoutGridStateRow = [LayoutGridValue[], LayoutGridValue[], LayoutGridValue[]];
export type LayoutGridStateCol = [LayoutGridStateRow, LayoutGridStateRow, LayoutGridStateRow];
export type LayoutGridState = Record<LayoutGridType, LayoutGridStateCol>;

export type LayoutBoxRowIcons = [IconType, IconType, IconType];
export type LayoutGridIcons = [LayoutBoxRowIcons, LayoutBoxRowIcons, LayoutBoxRowIcons];
export type LayoutGrids = Record<LayoutGridType, LayoutGridIcons>;

export function getLayoutGridType(direction: FlexDirection, gapAuto: boolean): LayoutGridType {
  if (direction === "flex-row") {
    return gapAuto ? "row-auto" : "row";
  } else if (direction === "flex-col") {
    return gapAuto ? "column-auto" : "column";
  } else {
    return gapAuto ? "wrap-auto" : "wrap";
  }
}
