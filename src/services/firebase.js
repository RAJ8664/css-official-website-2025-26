import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjS26yT2nJ_ZQyuxh57e8p6XlYLNvASUs",
  authDomain: "css-nits.firebaseapp.com",
  projectId: "css-nits",
  storageBucket: "css-nits.firebasestorage.app",
  messagingSenderId: "1059045529509",
  appId: "1:1059045529509:web:7c02bb3d370d7975fd3a4c",
  measurementId: "G-DXDZK123DZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll need
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);