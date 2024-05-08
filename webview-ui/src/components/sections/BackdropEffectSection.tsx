import { SectionHeader } from "../layout/SectionHeader";
import { cn } from "../../lib/cn";
import { LuPlus } from "react-icons/lu";
import { useBackdropEffects } from "../hooks/useBackdropEffects";
import { BackdropEffectInput } from "../input/BackdropEffectInput";

export function BackdropEffectSection() {
  const { addNextBackdropEffect, configuredBackdropEffects, availableBackdropEffects } = useBackdropEffects();

  return (
    <div>
      <SectionHeader title="Backdrop effects">
        <LuPlus
          className={cn("btn", availableBackdropEffects.length === 0 && "disabled")}
          onClick={addNextBackdropEffect}
        />
      </SectionHeader>
      {configuredBackdropEffects.map((type) => (
        <BackdropEffectInput
          key={type}
          type={type}
          availableTypes={availableBackdropEffects}
        />
      ))}
    </div>
  );
}
