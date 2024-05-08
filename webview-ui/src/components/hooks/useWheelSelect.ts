import { useWheelSelectIndex } from "./useWheelSelectIndex";


export type WheelSelectProps<T> = {
  resizeRef: React.RefObject<HTMLSpanElement | null>;
  value: T | undefined;
  options: T[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function useWheelSelect<T>({
  value, options, onChange, disabled, resizeRef,
}: WheelSelectProps<T>) {
  useWheelSelectIndex({
    value: value != null ? options.indexOf(value) : 0,
    min: 0,
    max: options.length - 1,
    onChange: (newIndex) => {
      onChange(options[newIndex]);
    },
    disabled,
    resizeRef,
  });
}
