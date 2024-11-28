// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6gL-LItz9cNsTmWLR6A9m2j64yD047WU",
  authDomain: "talk2sign-46d66.firebaseapp.com",
  projectId: "talk2sign-46d66",
  storageBucket: "talk2sign-46d66.firebasestorage.app",
  messagingSenderId: "399520281508",
  appId: "1:399520281508:web:33c7752309ea7f74e74731",
  measurementId: "G-VPG2J1K2PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);