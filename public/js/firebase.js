import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { CONFIG } from './config.js';

const firebaseConfig = {
    apiKey: CONFIG.VITE_FIREBASE_API_KEY,
    authDomain: CONFIG.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: CONFIG.VITE_FIREBASE_PROJECT_ID,
    storageBucket: CONFIG.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: CONFIG.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: CONFIG.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
