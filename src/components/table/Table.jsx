import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./table.scss";

const Table = ({ sheetID, websiteName }) => {
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // const sheetID = import.meta.env.VITE_CLIENT_ID;
  // const key = import.meta.env.VITE_CLIENT_KEY;

  let key = import.meta.env.VITE_CLIENT_KEY


  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values:batchGet?ranges=${websiteName}&majorDimension=ROWS&key=${key}`;
        const response = await fetch(endpoint);
        const result = await response.json();

        const headers = result.valueRanges[0].values[0];
        const rows = result.valueRanges[0].values.slice(1);

        const formattedData = rows.map((row) => {
          return headers.reduce((obj, header, index) => {
            obj[header] = row[index];
            return obj;
          }, {});
        });

        setTableData(formattedData);
      } catch (error) {
        console.error("Error fetching data from Google Sheets:", error);
      }
    };

    fetchData();
  }, [websiteName]);
  
  const renderTableHeader = () => {
    return Object.keys(tableData[0] || {}).map((key) => (
      <th key={key}>{key.toUpperCase()}</th>
    ));
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const renderTableData = () => {
    const filteredData = tableData.filter((item) => {
      const formattedDate = item.Date; // Use the correct key for the date column
      const startDateMatch =
        !startDate || new Date(formattedDate.split('/').reverse().join('/')) >= startDate;
      const endDateMatch =
        !endDate || new Date(formattedDate.split('/').reverse().join('/')) <= endDate;
  
      return startDateMatch && endDateMatch;
    });
  
    return filteredData.map((item, index) => (
      <tr key={index}>
        {Object.values(item).map((value, index) => (
          <td key={index}>{value}</td>
        ))}
      </tr>
    ));
  };
  
  return (
    <div className="tableContainer">
      <div className="date-picker">
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
          isClearable
          dateFormat="dd/MM/yyyy"
          placeholderText="Select Date Range" 
        />
      </div>
      <table>
        <thead>
          <tr>{renderTableHeader()}</tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );
};

export default Table;
