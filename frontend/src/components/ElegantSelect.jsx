import { useState, useRef, useEffect } from 'react';

const ElegantSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Selecione uma opção',
  disabled = false,
  className = '',
  label = '',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  // Find the selected option label
  const selectedOption = options.find(opt => {
    const optValue = typeof opt === 'object' ? opt.value : opt;
    return optValue === value;
  });
  const selectedLabel = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (optionValue, optionLabel) => {
    onChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          const option = options[highlightedIndex];
          const optValue = typeof option === 'object' ? option.value : option;
          handleSelect(optValue);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-darkTeal mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full rounded-md border bg-white px-3 py-2 text-sm text-darkTeal
            focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
            transition-all duration-300 ease-out
            ${disabled 
              ? 'opacity-50 cursor-not-allowed border-primary/20' 
              : 'border-primary/30 cursor-pointer hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5'
            }
            ${isOpen 
              ? 'border-primary ring-2 ring-primary/20 shadow-lg -translate-y-0.5' 
              : ''
            }
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <span className={value ? 'text-darkTeal' : 'text-mediumTeal'}>
              {selectedLabel}
            </span>
            <svg
              className={`w-5 h-5 text-primary transition-transform duration-300 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className={`
              absolute z-50 w-full mt-1 bg-white rounded-md shadow-xl
              border border-primary/20 overflow-hidden
              animate-dropdownSlideIn
            `}
            role="listbox"
          >
            <div className="max-h-60 overflow-auto">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-sm text-mediumTeal text-center">
                  Nenhuma opção disponível
                </div>
              ) : (
                options.map((option, index) => {
                  const optValue = typeof option === 'object' ? option.value : option;
                  const optLabel = typeof option === 'object' ? option.label : option;
                  const isSelected = optValue === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <button
                      key={optValue}
                      type="button"
                      onClick={() => handleSelect(optValue, optLabel)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`
                        w-full text-left px-3 py-2.5 text-sm
                        transition-all duration-200 ease-out
                        ${isSelected 
                          ? 'bg-primary/20 text-primary font-medium' 
                          : 'text-darkTeal'
                        }
                        ${isHighlighted && !isSelected
                          ? 'bg-primary/10 text-primary'
                          : ''
                        }
                        ${!isHighlighted && !isSelected
                          ? 'hover:bg-primary/5'
                          : ''
                        }
                      `}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex items-center justify-between">
                        <span>{optLabel}</span>
                        {isSelected && (
                          <svg
                            className="w-4 h-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElegantSelect;

