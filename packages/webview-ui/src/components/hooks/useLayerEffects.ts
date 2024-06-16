import { useCallback, useMemo } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { type LayerEffectType, isLayerEffect, layerEffectMap, layerEffects } from "../../types/layerEffects";

export function useLayerEffects() {
  const { updateCurrentStyles, getValueOneOf } = useExtensionState();

  const addLayerEffect = useCallback(
    (type: LayerEffectType) => {
      const className = layerEffectMap[type].valueMap[layerEffectMap[type].none];
      updateCurrentStyles([], [className]);
    },
    [updateCurrentStyles]
  );

  const configuredLayerEffects = useMemo(
    () =>
      Object.entries(layerEffectMap)
        .filter(
          ([_, info]) =>
            (getValueOneOf(Object.values(info.valueMap)).current ??
              getValueOneOf(Object.values(info.valueMap)).applied) != null
        )
        .map(([type]) => type) as LayerEffectType[],
    [getValueOneOf]
  );

  const availableLayerEffects: LayerEffectType[] = useMemo(
    () => layerEffects.filter((e) => !configuredLayerEffects.includes(e)),
    [configuredLayerEffects]
  );
  const nextLayerEffect: LayerEffectType | undefined = useMemo(() => availableLayerEffects[0], [availableLayerEffects]);

  const addNextLayerEffect = useCallback(() => {
    if (nextLayerEffect) {
      addLayerEffect(nextLayerEffect);
    }
  }, [addLayerEffect, nextLayerEffect]);

  return {
    // State
    configuredLayerEffects,
    availableLayerEffects,
    nextLayerEffect,
    // Actions
    addLayerEffect,
    addNextLayerEffect
  };
}

export function useLayerEffectValue(type: LayerEffectType) {
  const { updateCurrentStyles, getValueOneOf } = useExtensionState();

  const effect = useMemo(() => layerEffectMap[type], [type]);
  const allClassNames = useMemo(() => Object.values(effect.valueMap), [effect]);
  const allValues = useMemo(() => Object.keys(effect.valueMap), [effect]);
  const className = useMemo(() => {
    const value = getValueOneOf(allClassNames);
    return {
      current: value.current ?? value.applied ?? effect.none,
      applied: value.applied ?? effect.none
    };
  }, [getValueOneOf, allClassNames, effect]);
  const value = useMemo(
    () => ({
      current: allValues[allClassNames.indexOf(className.current)] ?? effect.valueMap[effect.none],
      applied: allValues[allClassNames.indexOf(className.applied)] ?? effect.valueMap[effect.none]
    }),
    [effect, allValues, allClassNames, className]
  );

  const setValue = useCallback(
    (newValue: string) => {
      const newClassName = layerEffectMap[type].valueMap[newValue] ?? layerEffectMap[type].none;
      updateCurrentStyles([className.current], [newClassName]);
    },
    [updateCurrentStyles, className, type]
  );

  const removeValue = useCallback(() => {
    updateCurrentStyles([className.current], []);
  }, [updateCurrentStyles, className]);

  const changeType = useCallback(
    (newType: string) => {
      if (isLayerEffect(newType)) {
        const defaultClassName = layerEffectMap[newType].valueMap[layerEffectMap[newType].none];
        const newClassName = layerEffectMap[newType].valueMap[value.current] ?? defaultClassName;
        updateCurrentStyles([className.current], [newClassName]);
      } else {
        console.error(`Invalid layer effect type: ${newType}`);
      }
    },
    [updateCurrentStyles, className, value]
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
