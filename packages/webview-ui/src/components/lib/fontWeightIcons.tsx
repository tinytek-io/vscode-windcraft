import { FontWeight } from "../../types/fontWeight";
import { IconType } from "react-icons";
import { RiFontSize2 } from "react-icons/ri";

export const fontWeightIcons: Record<FontWeight, IconType> = {
  /* 1 */ Thin: () => <RiFontSize2 style={{ strokeWidth: "0.1px", opacity: 0.5 }} />,
  /* 2 */ "Extra light": () => <RiFontSize2 style={{ strokeWidth: "0.3px", opacity: 0.55 }} />,
  /* 3 */ Light: () => <RiFontSize2 style={{ strokeWidth: "0.5px", opacity: 0.6 }} />,
  /* 4 */ Normal: () => <RiFontSize2 style={{ strokeWidth: "1px", opacity: 0.65 }} />,
  /* 5 */ Medium: () => <RiFontSize2 style={{ strokeWidth: "1.5px", opacity: 0.75 }} />,
  /* 6 */ Semibold: () => <RiFontSize2 style={{ strokeWidth: "1.6px", opacity: 0.8 }} />,
  /* 7 */ Bold: () => <RiFontSize2 style={{ strokeWidth: "1.7px", opacity: 0.85 }} />,
  /* 8 */ Extrabold: () => <RiFontSize2 style={{ strokeWidth: "1.8px", opacity: 0.9 }} />,
  /* 9 */ Black: () => <RiFontSize2 style={{ strokeWidth: "2px", opacity: 1 }} />
};
