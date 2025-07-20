import React, { useEffect, useState } from "react";
import { ref, get, child } from "firebase/database";
import { database } from "../../config/firebase";

const DeviceList = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const dbRef = ref(database);
                const snapshot = await get(child(dbRef, "wattify"));

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const deviceArray = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        ...value,
                    }));
                    setDevices(deviceArray);
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.error("Error fetching devices:", error);
            }
        };

        fetchDevices();
    }, []);

    return (
        <div>
            <h2>Device List</h2>
            <ul>
                {devices.map((device) => (
                    <li key={device.id}>
                        <strong>{device.DeviceUserName}</strong><br />
                        WiFi: {device.WiFiID}<br />
                        <div>
                            <p>Relay: {device.relay_state}</p>
                            <p>{device.relay_state === "high" ? "Device is connected" : "Device is disconnected"}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeviceList;
