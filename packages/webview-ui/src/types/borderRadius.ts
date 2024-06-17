import type { KeySuffixMap } from "./general";

export const borderRadiusNone = "none";
export const borderRadiusMap: KeySuffixMap = new Map([
  // uiValue, tailwindValue
  ["none", "-none"],
  ["sm", "-sm"],
  ["rg", ""],
  ["md", "-md"],
  ["lg", "-lg"],
  ["xl", "-xl"],
  ["2xl", "-2xl"],
  ["3xl", "-3xl"],
  ["full", "-full"]
]);
export const borderRadiusClasses = [...borderRadiusMap.values()].map((s) => `rounded${s}`);
export const borderRadiusClassesTL = [...borderRadiusMap.values()].map((s) => `rounded-tl${s}`);
export const borderRadiusClassesTR = [...borderRadiusMap.values()].map((s) => `rounded-tr${s}`);
export const borderRadiusClassesBR = [...borderRadiusMap.values()].map((s) => `rounded-br${s}`);
export const borderRadiusClassesBL = [...borderRadiusMap.values()].map((s) => `rounded-bl${s}`);
export const borderRadiusClassesAll = [
  ...borderRadiusClasses,
  ...borderRadiusClassesTL,
  ...borderRadiusClassesTR,
  ...borderRadiusClassesBR,
  ...borderRadiusClassesBL
];
