import { SectionHeader } from "../layout/SectionHeader";
import { Select } from "../input/Select";
import { RxBlendingMode, RxTransparencyGrid } from "react-icons/rx";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { cn } from "../../lib/cn";
import { mixBlendInputValues, opacityValues } from "../../types/layer";
import { useLayer } from "../hooks/useLayer";
import { IconToggleButton } from "../input/IconToggleButton";

export function LayerSection() {
  const layer = useLayer();
  return (
    <div>
      <SectionHeader title="Layer" />
      <div className="flex justify-between px-2 py-1">
        {/* Layer */}
        <Select
          icon={RxBlendingMode}
          value={layer.mixBlend.current}
          applied={layer.mixBlend.applied}
          options={mixBlendInputValues}
          onChange={layer.setMixBlend}
          title="Element blend mode"
        />
        <Select
          icon={RxTransparencyGrid}
          value={layer.opacity.current}
          applied={layer.opacity.applied}
          options={opacityValues}
          onChange={layer.setOpacity}
          title="Element opacity"
        />
        <IconToggleButton
          icon={PiEye}
          checkedIcon={PiEyeClosed}
          checked={layer.hidden.current ?? layer.hidden.applied}
          appliedChecked={layer.hidden.applied}
          onClick={layer.toggleHidden}
          title="Element visibility"
        />
      </div>
    </div>
  );
}
