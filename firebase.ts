// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBf6UsygkOpR9aoWmY-mDSwdGEoTF-EkCY",
  authDomain: "my-notes-app-aa717.firebaseapp.com",
  projectId: "my-notes-app-aa717",
  storageBucket: "my-notes-app-aa717.appspot.com",
  messagingSenderId: "236716485571",
  appId: "1:236716485571:web:30f5a35a4c57ebc65e6b76"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
});

export const db = getFirestore(app);
