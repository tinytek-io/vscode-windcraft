import { TbMinus, TbMinusVertical } from "react-icons/tb";
import { cn } from "../../../lib/cn";

export type ButtonProps = {
  className?: string;
  style?: React.CSSProperties;
  selected?: boolean;
  applied?: boolean;
  onClick?: () => void;
};
export function VerticalButton({ className, style, selected, applied, onClick }: ButtonProps = {}) {
  const currentValue = selected ?? false;
  const appliedValue = applied ?? false;
  return (
    <TbMinusVertical
      className={cn(
        "icon-button",
        currentValue ? "selected" : null,
        currentValue && currentValue !== appliedValue ? "changed" : null,
        className
      )}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}
export function HorizontalButton({ className, style, selected, applied, onClick }: ButtonProps = {}) {
  const currentValue = selected ?? false;
  const appliedValue = applied ?? false;

  return (
    <TbMinus
      className={cn(
        "icon-button",
        currentValue ? "selected" : null,
        currentValue && currentValue !== appliedValue ? "changed" : null,
        className
      )}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}
