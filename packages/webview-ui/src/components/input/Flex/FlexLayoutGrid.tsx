import { LuDot } from "react-icons/lu";
import { getLayoutGridType } from "./types";
import { layoutGrids } from "./grid";
import { useExtensionState } from "../../../tailwindModel/State/ExtensionStateProvider";
import { FlexDirection, useFlex } from "../../hooks/useFlex";
import { useGap } from "../../hooks/useGap";
import { flexCoord, layoutGridValues } from "./state";
import { gapNone } from "../../../types/gap";
import { cn } from "../../../lib/cn";

export type FlexLayoutGridProps = {};

export function FlexLayoutGrid({}: FlexLayoutGridProps) {
  const { updateCurrentStyles, getValueOneOf } = useExtensionState();
  const flex = useFlex();
  const gap = useGap();

  const gapXValue = {
    current:
      gap.value.current ??
      gap.value.current ??
      gap.x.current ??
      gap.x.current ??
      gap.value.applied ??
      gap.x.applied ??
      gapNone,
    applied: gap.value.applied ?? gap.x.applied ?? gapNone
  };

  const isGapXAuto = gapXValue.current === gapNone;

  const flexDirection = (flex.direction.current ?? flex.direction.applied ?? "flex-row") as FlexDirection;
  const gridType = getLayoutGridType(flexDirection, isGapXAuto);

  const coord = flexCoord[gridType];

  const defaultX = coord.x[0];
  const defaultY = coord.y[0];

  const keyX = getValueOneOf(coord.x);
  const keyY = getValueOneOf(coord.y);

  const grid = layoutGrids[gridType];

  return (
    <div className="flex flex-col border rounded w-fit p-px">
      {/* Dots matrix */}
      {[0, 1, 2].map((y) => (
        <div key={y} className="flex">
          {/* Dots row */}
          {[0, 1, 2].map((x) => {
            const Icon = grid[y][x];
            const currentX = coord.x[x];
            const currentY = coord.y[y];

            const currentSet =
              currentX === (keyX.current ?? keyX.applied ?? defaultX) &&
              currentY === (keyY.current ?? keyY.applied ?? defaultY);
            const appliedSet = currentX === (keyX.applied ?? defaultX) && currentY === (keyY.applied ?? defaultY);

            if (currentSet) {
              return (
                <Icon
                  key={x}
                  className={cn("flex-grid", currentSet && appliedSet ? null : "changed")}
                  title={`${currentX} ${currentY}`}
                />
              );
            }
            return (
              <LuDot
                key={x}
                className="cursor-pointer"
                title={`Set ${currentX} ${currentY}`}
                onClick={() => {
                  if (appliedSet) {
                    // Remove using the applied values
                    updateCurrentStyles(layoutGridValues, []);
                  } else {
                    // Set using the current values
                    updateCurrentStyles(layoutGridValues, [currentX, currentY]);
                  }
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
