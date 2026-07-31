import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxyE1LN55-bvelCaQtPv0zXOngEnB-eXQ",
  authDomain: "mental-health-main.firebaseapp.com",
  projectId: "mental-health-main",
  storageBucket: "mental-health-main.firebasestorage.app",
  messagingSenderId: "555603496970",
  appId: "1:555603496970:web:21af3469290f533a850ff3",
  measurementId: "G-T3HDGSTPCT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;
