import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import styles from './styles.module.css'; // Create this for styling

const DeviceDetailsModal = ({ deviceId, deviceName, onClose }) => {
  const [readings, setReadings] = useState(null);

  useEffect(() => {
    const fetchReadings = async () => {
      const db = getDatabase();
      const snapshot = await get(ref(db, `wattify/${deviceId}/Readings`));
      if (snapshot.exists()) {
        setReadings(snapshot.val());
      }
    };
    fetchReadings();
  }, [deviceId]);

  if (!readings) return <div className={styles.modal}>Loading...</div>;

  const { voltage = 220, current = 0, efficiency = 0.78 } = readings;
  const dailyCost = (voltage * current * 24 / 1000 * 0.14).toFixed(2); // kWh * $/unit
  const monthlyUsage = ((voltage * current * 24 * 30) / 1000).toFixed(1); // kWh

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>⚡ {deviceName}</h3>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <div>
              <div className={styles.label}>Voltage</div>
              <div className={styles.value}>{voltage}V</div>
            </div>
            <div>
              <div className={styles.label}>Current</div>
              <div className={styles.value}>{current}A</div>
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <div className={styles.label}>Daily Cost</div>
              <div className={styles.value}>${dailyCost}</div>
            </div>
            <div>
              <div className={styles.label}>Monthly Usage</div>
              <div className={styles.value}>{monthlyUsage} kWh</div>
            </div>
          </div>
          <div>
            <div className={styles.label}>Efficiency Rating</div>
            <div className={styles.efficiencyBar}>
              <div
                className={styles.fill}
                style={{ width: `${efficiency * 100}%` }}
              />
            </div>
            <div className={styles.efficiencyPercent}>
              {(efficiency * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsModal;
