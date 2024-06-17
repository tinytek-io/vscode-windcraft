import { LuMinus, LuPlus } from "react-icons/lu";
import { ColorInput } from "../input/Color/ColorInput";
import { SectionHeader } from "../layout/SectionHeader";
import { useColor } from "../hooks/useColor";

export function BackgroundSection() {
  const background = useColor("bg-");
  const hasBackground = (background.color.current ?? background.color.applied) != null;

  return (
    <div className="flex flex-col">
      <SectionHeader title="Background">
        {hasBackground ? (
          <LuMinus
            className="btn"
            onClick={() => {
              background.resetColor();
            }}
          />
        ) : (
          <LuPlus
            className="btn"
            onClick={() => {
              background.setColor("white");
            }}
          />
        )}
      </SectionHeader>
      {hasBackground && (
        <div className="flex px-2 py-2">
          <ColorInput
            colorName={background.color.current ?? background.color.applied ?? "transparent"}
            appliedColorName={background.color.applied ?? "transparent"}
            onChange={(newColor) => {
              background.setColor(newColor);
            }}
          />
        </div>
      )}
    </div>
  );
}
