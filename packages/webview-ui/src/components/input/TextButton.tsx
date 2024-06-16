import { cn } from "../../lib/cn";

export type TextButtonProps = {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  disabled?: boolean;
};

export function TextButton({ selected = false, onClick, className, title, disabled, children }: TextButtonProps) {
  return (
    <div
      className={cn("btn text-center", className, selected ? "selected" : null, disabled ? "disabled" : null)}
      onClick={onClick}
      title={title}
    >
      {children}
    </div>
  );
}
