
import { ReactNode } from 'react';

interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

export default function FilterBar({ children, className = '' }: FilterBarProps) {
  return (
    <div className={`bg-white border-b border-gray-200 px-8 py-4 h-16 flex items-center ${className}`}>
      <div className="flex items-center justify-between w-full">
        {children}
      </div>
    </div>
  );
}
