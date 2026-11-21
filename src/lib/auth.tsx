"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { siteAuth, siteDb } from "./firebase";

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
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signInWithEmail: async () => null,
  signOut: async () => {},
  isAdmin: false,
  isSuperAdmin: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Helper: map Firebase user → AuthUser via Firestore ──────────────────────

async function mapUser(firebaseUser: User): Promise<AuthUser> {
  const email = firebaseUser.email ?? "";

  // جيب صلاحيات الـ user من Firestore
  try {
    const adminDoc = await getDoc(doc(siteDb, "admins", firebaseUser.uid));
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      const role: UserRole = data.role ?? "customer";
      const adminStores: string[] = data.stores ?? [];
      return {
        uid: firebaseUser.uid,
        email,
        displayName: firebaseUser.displayName ?? data.name ?? null,
        photoURL: firebaseUser.photoURL,
        role,
        adminStores,
      };
    }
  } catch (e) {
    console.error("Error fetching admin doc:", e);
  }

  // مفيش doc → customer عادي
  return {
    uid: firebaseUser.uid,
    email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    role: "customer",
    adminStores: [],
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(siteAuth, async (firebaseUser) => {
      if (firebaseUser) {
        const mapped = await mapUser(firebaseUser);
        setUser(mapped);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signInWithEmail(email: string, password: string): Promise<string | null> {
    try {
      await signInWithEmailAndPassword(siteAuth, email, password);
      return null; // نجح
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        return "الإيميل أو كلمة المرور غلط";
      }
      if (code === "auth/too-many-requests") {
        return "تم تعطيل الحساب مؤقتاً — جرب بعد قليل";
      }
      return "حدث خطأ — جرب مرة تانية";
    }
  }

  async function signOut() {
    await firebaseSignOut(siteAuth);
  }

  const isAdmin = !!user && user.role !== "customer";
  const isSuperAdmin = !!user && user.role === "super_admin";

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signOut, isAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
