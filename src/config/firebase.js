// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCk8jgYp2dSVlXdfZHWwGTh5HZFXpQ-YNQ",
    authDomain: "watty-11.firebaseapp.com",
    projectId: "watty-11",
    storageBucket: "watty-11.firebasestorage.app",
    messagingSenderId: "978159296656",
    appId: "1:978159296656:web:ece076d7757ea6217d7815",
    measurementId: "G-5HGRBYG2W4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);