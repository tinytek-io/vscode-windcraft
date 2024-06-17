export const rotationPrefix = "rotate-";
export const rotationNone = "0";
export const rotationValues = [
  rotationNone,
  // "0",
  "1",
  "2",
  "3",
  "6",
  "12",
  "45",
  "90",
  "180"
];
export const rotationClasses = rotationValues.map((v) => `${rotationPrefix}${v}`);
