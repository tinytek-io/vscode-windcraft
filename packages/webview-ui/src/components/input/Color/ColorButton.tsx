import { useRef } from "react";
import { useWheelSelect } from "../../hooks/useWheelSelect";
import { ColorType, getColorSearchName, colors, formatColorName } from "../../../types/color";
import { cn } from "../../../lib/cn";

export type ColorButtonProps = {
  colorId: ColorType;
  appliedColorId?: ColorType;
  disabled?: boolean;
  onClick?: () => void;
  onChange: (color: ColorType) => void;
};

export function ColorButton({ colorId, appliedColorId, disabled, onClick, onChange }: ColorButtonProps) {
  const resizeRef = useRef<HTMLDivElement | null>(null);
  const search = getColorSearchName(colorId) ?? "";
  const result = colorSearch(search);

  const colorValue = colors[colorId];

  useWheelSelect({
    resizeRef,
    value: colorId,
    options: result.map(([key]) => key) as ColorType[],
    onChange,
    disabled
  });
  return (
    <div ref={resizeRef} className="color-input flex gap-2 cursor-pointer align-center" onClick={onClick} tabIndex={1}>
      <div className="w-3 h-3 border" style={{ backgroundColor: colorValue }} title={colorValue}></div>
      <div className={cn(colorId !== appliedColorId ? "changed" : null)}>
        {formatColorName(colorId ?? "transparent")}
      </div>
    </div>
  );
}

export function colorSearch(search: string) {
  const needles = search.split(" ").filter(Boolean);
  return Object.entries(colors).filter(([key, value]) => needles.every((needle) => key.includes(needle)));
}
