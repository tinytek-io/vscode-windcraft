import { useState } from "react";
import { VscClose } from "react-icons/vsc";
import { type ColorType, formatColorName } from "../../../types/color";
import { colorSearch } from "./ColorButton";

export type SearchColorListProps = {
  initialSearch?: string;
  onClose?: () => void;
  onChange?: (newValue: ColorType) => void;
};

export function SearchColorList({ initialSearch = "", onClose, onChange }: SearchColorListProps) {
  const [search, setSearch] = useState(initialSearch);

  const result = colorSearch(search) as [ColorType, string][];

  return (
    <div className="flex flex-col border p-2 gap-2 rounded">
      <div className="flex justify-between align-center">
        Color search
        <VscClose className="btn" onClick={onClose} />
      </div>
      <div className="flex px-2">
        <input
          type="search"
          className="input w-full rounded border p-1 bg-transparent"
          placeholder="Search"
          style={{
            fontSize: "1rem"
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          tabIndex={1}
        />
      </div>
      <div
        className="flex flex-col p-1 overflow-hidden"
        style={{
          maxHeight: "10rem",
          overflowY: "auto",
          border: "1px thin silver"
        }}
      >
        {result.length ? (
          result.map(([key, value]) => (
            <div
              key={key}
              className="list-item flex px-2 py-1 gap-2"
              tabIndex={2}
              onClick={onChange ? () => onChange(key) : undefined}
            >
              <div className="w-4 h-4 border" style={{ backgroundColor: value }} title={value}></div>
              {formatColorName(key)}
            </div>
          ))
        ) : (
          <div className="flex px-2 py-1 gap-2">No results</div>
        )}
      </div>
    </div>
  );
}
