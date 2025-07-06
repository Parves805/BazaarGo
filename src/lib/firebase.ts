
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// IMPORTANT: Add your Firebase project configuration to a .env.local file
// in the root of your project. You can find these in your Firebase project settings.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;

// This check prevents the app from crashing if Firebase config is missing.
// It's crucial for the user to add their config to .env.local for auth to work.
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
} else {
    if (typeof window !== 'undefined') {
        console.error("Firebase configuration is missing or invalid. Please ensure all NEXT_PUBLIC_FIREBASE_* variables are set correctly in your .env.local file.");
    }
    // Provide mock objects to prevent the app from crashing on import.
    // Authentication functionality will be disabled until the config is provided.
    app = {} as FirebaseApp;
    auth = {} as Auth;
}


export { app, auth };
