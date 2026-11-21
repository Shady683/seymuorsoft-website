"use client";

import { ReactNode } from "react";
import { EditorProvider } from "./EditorContext";
import EditorPanel from "./EditorPanel";
import { useAuth } from "@/lib/auth";

function EditorGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <>
      {children}
      {isSuperAdmin && <EditorPanel />}
    </>
  );
}

export default function EditorWrapper({ children }: { children: ReactNode }) {
  return (
    <EditorProvider>
      <EditorGate>{children}</EditorGate>
    </EditorProvider>
  );
}
