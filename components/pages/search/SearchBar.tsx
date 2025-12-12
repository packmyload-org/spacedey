import { Search, Sliders } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
}

export default function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim() && onSearch) {
      onSearch(value.trim());
    }
  };

  return (
    <div className="py-4 px-6 fixed flex gap-1 lg:sticky w-full top-[80px] lg:top-0 z-50 bg-opacity-100 bg-white">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          id="search-bar"
          type="text"
          placeholder="Search any city or location"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>
      <button
        type="button"
        className="p-2 hover:bg-gray-100 rounded-md transition"
        title="Filter options"
      >
        <Sliders className="w-6 h-6 text-brand-dark-blue" />
      </button>
    </div>
  );
}