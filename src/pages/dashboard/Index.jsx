import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Cards from "../../components/cards/Index";
import { TbSettings2 } from "react-icons/tb";
import { FaDollarSign } from "react-icons/fa";
import { PiLightning } from "react-icons/pi";
import { LiaSuperpowers } from "react-icons/lia";
import Charts from "../../components/chart/Index";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AddDevice from "../../components/addDevice/Index";
import DeviceList from "../../components/allDevices/Index";
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCurrent: 0,
    totalVoltage: 0,
    averagePower: 0,
    totalUnits: 0,
  });

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const db = getDatabase();
        const snapshot = await get(child(ref(db), "wattify/Arqish_arqish5634_Test-Machine/Readings"));

        if (snapshot.exists()) {
          const readings = Object.values(snapshot.val()).slice(10); // Skip first 10

          let totalCurrent = 0;
          let totalVoltage = 0;
          let totalPower = 0;
          let totalUnits = 0;

          readings.forEach(r => {
            totalCurrent += Number(r.current || 0);
            totalVoltage += Number(r.voltage || 0);
            totalPower += Number(r.power || 0);
            totalUnits += Number(r.units || 0);
          });

          const count = readings.length || 1;

          setStats({
            totalCurrent: totalCurrent.toFixed(2),
            totalVoltage: totalVoltage.toFixed(2),
            averagePower: (totalPower / count).toFixed(2),
            totalUnits: totalUnits.toFixed(2),
          });
        }
      } catch (error) {
        console.error("Error fetching readings:", error);
      }
    };

    fetchReadings();
  }, []);

  const cardsData = [
    {
      title: "Total Current",
      numb: stats.totalCurrent,
      unit: "A",
      description: "Live current usage",
      icon: <TbSettings2 />,
    },
    {
      title: "Total Units",
      numb: stats.totalUnits,
      unit: "kWh",
      description: "Energy consumed",
      money: "$",
      icon: <FaDollarSign />,
    },
    {
      title: "Avg. Power",
      numb: stats.averagePower,
      unit: "W",
      description: "Average power usage",
      icon: <PiLightning />,
    },
    {
      title: "Voltage Sum",
      numb: stats.totalVoltage,
      unit: "V",
      description: "Total voltage",
      icon: <LiaSuperpowers />,
    },
  ];
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeading}>
        <h1>Welcome to the wattify Monitoring Device </h1>
        <p>Monitor and optimize your energy consumption in real-time </p>
      </div>
      <div className={styles.cardSection}>
        <div className="row">
          {cardsData.map((data, idx) => (
            <div className="col-lg-3">
               <Cards key={idx} data={data} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chartSection}>
        <div className="row">
          <div className="col-lg-8">
            <div className={styles.chartContainer}>
              <Charts />
            </div>
          </div>
          <div className="col-lg-4">
            <AddDevice />
            {/* <DeviceList /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
