import { PiArrowsHorizontalFill, PiArrowsVerticalFill } from "react-icons/pi";
import { Select } from "../input/Select";
import { type PositionType, positionValues, usePosition } from "../hooks/usePosition";
import { pascalCase } from "../../lib/pascalCase";
import { SectionHeader } from "../layout/SectionHeader";
import { horizontalConstraintNone, horizontalConstraintOptions } from "../../types/constraintHorizontal";
import { verticalConstraintNone, verticalConstraintOptions } from "../../types/constraintVertical";
import { ConstraintsControl } from "../input/ConstraintsControl/ConstraintsControl";
import { useHorizontalConstraint } from "../hooks/useHorizontalConstraint";
import { useVerticalConstraint } from "../hooks/useVerticalConstraint";

export function ConstraintsSection() {
  const { position, hasPosition, setPosition } = usePosition();
  const { verticalConstraints, verticalOption, verticalConstraintOptionChange, verticalConstraintValueChange } =
    useVerticalConstraint();
  const { horizontalConstraints, horizontalOption, horizontalConstraintOptionChange, horizontalConstraintValueChange } =
    useHorizontalConstraint();

  if (!hasPosition) {
    return null;
  }

  return (
    <div>
      <SectionHeader title="Constraints" />
      <div className="flex px-2 py-1 align-center gap-4">
        <div className="flex w-fit h-fit px-1">
          {/* left */}
          <ConstraintsControl
            left={horizontalConstraints.left}
            right={horizontalConstraints.right}
            insetX={horizontalConstraints.insetX}
            top={verticalConstraints.top}
            bottom={verticalConstraints.bottom}
            insetY={verticalConstraints.insetY}
            onHorizontalClick={horizontalConstraintValueChange}
            onVerticalClick={verticalConstraintValueChange}
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          {/* right */}
          <Select
            icon={PiArrowsHorizontalFill}
            value={pascalCase(position.current ?? position.applied ?? "absolute")}
            applied={pascalCase(position.applied ?? "absolute")}
            options={[...positionValues].map(pascalCase)}
            onChange={(newPosition) => {
              setPosition(newPosition.toLowerCase() as PositionType);
            }}
            style={{ width: "130px" }}
          />
          <Select
            icon={PiArrowsVerticalFill}
            value={verticalOption.current ?? verticalOption.applied ?? verticalConstraintNone}
            applied={verticalOption.applied ?? verticalConstraintNone}
            options={verticalConstraintOptions}
            onChange={verticalConstraintOptionChange}
            style={{ width: "130px" }}
          />
          <Select
            icon={PiArrowsHorizontalFill}
            value={horizontalOption.current ?? horizontalOption.applied ?? horizontalConstraintNone}
            applied={horizontalOption.applied ?? horizontalConstraintNone}
            options={horizontalConstraintOptions}
            onChange={horizontalConstraintOptionChange}
            style={{ width: "130px" }}
          />
        </div>
      </div>
    </div>
  );
}
