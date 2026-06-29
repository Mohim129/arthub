"use client";

import { ART_CATEGORY_NAMES } from "@/data/categories";

export default function CategorySelect({
  value,
  onChange,
  className = "",
  id,
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={className}
    >
      {ART_CATEGORY_NAMES.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}
