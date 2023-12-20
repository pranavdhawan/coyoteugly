import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateFilter = ({ onChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = () => {
    // Check if both start and end dates are selected
    if (startDate && endDate) {
      // Perform the necessary logic, e.g., fetch data with the selected date range
      onChange(startDate.toISOString(), endDate.toISOString());
    }
  };

  return (
    <div className="date-filter">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start Date"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="End Date"
      />
      <button onClick={handleDateChange}>Apply</button>
    </div>
  );
};

export default DateFilter;
