import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  placeholder = 'Search gigs...',
  debounceMs = 300,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const titleParam = searchParams.get('title') || '';
    setInputValue(titleParam);
    if (onChange && titleParam !== value) {
      onChange(titleParam);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (inputValue === value) return;

    setIsLoading(true);
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(inputValue);
      }
      // Update URL
      if (inputValue) {
        setSearchParams({ title: inputValue });
      } else {
        setSearchParams({});
      }
      setIsLoading(false);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [inputValue, debounceMs, onChange, setSearchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Immediate search on Enter
      if (onChange) {
        onChange(inputValue);
      }
      if (inputValue) {
        setSearchParams({ title: inputValue });
      } else {
        setSearchParams({});
      }
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    if (onChange) {
      onChange('');
    }
    setSearchParams({});
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {isLoading && (
            <div className="pr-3">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
          {inputValue && (
            <button
              onClick={handleClear}
              className="pr-3 text-gray-400 hover:text-gray-600"
              type="button"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;