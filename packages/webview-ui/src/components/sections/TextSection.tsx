import { LuMinus, LuPlus } from "react-icons/lu";
import { ColorInput } from "../input/Color/ColorInput";
import { SectionHeader } from "../layout/SectionHeader";
import { Select } from "../input/Select";
import { BiFontSize } from "react-icons/bi";
import { getVerticalAlign, isVerticalAlign, verticalAlignIcons, verticalAlignValues } from "../../types/verticalAlign";
import { getTextAlign, isTextAlign, textAlignIcons, textAlignValues } from "../../types/textAlign";
import { fontSizeValues, getFontSizeOption } from "../../types/fontSize";
import { fontWeightOptions, getFontWeightOption, isFontWeight } from "../../types/fontWeight";
import { useTextSettings } from "../hooks/useTextSettings";
import { fontWeightIcons } from "../lib/fontWeightIcons";

export function TextSection() {
  const {
    hasTextSettings,
    addTextSettings,
    removeTextSettings,
    color,
    fontSize,
    fontWeight,
    textAlign,
    verticalAlign,
    setColor,
    setFontSize,
    setFontWeight,
    setTextAlign,
    setVerticalAlign
  } = useTextSettings();

  return (
    <div className="flex flex-col">
      <SectionHeader title="Text">
        {hasTextSettings ? (
          <LuMinus className="btn" onClick={removeTextSettings} />
        ) : (
          <LuPlus className="btn" onClick={addTextSettings} />
        )}
      </SectionHeader>
      {hasTextSettings && (
        <div className="flex flex-col p-2 gap-2">
          <div className="">
            <ColorInput
              colorName={color.current ?? color.applied}
              appliedColorName={color.applied}
              onChange={setColor}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select
              icon={BiFontSize}
              value={getFontSizeOption(fontSize.current ?? fontSize.applied ?? "text-base")}
              applied={getFontSizeOption(fontSize.applied ?? "text-base")}
              options={fontSizeValues}
              onChange={setFontSize}
              title="Font size"
            />
            <Select
              icon={getFontWeightIcon(fontWeight.current ?? fontWeight.applied ?? "Normal")}
              value={getFontWeightOption(fontWeight.current ?? fontWeight.applied ?? "Normal")}
              applied={getFontWeightOption(fontWeight.applied ?? "Normal")}
              options={fontWeightOptions}
              onChange={setFontWeight}
              title="Font weight"
            />
            <Select
              icon={getAlignIcon(textAlign.current ?? textAlign.applied ?? "left")}
              value={getTextAlign(textAlign.current ?? textAlign.applied ?? "left")}
              applied={getTextAlign(textAlign.applied ?? "left")}
              options={textAlignValues}
              onChange={setTextAlign}
              title="Text align"
            />
            <Select
              icon={getVerticalAlignIcon(verticalAlign.current ?? verticalAlign.applied ?? "top")}
              value={getVerticalAlign(verticalAlign.current ?? verticalAlign.applied ?? "top")}
              applied={getVerticalAlign(verticalAlign.applied ?? "top")}
              options={verticalAlignValues}
              onChange={setVerticalAlign}
              title="Vertical align"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function getFontWeightIcon(fontWeight: string) {
  if (isFontWeight(fontWeight)) {
    return fontWeightIcons[fontWeight];
  }
  return fontWeightIcons.Normal;
}

function getAlignIcon(align: string) {
  if (isTextAlign(align)) {
    return textAlignIcons[align];
  }
  return textAlignIcons.left;
}

function getVerticalAlignIcon(align: string) {
  if (isVerticalAlign(align)) {
    return verticalAlignIcons[align];
  }
  return verticalAlignIcons.top;
}
