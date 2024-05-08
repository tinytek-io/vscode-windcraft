import { CgAssign, CgMaximize } from "react-icons/cg";
import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";
import { RxAngle, RxCornerTopLeft } from "react-icons/rx";
import { Select } from "../input/Select";
import {
  TbLetterH,
  TbLetterW,
  TbLetterX,
  TbLetterY,
  TbRadiusBottomLeft,
  TbRadiusBottomRight,
  TbRadiusTopLeft,
  TbRadiusTopRight,
} from "react-icons/tb";
import { cn } from "../../lib/cn";
import { LuLink2, LuUnlink2 } from "react-icons/lu";
import { MdAspectRatio } from "react-icons/md";
import { usePosition } from "../hooks/usePosition";
import { SectionHeader } from "../layout/SectionHeader";
import { IconToggleButton } from "../input/IconToggleButton";
import { rotationNone, rotationValues } from "../../types/rotation";
import { borderRadiusMap, borderRadiusNone } from "../../types/borderRadius";
import { aspectRatioNone, aspectRatioValues } from "../../types/aspectRatio";
import { placementNone, placementValues } from "../../types/placement";
import { widthNone, widthValues } from "../../types/width";
import { heightNone, heightValues } from "../../types/height";
import { useOverflow } from "../hooks/useOverflow";
import { useRotation } from "../hooks/useRotation";
import { usePlacement } from "../hooks/usePlacement";
import { useWidth } from "../hooks/useWidth";
import { useHeightOrAspectRatio } from "../hooks/useHeightOrAspectRatio";
import { useBorderRadius } from "../hooks/useBorderRadius";

