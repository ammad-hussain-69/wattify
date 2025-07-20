// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBO3SFS4k8SxUq3poIGeH9Xgi98BDP1eeg",
    authDomain: "wattify001.firebaseapp.com",
    databaseURL: "https://wattify001-default-rtdb.firebaseio.com",
    projectId: "wattify001",
    storageBucket: "wattify001.firebasestorage.app",
    messagingSenderId: "441047207108",
    appId: "1:441047207108:web:992e9a28c07de4e2a14d91"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const database = getDatabase(app);
export { database };