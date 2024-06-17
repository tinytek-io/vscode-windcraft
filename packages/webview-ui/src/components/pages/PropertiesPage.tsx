import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { AlignmentSection } from "../sections/AlignmentSection";
import { ConstraintsSection } from "../sections/ContraintsSection";
import { DynamicSection } from "../sections/DynamicSection";
import { ElementSection } from "../sections/ElementSection";
import { FlexLayoutSection } from "../sections/FlexLayoutSection";
import { usePosition } from "../hooks/usePosition";
import { BackgroundSection } from "../sections/BackgroundSection";
import { TextSection } from "../sections/TextSection";
import { BorderSection } from "../sections/BorderSection";
import { LayerSection } from "../sections/LayerSection";
import { LayerEffectSection } from "../sections/LayerEffectSection";
import { BackdropEffectSection } from "../sections/BackdropEffectSection";

export function PropertiesPage() {
  const { position } = usePosition();

  return (
    <>
      <AlignmentSection />

      <VSCodeDivider />

      <DynamicSection />

      <VSCodeDivider />

      <ElementSection />

      <VSCodeDivider />

      <FlexLayoutSection />

      <VSCodeDivider />

      {(position.current || position.applied) && (
        <>
          <ConstraintsSection />

          <VSCodeDivider />
        </>
      )}

      <LayerSection />

      <VSCodeDivider />

      <TextSection />

      <VSCodeDivider />

      <BackgroundSection />

      <VSCodeDivider />

      <BorderSection />

      <VSCodeDivider />

      <LayerEffectSection />

      <VSCodeDivider />

      <BackdropEffectSection />

      <VSCodeDivider />
    </>
  );
}

function DebugClassName() {
  const { styleState } = useExtensionState();

  return (
    <>
      <div className="p-2">
        <b>State:</b> {styleState.modifierState}
      </div>
      <div className="p-2">
        <b>Current:</b>
        <ul>
          {styleState.currentTailwindStyles.map((style) => (
            <li key={style}>{style}</li>
          ))}
        </ul>
      </div>

      <div className="p-2">
        <b>Applied:</b>
        <ul>
          {styleState.appliedTailwindStyles.map((style) => (
            <li key={style}>{style}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
