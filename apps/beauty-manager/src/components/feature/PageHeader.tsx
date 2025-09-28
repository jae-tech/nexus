
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  searchBar?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, searchBar, actions, className = '' }: PageHeaderProps) {
  return (
    <div className={`bg-white border-b border-gray-200 px-8 py-6 h-20 flex items-center ${className}`}>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          {searchBar}
          {actions}
        </div>
      </div>
    </div>
  );
}
