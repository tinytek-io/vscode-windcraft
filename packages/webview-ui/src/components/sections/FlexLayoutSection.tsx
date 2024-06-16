import {
  CgArrowDown,
  CgArrowRight,
  CgCornerDownLeft,
  CgSpaceBetweenV,
  CgSpaceBetween,
  CgDistributeVertical,
  CgDistributeHorizontal,
  CgMoreAlt,
  CgSidebar,
  CgSidebarRight
} from "react-icons/cg";
import { LuMinus, LuPlus } from "react-icons/lu";
import { TbBorderSides } from "react-icons/tb";
import { cn } from "../../lib/cn";
import { Select } from "../input/Select";
import { SectionHeader } from "../layout/SectionHeader";
import { FlexLayoutGrid } from "../input/Flex/FlexLayoutGrid";
import { useFlex } from "../hooks/useFlex";
import { useGap } from "../hooks/useGap";
import { paddingNone, paddingValues } from "../../types/padding";
import { usePadding } from "../hooks/usePadding";
import { gapNone, gapValues } from "../../types/gap";

export function FlexLayoutSection() {
  const padding = usePadding();
  const flex = useFlex();
  const gap = useGap();

  return (
    <div>
      <SectionHeader title="Flex layout">
        {flex.enabled ? (
          <LuMinus className="btn" onClick={flex.removeFlex} />
        ) : (
          <LuPlus className="btn" onClick={flex.addFlex} />
        )}
      </SectionHeader>
      {flex.enabled && (
        <div className="flex px-2 py-1">
          <div className="flex flex-col w-full justify-between gap-2">
            {/* left */}
            <div className="flex gap-2">
              <CgArrowDown
                className={cn(
                  "btn",
                  flex.direction.current === "flex-col" ? "selected" : null,
                  flex.direction.current === "flex-col" && flex.direction.current !== flex.direction.applied
                    ? "changed"
                    : null
                )}
                onClick={() => flex.setDirection("flex-col")}
              />
              <CgArrowRight
                className={cn(
                  "btn",
                  (flex.direction.current ?? "flex-row") === "flex-row" ? "selected" : null,
                  flex.direction.current === "flex-row" && flex.direction.current !== flex.direction.applied
                    ? "changed"
                    : null
                )}
                onClick={() => flex.setDirection("flex-row")}
              />
              <CgCornerDownLeft
                className={cn(
                  "btn",
                  flex.direction.current === "flex-wrap" ? "selected" : null,
                  flex.direction.current === "flex-wrap" && flex.direction.current !== flex.direction.applied
                    ? "changed"
                    : null
                )}
                onClick={() => flex.setDirection("flex-wrap")}
              />
            </div>
            <div className="flex align-center">
              {flex.direction.current !== "flex-wrap" ? (
                <Select
                  icon={flex.direction.current === "flex-col" ? CgSpaceBetweenV : CgSpaceBetween}
                  value={gap.value.current ?? gap.value.applied ?? gapNone}
                  applied={gap.value.applied ?? gapNone}
                  options={gapValues}
                  onChange={gap.updateValue}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <Select
                    icon={CgSpaceBetween}
                    value={gap.x.current ?? gap.x.applied ?? gapNone}
                    applied={gap.x.applied ?? gapNone}
                    options={gapValues}
                    onChange={gap.updateX}
                  />
                  <Select
                    icon={CgSpaceBetweenV}
                    value={gap.y.current ?? gap.y.applied ?? gapNone}
                    applied={gap.y.applied ?? gapNone}
                    options={gapValues}
                    onChange={gap.updateY}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {padding.isAdvanced ? (
                <>
                  <Select
                    icon={CgSidebar}
                    value={padding.left.current ?? padding.left.applied ?? paddingNone}
                    applied={padding.left.applied ?? paddingNone}
                    options={paddingValues}
                    onChange={padding.updateLeft}
                  />
                  <Select
                    icon={CgSidebarRight}
                    value={padding.right.current ?? padding.right.applied ?? paddingNone}
                    applied={padding.right.applied ?? paddingNone}
                    options={paddingValues}
                    onChange={padding.updateRight}
                  />
                </>
              ) : (
                <Select
                  icon={CgDistributeHorizontal}
                  value={padding.x.current ?? padding.x.applied ?? paddingNone}
                  applied={padding.x.applied ?? paddingNone}
                  options={paddingValues}
                  onChange={padding.updateX}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col w-full justify-between gap-2">
            {/* center */}
            <FlexLayoutGrid />
            <div className="flex flex-col gap-2">
              {padding.isAdvanced ? (
                <>
                  <Select
                    icon={CgSidebar}
                    iconClassName="rotate-90"
                    value={padding.top.current ?? padding.top.applied ?? paddingNone}
                    applied={padding.top.applied ?? paddingNone}
                    options={paddingValues}
                    onChange={padding.updateTop}
                  />
                  <Select
                    icon={CgSidebarRight}
                    iconClassName="rotate-90"
                    value={padding.bottom.current ?? padding.bottom.applied ?? paddingNone}
                    applied={padding.bottom.applied ?? paddingNone}
                    options={paddingValues}
                    onChange={padding.updateBottom}
                  />
                </>
              ) : (
                <Select
                  icon={CgDistributeVertical}
                  value={padding.y.current ?? padding.y.applied ?? paddingNone}
                  applied={padding.y.applied ?? paddingNone}
                  options={paddingValues}
                  onChange={padding.updateY}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between px-1 gap-2">
            {/* right */}
            <div>{/* <CgMoreAlt /> */}</div>
            <div></div>
            <div>
              <TbBorderSides
                className={cn(
                  "btn",
                  padding.isAdvanced ? "selected" : null,
                  padding.isAdvancedChanged ? "changed" : null
                )}
                onClick={padding.toggleMode}
              />
            </div>
            {padding.isAdvanced ? <div></div> : null}
          </div>
        </div>
      )}
    </div>
  );
}
