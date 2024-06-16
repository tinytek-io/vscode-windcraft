import { useCallback, useMemo } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { CurrentAppliedType } from "../../types/general";
import { BackdropEffectType, backdropEffectMap, backdropEffects, isBackdropEffect } from "../../types/backdropEffects";

export function useBackdropEffects() {
  const { updateCurrentStyles, getValueOneOf } = useExtensionState();

  const addBackdropEffect = useCallback(
    (type: BackdropEffectType) => {
      const className = backdropEffectMap[type].valueMap[backdropEffectMap[type].none];
      updateCurrentStyles([], [className]);
    },
    [updateCurrentStyles]
  );

  const configuredBackdropEffects = useMemo(
    () =>
      Object.entries(backdropEffectMap)
        .filter(
          ([_, info]) =>
            (getValueOneOf(Object.values(info.valueMap)).current ??
              getValueOneOf(Object.values(info.valueMap)).applied) != null
        )
        .map(([type]) => type) as BackdropEffectType[],
    [getValueOneOf]
  );

  const availableBackdropEffects: BackdropEffectType[] = useMemo(
    () => backdropEffects.filter((e) => !configuredBackdropEffects.includes(e)),
    [configuredBackdropEffects]
  );
  const nextBackdropEffect: BackdropEffectType | undefined = useMemo(
    () => availableBackdropEffects[0],
    [availableBackdropEffects]
  );

  const addNextBackdropEffect = useCallback(() => {
    if (nextBackdropEffect) {
      addBackdropEffect(nextBackdropEffect);
    }
  }, [addBackdropEffect, nextBackdropEffect]);

  return {
    // State
    configuredBackdropEffects,
    availableBackdropEffects,
    nextBackdropEffect,
    // Actions
    addBackdropEffect,
    addNextBackdropEffect
  };
}

export function useBackdropEffectValue(type: BackdropEffectType) {
  const { updateCurrentStyles, getValueOneOf } = useExtensionState();

  const effect = useMemo(() => backdropEffectMap[type], [type]);
  const allClassNames = useMemo(() => Object.values(effect.valueMap), [effect]);
  const allValues = useMemo(() => Object.keys(effect.valueMap), [effect]);
  const className = useMemo(() => {
    const value = getValueOneOf(allClassNames);
    return {
      current: value.current ?? value.applied ?? effect.none,
      applied: value.applied ?? effect.none
    };
  }, [getValueOneOf, allClassNames]);

  const value: CurrentAppliedType<string> = useMemo(
    () => ({
      current: allValues[allClassNames.indexOf(className.current)] ?? effect.valueMap[effect.none],
      applied: allValues[allClassNames.indexOf(className.applied)] ?? effect.valueMap[effect.none]
    }),
    [effect, allValues, allClassNames, className]
  );

  const setValue = useCallback(
    (newValue: string) => {
      const newClassName = backdropEffectMap[type].valueMap[newValue] ?? backdropEffectMap[type].none;
      updateCurrentStyles([className.current], [newClassName]);
    },
    [updateCurrentStyles]
  );

  const removeValue = useCallback(() => {
    updateCurrentStyles([className.current], []);
  }, [updateCurrentStyles]);

  const changeType = useCallback(
    (newType: string) => {
      if (isBackdropEffect(newType)) {
        const defaultClassName = backdropEffectMap[newType].valueMap[backdropEffectMap[newType].none];
        const newClassName = backdropEffectMap[newType].valueMap[value.current] ?? defaultClassName;
        updateCurrentStyles([className.current], [newClassName]);
      } else {
        console.error(`Invalid backdrop effect type: ${newType}`);
      }
    },
    [updateCurrentStyles]
  );

  return {
    // State
    value,
    allValues,
    // Methods
    setValue,
    removeValue,
    changeType
  };
}
