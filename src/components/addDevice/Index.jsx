  // AddDevice.js
  import React, { useState, useEffect } from "react";
  import { getAuth } from "firebase/auth";
  import { getDatabase, ref, push, get } from "firebase/database";
  import styles from './styles.module.css';
  import { FaPlus } from "react-icons/fa";

  const AddDevice = () => {
    const [deviceName, setDeviceName] = useState("");
    const [ssid, setSsid] = useState("");
    const [password, setPassword] = useState("");
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const auth = getAuth();
    const db = getDatabase();

    const fetchDevices = async () => {
      const uid = auth.currentUser.uid;
      const snapshot = await get(ref(db, `users/${uid}/devices`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arr = Object.entries(data).map(([id, device]) => ({
          id,
          ...device,
        }));
        setDevices(arr);
      } else {
        setDevices([]);
      }
      setLoading(false);
    };

    const handleAddDevice = async () => {
      const uid = auth.currentUser.uid;

      if (!deviceName || !ssid || !password) {
        alert("Please fill all fields!");
        return;
      }

      const deviceData = {
        deviceName,
        wifiSSID: ssid,
        wifiPassword: password,
        relay_state: "low",
        current: 0,
        addedAt: new Date().toISOString(),
      };

      await push(ref(db, `users/${uid}/devices`), deviceData);
      setDeviceName("");
      setSsid("");
      setPassword("");
      setIsModalOpen(false);
      fetchDevices();
    };

    const handleModalClose = () => {
      setIsModalOpen(false);
      // Reset form when closing
      setDeviceName("");
      setSsid("");
      setPassword("");
    };

    useEffect(() => {
      fetchDevices();
    }, []);

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Devices</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.addButton}
          >
          <FaPlus />
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading devices...</p>
          </div>
        ) : devices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No devices found.</p>
            <p className={styles.emptySubtext}>Add your first device to get started!</p>
          </div>
        ) : (
          <div className={styles.deviceList}>
            {devices.map((dev) => (
              <div key={dev.id} className={styles.deviceCard}>
                <div className={styles.deviceInfo}>
                  <h3 className={styles.deviceName}>{dev.deviceName}</h3>
                  <div className={styles.deviceDetails}>
                    <span className={styles.current}>Current: {dev.current} A</span>
                    <span className={`${styles.relay} ${dev.relay_state === 'high' ? styles.relayActive : styles.relayInactive}`}>
                      Relay: {dev.relay_state}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Classic Modal */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={handleModalClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Add New Device</h3>
                <button 
                  onClick={handleModalClose}
                  className={styles.closeButton}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="deviceName">
                    Device Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="deviceName"
                    type="text"
                    placeholder="Enter device name"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="ssid">
                    WiFi SSID <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="ssid"
                    type="text"
                    placeholder="Enter WiFi network name"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="password">
                    WiFi Password <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter WiFi password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  onClick={handleModalClose}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDevice}
                  className={styles.saveButton}
                >
                  Save Device
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default AddDevice;