import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDatabase, ref, get, child } from "firebase/database";

const Charts = () => {
  const [todayData, setTodayData] = useState([]);
  const [weekData] = useState([]); // Placeholder
  const [activeData, setActiveData] = useState("today");

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const db = getDatabase();
        const snapshot = await get(child(ref(db), "wattify/Arqish_arqish5634_Test-Machine/Readings"));

        if (snapshot.exists()) {
          const readings = snapshot.val();

          // Convert to array and sort by key (timestamp order)
          const sortedReadings = Object.entries(readings)
            .sort(([a], [b]) => a.localeCompare(b)) // sorting by Firebase keys
            .map(([_, value]) => value);

          // Remove the first 10
          const trimmedReadings = sortedReadings.slice(10);

          // Prepare chart data
          const chartData = trimmedReadings.map((reading, index) => ({
            time: reading.timestamp || `T+${index}s`,
            consumption: parseFloat(reading.current.toFixed(2)) || 0,
          }));

          setTodayData(chartData);
        } else {
          console.log("No readings found.");
        }
      } catch (error) {
        console.error("Error fetching readings:", error);
      }
    };

    fetchReadings();
  }, []);

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
          <YAxis unit=" A" />
          <Tooltip formatter={(value) => [`${value} A`, "Current"]} />
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
