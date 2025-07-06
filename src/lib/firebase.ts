
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// These variables are loaded from .env file by Next.js
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
let isFirebaseConfigured = false;

// Check if all required Firebase config values are present and valid
if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
) {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        isFirebaseConfigured = true;
    } catch (e) {
        console.error("Firebase initialization failed:", e);
        // Fallback to unconfigured state
        app = {} as FirebaseApp;
        auth = {} as Auth;
        isFirebaseConfigured = false;
    }
} else {
    // Silently fail if config is not set, the UI will adapt by disabling auth features.
    app = {} as FirebaseApp;
    auth = {} as Auth;
    isFirebaseConfigured = false;
}

export { app, auth, isFirebaseConfigured };
