import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChJGTrIs4nSCSSi4lV5qQlH4_ERhQc3vc",
  authDomain: "arnold-web-streaming.firebaseapp.com",
  projectId: "arnold-web-streaming",
  storageBucket: "arnold-web-streaming.firebasestorage.app",
  messagingSenderId: "153367877355",
  appId: "1:153367877355:web:21a54538aace0b26dd10ae",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
