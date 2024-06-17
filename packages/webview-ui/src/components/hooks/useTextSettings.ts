import { useColor } from "./useColor";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { useCallback } from "react";
import { verticalAlignClasses, isVerticalAlign, verticalAlignMap } from "../../types/verticalAlign";
import { textAlignClasses, isTextAlign, textAlignMap } from "../../types/textAlign";
import { fontSizeClasses, isFontSize, fontSizeMap } from "../../types/fontSize";
import { fontWeightClasses, isFontWeight, fontWeightMap } from "../../types/fontWeight";

export function useTextSettings() {
  const { updateCurrentStyles, getValueOneOf } = useExtensionState();
  const color = useColor("text-");

  const fontWeight = getValueOneOf(fontWeightClasses);
  const fontSize = getValueOneOf(fontSizeClasses);
  const textAlign = getValueOneOf(textAlignClasses);
  const verticalAlign = getValueOneOf(verticalAlignClasses);

  const hasTextSettings =
    (color.color.current ??
      color.colorClassName.current ??
      fontWeight.current ??
      fontWeight.applied ??
      fontSize.current ??
      fontSize.applied ??
      textAlign.current ??
      textAlign.applied ??
      verticalAlign.current ??
      verticalAlign.applied) != null;

  const removeTextSettings = useCallback(() => {
    updateCurrentStyles(
      [fontWeight.current, fontSize.current, textAlign.current, verticalAlign.current, color.colorClassName.current],
      []
    );
  }, [updateCurrentStyles, fontWeight, fontSize, textAlign, verticalAlign, color.colorClassName]);

  const addTextSettings = useCallback(() => {
    updateCurrentStyles([], ["text-current"]);
  }, [updateCurrentStyles]);

  const setFontWeight = useCallback(
    (newFontWeight: string) => {
      if (isFontWeight(newFontWeight)) {
        updateCurrentStyles(fontWeightClasses, [fontWeightMap[newFontWeight]]);
      }
    },
    [updateCurrentStyles]
  );

  const setFontSize = useCallback(
    (newFontSize: string) => {
      if (isFontSize(newFontSize)) {
        updateCurrentStyles(fontSizeClasses, [fontSizeMap[newFontSize]]);
      }
    },
    [updateCurrentStyles]
  );

  const setTextAlign = useCallback(
    (newTextAlign: string) => {
      if (isTextAlign(newTextAlign)) {
        updateCurrentStyles(textAlignClasses, [textAlignMap[newTextAlign]]);
      }
    },
    [updateCurrentStyles]
  );

  const setVerticalAlign = useCallback(
    (newVerticalAlign: string) => {
      if (isVerticalAlign(newVerticalAlign)) {
        updateCurrentStyles(verticalAlignClasses, [verticalAlignMap[newVerticalAlign]]);
      }
    },
    [updateCurrentStyles]
  );

  return {
    ...color,
    hasTextSettings,
    fontWeight,
    fontSize,
    textAlign,
    verticalAlign,
    setFontWeight,
    setFontSize,
    removeTextSettings,
    addTextSettings,
    setTextAlign,
    setVerticalAlign
  };
}
