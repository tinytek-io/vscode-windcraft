import { Select } from "./Select";
import { RxShadow } from "react-icons/rx";
import { cn } from "../../lib/cn";
import { LuMinus } from "react-icons/lu";
import { useMemo } from "react";
import { IconType } from "react-icons";
import { ImBrightnessContrast } from "react-icons/im";
import { IoMdColorPalette } from "react-icons/io";
import { IoInvertModeOutline } from "react-icons/io5";
import { MdBlurOn, MdOpacity } from "react-icons/md";
import { RiContrastFill } from "react-icons/ri";
import { TbColorSwatch } from "react-icons/tb";
import { TfiCamera } from "react-icons/tfi";
import { useBackdropEffectValue } from "../hooks/useBackdropEffects";
import { BackdropEffectType } from "../../types/backdropEffects";


export type EffectInputProps = {
  type: BackdropEffectType;
  availableTypes: BackdropEffectType[];
};

export function BackdropEffectInput({ type, availableTypes }: Readonly<EffectInputProps>) {
  const { value, allValues, removeValue, setValue, changeType } = useBackdropEffectValue(type);
  const Icon = useMemo(() => backdropEffectIcons[type], [type]);

  const isChanged = value.current !== value.applied;

  return (
    <div className="flex justify-between px-2 py-1">
      {/* Backdrop */}
      <Select
        icon={Icon}
        value={type}
        applied={isChanged ? undefined : type}
        options={[type, ...availableTypes].toSorted()}
        onChange={changeType}
        title="Backdrop effect type"
        disabled={availableTypes.length === 0} />
      <Select
        icon={Icon}
        value={value.current ?? value.applied}
        applied={value.applied}
        options={allValues}
        onChange={setValue}
        title={`Backdrop effect value`} />
      <LuMinus
        className={cn(
          "btn",
          isChanged ? "" : "disabled",
        )}
        onClick={isChanged ? removeValue : undefined}
        title="Remove backdrop effect"
      />
    </div>
  );
}

const backdropEffectIcons: Record<BackdropEffectType, IconType> = {
  Blur: MdBlurOn,
  Brightness: ImBrightnessContrast,
  Contrast: RiContrastFill,
  Grayscale: RxShadow,
  HueRotate: TbColorSwatch,
  Invert: IoInvertModeOutline,
  Opacity: MdOpacity,
  Saturate: IoMdColorPalette,
  Sepia: TfiCamera,
};
