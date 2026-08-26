import type { ReactNode } from 'react';

export function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="label-campo">{label}</span>
      {children}
    </label>
  );
}

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}

export function Select({ value, onChange, children }: SelectProps) {
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      {children}
    </select>
  );
}
