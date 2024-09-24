// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (replace with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyBr8JNaAfNTSBEaALdAbs9GZV75dCaFpKA",
    authDomain: "telegrambot-488b1.firebaseapp.com",
    projectId: "telegrambot-488b1",
    storageBucket: "telegrambot-488b1.appspot.com",
    messagingSenderId: "352329076424",
    appId: "1:352329076424:web:904e202176bb04224a5ffd",
    measurementId: "G-ZFQM9Y289S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
