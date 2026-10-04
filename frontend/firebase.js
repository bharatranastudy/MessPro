// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Note: If you create a new Firebase project for MessPro in the Firebase Console, 
// replace these fields with the exact credentials from your Firebase Console.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "hash-150ce.firebaseapp.com",
  projectId: "hash-150ce",
  storageBucket: "hash-150ce.firebasestorage.app",
  messagingSenderId: "922232435171",
  appId: "1:922232435171:web:4ce4103ad1e29da7d9b0d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}