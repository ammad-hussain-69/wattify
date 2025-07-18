import React from "react";
import styles from "./styles.module.css";
const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeading}>
        <h1>Welcome to the wattify Monitoring Device </h1>
        <p>Monitor and optimize your energy consumption in real-time </p>
      </div>
    </div>
  );
};

export default Dashboard;
