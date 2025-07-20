import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, get, update, remove } from "firebase/database";
import styles from './styles.module.css';
import { FaPlus, FaTrash, FaPlug, FaUnlink } from "react-icons/fa";
import DeviceDetailsModal from "../../components/deviceModal/Index";

const AddDevice = () => {
  const [deviceName, setDeviceName] = useState("");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const auth = getAuth();
  const db = getDatabase();

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(db, `wattify`));
      if (snapshot.exists()) {
        const allDevices = snapshot.val();
        const deviceList = Object.entries(allDevices).map(([key, val]) => ({
          id: key,
          deviceName: val.DeviceUserName || "Unnamed",
          wifiSSID: val.WiFiID || "",
          wifiPassword: val.WiFiPassword || "",
          relay_state: val.relay_state || "unknown",
          current: val.Readings?.current || 0,
        }));
        setDevices(deviceList);
      } else {
        setDevices([]);
      }
    } catch (err) {
      console.error("Error fetching wattify devices:", err);
    }
    setLoading(false);
  };

  const handleAddDevice = async () => {
    const uid = auth.currentUser?.uid;

    if (!deviceName || !ssid || !password) {
      alert("Please fill all fields!");
      return;
    }

    const deviceId = `${ssid}_${password}_${deviceName}`;
    const deviceData = {
      DeviceUserName: deviceName,
      WiFiID: ssid,
      WiFiPassword: password,
      relay_state: "low",
      Readings: {
        current: 0
      }
    };

    await update(ref(db, `wattify/${deviceId}`), deviceData);

    setDeviceName("");
    setSsid("");
    setPassword("");
    setIsModalOpen(false);
    fetchDevices();
  };

  const toggleRelay = async (deviceId, currentState) => {
    const newState = currentState === "high" ? "low" : "high";
    await update(ref(db, `wattify/${deviceId}`), { relay_state: newState });
    fetchDevices();
  };

  const deleteDevice = async (deviceId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this device?");
    if (confirmDelete) {
      await remove(ref(db, `wattify/${deviceId}`));
      fetchDevices();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDeviceName("");
    setSsid("");
    setPassword("");
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <>
      {selectedDevice && (
        <DeviceDetailsModal
          deviceId={selectedDevice.id}
          deviceName={selectedDevice.deviceName}
          onClose={() => setSelectedDevice(null)}
        />
      )}
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Devices</h2>
          <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>
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
                <div className={styles.deviceInfo} onClick={() => setSelectedDevice(dev)}>
                  <h3 className={styles.deviceName}>{dev.deviceName}</h3>
                  <div className={styles.deviceDetails}>
                    <span className={styles.current}>Current: {dev.current} A</span>
                    <span className={`${styles.relay} ${dev.relay_state === 'high' ? styles.relayActive : styles.relayInactive}`}>
                      Relay: {dev.relay_state}
                    </span>
                  </div>
                </div>
                <div className={styles.deviceActions}>
                  <button
                    className={styles.toggleRelay}
                    onClick={() => toggleRelay(dev.id, dev.relay_state)}
                  >
                    {dev.relay_state === "high" ? <FaUnlink /> : <FaPlug />}
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteDevice(dev.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Adding Device */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={handleModalClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Add New Device</h3>
                <button onClick={handleModalClose} className={styles.closeButton}>✕</button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label htmlFor="deviceName">Device Name *</label>
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
                  <label htmlFor="ssid">WiFi SSID *</label>
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
                  <label htmlFor="password">WiFi Password *</label>
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
                <button onClick={handleModalClose} className={styles.cancelButton}>Cancel</button>
                <button onClick={handleAddDevice} className={styles.saveButton}>Save Device</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddDevice;
