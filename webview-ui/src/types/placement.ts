export const placementXPrefix = "left-";
export const placementYPrefix = "top-";

export const placementNone = "auto";
export const placementValues = [
  placementNone,
  "0",
  "px",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
  "1/2",
  "1/3",
  "2/3",
  "1/4",
  "2/4",
  "3/4",
  "full",
];

export const placementXClasses = placementValues.map(
  (x) => `${placementXPrefix}${x}`
);
export const placementYClasses = placementValues.map(
  (y) => `${placementYPrefix}${y}`
);
