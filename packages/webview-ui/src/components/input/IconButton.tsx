import { IconType } from "react-icons";
import { cn } from "../../lib/cn";

export type IconButtonProps = {
  icon: IconType;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
};

export function IconButton({ icon: Icon, selected, disabled, onClick, className }: IconButtonProps) {
  return <Icon onClick={onClick} className={cn("btn", selected ? "selected" : null, disabled ? "disabled" : null)} />;
}
