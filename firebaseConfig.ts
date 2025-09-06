// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf6UsygkOpR9aoWmY-mDSwdGEoTF-EkCY",
  authDomain: "my-notes-app-aa717.firebaseapp.com",
  projectId: "my-notes-app-aa717",
  storageBucket: "my-notes-app-aa717.appspot.com",
  messagingSenderId: "236716485571",
  appId: "1:236716485571:web:30f5a35a4c57ebc65e6b76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