export function ElementSection() {
  const { hasPosition, position, setPosition } = usePosition();
  const { rotation, setRotation } = useRotation();
  const { placementX, placementY, setPlacementX, setPlacementY } =
    usePlacement();
  const { clipContent, toggleClipContent } = useOverflow();
  const { width, setWidth } = useWidth();
  const {
    isAspectRatio,
    isAspectRatioToggled,
    height,
    setHeight,
    aspectRatio,
    setAspectRatio,
    toggleHeightOrAspectRatio,
  } = useHeightOrAspectRatio();
  const {
    borderRadius,
    borderRadiusTL,
    borderRadiusTR,
    borderRadiusBR,
    borderRadiusBL,
    multipleBorderRadius,
    setBorderRadius,
    setBorderRadiusBL,
    setBorderRadiusBR,
    setBorderRadiusTL,
    setBorderRadiusTR,
    toggleMultipleBorderRadius,
  } = useBorderRadius();

  return (
    <div className="flex flex-col">
      <SectionHeader title="Element">
        {/*<HiMiniArrowsPointingIn />*/}
      </SectionHeader>
      <div className="flex justify-between px-2">
        <div className="flex flex-col gap-2">
          {/* left */}
          <div>
            <Select
              icon={TbLetterX}
              value={placementX.current ?? placementX.applied ?? placementNone}
              applied={placementX.applied ?? placementNone}
              options={placementValues}
              onChange={setPlacementX}
              disabled={!hasPosition}
            />
          </div>
          <div>
            <Select
              icon={TbLetterW}
              value={width.current ?? width.applied ?? widthNone}
              applied={width.applied ?? widthNone}
              options={widthValues}
              onChange={setWidth}
            />
          </div>
          <div>
            <Select
              icon={RxAngle}
              value={`${rotation.current ?? rotation.applied ?? rotationNone}°`}
              applied={`${rotation.applied ?? rotationNone}°`}
              options={rotationValues.map((v) => `${v}°`)}
              onChange={setRotation}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {/* center */}
          <div>
            <Select
              icon={TbLetterY}
              value={placementY.current ?? placementY.applied ?? placementNone}
              applied={placementY.applied ?? placementNone}
              options={placementValues}
              onChange={setPlacementY}
              disabled={!hasPosition}
            />
          </div>
          <div>
            {isAspectRatio ? (
              <Select
                icon={MdAspectRatio}
                value={
                  aspectRatio.current ?? aspectRatio.applied ?? aspectRatioNone
                }
                applied={isAspectRatioToggled ? "[Height]" : aspectRatio.applied ?? aspectRatioNone}
                options={aspectRatioValues}
                onChange={setAspectRatio}
              />
            ) : (
              <Select
                icon={TbLetterH}
                value={height.current ?? height.applied ?? heightNone}
                applied={isAspectRatioToggled ? "[AspectRatio]" : height.applied ?? heightNone}
                options={heightValues}
                onChange={setHeight}
              />
            )}
          </div>
          <div>
            {multipleBorderRadius.current ? null : (
              <Select
                icon={RxCornerTopLeft}
                value={
                  borderRadius.current ??
                  borderRadius.applied ??
                  borderRadiusNone
                }
                applied={borderRadius.applied ?? borderRadiusNone}
                options={[...borderRadiusMap.keys()]}
                onChange={setBorderRadius}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between align-center">
          {/* right */}
          <div className="flex align-center">
            <CgAssign
              title="Enable positioning"
              className={cn(
                "btn",
                hasPosition ? "selected" : null,
                position.current ? "changed" : null
              )}
              onClick={() => {
                if (position.current != null) {
                  setPosition();
                } else {
                  setPosition("absolute");
                }
              }}
            />
          </div>
          <div className="flex align-center">
            <IconToggleButton
              icon={LuUnlink2}
              checkedIcon={LuLink2}
              checked={isAspectRatio}
              appliedChecked={isAspectRatioToggled ? !isAspectRatio : isAspectRatio}
              onClick={toggleHeightOrAspectRatio}
              title="Toggle aspect ratio"
            />
          </div>
          <div className="flex align-center">
            <CgMaximize
              title="Indepedent border radius"
              className={cn(
                "btn",
                multipleBorderRadius.current ? "selected" : null
              )}
              onClick={toggleMultipleBorderRadius}
            />
          </div>
        </div>
      </div>
      {multipleBorderRadius.current ? (
        <div className="flex px-2 py-1">
          <div className="flex flex-col gap-1">
            <Select
              icon={TbRadiusTopLeft}
              value={
                borderRadiusTL.current ??
                borderRadiusTL.applied ??
                borderRadiusNone
              }
              applied={borderRadiusTL.applied ?? borderRadiusNone}
              options={[...borderRadiusMap.keys()]}
              onChange={setBorderRadiusTL}
            />

            <Select
              icon={TbRadiusBottomLeft}
              value={
                borderRadiusBL.current ??
                borderRadiusBL.applied ??
                borderRadiusNone
              }
              applied={borderRadiusBL.applied ?? borderRadiusNone}
              options={[...borderRadiusMap.keys()]}
              onChange={setBorderRadiusBL}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Select
              icon={TbRadiusTopRight}
              value={
                borderRadiusTR.current ??
                borderRadiusTR.applied ??
                borderRadiusNone
              }
              applied={borderRadiusTR.applied ?? borderRadiusNone}
              options={[...borderRadiusMap.keys()]}
              onChange={setBorderRadiusTR}
            />

            <Select
              icon={TbRadiusBottomRight}
              value={
                borderRadiusBR.current ??
                borderRadiusBR.applied ??
                borderRadiusNone
              }
              applied={borderRadiusBR.applied ?? borderRadiusNone}
              options={[...borderRadiusMap.keys()]}
              onChange={setBorderRadiusBR}
            />
          </div>
        </div>
      ) : null}
      <div className="px-2 py-2">
        <div className="flex gap-1 align-center">
          <IconToggleButton
            icon={FaRegSquare}
            checkedIcon={FaRegCheckSquare}
            checked={
              (clipContent.current ?? clipContent.applied) === "overflow-hidden"
            }
            appliedChecked={clipContent.applied === "overflow-hidden"}
            onClick={toggleClipContent}
            title="Clip content"
          />
          Clip content
        </div>
      </div>
    </div>
  );
}
