// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import dotenv from 'dotenv';
dotenv.config();  // This will load the variables from the .env file

const secretKey = process.env.SECRET_KEY;  // Now you can access the secret key from the .env

const firebaseConfig = {
  apiKey: "AIzaSyAvQzvhfW1YsO4-yzhjA24k5B2FWUSRQ7M",
  authDomain: "shopping-mall-app-de3c9.firebaseapp.com",
  projectId: "shopping-mall-app-de3c9",
  storageBucket: "shopping-mall-app-de3c9.firebasestorage.app",
  messagingSenderId: "1061249472769",
  appId: "1:1061249472769:web:b44afdb19941e6ca4ce300",
  measurementId: "G-63RQCFGBHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { db, analytics, firebaseConfig, storage, ref, uploadBytesResumable, getDownloadURL };


