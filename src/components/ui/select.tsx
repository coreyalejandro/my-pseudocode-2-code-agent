// src/components/ui/select.tsx
import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** The text label shown above the select */
  label: string;
  /** Optional ID; generated if omitted */
  id?: string;
}

export function Select({ label, id, children, ...props }: SelectProps) {
  // Generate an ID if none provided
  const selectId = id || `select-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="mb-4">
      {/* Native visible label — Axe will detect this */}
      <label htmlFor={selectId} className="block mb-1 font-medium">
        {label}
      </label>

      {/* Simple select with native association */}
      <select
        id={selectId}
        {...props}
        className="p-2 border rounded w-full"
      >
        {children}
      </select>
    </div>
  );
}
