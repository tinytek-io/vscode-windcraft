export type SectionHeaderProps = {
  title: string;
  children?: React.ReactNode;
};
export function SectionHeader({ title, children }: SectionHeaderProps) {
  return (
    <div className="flex p-2 justify-between align-center">
      {title}
      {children}
    </div>
  );
}
