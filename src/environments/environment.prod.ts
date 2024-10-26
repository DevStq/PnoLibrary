// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const environment = {
    production: true,
    firebaseConfig: {
        apiKey: "AIzaSyDu5XqsIhH0UWJrsFzDP_v2o3zBAuRStlI",
  authDomain: "madinalibrary-7ad63.firebaseapp.com",
  projectId: "madinalibrary-7ad63",
  storageBucket: "madinalibrary-7ad63.appspot.com",
  messagingSenderId: "1061833948355",
  appId: "1:1061833948355:web:e1197dbbc42d7589b4f676",
  measurementId: "G-JB88XRNJ9X"
    }

  };
      // Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);