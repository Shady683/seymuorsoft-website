import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ── Seymosoft Website Firebase (site config + auth) ──────────────────────────
const siteApp = getApps().find(a => a.name === "site") || initializeApp({
  apiKey: "AIzaSyDSVGKnix7hO7cHw3SWbU7uHl6ux7gVrN0",
  authDomain: "seymoursoft-website.firebaseapp.com",
  projectId: "seymoursoft-website",
  storageBucket: "seymoursoft-website.firebasestorage.app",
  messagingSenderId: "161984577863",
  appId: "1:161984577863:web:f6f332d1a56bcb8c624c62",
}, "site");

export const siteDb   = getFirestore(siteApp);
export const siteAuth = getAuth(siteApp);

const giftxApp = getApps().find(a => a.name === "giftx") || initializeApp({
  apiKey: process.env.NEXT_PUBLIC_GIFTX_API_KEY,
  authDomain: "toy-x-app.firebaseapp.com",
  projectId: "toy-x-app",
  storageBucket: "toy-x-app.firebasestorage.app",
  messagingSenderId: "398307891960",
  appId: "1:398307891960:web:11faa38fb0c4f2f65df90d",
}, "giftx");

const karellaApp = getApps().find(a => a.name === "karella") || initializeApp({
  apiKey: process.env.NEXT_PUBLIC_KARELLA_API_KEY,
  authDomain: "karella-app.firebaseapp.com",
  projectId: "karella-app",
  storageBucket: "karella-app.firebasestorage.app",
  messagingSenderId: "204582256703",
  appId: "1:204582256703:web:fd7d07bd94e5da315cf88a",
}, "karella");

export const giftxDb = getFirestore(giftxApp);
export const karellaDb = getFirestore(karellaApp);
export const giftxAuth = getAuth(giftxApp);