// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6gL-LItz9cNsTmWLR6A9m2j64yD047WU",
  authDomain: "talk2sign-46d66.firebaseapp.com",
  projectId: "talk2sign-46d66",
  storageBucket: "talk2sign-46d66.appspot.com", // Corrected storage bucket
  messagingSenderId: "399520281508",
  appId: "1:399520281508:web:33c7752309ea7f74e74731",
  measurementId: "G-VPG2J1K2PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Debugging log for development
if (process.env.NODE_ENV !== "production") {
  console.log("Firebase App Initialized:", app.name); // Logs "[DEFAULT]"
}

// Initialize Analytics and Authentication
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Export Firebase Auth instance

// Initialize Firestore
const db = getFirestore(app);
export { db };

export default app;