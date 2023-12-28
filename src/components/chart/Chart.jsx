import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./chart.scss";
import Footer from "../footer/Footer";

const convertToNumber = (value) => {
  return parseFloat(value.replace(/\$/g, ""));
};

const Chart = ({ sheetID, websiteName }) => {
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // const sheetID = import.meta.env.VITE_CLIENT_ID;
  // const key = import.meta.env.VITE_CLIENT_KEY;

  let key = import.meta.env.VITE_CLIENT_KEY


  const getData = async () => {
    try {
      const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values:batchGet?ranges=${websiteName}&majorDimension=ROWS&key=${key}`;

      // console.log("datah: ")
      // console.log(sheetID)
      // console.log(websiteName)
      // console.log(key)
      
      const response = await fetch(endpoint);
      const result = await response.json();

      const headers = result.valueRanges[0].values[0];
      const dateIndex = headers.indexOf("Date");

      const data = result.valueRanges[0].values
        .slice(1)
        .map((row) => {
          const rowData = {};
          headers.forEach((header, index) => {
            if (index === dateIndex) {
              rowData[header] = row[index];
            } else if (header !== "Website") {
              rowData[header] = convertToNumber(row[index]);
            }
          });
          return rowData;
        });

      setChartData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [websiteName]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const renderCharts = () => {
    if (chartData.length === 0) {
      return <div>No data available</div>;
    }

    const filteredData = chartData.filter((item) => {
      const formattedDate = item.Date;
      const startDateMatch =
        !startDate || new Date(formattedDate.split('/').reverse().join('/')) >= startDate;
      const endDateMatch =
        !endDate || new Date(formattedDate.split('/').reverse().join('/')) <= endDate;

      return startDateMatch && endDateMatch;
    });

    const chartElements = Object.keys(filteredData[0])
      .filter((key) => key !== "Date" && key !== "Website")
      .map((key) => {
        const displayName = key; // Add more mappings as needed

        const values = filteredData.map((entry) => entry[key]);

        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const domain = [minValue, maxValue];

        let total = values.reduce((acc, value) => acc + value, 0);
        let totalFormatted = total.toLocaleString();

        if (displayName !== "Impressions") {
          totalFormatted = `$${total.toFixed(2)}`;
        }

        return (
          <div key={key} className="chart-container">
             <div className="total-value">
              Total {displayName}: {totalFormatted}
            </div>
            {/* <ResponsiveContainer width="100%" aspect={3/ 1}> */}
              <AreaChart
                width={730}
                height={250}
                data={filteredData}
                margin={{ top: 30, right: 30, left: 50, bottom: 20 }}
              >
                <defs>
                  <linearGradient id={"common-gradient"} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#31a2c4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#31a2c4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="Date" stroke="gray" />
                <YAxis
                  type="number"
                  stroke="gray"
                  domain={domain}
                  tickFormatter={(value) => ((key === "Impressions") ? value : `$${value}`)}
                />
                <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey={key}
                  stroke="#31a2c4"
                  fillOpacity={1}
                  fill={"url(#common-gradient)"}
                />
              </AreaChart>
            {/* </ResponsiveContainer> */}
           
          </div>
        );
      });

    return <div className="charts-container">{chartElements}</div>;
  };

  return (
    <div className="chart">
      <div className="title">{websiteName}</div>
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
        {renderCharts()}
        {/* <Footer></Footer> */}
    </div>
  );
};

export default Chart;
