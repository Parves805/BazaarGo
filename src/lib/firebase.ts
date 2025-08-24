
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, collection, doc, type Firestore, type DocumentReference, type CollectionReference } from "firebase/firestore";
import type { Product, Category, Order, Review, WebsiteSettings, AiSettings, PaymentGatewaySettings, PopupCampaign, HomepageSection, PromoSection, UserThread, Notification } from '@/lib/types';


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
let db: Firestore;
let isFirebaseConfigured = false;

// Check if all required Firebase config values are present and valid
if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
) {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);
        isFirebaseConfigured = true;
    } catch (e) {
        console.error("Firebase initialization failed:", e);
        // Fallback to unconfigured state
        app = {} as FirebaseApp;
        auth = {} as Auth;
        db = {} as Firestore;
        isFirebaseConfigured = false;
    }
} else {
    // Silently fail if config is not set, the UI will adapt by disabling auth features.
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
    isFirebaseConfigured = false;

    if (typeof window !== 'undefined') {
        console.warn("\n[BazaarGo] WARNING: Firebase configuration is missing or incomplete.");
        console.warn("[Bazaargo] Authentication and database features will be disabled.");
        console.warn("[Bazaargo] Please ensure all NEXT_PUBLIC_FIREBASE_* variables are set in your .env file.\n");
    }
}

// Collection References
const productsCollection = collection(db, 'products') as CollectionReference<Product>;
const categoriesCollection = collection(db, 'categories') as CollectionReference<Category>;
const ordersCollection = collection(db, 'orders') as CollectionReference<Order>;
const reviewsCollection = collection(db, 'reviews') as CollectionReference<Review>;
const chatThreadsCollection = collection(db, 'chatThreads') as CollectionReference<UserThread>;
const notificationsCollection = collection(db, 'notifications') as CollectionReference<Notification>;


// Singleton Document References for Settings
const websiteSettingsDoc = doc(db, 'settings', 'website') as DocumentReference<WebsiteSettings>;
const aiSettingsDoc = doc(db, 'settings', 'ai') as DocumentReference<AiSettings>;
const paymentSettingsDoc = doc(db, 'settings', 'payment') as DocumentReference<PaymentGatewaySettings>;
const popupCampaignDoc = doc(db, 'settings', 'popupCampaign') as DocumentReference<PopupCampaign>;
const homepageSectionsDoc = doc(db, 'settings', 'homepageSections') as DocumentReference<{ sections: HomepageSection[] }>;
const promoSectionsDoc = doc(db, 'settings', 'promoSections') as DocumentReference<{ sections: PromoSection[] }>;
const seoSettingsDoc = doc(db, 'settings', 'seo'); // You'll define the type later if needed


export { 
    app, 
    auth, 
    db, 
    isFirebaseConfigured,
    productsCollection,
    categoriesCollection,
    ordersCollection,
    reviewsCollection,
    websiteSettingsDoc,
    aiSettingsDoc,
    paymentSettingsDoc,
    popupCampaignDoc,
    homepageSectionsDoc,
    promoSectionsDoc,
    seoSettingsDoc,
    chatThreadsCollection,
    notificationsCollection,
};
