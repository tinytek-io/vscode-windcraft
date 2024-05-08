import { IconType } from "react-icons";
import { useRef } from "react";
import { cn } from "../../lib/cn";
import { useWheelSelect } from "../hooks/useWheelSelect";

export type SelectProps = {
  icon: IconType;
  iconClassName?: string;
  value: string | undefined;
  applied?: string | undefined;
  options: string[];
  onChange: (value: string) => void;
  title?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};
export const wheelIndexRatio = 50;
export function Select({
  icon: Icon,
  iconClassName,
  value,
  applied,
  options,
  title,
  disabled,
  className,
  style,
  onChange,
}: SelectProps) {
  const resizeRef = useRef<HTMLSpanElement | null>(null);

  useWheelSelect({
    value,
    options,
    onChange,
    disabled,
    resizeRef,
  });

  return (
    <div
      className={cn(
        "select-container flex justify-between align-center gap-1 h-5",
        disabled ? "disabled" : value != null && value !== applied ? "changed" : null,
        className
      )}
      style={style}
      title={title}
    >
      <span ref={resizeRef} className="select-resize-handle flex align-center">
        <Icon className={cn("select-icon", iconClassName)} />
      </span>
      <select
        className="select flex align-center justify-between w-full"
        value={value}
        onChange={(e) => {
          e.preventDefault();
          onChange(e.target.value);
        }}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
