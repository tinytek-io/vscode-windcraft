import { LuMinus, LuPlus } from "react-icons/lu";
import { SectionHeader } from "../layout/SectionHeader";
import { useBorderSection } from "../hooks/useBorderSection";
import { BorderWidthInput } from "../input/BorderWidthInput";
import { BorderColorInput } from "../input/BorderColorInput";

export function BorderSection() {
  const { borderClasses, addBorder, removeBorder } = useBorderSection();

  const hasBorder = borderClasses.current.length > 0 || borderClasses.applied.length > 0;

  return (
    <div className="flex flex-col">
      <SectionHeader title="Border">
        {hasBorder ? (
          <LuMinus className="btn" onClick={removeBorder} />
        ) : (
          <LuPlus className="btn" onClick={addBorder} />
        )}
      </SectionHeader>
      {hasBorder && (
        <>
          <div className="flex px-2">
            <BorderColorInput />
          </div>
          <div className="flex flex-col px-2">
            <BorderWidthInput />
          </div>
        </>
      )}
    </div>
  );
}
