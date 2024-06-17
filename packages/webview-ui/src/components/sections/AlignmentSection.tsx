import { CgAlignLeft, CgAlignCenter, CgAlignRight, CgAlignTop, CgAlignMiddle, CgAlignBottom } from "react-icons/cg";
import { usePosition } from "../hooks/usePosition";
import { cn } from "../../lib/cn";
import { SectionHeader } from "../layout/SectionHeader";
import { useHorizontalConstraint } from "../hooks/useHorizontalConstraint";
import { useVerticalConstraint } from "../hooks/useVerticalConstraint";

export function AlignmentSection() {
  const { position } = usePosition();
  const { horizontalConstraintValueChange } = useHorizontalConstraint();
  const { verticalConstraintValueChange } = useVerticalConstraint();
  const disabled = position.current != null || position.applied != null ? null : "disabled";
  return (
    <div>
      <SectionHeader title="Design" />
      <div className="flex justify-between px-2 py-1">
        {/* Align */}
        <CgAlignLeft className={cn("btn", disabled)} onClick={() => horizontalConstraintValueChange("left")} />
        <CgAlignCenter className={cn("btn", disabled)} onClick={() => horizontalConstraintValueChange("insetX")} />
        <CgAlignRight className={cn("btn", disabled)} onClick={() => horizontalConstraintValueChange("right")} />
        <CgAlignTop className={cn("btn", disabled)} onClick={() => verticalConstraintValueChange("top")} />
        <CgAlignMiddle className={cn("btn", disabled)} onClick={() => verticalConstraintValueChange("insetY")} />
        <CgAlignBottom className={cn("btn", disabled)} onClick={() => verticalConstraintValueChange("bottom")} />
        {/* TODO: Button / dropdown */}
      </div>
    </div>
  );
}
