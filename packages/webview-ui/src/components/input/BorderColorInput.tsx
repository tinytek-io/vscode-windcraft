import { ColorInput } from "./Color/ColorInput";
import { useColor } from "../hooks/useColor";

export function BorderColorInput() {
  const borderColor = useColor("border-");

  if (!borderColor.color.current && !borderColor.color.applied) {
    return null;
  }

  return (
    <ColorInput
      colorName={borderColor.color.current ?? borderColor.color.applied ?? "transparent"}
      appliedColorName={borderColor.color.applied ?? "transparent"}
      onChange={(newColor) => {
        borderColor.setColor(newColor);
      }}
    />
  );
}
