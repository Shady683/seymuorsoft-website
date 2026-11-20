"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { giftxAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(giftxAuth, email, password);
      router.push("/dashboard");
    } catch {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", direction: "rtl", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 24, padding: 32, width: "100%", maxWidth: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔑</div>
          <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800 }}>لوحة التحكم</h1>
          <p style={{ margin: 0, color: "#888", fontSize: 13 }}>سجل دخولك لإدارة المتجر</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "13px 16px", borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 14, textAlign: "right", outline: "none", fontFamily: "inherit" }} />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: "13px 16px", borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 14, textAlign: "right", outline: "none", fontFamily: "inherit" }} />
          {error && <div style={{ color: "#ef4444", fontSize: 13, textAlign: "center" }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ background: "#F97316", color: "white", border: "none", borderRadius: 14, padding: "14px", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "inherit" }}>
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}