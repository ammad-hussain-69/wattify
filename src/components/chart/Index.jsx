import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Charts = () => {
  // Sample data for today's consumption (hourly)
  const todayData = [
    { time: "12 AM", consumption: 1.2 },
    { time: "2 AM", consumption: 1.0 },
    { time: "4 AM", consumption: 0.8 },
    { time: "6 AM", consumption: 1.5 },
    { time: "8 AM", consumption: 2.2 },
    { time: "10 AM", consumption: 2.8 },
    { time: "12 PM", consumption: 3.5 },
    { time: "2 PM", consumption: 4.1 },
    { time: "4 PM", consumption: 3.9 },
    { time: "6 PM", consumption: 3.2 },
    { time: "8 PM", consumption: 2.7 },
    { time: "10 PM", consumption: 2.0 },
  ];

  // Sample data for week consumption (daily)
  const weekData = [
    { time: "Mon", consumption: 18 },
    { time: "Tue", consumption: 21 },
    { time: "Wed", consumption: 17 },
    { time: "Thu", consumption: 22 },
    { time: "Fri", consumption: 19 },
    { time: "Sat", consumption: 24 },
    { time: "Sun", consumption: 20 },
  ];

  const [activeData, setActiveData] = useState("today");

  const getChartData = () => (activeData === "today" ? todayData : weekData);

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Electricity Consumption ({activeData === "today" ? "Today" : "This Week"})
      </h3>

      {/* Toggle Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setActiveData("today")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeData === "today" ? "#00b894" : "#dfe6e9",
            color: activeData === "today" ? "#fff" : "#2d3436",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Today's Consumption
        </button>
        <button
          onClick={() => setActiveData("week")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeData === "week" ? "#00b894" : "#dfe6e9",
            color: activeData === "week" ? "#fff" : "#2d3436",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Week's Consumption
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={getChartData()}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis unit=" kWh" />
          <Tooltip formatter={(value) => [`${value} kWh`, "Consumption"]} />
          <Area
            type="monotone"
            dataKey="consumption"
            stroke="#00b894"
            fill="#00cec9"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
