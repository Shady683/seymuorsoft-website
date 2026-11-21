"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor } from "./EditorContext";
import { getSiteConfig, saveSiteConfig, SiteConfig, ServiceItem } from "@/lib/siteConfig";

// ── Helpers ──────────────────────────────────────────────────────────────────
const ICON_OPTIONS = ["📱","🛒","🖥️","🌐","🎮","🏪","💼","🤖","⚡","🔧","🎨","📊","🚀","💡","🔐"];
const COLOR_OPTIONS = [
  { label:"أزرق",   color:"#4A6CF7", bg:"#EEF2FF" },
  { label:"برتقالي",color:"#F97316", bg:"#FFF7ED" },
  { label:"بنفسجي",color:"#8B5CF6", bg:"#F5F3FF" },
  { label:"أخضر",  color:"#10B981", bg:"#ECFDF5" },
  { label:"أحمر",  color:"#EF4444", bg:"#FEF2F2" },
  { label:"وردي",  color:"#EC4899", bg:"#FDF2F8" },
  { label:"سماوي", color:"#06B6D4", bg:"#ECFEFF" },
  { label:"رمادي", color:"#64748B", bg:"#F8FAFC" },
];
const SECTION_ICONS: Record<string, string> = {
  services:"🃏", hero:"🏠", portfolio:"📂", contact:"📬",
};

