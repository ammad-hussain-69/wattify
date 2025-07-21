import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import styles from "./styles.module.css";
import {
  FaClock,
  FaCalendarDay,
  FaCalendarWeek,
  FaChartLine,
  FaBolt,
  FaDownload,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";

const Reports = () => {
const [reportType, setReportType] = useState("daily");
  const [selectedDevice, setSelectedDevice] = useState("all");
  const [devices, setDevices] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [peakUsage, setPeakUsage] = useState({ value: 0, time: "" });
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const db = getDatabase();

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    if (devices.length > 0) {
      generateReport();
    }
  }, [reportType, selectedDevice, devices, dateRange]);

  const fetchDevices = async () => {
    try {
      const snapshot = await get(ref(db, `wattify`));
      if (snapshot.exists()) {
        const allDevices = snapshot.val();
        const deviceList = Object.entries(allDevices).map(([key, val]) => ({
          id: key,
          name: val.DeviceUserName || "Unnamed",
        }));
        setDevices(deviceList);
      }
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      // Generate realistic electrical data based on your Firebase structure
      const data = await generateReportData();
      setReportData(data);
      calculateStats(data);
    } catch (err) {
      console.error("Error generating report:", err);
    }
    setLoading(false);
  };

  const generateReportData = async () => {
    // This simulates processing your Firebase readings data with correct electrical calculations
    const data = [];
    const now = new Date();
    let intervals = 24; // Default for daily (hourly intervals)

    if (reportType === "weekly") intervals = 7;
    else if (reportType === "hourly") intervals = 60; // Minutes

    for (let i = intervals - 1; i >= 0; i--) {
      let timeLabel;
      let current, voltage, power, energyConsumption;

      if (reportType === "hourly") {
        const time = new Date(now.getTime() - i * 60 * 1000);
        timeLabel = time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        
        // Realistic electrical values for 1-minute intervals
        current = Math.random() * 5 + 2; // 2-7A typical appliance range
        voltage = 220 + (Math.random() - 0.5) * 10; // 215-225V (typical with small variations)
        power = current * voltage; // P = I × V
        energyConsumption = (power * (1/60)) / 1000; // kWh for 1 minute
        
      } else if (reportType === "daily") {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        timeLabel = time.toLocaleTimeString([], { hour: "2-digit" });
        
        // Realistic electrical values for 1-hour intervals
        current = Math.random() * 8 + 3; // 3-11A average over an hour
        voltage = 220 + (Math.random() - 0.5) * 8; // 216-224V
        power = current * voltage; // P = I × V
        energyConsumption = power / 1000; // kWh for 1 hour
        
      } else {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        timeLabel = time.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        
        // Daily totals (24-hour period)
        current = Math.random() * 6 + 4; // 4-10A average over 24 hours
        voltage = 220 + (Math.random() - 0.5) * 6; // 217-223V
        power = current * voltage; // P = I × V
        energyConsumption = (power * 24) / 1000; // kWh for 24 hours
      }

      data.push({
        time: timeLabel,
        current: parseFloat(current.toFixed(2)),
        voltage: parseFloat(voltage.toFixed(1)),
        power: parseFloat(power.toFixed(2)),
        energyConsumption: parseFloat(energyConsumption.toFixed(3)), // kWh
        cost: parseFloat((energyConsumption * 0.15).toFixed(2)), // Assuming $0.15 per kWh
      });
    }

    return data;
  };

  const calculateStats = (data) => {
    // Total energy consumption (kWh)
    const total = data.reduce((sum, item) => sum + item.energyConsumption, 0);
    setTotalConsumption(parseFloat(total.toFixed(3)));

    // Peak power usage (not current, as power is more meaningful)
    const peak = data.reduce(
      (max, item) =>
        item.power > max.value
          ? { value: item.power, time: item.time }
          : max,
      { value: 0, time: "" }
    );
    setPeakUsage({
      value: parseFloat(peak.value.toFixed(2)),
      time: peak.time
    });
  };

  const exportReport = () => {
    const csvContent =
      "Time,Current (A),Voltage (V),Power (W),Energy (kWh),Cost ($)\n" +
      reportData
        .map((row) => 
          `${row.time},${row.current},${row.voltage},${row.power},${row.energyConsumption},${row.cost}`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wattify-${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getReportIcon = (type) => {
    switch (type) {
      case "hourly":
        return <FaClock />;
      case "daily":
        return <FaCalendarDay />;
      case "weekly":
        return <FaCalendarWeek />;
      default:
        return <FaChartLine />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <FaChartLine className={styles.headerIcon} />
          <h2 className={styles.title}>Energy Consumption Reports</h2>
        </div>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <FaFilter className={styles.controlIcon} />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className={styles.select}
            >
              <option value="hourly">Hourly Report</option>
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className={styles.select}
            >
              <option value="all">All Devices</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={exportReport} className={styles.exportButton}>
            <FaDownload />
            Export CSV
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaBolt />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{totalConsumption}A</h3>
            <p className={styles.statLabel}>Total Consumption</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaChartLine />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{peakUsage.value}A</h3>
            <p className={styles.statLabel}>Peak Usage at {peakUsage.time}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaBolt />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>
              ${(totalConsumption * 0.12).toFixed(2)}
            </h3>
            <p className={styles.statLabel}>Estimated Cost</p>
          </div>
        </div>
      </div>

      <div className={styles.reportSection}>
        <div className={styles.reportHeader}>
          <div className={styles.reportTitle}>
            {getReportIcon(reportType)}
            <h3>
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
            </h3>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <FaSpinner className={styles.spinner} />
            <p>Generating report...</p>
          </div>
        ) : (
          <div className={styles.reportContent}>
            <div className={styles.chartContainer}>
              <div className={styles.chart}>
                {reportData.map((item, index) => {
                  const maxConsumption = Math.max(
                    ...reportData.map((d) => d.consumption)
                  );
                  const height = (item.consumption / maxConsumption) * 100;

                  return (
                    <div key={index} className={styles.chartBar}>
                      <div
                        className={styles.bar}
                        style={{ height: `${height}%` }}
                        title={`${item.time}: ${item.consumption}A - $${item.cost}`}
                      ></div>
                      <span className={styles.barLabel}>{item.time}</span>
                      <span className={styles.barValue}>
                        {item.consumption}A
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.reportTable}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Consumption (A)</th>
                    <th>Estimated Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.time}</td>
                      <td>{item.consumption}A</td>
                      <td>${item.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
