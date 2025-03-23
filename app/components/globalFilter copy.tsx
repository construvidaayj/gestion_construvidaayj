'use client';

import { GlobalFilterProps } from "../interfaces/globalFilterProps";

export default function GlobalFilter({
  filterText,
  onFilterChange,
  placeholder = 'Buscar...',
}: GlobalFilterProps) {
  return (
    <div className="my-3 mx-4">
      <input
        type="text"
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
