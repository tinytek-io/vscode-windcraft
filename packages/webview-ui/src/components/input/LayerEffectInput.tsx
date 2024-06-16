import { Select } from "./Select";
import { RxShadow, RxShadowOuter } from "react-icons/rx";
import { cn } from "../../lib/cn";
import { LuMinus } from "react-icons/lu";
import { useMemo } from "react";
import { IconType } from "react-icons";
import { ImBrightnessContrast } from "react-icons/im";
import { IoMdColorPalette } from "react-icons/io";
import { IoInvertModeOutline } from "react-icons/io5";
import { MdBlurOn } from "react-icons/md";
import { RiContrastFill } from "react-icons/ri";
import { TbColorSwatch } from "react-icons/tb";
import { TfiCamera } from "react-icons/tfi";
import { LayerEffectType } from "../../types/layerEffects";
import { useLayerEffectValue } from "../hooks/useLayerEffects";

export type EffectInputProps = {
  type: LayerEffectType;
  availableTypes: LayerEffectType[];
};

export function LayerEffectInput({ type, availableTypes }: EffectInputProps) {
  const { value, allValues, removeValue, setValue, changeType } = useLayerEffectValue(type);
  const Icon = useMemo(() => layerEffectIcons[type], [type]);

  const isChanged = value.current !== value.applied;

  return (
    <div className="flex justify-between px-2 py-1">
      {/* Layer */}
      <Select
        icon={Icon}
        value={type}
        applied={isChanged ? undefined : type}
        options={[type, ...availableTypes].toSorted()}
        onChange={changeType}
        title="Layer effect type"
        disabled={availableTypes.length === 0}
      />
      <Select
        icon={Icon}
        value={value.current ?? value.applied}
        applied={value.applied}
        options={allValues}
        onChange={setValue}
        title={`Layer effect value`}
      />
      <LuMinus
        className={cn("btn", isChanged ? "" : "disabled")}
        onClick={isChanged ? removeValue : undefined}
        title="Remove layer effect"
      />
    </div>
  );
}
const layerEffectIcons: Record<LayerEffectType, IconType> = {
  Blur: MdBlurOn,
  Brightness: ImBrightnessContrast,
  Contrast: RiContrastFill,
  DropShadow: RxShadowOuter,
  Grayscale: RxShadow,
  HueRotate: TbColorSwatch,
  Invert: IoInvertModeOutline,
  Saturate: IoMdColorPalette,
  Sepia: TfiCamera
};
