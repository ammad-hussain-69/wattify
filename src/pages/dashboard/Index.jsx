import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, child } from "firebase/database";
import styles from "./styles.module.css";
import Cards from "../../components/cards/Index";
import { TbSettings2 } from "react-icons/tb";
import { FaDollarSign, FaChartLine, FaBolt, FaHome } from "react-icons/fa";
import { PiLightning } from "react-icons/pi";
import { LiaSuperpowers } from "react-icons/lia";
import { HiSparkles } from "react-icons/hi";
import Charts from "../../components/chart/Index";
import AddDevice from "../../components/addDevice/Index";
import DeviceList from "../../components/allDevices/Index";
import { GiElectricalResistance } from "react-icons/gi";

const Dashboard = () => {
 const [stats, setStats] = useState({
    averageCurrent: 0,
    averageVoltage: 0,
    averagePower: 0,
    totalUnits: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchReadings = async () => {
      setLoading(true);
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
            averageCurrent: (totalCurrent / count).toFixed(2),
            averageVoltage: (totalVoltage / count).toFixed(2),
            averagePower: (totalPower / count).toFixed(2),
            totalUnits: totalUnits.toFixed(2),
          });
          
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error("Error fetching readings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchReadings, 30000);
    return () => clearInterval(interval);
  }, []);

  const cardsData = [
    {
      title: "Average Current",
      numb: stats.averageCurrent,
      unit: "A",
      description: "Average current usage",
      icon: <GiElectricalResistance />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      trend: "+5.2%"
    },
    {
      title: "Energy Units",
      numb: stats.totalUnits,
      unit: "kWh",
      description: "Total energy consumed",
      icon: <FaDollarSign />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      trend: "+12.3%"
    },
    {
      title: "Average Power",
      numb: stats.averagePower,
      unit: "W",
      description: "Average power usage",
      icon: <PiLightning />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      trend: "-2.1%"
    },
    {
      title: "Average Voltage",
      numb: stats.averageVoltage,
      unit: "V",
      description: "Average voltage reading",
      icon: <LiaSuperpowers />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      trend: "+8.7%"
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <FaHome className={styles.heroIcon} />
              Energy Dashboard
              <HiSparkles className={styles.sparkleIcon} />
            </h1>
            <p className={styles.heroSubtitle}>
              Monitor and optimize your energy consumption in real-time
            </p>
            <div className={styles.lastUpdate}>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.quickStat}>
              <FaBolt className={styles.quickStatIcon} />
              <div>
                <span className={styles.quickStatValue}>{stats.totalCurrent}A</span>
                <span className={styles.quickStatLabel}>Current Load</span>
              </div>
            </div>
            <div className={styles.quickStat}>
              <FaChartLine className={styles.quickStatIcon} />
              <div>
                <span className={styles.quickStatValue}>{stats.averagePower}W</span>
                <span className={styles.quickStatLabel}>Avg Power</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.heroBackground}></div>
      </div>

      {/* Stats Cards Section */}
      <div className={styles.statsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <TbSettings2 className={styles.sectionIcon} />
            Energy Metrics
          </h2>
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot}></div>
            Live Data
          </div>
        </div>
        
        {loading ? (
          <div className={styles.loadingCards}>
            {[1,2,3,4].map(i => (
              <div key={i} className={styles.loadingCard}>
                <div className={styles.loadingSkeleton}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {cardsData.map((data, idx) => (
              <div key={idx} className={styles.cardWrapper}>
                <div className={styles.modernCard} style={{ background: data.gradient }}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                      {data.icon}
                    </div>
                    <div className={styles.cardTrend}>
                      {data.trend}
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{data.title}</h3>
                    <div className={styles.cardValue}>
                      {data.money && <span className={styles.currency}>{data.money}</span>}
                      <span className={styles.number}>{data.numb}</span>
                      <span className={styles.unit}>{data.unit}</span>
                    </div>
                    <p className={styles.cardDescription}>{data.description}</p>
                  </div>
                  <div className={styles.cardGlow}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts and Controls Section */}
      <div className={styles.chartsSection}>
        <div className={styles.mainChart}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>
              <FaChartLine className={styles.chartIcon} />
              Energy Consumption Trends
            </h2>
          </div>
          <div className={styles.chartContainer}>
            <Charts />
          </div>
        </div>
        
        <div className={styles.sidePanel}>
          <div className={styles.deviceControls}>
            <AddDevice />
          </div>
          {/* Uncomment if you want to show device list */}
          {/* <div className={styles.deviceList}>
            <DeviceList />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;