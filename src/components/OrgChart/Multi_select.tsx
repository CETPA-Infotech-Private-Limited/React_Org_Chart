import React, { useEffect, useRef, useState } from 'react';

type Option = {
  label: string;
  value: string;
};

const MultiSelect = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<Option[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/data/selectdata.json')
      .then((res) => res.json())
      .then((data) => {
        setOptions(data);
        setFilteredOptions(data);
      });
  }, []);

  useEffect(() => {
    const filtered = options.filter(
      (option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedItems.some((sel) => sel.value === option.value)
    );
    setFilteredOptions(filtered);
    setHighlightedIndex(0);
  }, [inputValue, options, selectedItems]);

  const handleSelect = (item: Option) => {
    if (!selectedItems.find((i) => i.value === item.value)) {
      setSelectedItems([...selectedItems, item]);
    }
    setInputValue('');
    
  };

  const handleRemove = (value: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.value !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } 
  };

  const clearAllSelected = () => {
    setSelectedItems([]);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-10" ref={containerRef}>
      <label className="block mb-2 font-medium text-gray-700">Select values</label>

      <div className="border border-gray-300 rounded py-2 px-2 relative bg-white">
        <div className="flex flex-wrap items-center gap-2">
          {selectedItems.map((item) => (
            <span
              key={item.value}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm flex items-center"
            >
              {item.label}
              <button
                onClick={() => handleRemove(item.value)}
                className="ml-1 text-xs text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Type to search..."
            className="flex-grow min-w-[100px] px-1 outline-none"
          />
          {selectedItems.length > 0 && (
            <button
              onClick={clearAllSelected}
              className="text-gray-400 hover:text-gray-700 text-xl leading-none"
              aria-label="Clear all selected"
            >
              ×
            </button>
          )}
        </div>

        {showDropdown && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-2 max-h-48 overflow-y-auto rounded shadow">
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`px-3 py-2 cursor-pointer ${
                  highlightedIndex === index ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
