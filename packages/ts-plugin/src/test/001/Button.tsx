export type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export function Button({ onClick, children }: ButtonProps) {
  return (
    <button type="button" className="flex" onClick={onClick}>
      <div className="flex flex-col">test</div>
      <img alt="test" src="test" className="w-full" />
      <div>empty element</div>
      {children}
    </button>
  );
}
