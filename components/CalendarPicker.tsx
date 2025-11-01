import React, { useState } from 'react';

interface CalendarPickerProps {
  selectedDates: string[];
  onDatesChange: (dates: string[]) => void;
  selectionMode?: 'single' | 'multiple';
  minDate?: string; // YYYY-MM-DD
  disabled?: boolean;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedDates, onDatesChange, selectionMode = 'multiple', minDate, disabled = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const todayString = formatDate(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    if (date.getDay() === 0 || disabled) return; // Disable Sunday or if whole component is disabled
    const dateString = formatDate(date);

    if (selectionMode === 'single') {
        onDatesChange([dateString]);
        return;
    }

    const newSelectedDates = selectedDates.includes(dateString)
      ? selectedDates.filter(d => d !== dateString)
      : [...selectedDates, dateString];
    onDatesChange(newSelectedDates.sort());
  };
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const currentStaticYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentStaticYear - 10 + i); // 10 years past, 10 years future
  const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(year, newMonth, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate(new Date(newYear, month, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const minD = minDate ? new Date(minDate + 'T00:00:00') : null;
    if (minD) minD.setHours(0,0,0,0);

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = formatDate(date);
      const isSunday = date.getDay() === 0;
      const isPast = minD ? date < minD : false;
      const isSelected = selectionMode === 'single' 
        ? selectedDates[0] === dateString 
        : selectedDates.includes(dateString);
      const isToday = dateString === todayString;
      
      let buttonClass = 'w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200';
      if (isSunday || isPast || disabled) {
        buttonClass += ' text-gray-400 dark:text-gray-600 cursor-not-allowed';
      } else if (isSelected) {
        buttonClass += ' bg-teal-600 text-white font-bold';
      } else if (isToday) {
        buttonClass += ' text-teal-700 dark:text-teal-300 ring-2 ring-teal-500';
      } else {
        buttonClass += ' text-gray-700 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-teal-900';
      }

      days.push(
        <div key={i} className="p-1 flex justify-center items-center">
          <button
            type="button"
            onClick={() => handleDateClick(date)}
            disabled={isSunday || isPast || disabled}
            className={buttonClass}
          >
            {i}
          </button>
        </div>
      );
    }

    return days;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-80 ${disabled ? 'opacity-70' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <button type="button" disabled={disabled} onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50" aria-label="Previous month">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </button>
        <div className="flex items-center space-x-2">
            <select
                value={month}
                onChange={handleMonthChange}
                disabled={disabled}
                className="w-auto px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm font-medium text-gray-700 dark:text-gray-200"
                aria-label="Chọn tháng"
            >
                {months.map((m, index) => (
                    <option key={index} value={index}>{m}</option>
                ))}
            </select>
            <select
                value={year}
                onChange={handleYearChange}
                disabled={disabled}
                className="w-auto px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm font-medium text-gray-700 dark:text-gray-200"
                aria-label="Chọn năm"
            >
                {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
        </div>
        <button type="button" disabled={disabled} onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50" aria-label="Next month">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
        <div>CN</div><div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default CalendarPicker;