import { Select } from "./Select";
import { CgBorderTop, CgBorderRight, CgBorderBottom, CgBorderLeft } from "react-icons/cg";
import { RxBorderWidth } from "react-icons/rx";
import { cn } from "../../lib/cn";
import { borderWidthIconsMap, borderWidthValues, borderWidthTypes, BorderWidthValue } from "../../types/borderWidth";
import { useBorderConfig } from "../hooks/useBorderConfig";
import { CurrentAppliedType } from "../../types/general";


export function BorderWidthInput() {
  const { borderWidthType, borderWidth, setBorderType, setBorderWidth, borderWidthMap, toggleBorder } = useBorderConfig();

  const Icon = borderWidthIconsMap[borderWidthType.current ?? borderWidthType.applied ?? "All"];

  return (
    <div className="grid grid-cols-2 gap-y-2 py-2">
      <Select
        icon={RxBorderWidth}
        value={borderWidth.current ?? borderWidth.applied ?? "1"}
        applied={borderWidth.applied ?? "1"}
        options={borderWidthValues}
        onChange={setBorderWidth} />
      <Select
        icon={Icon}
        iconClassName="w-4 h-4"
        value={borderWidthType.current ?? borderWidthType.applied ?? "All"}
        applied={borderWidthType.applied ?? "All"}
        options={borderWidthTypes}
        onChange={setBorderType} />
      {(borderWidthType.current ?? borderWidthType.applied) === "Custom" && (
        <>
          <div className="flex gap-1 items-center">
            <CgBorderLeft className={cn(
              "btn w-4 h-4",
              isBorderSelected(borderWidthMap.Left) ? "selected" : null,
              isBorderChanged(borderWidthMap.Left) ? "changed" : null,
            )}
              onClick={() => toggleBorder("Left")} /> Left
          </div>
          <div className="flex gap-1 items-center">
            <CgBorderTop className={cn(
              "btn w-4 h-4",
              isBorderSelected(borderWidthMap.Top) ? "selected" : null,
              isBorderChanged(borderWidthMap.Top) ? "changed" : null,
            )}
              onClick={() => toggleBorder("Top")} /> Top
          </div>
          <div className="flex gap-1 items-center">
            <CgBorderRight className={cn(
              "btn w-4 h-4",
              isBorderSelected(borderWidthMap.Right) ? "selected" : null,
              isBorderChanged(borderWidthMap.Right) ? "changed" : null,
            )}
              onClick={() => toggleBorder("Right")} /> Right
          </div>
          <div className="flex gap-1 items-center">
            <CgBorderBottom className={cn(
              "btn w-4 h-4",
              isBorderSelected(borderWidthMap.Bottom) ? "selected" : null,
              isBorderChanged(borderWidthMap.Bottom) ? "changed" : null,
            )}
              onClick={() => toggleBorder("Bottom")}
            /> Bottom
          </div>
        </>
      )}
    </div>
  );
}

function isBorderSelected(borderWidthValue: CurrentAppliedType<BorderWidthValue | undefined>) {
  return (borderWidthValue.current ?? borderWidthValue.applied ?? "0") !== "0";
}

function isBorderChanged(borderWidthValue: CurrentAppliedType<BorderWidthValue | undefined>) {
  const current = (borderWidthValue.current ?? borderWidthValue.applied ?? "0") !== "0";
  const applied = (borderWidthValue.applied ?? "0") !== "0";
  return current !== applied;
}