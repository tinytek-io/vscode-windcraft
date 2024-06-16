export interface DynamicSettings {
  /**
   * The current theme mode of the application
   * @default undefined
   */
  themeMode?: "dark";
  /**
   * Device mode for the application to simulate
   * @default undefined
   */
  deviceMode?: "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Element event state for the application to simulate
   * @default undefined
   */
  elementEventState?: "none" | "hover" | "focus" | "active";
  /**
   * Element form state for the application to simulate
   * @default undefined
   */
  elementFormState?: "checked" | "enabled" | "disabled" | "required" | "valid" | "invalid";
}

/**
 * Get the style prefix for the current dynamic settings
 */
export function getStylePrefix(dynamicSettings: DynamicSettings) {
  return [
    dynamicSettings.themeMode,
    dynamicSettings.deviceMode,
    dynamicSettings.elementEventState,
    dynamicSettings.elementFormState
  ]
    .filter(Boolean)
    .join(":");
}

export function getDynamicSettingsFromKey(key: string): DynamicSettings {
  const conditions = key.split(":");

  return {
    themeMode: getSettingFromCondition(["dark"], conditions),
    deviceMode: getSettingFromCondition(["sm", "md", "lg", "xl", "2xl"], conditions),
    elementEventState: getSettingFromCondition(["none", "hover", "focus", "active"], conditions),
    elementFormState: getSettingFromCondition(
      ["checked", "enabled", "disabled", "required", "valid", "invalid"],
      conditions
    )
  };
}

/**
 * Get the setting from the conditions
 */
function getSettingFromCondition<T extends string>(values: T[], conditions: string[]): T | undefined {
  return values.find((value) => conditions.includes(value));
}
