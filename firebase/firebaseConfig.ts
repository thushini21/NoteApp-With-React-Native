// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBf6UsygkOpR9aoWmY-mDSwdGEoTF-EkCY",
  authDomain: "my-notes-app-aa717.firebaseapp.com",
  projectId: "my-notes-app-aa717",
  storageBucket: "my-notes-app-aa717.appspot.com", // fix: use ".appspot.com"
  messagingSenderId: "236716485571",
  appId: "1:236716485571:web:30f5a35a4c57ebc65e6b76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
