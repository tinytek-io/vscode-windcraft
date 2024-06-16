import {
  MdAlignVerticalTop,
  MdAlignVerticalCenter,
  MdAlignVerticalBottom,
  MdAlignHorizontalLeft,
  MdOutlineAlignHorizontalCenter,
  MdAlignHorizontalRight
} from "react-icons/md";
import { LayoutGrids } from "./types";
import { BsGrid3X2GapFill } from "react-icons/bs";
import {
  PiAlignBottomFill,
  PiAlignBottomSimpleFill,
  PiAlignCenterHorizontalSimpleFill,
  PiAlignCenterVerticalFill,
  PiAlignCenterVerticalSimpleFill,
  PiAlignLeftSimpleFill,
  PiAlignRightSimpleFill,
  PiAlignTopFill,
  PiAlignTopSimpleFill
} from "react-icons/pi";

export const layoutGrids: LayoutGrids = {
  row: [
    [MdAlignVerticalTop, MdAlignVerticalTop, MdAlignVerticalTop],
    [MdAlignVerticalCenter, MdAlignVerticalCenter, MdAlignVerticalCenter],
    [MdAlignVerticalBottom, MdAlignVerticalBottom, MdAlignVerticalBottom]
  ],
  "row-auto": [
    [PiAlignTopSimpleFill, PiAlignTopSimpleFill, PiAlignTopSimpleFill],
    [PiAlignCenterVerticalSimpleFill, PiAlignCenterVerticalSimpleFill, PiAlignCenterVerticalSimpleFill],
    [PiAlignBottomSimpleFill, PiAlignBottomSimpleFill, PiAlignBottomSimpleFill]
  ],
  column: [
    [MdAlignHorizontalLeft, MdOutlineAlignHorizontalCenter, MdAlignHorizontalRight],
    [MdAlignHorizontalLeft, MdOutlineAlignHorizontalCenter, MdAlignHorizontalRight],
    [MdAlignHorizontalLeft, MdOutlineAlignHorizontalCenter, MdAlignHorizontalRight]
  ],
  "column-auto": [
    [PiAlignLeftSimpleFill, PiAlignCenterHorizontalSimpleFill, PiAlignRightSimpleFill],
    [PiAlignLeftSimpleFill, PiAlignCenterHorizontalSimpleFill, PiAlignRightSimpleFill],
    [PiAlignLeftSimpleFill, PiAlignCenterHorizontalSimpleFill, PiAlignRightSimpleFill]
  ],
  wrap: [
    [BsGrid3X2GapFill, BsGrid3X2GapFill, BsGrid3X2GapFill],
    [BsGrid3X2GapFill, BsGrid3X2GapFill, BsGrid3X2GapFill],
    [BsGrid3X2GapFill, BsGrid3X2GapFill, BsGrid3X2GapFill]
  ],
  "wrap-auto": [
    [PiAlignTopFill, PiAlignTopSimpleFill, PiAlignTopFill],
    [PiAlignCenterVerticalFill, PiAlignCenterVerticalSimpleFill, PiAlignCenterVerticalFill],
    [PiAlignBottomFill, PiAlignBottomSimpleFill, PiAlignBottomFill]
  ]
};
