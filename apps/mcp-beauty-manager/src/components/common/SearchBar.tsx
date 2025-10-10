import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  value?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = '검색어를 입력하세요',
  onSearch,
  value: controlledValue,
  className = '',
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState('');
  const query = controlledValue !== undefined ? controlledValue : internalQuery;
  const setQuery = controlledValue !== undefined ? onSearch || (() => {}) : setInternalQuery;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleClear = () => {
    if (controlledValue !== undefined) {
      onSearch?.('');
    } else {
      setInternalQuery('');
      onSearch?.('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue !== undefined) {
      onSearch?.(newValue);
    } else {
      setInternalQuery(newValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
          >
            <X size={16} className="text-gray-600 hover:text-gray-800" />
          </button>
        )}
      </div>
    </form>
  );
}
