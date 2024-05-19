export const aspectRatioPrefix = "aspect-";
export const aspectRatioNone = "auto";

export const aspectRatioValues = ["auto", "square", "video"];
export const aspectRatioClasses = [
  "aspect-auto",
  "aspect-square",
  "aspect-video",
];

export function getAspectRatioValue(value: string) {
  const index = aspectRatioValues.indexOf(value);
  const defaultIndex = aspectRatioValues.indexOf(aspectRatioNone);
  return aspectRatioClasses[index] ?? aspectRatioClasses[defaultIndex];
}

export function getKeyFromValue(className: string) {
  const index = aspectRatioClasses.indexOf(className);
  return aspectRatioValues[index];
}
