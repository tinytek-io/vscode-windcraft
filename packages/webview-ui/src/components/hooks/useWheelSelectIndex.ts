import { useCallback, useEffect } from "react";
import { wheelIndexRatio } from "../input/Select";

export type WheelSelectIndexProps = {
  resizeRef: React.RefObject<HTMLSpanElement | null>;
  value: number | undefined;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function useWheelSelectIndex({ value = 0, min, max, onChange, disabled, resizeRef }: WheelSelectIndexProps) {
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      // Calculate the index delta based on the wheel delta
      const deltaIndex = e.deltaY > 0 ? Math.ceil(e.deltaY / wheelIndexRatio) : Math.floor(e.deltaY / wheelIndexRatio);
      // Find the index of the current value in the options array
      const currentIndex = Math.max(min, value);
      // Clamp the index to the bounds of the options array
      const newIndex = Math.min(Math.max(0, currentIndex + deltaIndex), max);

      if (value !== newIndex) {
        // Update the value if it has changed
        onChange(newIndex);
      }
    },
    [min, max, value, onChange]
  );

  useEffect(() => {
    if (disabled) {
      return;
    }

    if (resizeRef.current) {
      resizeRef.current.addEventListener("wheel", handleWheel, {
        passive: false
      });
    }
    return () => {
      if (resizeRef.current) {
        resizeRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel, disabled]);
}
