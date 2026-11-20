"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { giftxAuth } from "./firebase";

// ─── Admin emails — أضيف إيميلك وإيميلات أصحاب المحلات هنا ─────────────────
// الـ Super Admin (أنت): تحكم كامل في كل المتاجر
// Store Admin: يشوف بس المتجر بتاعه

export const SUPER_ADMINS = [
  "sheko.1983sh@gmail.com", // شادي — Super Admin
];

export const STORE_ADMINS: Record<string, string[]> = {
  giftx:   ["sheko.1983sh@gmail.com"], // أضيف إيميل صاحب Gift X هنا
  karella: ["sheko.1983sh@gmail.com"], // أضيف إيميل صاحب Karella هنا
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "super_admin" | "store_admin" | "customer";

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  adminStores: string[]; // المتاجر اللي عنده صلاحية عليها
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  isAdmin: false,
  isSuperAdmin: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Helper: map Firebase user → AuthUser ────────────────────────────────────

function mapUser(firebaseUser: User): AuthUser {
  const email = firebaseUser.email ?? "";

  const isSuperAdmin = SUPER_ADMINS.includes(email);

  const adminStores = isSuperAdmin
    ? Object.keys(STORE_ADMINS) // Super admin يتحكم في كل المتاجر
    : Object.entries(STORE_ADMINS)
        .filter(([, emails]) => emails.includes(email))
        .map(([storeId]) => storeId);

  const role: UserRole = isSuperAdmin
    ? "super_admin"
    : adminStores.length > 0
    ? "store_admin"
    : "customer";

  return {
    uid: firebaseUser.uid,
    email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    role,
    adminStores,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(giftxAuth, (firebaseUser) => {
      setUser(firebaseUser ? mapUser(firebaseUser) : null);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signInWithGoogle() {
    try {
      await signInWithPopup(giftxAuth, googleProvider);
    } catch (e) {
      console.error("Google sign-in error:", e);
    }
  }

  async function signOut() {
    await firebaseSignOut(giftxAuth);
  }

  const isAdmin = !!user && user.role !== "customer";
  const isSuperAdmin = !!user && user.role === "super_admin";

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, isAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
