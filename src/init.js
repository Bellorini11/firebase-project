// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHsvg_BIrJ2cQRiMDlWvqpWRUiWVd4yus",
  authDomain: "fir-project-b13c8.firebaseapp.com",
  projectId: "fir-project-b13c8",
  storageBucket: "fir-project-b13c8.firebasestorage.app",
  messagingSenderId: "869744291338",
  appId: "1:869744291338:web:d1591e27902a424dda39f3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
