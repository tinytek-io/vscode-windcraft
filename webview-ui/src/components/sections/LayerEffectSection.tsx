import { SectionHeader } from "../layout/SectionHeader";
import { cn } from "../../lib/cn";
import { LuPlus } from "react-icons/lu";
import { useLayerEffects } from "../hooks/useLayerEffects";
import { LayerEffectInput } from "../input/LayerEffectInput";

export function LayerEffectSection() {
  const { addNextLayerEffect, configuredLayerEffects, availableLayerEffects } = useLayerEffects();

  return (
    <div>
      <SectionHeader title="Layer effecs">
        <LuPlus
          className={cn("btn", availableLayerEffects.length === 0 && "disabled")}
          onClick={addNextLayerEffect}
        />
      </SectionHeader>
      {configuredLayerEffects.map((type) => (
        <LayerEffectInput
          key={type}
          type={type}
          availableTypes={availableLayerEffects}
        />
      ))}
    </div>
  );
}
