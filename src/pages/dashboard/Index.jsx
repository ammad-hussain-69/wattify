import React from "react";
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
const Dashboard = () => {
  const data = [
    {
      title: "Current Usage",
      numb: -24,
      unit: "kW",
      description: "Live power consumption",
      consumptionRate: 2.1,
      icon: <TbSettings2 />,
    },
    {
      title: "Today's cost",
      numb: 24,
      unit: "",
      money: "$",
      description: "Live power consumption",
      consumptionRate: 2.1,
      icon: <FaDollarSign />,
    },
    {
      title: "Current Usage",
      numb: -24,
      unit: "kW",
      description: "Live power consumption",
      consumptionRate: 2.1,
      icon: <PiLightning />,
    },
    {
      title: "Current Usage",
      numb: +24,
      unit: "%",
      description: "Live power consumption",
      consumptionRate: 2.1,
      icon: <LiaSuperpowers />,
    },
  ];
  const data2 = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
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
          {data.map((items, i) => (
            <div className="col-lg-3">
              <Cards data={items} key={i} />
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
          <div className="col-lg-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
