import { IconType } from "react-icons";
import {
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from "react-icons/fa";
import { MdAlignHorizontalLeft, MdAlignHorizontalRight } from "react-icons/md";

export type TextAlign =
  | "left"
  | "center"
  | "right"
  | "justify"
  | "start"
  | "end";
export const textAlignMap: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
  start: "text-start",
  end: "text-end",
};
export const textAlignClasses = [...Object.values(textAlignMap)];
export const textAlignValues = Object.keys(textAlignMap);
export const classTextAlignMap: Record<string, TextAlign> = Object.entries(
  textAlignMap
).reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});
export function isTextAlign(value: string): value is TextAlign {
  return value in textAlignMap;
}
export const textAlignIcons: Record<TextAlign, IconType> = {
  left: FaAlignLeft,
  center: FaAlignCenter,
  right: FaAlignRight,
  justify: FaAlignJustify,
  start: MdAlignHorizontalLeft,
  end: MdAlignHorizontalRight,
};

export function getTextAlign(value: string): TextAlign {
  return classTextAlignMap[value] ?? "left";
}
