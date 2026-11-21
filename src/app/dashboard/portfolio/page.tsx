"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  getPortfolioConfig, savePortfolioConfig,
  PortfolioConfig, PortfolioProject, DEFAULT_PORTFOLIO
} from "@/lib/portfolioConfig";

const COLORS = ["#4A6CF7","#FF6B35","#6C5CE7","#00B894","#0984E3","#E17055","#FDCB6E","#E84393","#00CEC9","#636E72"];
const EMOJIS = ["🎁","🛋️","🚌","🎮","📱","🏪","🛒","💼","🎯","🚀","⚡","🔧","💡","🌐","📊"];

function newProject(): PortfolioProject {
  return { id: Date.now().toString(), name: "", description: "", tags: [], image: "🚀", color: "#4A6CF7", link: "", available: true, order: 99 };
}

export default function DashboardPortfolio() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<PortfolioConfig>(DEFAULT_PORTFOLIO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading]);

  useEffect(() => {
    getPortfolioConfig().then(c => { setConfig(c); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true);
    await savePortfolioConfig(config);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const saveProject = () => {
    if (!editing) return;
    const exists = config.projects.find(p => p.id === editing.id);
    const projects = exists
      ? config.projects.map(p => p.id === editing.id ? editing : p)
      : [...config.projects, { ...editing, order: config.projects.length + 1 }];
    setConfig({ ...config, projects });
    setEditing(null);
  };

  const deleteProject = (id: string) => {
    setConfig({ ...config, projects: config.projects.filter(p => p.id !== id) });
  };

  const moveProject = (id: string, dir: "up" | "down") => {
    const sorted = [...config.projects].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(p => p.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === sorted.length - 1) return;
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [sorted[idx].order, sorted[swap].order] = [sorted[swap].order, sorted[idx].order];
    setConfig({ ...config, projects: sorted });
  };

  const addTag = () => {
    if (!editing || !tagInput.trim()) return;
    setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] });
    setTagInput("");
  };

  if (authLoading || loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo, sans-serif" }}>
      <div style={{ fontSize: 18, color: "#64748B" }}>جاري التحميل...</div>
    </div>
  );

  const sorted = [...config.projects].sort((a, b) => a.order - b.order);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", direction: "rtl", fontFamily: "Cairo, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #EEF2FF", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/dashboard" style={{ color: "#64748B", textDecoration: "none", fontSize: 22 }}>←</a>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#1E293B" }}>🗂️ إدارة الأعمال</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/portfolio" target="_blank" style={{ background: "#EEF2FF", color: "#4A6CF7", padding: "8px 16px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>معاينة ←</a>
          <button onClick={save} disabled={saving} style={{ background: saving ? "#94A3B8" : saved ? "#10B981" : "#4A6CF7", color: "white", border: "none", padding: "8px 20px", borderRadius: 10, cursor: saving ? "default" : "pointer", fontWeight: 700, fontSize: 14, fontFamily: "Cairo, sans-serif" }}>
            {saving ? "جاري الحفظ..." : saved ? "✓ تم الحفظ" : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Page Header Settings */}
        <div style={{ background: "white", borderRadius: 20, padding: 24, marginBottom: 24, border: "1px solid #F1F5F9" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#1E293B" }}>⚙️ إعدادات الصفحة</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[["عنوان الصفحة", "title"], ["العنوان الفرعي", "subtitle"]].map(([label, key]) => (
              <label key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>{label}</span>
                <input value={(config as any)[key]} onChange={e => setConfig({ ...config, [key]: e.target.value })}
                  style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "Cairo, sans-serif", outline: "none" }} />
              </label>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1E293B" }}>📂 المشاريع ({sorted.length})</h3>
            <button onClick={() => setEditing(newProject())}
              style={{ background: "#4A6CF7", color: "white", border: "none", padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "Cairo, sans-serif" }}>
              + إضافة مشروع
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sorted.map((project, idx) => (
              <div key={project.id} style={{ border: "1px solid #F1F5F9", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, opacity: project.available ? 1 : 0.5 }}>
                {/* Order arrows */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <button onClick={() => moveProject(project.id, "up")} disabled={idx === 0}
                    style={{ background: "none", border: "1px solid #E2E8F0", borderRadius: 6, width: 26, height: 26, cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.3 : 1, fontSize: 12 }}>↑</button>
                  <button onClick={() => moveProject(project.id, "down")} disabled={idx === sorted.length - 1}
                    style={{ background: "none", border: "1px solid #E2E8F0", borderRadius: 6, width: 26, height: 26, cursor: idx === sorted.length - 1 ? "default" : "pointer", opacity: idx === sorted.length - 1 ? 0.3 : 1, fontSize: 12 }}>↓</button>
                </div>

                {/* Icon */}
                <div style={{ width: 48, height: 48, borderRadius: 12, background: project.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                  {project.image}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: "#1E293B", fontSize: 15 }}>{project.name || "مشروع جديد"}</div>
                  <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{project.description}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                    {project.tags.map(t => (
                      <span key={t} style={{ background: project.color + "15", color: project.color, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => setConfig({ ...config, projects: config.projects.map(p => p.id === project.id ? { ...p, available: !p.available } : p) })}
                    style={{ background: project.available ? "#DCFCE7" : "#F1F5F9", color: project.available ? "#10B981" : "#94A3B8", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>
                    {project.available ? "ظاهر" : "مخفي"}
                  </button>
                  <button onClick={() => { setEditing(project); setTagInput(""); }}
                    style={{ background: "#EEF2FF", color: "#4A6CF7", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>تعديل</button>
                  <button onClick={() => deleteProject(project.id)}
                    style={{ background: "#FEE2E2", color: "#EF4444", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>حذف</button>
                </div>
              </div>
            ))}

            {sorted.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                <div>لا توجد مشاريع — اضغط "+ إضافة مشروع"</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div style={{ background: "white", borderRadius: 24, padding: 28, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", direction: "rtl" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1E293B" }}>
                {config.projects.find(p => p.id === editing.id) ? "✏️ تعديل المشروع" : "➕ مشروع جديد"}
              </h3>
              <button onClick={() => setEditing(null)} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Name */}
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>اسم المشروع *</span>
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Gift X"
                  style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "Cairo, sans-serif", outline: "none" }} />
              </label>

              {/* Description */}
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>وصف المشروع</span>
                <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })}
                  rows={3} placeholder="وصف قصير للمشروع..."
                  style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "Cairo, sans-serif", outline: "none", resize: "vertical" }} />
              </label>

              {/* Icon Picker */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>الأيقونة</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setEditing({ ...editing, image: e })}
                      style={{ width: 40, height: 40, borderRadius: 10, border: editing.image === e ? "2px solid #4A6CF7" : "1px solid #E2E8F0", background: editing.image === e ? "#EEF2FF" : "white", fontSize: 20, cursor: "pointer" }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>لون المشروع</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setEditing({ ...editing, color: c })}
                      style={{ width: 36, height: 36, borderRadius: "50%", background: c, border: editing.color === c ? "3px solid #1E293B" : "2px solid transparent", cursor: "pointer" }} />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>التقنيات المستخدمة</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {editing.tags.map(tag => (
                    <span key={tag} style={{ background: editing.color + "15", color: editing.color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      {tag}
                      <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter(t => t !== tag) })}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()}
                    placeholder="Flutter أو اضغط Enter"
                    style={{ flex: 1, border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 12px", fontSize: 13, fontFamily: "Cairo, sans-serif", outline: "none" }} />
                  <button onClick={addTag} style={{ background: "#EEF2FF", color: "#4A6CF7", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>+ إضافة</button>
                </div>
              </div>

              {/* Link */}
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>رابط المشروع (اختياري)</span>
                <input value={editing.link || ""} onChange={e => setEditing({ ...editing, link: e.target.value })}
                  placeholder="https://..."
                  style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "Cairo, sans-serif", outline: "none", direction: "ltr" }} />
              </label>

              {/* Preview */}
              <div style={{ background: "#F8FAFF", borderRadius: 14, padding: 16, border: "1px solid #EEF2FF" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 10 }}>معاينة البطاقة</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: editing.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{editing.image}</div>
                  <div>
                    <div style={{ fontWeight: 800, color: "#1E293B", fontSize: 15 }}>{editing.name || "اسم المشروع"}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      {editing.tags.slice(0, 3).map(t => (
                        <span key={t} style={{ background: editing.color + "15", color: editing.color, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={saveProject} disabled={!editing.name}
                  style={{ flex: 1, background: editing.name ? "#4A6CF7" : "#94A3B8", color: "white", border: "none", padding: "12px", borderRadius: 12, cursor: editing.name ? "pointer" : "default", fontWeight: 800, fontSize: 15, fontFamily: "Cairo, sans-serif" }}>
                  حفظ المشروع ✓
                </button>
                <button onClick={() => setEditing(null)}
                  style={{ background: "#F1F5F9", color: "#64748B", border: "none", padding: "12px 20px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
