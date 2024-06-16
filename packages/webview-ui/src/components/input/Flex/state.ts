import { LayoutGridType, LayoutGridValue } from "./types";

export const layoutGridValues: LayoutGridValue[] = [
  "items-start",
  "items-center",
  "items-end",
  "justify-start",
  "justify-center",
  "justify-end",
  "justify-between"
];

export type LayoutGridCoord = [LayoutGridValue, LayoutGridValue, LayoutGridValue];

export const flexCoord: Record<LayoutGridType, { x: LayoutGridCoord; y: LayoutGridCoord }> = {
  column: {
    x: ["items-start", "items-center", "items-end"],
    y: ["justify-start", "justify-center", "justify-end"]
  },
  "column-auto": {
    x: ["items-start", "items-center", "items-end"],
    y: ["justify-between", "justify-between", "justify-between"]
  },
  row: {
    x: ["justify-start", "justify-center", "justify-end"],
    y: ["items-start", "items-center", "items-end"]
  },
  "row-auto": {
    x: ["justify-between", "justify-between", "justify-between"],
    y: ["items-start", "items-center", "items-end"]
  },
  wrap: {
    x: ["justify-start", "justify-center", "justify-end"],
    y: ["items-start", "items-center", "items-end"]
  },
  "wrap-auto": {
    x: ["justify-between", "justify-between", "justify-between"],
    y: ["items-start", "items-center", "items-end"]
  }
};
