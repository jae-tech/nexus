import type { ReactNode } from 'react';

interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

export default function FilterBar({
  children,
  className = '',
}: FilterBarProps) {
  return (
    <div
      className={`flex h-16 items-center border-b border-gray-200 bg-white px-8 py-4 ${className}`}
    >
      <div className="flex w-full items-center justify-between">{children}</div>
    </div>
  );
}
