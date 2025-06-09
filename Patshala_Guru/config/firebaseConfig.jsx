import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC2z0ksvG1NOj-in2xNhQHa0gPTAtu2Y2s",
  authDomain: "project-patshala.firebaseapp.com",
  projectId: "project-patshala",
  storageBucket: "project-patshala.firebasestorage.app",
  messagingSenderId: "943313093612",
  appId: "1:943313093612:web:f72859cf455a0a1cbd36c9",
  measurementId: "G-2BVSKVJRBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app); // ✅ Fixed

const analytics = getAnalytics(app);
