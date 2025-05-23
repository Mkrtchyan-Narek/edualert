
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAR93GNBAJb4Fqx2MTbZYEpd8MiO_J9LPE",
  authDomain: "homeworklogger-6512e.firebaseapp.com",
  projectId: "homeworklogger-6512e",
  storageBucket: "homeworklogger-6512e.appspot.com",
  messagingSenderId: "622243787275",
  appId: "1:622243787275:web:8ecc845c574755dbf94d0e",
  measurementId: "G-T6P2VNFBH1"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
