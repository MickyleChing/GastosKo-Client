import React, { useState } from 'react';

const YearMonthDropdown = ({ selectedYear, selectedMonth, onYearMonthChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index);

  const handleYearChange = (e) => {
    onYearMonthChange(parseInt(e.target.value, 10), selectedMonth);
  };

  const handleMonthChange = (e) => {
    const monthValue = parseInt(e.target.value, 10);
    onYearMonthChange(selectedYear, monthValue > 0 ? monthValue : null);
  };

  return (
    <div>
      <label>Year:</label>
      <select value={selectedYear} onChange={handleYearChange}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <label>Month:</label>
      <select value={selectedMonth || ''} onChange={handleMonthChange}>
        <option value=''>No Month</option>
        {Array.from({ length: 12 }, (_, index) => (
          <option key={index + 1} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearMonthDropdown;
