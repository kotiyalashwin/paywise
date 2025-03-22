"use client";

export function Select({
  onSelect,
  options,
}: {
  onSelect: (value: string) => void;
  options: { key: string; value: string }[];
}) {
  return (
    <select
      onChange={(e) => {
        onSelect(e.target.value);
      }}
    >
      {" "}
      {options.map((option) => (
        <option key={option.key}>{option.value}</option>
      ))}
    </select>
  );
}
