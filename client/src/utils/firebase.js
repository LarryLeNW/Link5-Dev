// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE,
    authDomain: "blog-app-22-12-2023.firebaseapp.com",
    projectId: "blog-app-22-12-2023",
    storageBucket: "blog-app-22-12-2023.firebasestorage.app",
    messagingSenderId: "1056256800533",
    appId: "1:1056256800533:web:04babb726d4fcc62065b1c",
    measurementId: "G-B895J9T7W1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
