import { useState, useRef, useEffect } from 'react';
import DatePickerLib from 'react-datepicker';
import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ value, onChange, placeholder = 'Selecione uma data', className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Convert string value (YYYY-MM-DD) to Date object
  const dateValue = value && value !== '' ? (() => {
    // Try parsing as YYYY-MM-DD first
    const parsed = parse(value, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? parsed : null;
  })() : null;

  // Handle date change
  const handleDateChange = (date) => {
    if (date && isValid(date)) {
      // Format as YYYY-MM-DD for input compatibility
      const formattedDate = format(date, 'yyyy-MM-dd');
      onChange({
        target: {
          value: formattedDate
        }
      });
    } else {
      onChange({
        target: {
          value: ''
        }
      });
    }
    setIsOpen(false);
  };

  // Format display value
  const displayValue = dateValue && isValid(dateValue) 
    ? format(dateValue, 'dd/MM/yyyy', { locale: ptBR }) 
    : '';

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className={`input-field cursor-pointer flex items-center justify-between ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className={displayValue ? 'text-darkTeal' : 'text-lightTeal'}>
          {displayValue || placeholder}
        </span>
        <svg
          className="w-5 h-5 text-primary flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-[9999] mt-1 left-0 sm:left-auto sm:right-0">
          <DatePickerLib
            selected={dateValue}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            inline
            calendarClassName="everwell-datepicker"
            {...props}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;

