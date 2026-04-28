import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBeB09hmBGOl0gjTJwBZ_UDjK44bHB2thQ",
  authDomain: "khlia-atyaf.firebaseapp.com",
  projectId: "khlia-atyaf",
  storageBucket: "khlia-atyaf.firebasestorage.app",
  messagingSenderId: "58587153069",
  appId: "1:58587153069:web:7be1f8dc7fa7376c597c24",
  measurementId: "G-9FZ517DZLS",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