export default function EditorPanel() {
  const { editorOpen, activeSection, closeEditor, setActiveSection } = useEditor();
  const [cfg, setCfg] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [newTag, setNewTag] = useState("");

  // جلب الكونفيج
  useEffect(() => {
    if (editorOpen && !cfg) {
      getSiteConfig().then(setCfg);
    }
  }, [editorOpen, cfg]);

  const save = useCallback(async (c: SiteConfig) => {
    setSaving(true);
    await saveSiteConfig(c);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // أرسل event عشان الصفحة تتحدث live
    window.dispatchEvent(new CustomEvent("siteConfigUpdated", { detail: c }));
  }, []);

  if (!editorOpen || !cfg) return null;

  // ── Services Section ───────────────────────────────────────────────────────
  const ServicesEditor = () => {
    const items = cfg.services.items;

    const updateItem = (i: number, patch: Partial<ServiceItem>) => {
      const updated = { ...cfg };
      updated.services.items[i] = { ...updated.services.items[i], ...patch };
      setCfg({ ...updated });
    };

    const deleteItem = (i: number) => {
      const updated = { ...cfg };
      updated.services.items.splice(i, 1);
      setCfg({ ...updated });
    };

    const addItem = () => {
      const updated = { ...cfg };
      updated.services.items.push({
        icon:"🆕", title:"خدمة جديدة", desc:"وصف الخدمة هنا",
        tags:[], color:"#4A6CF7", bg:"#EEF2FF",
      });
      setCfg({ ...updated });
      setEditingCard(updated.services.items.length - 1);
    };

    const moveUp = (i: number) => {
      if (i === 0) return;
      const updated = { ...cfg };
      [updated.services.items[i-1], updated.services.items[i]] =
       [updated.services.items[i], updated.services.items[i-1]];
      setCfg({ ...updated });
    };

    const moveDown = (i: number) => {
      if (i === items.length - 1) return;
      const updated = { ...cfg };
      [updated.services.items[i], updated.services.items[i+1]] =
       [updated.services.items[i+1], updated.services.items[i]];
      setCfg({ ...updated });
    };

    // وضع التعديل لبطاقة معينة
    if (editingCard !== null) {
      const card = items[editingCard];
      return (
        <div>
          <button onClick={() => setEditingCard(null)} style={styles.backBtn}>← رجوع للقائمة</button>
          <h3 style={styles.sectionTitle}>✏️ تعديل البطاقة</h3>

          {/* Preview */}
          <div style={{ ...styles.cardPreview, background: card.bg, borderRight: `4px solid ${card.color}` }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{card.icon}</div>
            <div style={{ fontWeight: 800, color: "#1E293B", fontSize: 14 }}>{card.title}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{card.desc.substring(0, 60)}…</div>
            <div style={{ display:"flex", gap: 4, flexWrap:"wrap", marginTop: 6 }}>
              {card.tags.map(t => (
                <span key={t} style={{ background: card.color+"22", color: card.color, fontSize: 10, padding:"2px 7px", borderRadius: 20, fontWeight: 700 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* الأيقونة */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>الأيقونة</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap: 6 }}>
              {ICON_OPTIONS.map(ic => (
                <button key={ic} onClick={() => updateItem(editingCard, { icon: ic })}
                  style={{ fontSize: 20, padding: "4px 8px", borderRadius: 8, border: card.icon === ic ? "2px solid #4A6CF7" : "1px solid #E2E8F0", background: card.icon === ic ? "#EEF2FF" : "white", cursor:"pointer" }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* الاسم */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>اسم الخدمة</label>
            <input style={styles.input} value={card.title}
              onChange={e => updateItem(editingCard, { title: e.target.value })} />
          </div>

          {/* الوصف */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>الوصف</label>
            <textarea style={{ ...styles.input, height: 70, resize:"none" }} value={card.desc}
              onChange={e => updateItem(editingCard, { desc: e.target.value })} />
          </div>

          {/* اللون */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>اللون</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap: 6 }}>
              {COLOR_OPTIONS.map(c => (
                <button key={c.color} onClick={() => updateItem(editingCard, { color: c.color, bg: c.bg })}
                  title={c.label}
                  style={{ width: 32, height: 32, borderRadius: 8, background: c.color, border: card.color === c.color ? "3px solid #1E293B" : "2px solid transparent", cursor:"pointer" }} />
              ))}
            </div>
          </div>

          {/* التاجات */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>التاجات (تقنيات)</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap: 4, marginBottom: 6 }}>
              {card.tags.map((t, ti) => (
                <span key={ti} style={{ display:"flex", alignItems:"center", gap: 4, background:"#F1F5F9", padding:"3px 8px", borderRadius: 20, fontSize: 12, fontWeight: 600, color:"#475569" }}>
                  {t}
                  <button onClick={() => { const tgs=[...card.tags]; tgs.splice(ti,1); updateItem(editingCard,{tags:tgs}); }}
                    style={{ background:"none", border:"none", cursor:"pointer", color:"#EF4444", fontSize: 14, lineHeight:1, padding:0 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display:"flex", gap: 6 }}>
              <input style={{ ...styles.input, flex:1, marginBottom:0 }} placeholder="تاج جديد…" value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => { if(e.key==="Enter" && newTag.trim()){ updateItem(editingCard,{tags:[...card.tags, newTag.trim()]}); setNewTag(""); } }} />
              <button onClick={() => { if(newTag.trim()){ updateItem(editingCard,{tags:[...card.tags, newTag.trim()]}); setNewTag(""); } }}
                style={styles.smallBtn}>+ إضافة</button>
            </div>
          </div>

          <button onClick={() => save(cfg)} style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}>
            {saving ? "⏳ جاري الحفظ…" : saved ? "✅ تم الحفظ!" : "💾 حفظ التغييرات"}
          </button>
        </div>
      );
    }

    // قائمة البطاقات
    return (
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 12 }}>
          <h3 style={{ ...styles.sectionTitle, margin:0 }}>🃏 بطاقات الخدمات</h3>
          <button onClick={addItem} style={styles.addBtn}>+ بطاقة جديدة</button>
        </div>

        {/* إعدادات العنوان */}
        <div style={{ background:"#F8FAFC", borderRadius: 10, padding: 12, marginBottom: 12, border:"1px solid #E2E8F0" }}>
          <label style={styles.label}>عنوان القسم</label>
          <input style={styles.input} value={cfg.services.heading}
            onChange={e => setCfg({...cfg, services:{...cfg.services, heading:e.target.value}})} />
          <label style={styles.label}>الوصف</label>
          <input style={styles.input} value={cfg.services.subheading}
            onChange={e => setCfg({...cfg, services:{...cfg.services, subheading:e.target.value}})} />
        </div>

        {/* البطاقات */}
        {items.map((card, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap: 8, background:"white", border:"1px solid #E2E8F0", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: card.bg, borderRadius: 8, display:"flex", alignItems:"center", justifyContent:"center", fontSize: 18, flexShrink:0 }}>
              {card.icon}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color:"#1E293B", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{card.title}</div>
              <div style={{ fontSize: 11, color:"#94A3B8" }}>{card.tags.slice(0,3).join(" · ")}</div>
            </div>
            <div style={{ display:"flex", gap: 4, flexShrink:0 }}>
              <button onClick={() => moveUp(i)} style={styles.iconBtn} title="أعلى">↑</button>
              <button onClick={() => moveDown(i)} style={styles.iconBtn} title="أسفل">↓</button>
              <button onClick={() => setEditingCard(i)} style={{ ...styles.iconBtn, color:"#4A6CF7" }}>✏️</button>
              <button onClick={() => deleteItem(i)} style={{ ...styles.iconBtn, color:"#EF4444" }}>🗑️</button>
            </div>
          </div>
        ))}

        <button onClick={() => save(cfg)} style={{ ...styles.saveBtn, marginTop: 8, opacity: saving ? 0.7 : 1 }}>
          {saving ? "⏳ جاري الحفظ…" : saved ? "✅ تم الحفظ!" : "💾 حفظ الكل"}
        </button>
      </div>
    );
  };

  // ── Hero Section ───────────────────────────────────────────────────────────
  const HeroEditor = () => (
    <div>
      <h3 style={styles.sectionTitle}>🏠 الصفحة الرئيسية (Hero)</h3>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>الجملة الرئيسية</label>
        <input style={styles.input} value={cfg.hero.tagline}
          onChange={e => setCfg({...cfg, hero:{...cfg.hero, tagline:e.target.value}})} />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>الكلمة المميزة (highlight)</label>
        <input style={styles.input} value={cfg.hero.highlight}
          onChange={e => setCfg({...cfg, hero:{...cfg.hero, highlight:e.target.value}})} />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>الوصف</label>
        <textarea style={{ ...styles.input, height: 80, resize:"none" }} value={cfg.hero.description}
          onChange={e => setCfg({...cfg, hero:{...cfg.hero, description:e.target.value}})} />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>زر رئيسي</label>
        <input style={styles.input} value={cfg.hero.cta_primary}
          onChange={e => setCfg({...cfg, hero:{...cfg.hero, cta_primary:e.target.value}})} />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>زر ثانوي</label>
        <input style={styles.input} value={cfg.hero.cta_secondary}
          onChange={e => setCfg({...cfg, hero:{...cfg.hero, cta_secondary:e.target.value}})} />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>الحالة</label>
        <div style={{ display:"flex", gap: 8 }}>
          <button onClick={() => setCfg({...cfg, hero:{...cfg.hero, available:true}})}
            style={{ ...styles.smallBtn, background: cfg.hero.available ? "#10B981" : "#F1F5F9", color: cfg.hero.available ? "white" : "#64748B" }}>
            🟢 متاح
          </button>
          <button onClick={() => setCfg({...cfg, hero:{...cfg.hero, available:false}})}
            style={{ ...styles.smallBtn, background: !cfg.hero.available ? "#EF4444" : "#F1F5F9", color: !cfg.hero.available ? "white" : "#64748B" }}>
            🔴 مشغول
          </button>
        </div>
      </div>

      <h4 style={{ fontSize: 13, fontWeight: 700, color:"#475569", margin:"16px 0 8px" }}>📊 الإحصائيات</h4>
      {cfg.hero.stats.map((s, i) => (
        <div key={i} style={{ display:"flex", gap: 8, marginBottom: 8 }}>
          <input style={{ ...styles.input, width: 70, marginBottom:0, textAlign:"center", fontWeight:800, fontSize:14 }}
            value={s.n} onChange={e => { const st=[...cfg.hero.stats]; st[i]={...st[i],n:e.target.value}; setCfg({...cfg, hero:{...cfg.hero, stats:st}}); }} />
          <input style={{ ...styles.input, flex:1, marginBottom:0 }} placeholder="التسمية" value={s.label}
            onChange={e => { const st=[...cfg.hero.stats]; st[i]={...st[i],label:e.target.value}; setCfg({...cfg, hero:{...cfg.hero, stats:st}}); }} />
        </div>
      ))}
      <button onClick={() => save(cfg)} style={{ ...styles.saveBtn, marginTop: 12, opacity: saving ? 0.7 : 1 }}>
        {saving ? "⏳ جاري الحفظ…" : saved ? "✅ تم الحفظ!" : "💾 حفظ التغييرات"}
      </button>
    </div>
  );

  // ── Main Panel ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Overlay */}
      <div onClick={closeEditor} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:999, backdropFilter:"blur(2px)" }} />

      {/* Panel */}
      <div style={{
        position:"fixed", top:0, right:0, bottom:0, width:360, maxWidth:"95vw",
        background:"white", zIndex:1000, overflowY:"auto", direction:"rtl",
        boxShadow:"-8px 0 40px rgba(0,0,0,0.15)",
        display:"flex", flexDirection:"column",
      }}>
        {/* Header */}
        <div style={{ padding:"16px 20px", borderBottom:"1px solid #E2E8F0", display:"flex", alignItems:"center", justifyContent:"space-between", background:"linear-gradient(135deg,#4A6CF7,#7C3AED)", flexShrink:0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color:"white" }}>🎛️ تحكم بالموقع</div>
            <div style={{ fontSize: 11, color:"rgba(255,255,255,0.7)", marginTop: 2 }}>التغييرات مباشرة على Firebase</div>
          </div>
          <button onClick={closeEditor} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"white", width:32, height:32, borderRadius: 8, cursor:"pointer", fontSize: 16, display:"flex", alignItems:"center", justifyContent:"center" }}>
            ✕
          </button>
        </div>

        {/* Section tabs */}
        {!activeSection && (
          <div style={{ padding: 20 }}>
            <p style={{ fontSize: 13, color:"#64748B", marginBottom: 16 }}>اختر القسم اللي عايز تعدله:</p>
            {(["hero","services","portfolio"] as const).map(sec => (
              <button key={sec} onClick={() => setActiveSection(sec)}
                style={{ width:"100%", padding:"14px 16px", background:"white", border:"1px solid #E2E8F0", borderRadius: 12, cursor:"pointer", display:"flex", alignItems:"center", gap: 12, marginBottom: 8, transition:"all 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor="#4A6CF7")}
                onMouseLeave={e => (e.currentTarget.style.borderColor="#E2E8F0")}>
                <div style={{ width:40, height:40, background:"#EEF2FF", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                  {SECTION_ICONS[sec]}
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#1E293B" }}>
                    {sec==="hero" ? "الصفحة الرئيسية" : sec==="services" ? "بطاقات الخدمات" : "الأعمال والمشاريع"}
                  </div>
                  <div style={{ fontSize:11, color:"#94A3B8" }}>
                    {sec==="hero" ? "العنوان والوصف والإحصائيات" : sec==="services" ? "أضف وعدل وحذف بطاقات الخدمة" : "انتقل لصفحة إدارة الأعمال"}
                  </div>
                </div>
                <span style={{ marginRight:"auto", color:"#94A3B8", fontSize:16 }}>←</span>
              </button>
            ))}

            <a href="/dashboard" style={{ display:"flex", alignItems:"center", gap: 12, padding:"14px 16px", background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius: 12, textDecoration:"none", marginTop: 4 }}>
              <div style={{ fontSize:20 }}>⚙️</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#92400E" }}>الداشبورد الكامل</div>
                <div style={{ fontSize:11, color:"#B45309" }}>الثيم، البورتفوليو، والإعدادات المتقدمة</div>
              </div>
            </a>
          </div>
        )}

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"0 20px 20px" }}>
          {activeSection && activeSection !== "portfolio" && (
            <div style={{ paddingTop: 16 }}>
              <button onClick={() => setActiveSection(null)} style={styles.backBtn}>← رجوع</button>
            </div>
          )}

          {activeSection === "hero" && <HeroEditor />}
          {activeSection === "services" && <ServicesEditor />}
          {activeSection === "portfolio" && (
            <div style={{ padding: 20, textAlign:"center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color:"#1E293B", marginBottom: 8 }}>إدارة الأعمال والمشاريع</h3>
              <p style={{ fontSize: 13, color:"#64748B", marginBottom: 20 }}>لإدارة المشاريع والأعمال من صفحة متخصصة</p>
              <a href="/dashboard/portfolio" style={{ display:"inline-block", background:"#4A6CF7", color:"white", textDecoration:"none", padding:"12px 24px", borderRadius:12, fontWeight:700, fontSize:14 }}>
                انتقل لصفحة إدارة الأعمال ←
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  sectionTitle: { fontSize: 15, fontWeight: 800, color:"#1E293B", margin:"16px 0 12px" },
  backBtn: { background:"none", border:"none", cursor:"pointer", color:"#4A6CF7", fontSize: 13, fontWeight: 700, padding:"4px 0", marginBottom: 8 },
  fieldGroup: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: 600, color:"#64748B", display:"block", marginBottom: 4 },
  input: { width:"100%", padding:"9px 12px", borderRadius: 8, border:"1.5px solid #E2E8F0", fontSize: 13, outline:"none", boxSizing:"border-box" as const, fontFamily:"inherit", color:"#1E293B", marginBottom: 0 },
  iconBtn: { background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius: 6, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize: 13 },
  smallBtn: { padding:"6px 12px", borderRadius: 8, border:"none", cursor:"pointer", fontSize: 12, fontWeight: 700, background:"#EEF2FF", color:"#4A6CF7" },
  addBtn: { padding:"6px 14px", borderRadius: 8, border:"none", cursor:"pointer", fontSize: 12, fontWeight: 700, background:"#4A6CF7", color:"white" },
  saveBtn: { width:"100%", padding:"12px", background:"linear-gradient(135deg,#4A6CF7,#7C3AED)", color:"white", border:"none", borderRadius:12, cursor:"pointer", fontSize:14, fontWeight:800, marginTop:4 },
  cardPreview: { borderRadius: 12, padding: "12px 14px", marginBottom: 16, border:"1px solid rgba(0,0,0,0.05)" },
};
