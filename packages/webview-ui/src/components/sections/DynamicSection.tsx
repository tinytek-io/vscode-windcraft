import { useCallback } from "react";
import { LuBug, LuSunMedium, LuMoonStar, LuMonitorSmartphone } from "react-icons/lu";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { cn } from "../../lib/cn";
import { Select } from "../input/Select";
import { FaWpforms } from "react-icons/fa";
import { VscSymbolEvent } from "react-icons/vsc";
import { TextButton } from "../input/TextButton";
import { SectionHeader } from "../layout/SectionHeader";

const debugModifiers = ["!outline", "!outline-red-500"];

export type DeviceMode = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export const deviceModes = ["xs", "sm", "md", "lg", "xl", "2xl"];
export const elementEventModes = ["none", "hover", "focus", "active"];
export const elementFormModes = ["none", "checked", "enabled", "disabled", "required", "valid", "invalid"];

const deviceTitle: Record<DeviceMode, string> = {
  xs: "Mobile (all)",
  sm: "Tablet and larger",
  md: "Laptop and larger",
  lg: "Desktop and larger",
  xl: "Large desktop and larger",
  "2xl": "Extra large desktop and larger"
};

export function DynamicSection() {
  const { hasExactValue, updateCurrentStyles, dispatch, styleState } = useExtensionState();
  const debugMode = debugModifiers.every((mod) => hasExactValue(mod).current || hasExactValue(mod).applied);

  const setModifierState = useCallback(
    (deviceMode: string, themeMode: string, elementEvent: string, elementForm: string) => {
      const modifierState = [
        deviceMode === "xs" ? null : deviceMode,
        themeMode === "dark" ? "dark" : null,
        elementEvent === "none" ? null : elementEvent,
        elementForm === "none" ? null : elementForm
      ]
        .filter(Boolean)
        .join(":");
      dispatch({ type: "SET_MODIFIER_STATE", payload: modifierState });
    },
    []
  );

  const modifierStates = styleState.modifierState.split(":");

  const deviceMode = modifierStates.find((mod) => deviceModes.includes(mod)) || "xs";
  const themeMode = modifierStates.includes("dark") ? "dark" : "light";
  const elementEvent = modifierStates.find((mod) => elementEventModes.includes(mod)) || "none";
  const elementForm = modifierStates.find((mod) => elementFormModes.includes(mod)) || "none";

  return (
    <div>
      <SectionHeader title="Dynamics">
        <div className="flex">
          <LuBug
            className="btn"
            style={{ color: debugMode ? "red" : "" }}
            onClick={() => {
              if (debugMode) {
                updateCurrentStyles(debugModifiers, []);
              } else {
                updateCurrentStyles([], debugModifiers);
              }
            }}
            title="Show debug outline"
          />
          {/*play ? (
            <LuStopCircle
              className="btn"
              style={{ color: "red" }}
              onClick={() => setPlay(false)}
              title="Stop debug modifiers"
            />
          ) : (
            <LuPlay
              className="btn"
              style={{ color: "green" }}
              onClick={() => setPlay(true)}
              title="Start debug modifiers"
            />
          )*/}
        </div>
      </SectionHeader>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between px-2">
          {deviceModes.map((dm) => (
            <TextButton
              key={dm}
              className="w-6"
              onClick={() => setModifierState(dm, themeMode, elementEvent, elementForm)}
              selected={deviceMode === dm}
              title={deviceTitle[dm as DeviceMode]}
            >
              {dm === "xs" ? <LuMonitorSmartphone /> : dm}
            </TextButton>
          ))}
        </div>
        <div className="flex px-2 justify-between">
          <div className="flex gap-1">
            <LuSunMedium
              className={cn("btn", themeMode === "light" ? "selected" : null)}
              onClick={() => setModifierState(deviceMode, "light", elementEvent, elementForm)}
              title="Light mode"
            />
            <LuMoonStar
              className={cn("btn", themeMode === "dark" ? "selected" : null)}
              onClick={() => setModifierState(deviceMode, "dark", elementEvent, elementForm)}
              title="Dark mode"
            />
          </div>
          <div className="flex gap-1">
            <Select
              icon={VscSymbolEvent}
              value={elementEvent}
              applied={elementEvent}
              options={elementEventModes}
              onChange={(ee) => {
                setModifierState(deviceMode, themeMode, ee, elementForm);
              }}
              title="Element event modifier"
            />
            <Select
              icon={FaWpforms}
              value={elementForm}
              applied={elementForm}
              options={elementFormModes}
              onChange={(ef) => {
                setModifierState(deviceMode, themeMode, elementEvent, ef);
              }}
              title="Element form modifier"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
