import { useState } from "react";
import { RxTransparencyGrid } from "react-icons/rx";
import { ColorName, ColorType, createColor, getColorSearchName } from "../../../types/color";
import { NumberInput } from "../NumberInput";
import { SearchColorList } from "./SearchColorList";
import { ColorButton } from "./ColorButton";

export type ColorInputProps = {
  colorName: string | undefined;
  appliedColorName?: string;
  onChange?: (colorName: ColorName) => void;
};

export function ColorInput({ colorName, appliedColorName, onChange }: ColorInputProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [colorId, colorOpacity] = (colorName ?? "").split("/") as [
    ColorType,
    string?
  ];
  const [appliedColorId, appliedColorOpacity] = (appliedColorName ?? "").split("/") as [
    ColorType,
    string?
  ] ?? [];

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-2 align-center">
        <ColorButton
          colorId={colorId ?? appliedColorId ?? "transparent"}
          appliedColorId={appliedColorId ?? "transparent"}
          onChange={(newValue) => {
            onChange?.(createColor(newValue, colorOpacity ?? "100"));
            setShowSearch(false);
          }}
          onClick={() => setShowSearch((s) => !s)}
        />
        <NumberInput
          icon={RxTransparencyGrid}
          min={0}
          max={100}
          placeholder="Opacity"
          value={parseInt(colorOpacity ?? "100", 10)}
          applied={parseInt(appliedColorOpacity ?? "100", 10)}
          onChange={(value) => {
            onChange?.(createColor(colorId, `${value}`));
          }}
          onFocus={() => setShowSearch(false)}
        />
      </div>
      {showSearch ? (
        <SearchColorList
          initialSearch={getColorSearchName(colorId ?? appliedColorId) ?? ""}
          onChange={(newValue) => {
            onChange?.(createColor(newValue, colorOpacity ?? appliedColorOpacity ?? "100"));
            setShowSearch(false);
          }}
          onClose={() => setShowSearch(false)}
        />
      ) : null}
    </div>
  );
}
