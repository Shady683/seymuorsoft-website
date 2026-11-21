"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type EditorSection = "hero" | "services" | "portfolio" | "contact" | null;

interface EditorContextType {
  editorOpen: boolean;
  activeSection: EditorSection;
  openEditor: (section?: EditorSection) => void;
  closeEditor: () => void;
  setActiveSection: (s: EditorSection) => void;
}

const EditorContext = createContext<EditorContextType>({
  editorOpen: false,
  activeSection: null,
  openEditor: () => {},
  closeEditor: () => {},
  setActiveSection: () => {},
});

export function EditorProvider({ children }: { children: ReactNode }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<EditorSection>(null);

  const openEditor = (section?: EditorSection) => {
    setEditorOpen(true);
    if (section) setActiveSection(section);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setActiveSection(null);
  };

  return (
    <EditorContext.Provider value={{ editorOpen, activeSection, openEditor, closeEditor, setActiveSection }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => useContext(EditorContext);
