export type EventTriangleProps = {
  onClick: (type: "insetX" | "insetY") => void;
};

export function EventTriangle({ onClick }: EventTriangleProps) {
  const a = Math.sqrt(32 / 2);
  return (
    <div className="relative w-full h-full overflow-hidden cursor-pointer">
      {/* top */}
      <button
        type="button"
        className="absolute w-full h-full"
        style={{
          transform: "rotate(45deg) translateY(-16px) translateX(-16px)"
        }}
        onClick={() => onClick("insetY")}
      />
      {/* top */}
      <button
        type="button"
        className="absolute w-full h-full"
        style={{
          transform: "rotate(45deg) translateY(16px) translateX(16px)"
        }}
        onClick={() => onClick("insetY")}
      />
      {/* left */}
      <button
        type="button"
        className="absolute w-full h-full"
        style={{
          transform: "rotate(45deg) translateY(16px) translateX(-16px)"
        }}
        onClick={() => onClick("insetX")}
      />
      {/* right */}
      <button
        type="button"
        className="absolute w-full h-full"
        style={{
          transform: "rotate(45deg) translateY(-16px) translateX(16px)"
        }}
        onClick={() => onClick("insetX")}
      />
    </div>
  );
}
