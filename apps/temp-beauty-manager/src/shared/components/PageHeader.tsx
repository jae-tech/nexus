import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  searchBar?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  searchBar,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div
      className={`flex h-20 items-center border-b border-gray-200 bg-white px-8 py-6 ${className}`}
    >
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          {searchBar}
          {actions}
        </div>
      </div>
    </div>
  );
}
