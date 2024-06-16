import type { IconType } from "react-icons";
import { cn } from "../../lib/cn";

export type IconToggleButtonProps = {
  icon: IconType;
  checkedIcon?: IconType;
  onClick: () => void;
  checked?: boolean;
  appliedChecked?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
};

export function IconToggleButton({
  icon,
  checkedIcon,
  checked,
  appliedChecked,
  disabled,
  onClick,
  className,
  title
}: IconToggleButtonProps) {
  const Icon = checked ? checkedIcon ?? icon : icon;
  return (
    <Icon
      onClick={onClick}
      className={cn(
        "btn",
        checked && !checkedIcon ? "selected" : null,
        disabled ? "disabled" : checked !== undefined && checked !== appliedChecked ? "changed" : null,
        className
      )}
      title={title}
    />
  );
}
