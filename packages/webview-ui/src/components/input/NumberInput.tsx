import { useRef } from "react";
import { cn } from "../../lib/cn";
import { useWheelSelectIndex } from "../hooks/useWheelSelectIndex";
import { IconType } from "react-icons";

export type NumberInputProps = {
  icon?: IconType;
  value: number;
  applied?: number;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
  onFocus?: () => void;
};

export function NumberInput({
  icon: Icon,
  value,
  applied,
  min = 0,
  max = 100,
  placeholder,
  className,
  disabled,
  onChange,
  onFocus
}: NumberInputProps) {
  const resizeRef = useRef<HTMLDivElement | null>(null);
  useWheelSelectIndex({
    resizeRef,
    value,
    min,
    max,
    onChange,
    disabled
  });

  return (
    <div ref={resizeRef} className={cn("number-input flex w-16 rounded border align-center", className)}>
      {Icon ? <Icon className="icon" /> : null}
      <input
        type="number"
        min={min}
        max={max}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        onFocus={onFocus}
        className={cn("number-input w-full bg-transparent", value !== applied ? "changed" : null)}
      />
    </div>
  );
}
