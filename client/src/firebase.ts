import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDL2WO_z1sDNqWzNojZD7yRvZAdF4lOlvU",
  authDomain: "chess-app-org.firebaseapp.com",
  projectId: "chess-app-org",
  storageBucket: "chess-app-org.appspot.com",
  messagingSenderId: "555387148122",
  appId: "1:555387148122:web:734f865f336a9df41d4563",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
