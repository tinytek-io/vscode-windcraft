import { HorizontalConstraintsState, HorizontalSelectValue } from "../../../types/constraintHorizontal";
import { VerticalConstraintsState, VerticalSelectValue } from "../../../types/constraintVertical";
import { HorizontalButton, VerticalButton } from "./ConstraintButton";
import { EventTriangle } from "./EventTriangle";


export type ConstraintsProps = VerticalConstraintsState & HorizontalConstraintsState & {
  onHorizontalClick: (type: HorizontalSelectValue) => void;
  onVerticalClick: (type: VerticalSelectValue) => void;
};

export function ConstraintsControl({
  left, right, top, bottom, insetX, insetY, onHorizontalClick, onVerticalClick,
}: Readonly<ConstraintsProps>) {
  return (
    <div className="constraints-container flex border rounded aspect-square">
      {/* main box */}
      <div className="flex flex-col justify-center p-px">
        {/* left */}
        <HorizontalButton selected={left.current || left.applied} applied={left.applied} onClick={() => onHorizontalClick("left")} />
      </div>
      <div className="flex flex-col w-full">
        {/* center */}
        <div className="flex justify-center p-px">
          {/* top */}
          <VerticalButton selected={top.current || top.applied} applied={top.applied} onClick={() => onVerticalClick("top")} />
        </div>
        <div
          className="constraints-center-box flex border rounded relative w-10 h-10"
          style={{ position: "relative" }}
        >
          {/* center box */}
          <div className="absolute w-full h-full flex flex-col justify-center align-center">
            <VerticalButton selected={insetY.current || insetY.applied} applied={insetY.applied} />
            <VerticalButton selected={insetY.current || insetY.applied} applied={insetY.applied} />
          </div>
          <div className="absolute w-full h-full flex justify-center align-center">
            <HorizontalButton selected={insetX.current || insetX.applied} applied={insetX.applied} />
            <HorizontalButton selected={insetX.current || insetX.applied} applied={insetX.applied} />
          </div>
          <EventTriangle onClick={(value: "insetX" | "insetY") => {
            value === "insetX" ? onHorizontalClick("insetX") : onVerticalClick("insetY");
          }} />
        </div>
        <div className="flex justify-center p-px">
          {/* bottom */}
          <VerticalButton selected={bottom.current || bottom.applied} applied={bottom.applied} onClick={() => onVerticalClick("bottom")} />
        </div>
      </div>
      <div className="flex flex-col justify-center p-px">
        {/* right */}
        <HorizontalButton selected={right.current || right.applied} applied={right.applied} onClick={() => onHorizontalClick("right")} />
      </div>
    </div>
  );
}
