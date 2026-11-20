"use client";

import { useEffect, useState, useCallback } from "react";
import type { Firestore } from "firebase/firestore";
import { subscribeToOrders, updateOrderStatus, updatePaymentStatus } from "@/lib/firestore";
import type { FirestoreOrder, OrderStatus, PaymentStatus } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "جديد",
  confirmed: "مؤكد",
  processing: "جارية",
  shipped: "شُحن",
  delivered: "مكتمل",
  cancelled: "ملغي",
};

const STATUS_COLORS: Record<OrderStatus, { color: string; bg: string }> = {
  pending:    { color: "#F97316", bg: "#FFF7ED" },
  confirmed:  { color: "#3B82F6", bg: "#EFF6FF" },
  processing: { color: "#8B5CF6", bg: "#F5F3FF" },
  shipped:    { color: "#06B6D4", bg: "#ECFEFF" },
  delivered:  { color: "#16A34A", bg: "#DCFCE7" },
  cancelled:  { color: "#EF4444", bg: "#FEF2F2" },
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending:  "في الانتظار",
  verified: "مدفوع ✓",
  rejected: "مرفوض",
  refunded: "مُسترد",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "كاش",
  vodafone_cash: "فودافون كاش",
  instapay: "انستاباي",
  card: "بطاقة",
  other: "أخرى",
};

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

function formatDate(date?: Date): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ar-EG").format(amount) + " ج";
}

// ─── Order Row ────────────────────────────────────────────────────────────────

function OrderRow({
  order,
  onSelect,
}: {
  order: FirestoreOrder;
  onSelect: (order: FirestoreOrder) => void;
}) {
  const ss = STATUS_COLORS[order.status] ?? { color: "#64748B", bg: "#F1F5F9" };
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;

  const avatarColors = ["#F97316", "#8B5CF6", "#EC4899", "#06B6D4", "#10B981", "#3B82F6"];
  const avatarColor = avatarColors[order.id.charCodeAt(0) % avatarColors.length];
  const initials = (order.customerName || "؟")[0] ?? "؟";

  return (
    <div
      onClick={() => onSelect(order)}
      className="grid border-b border-[#F1F5F9] last:border-0 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
      style={{ gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1.2fr 1fr" }}
    >
      <div className="p-3 flex items-center text-sm font-bold text-[#4A6CF7]">
        #{order.orderNumber || order.id.slice(-6)}
      </div>
      <div className="p-3 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
          style={{ background: avatarColor }}
        >
          {initials}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-bold text-[#1E293B] truncate">
            {order.customerName || "عميل"}
          </div>
          {order.customerPhone && (
            <div className="text-xs text-[#94A3B8]">{order.customerPhone}</div>
          )}
        </div>
      </div>
      <div className="p-3 flex items-center text-sm text-[#64748B]">
        {order.items.length} منتج
      </div>
      <div className="p-3 flex items-center text-sm font-black text-[#1E293B]">
        {formatAmount(order.totalAmount)}
      </div>
      <div className="p-3 flex items-center">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ color: ss.color, background: ss.bg }}
        >
          {statusLabel}
        </span>
      </div>
      <div className="p-3 flex items-center text-xs text-[#94A3B8]">
        {formatDate(order.createdAt)}
      </div>
    </div>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderDetail({
  order,
  db,
  onClose,
  onUpdated,
}: {
  order: FirestoreOrder;
  db: Firestore;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(order.adminNotes || "");
  const ss = STATUS_COLORS[order.status] ?? { color: "#64748B", bg: "#F1F5F9" };

  async function changeStatus(status: OrderStatus) {
    if (loading) return;
    setLoading(true);
    try {
      await updateOrderStatus(db, order.id, status, notes || undefined);
      onUpdated();
      onClose();
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  }

  async function changePayment(paymentStatus: PaymentStatus) {
    if (loading) return;
    setLoading(true);
    try {
      await updatePaymentStatus(db, order.id, paymentStatus, notes || undefined);
      onUpdated();
      onClose();
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  }

  const currentStep = STATUS_FLOW.indexOf(order.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white"
        style={{ direction: "rtl" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#F1F5F9] p-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl z-10">
          <div>
            <h2 className="font-black text-[#1E293B] text-base">
              طلب #{order.orderNumber || order.id.slice(-6)}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ color: ss.color, background: ss.bg }}
              >
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
              <span className="text-xs text-[#94A3B8]">{formatDate(order.createdAt)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Status Progress */}
          {order.status !== "cancelled" && (
            <div className="bg-[#F8FAFC] rounded-2xl p-4">
              <p className="text-xs font-bold text-[#64748B] mb-3">مسار الطلب</p>
              <div className="flex items-center justify-between">
                {STATUS_FLOW.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all"
                        style={
                          i <= currentStep
                            ? { background: "#4A6CF7", color: "#fff" }
                            : { background: "#E2E8F0", color: "#94A3B8" }
                        }
                      >
                        {i < currentStep ? "✓" : i + 1}
                      </div>
                      <span className="text-[9px] text-[#94A3B8] mt-1 text-center leading-tight w-10">
                        {STATUS_LABELS[s]}
                      </span>
                    </div>
                    {i < STATUS_FLOW.length - 1 && (
                      <div
                        className="flex-1 h-0.5 mx-1 mb-4 transition-all"
                        style={{ background: i < currentStep ? "#4A6CF7" : "#E2E8F0" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4">
            <p className="text-xs font-bold text-[#64748B] mb-3">بيانات العميل</p>
            <div className="flex flex-col gap-2">
              {order.customerName && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-base">👤</span>
                  <span className="font-bold text-[#1E293B]">{order.customerName}</span>
                </div>
              )}
              {order.customerPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-base">📱</span>
                  <a href={`tel:${order.customerPhone}`} className="text-[#4A6CF7] font-bold" dir="ltr">
                    {order.customerPhone}
                  </a>
                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/^0/, "20")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "#25D366" }}
                  >
                    واتساب
                  </a>
                </div>
              )}
              {order.deliveryAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-base mt-0.5">📍</span>
                  <span className="text-[#64748B]">
                    {[
                      order.deliveryAddress.street,
                      order.deliveryAddress.area,
                      order.deliveryAddress.city,
                    ]
                      .filter(Boolean)
                      .join("، ")}
                    {order.deliveryAddress.notes && (
                      <span className="text-[#94A3B8]"> — {order.deliveryAddress.notes}</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4">
            <p className="text-xs font-bold text-[#64748B] mb-3">
              المنتجات ({order.items.length})
            </p>
            <div className="flex flex-col gap-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-2.5">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] flex items-center justify-center text-xl flex-shrink-0">
                      🎁
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#1E293B]">{item.name}</div>
                    <div className="text-xs text-[#94A3B8]">
                      {formatAmount(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-black text-[#1E293B]">
                    {formatAmount(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-[#E2E8F0] mt-1">
                <span className="text-sm font-bold text-[#64748B]">الإجمالي</span>
                <span className="text-base font-black text-[#1E293B]">
                  {formatAmount(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-[#64748B]">الدفع</p>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={
                  order.paymentStatus === "verified"
                    ? { color: "#16A34A", background: "#DCFCE7" }
                    : order.paymentStatus === "rejected"
                    ? { color: "#EF4444", background: "#FEF2F2" }
                    : { color: "#F97316", background: "#FFF7ED" }
                }
              >
                {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm mb-3">
              <span className="text-base">💳</span>
              <span className="text-[#64748B]">
                {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
              </span>
            </div>

            {/* Receipt image */}
            {order.paymentReceipt?.imageUrl && (
              <div className="mb-3">
                <a
                  href={order.paymentReceipt.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={order.paymentReceipt.imageUrl}
                    alt="إيصال الدفع"
                    className="w-full max-h-40 object-contain rounded-xl border border-[#E2E8F0]"
                  />
                </a>
                <p className="text-[10px] text-[#94A3B8] text-center mt-1">
                  اضغط للتكبير · {formatDate(order.paymentReceipt.uploadedAt)}
                </p>
              </div>
            )}

            {/* Verify/Reject payment buttons */}
            {order.paymentStatus === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => changePayment("verified")}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-opacity"
                  style={{ background: "#16A34A", opacity: loading ? 0.6 : 1 }}
                >
                  ✓ تأكيد الدفع
                </button>
                <button
                  onClick={() => changePayment("rejected")}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-opacity"
                  style={{ background: "#EF4444", opacity: loading ? 0.6 : 1 }}
                >
                  ✕ رفض الدفع
                </button>
              </div>
            )}
          </div>

          {/* Admin notes */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4">
            <p className="text-xs font-bold text-[#64748B] mb-2">ملاحظات الأدمن</p>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أضف ملاحظة..."
              className="w-full px-3 py-2 border-2 border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:border-[#4A6CF7] outline-none bg-white resize-none"
            />
          </div>

          {/* Status Change Buttons */}
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-[#64748B]">تغيير حالة الطلب</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.filter((s) => STATUS_FLOW.indexOf(s) > currentStep).map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(s)}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl text-sm font-black text-white transition-opacity"
                    style={{ background: "#4A6CF7", opacity: loading ? 0.6 : 1 }}
                  >
                    → {STATUS_LABELS[s]}
                  </button>
                ))}
                {(order.status as string) !== "cancelled" && (
                  <button
                    onClick={() => changeStatus("cancelled")}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl text-sm font-black text-white transition-opacity"
                    style={{ background: "#EF4444", opacity: loading ? 0.6 : 1 }}
                  >
                    إلغاء الطلب
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  db: Firestore;
  storeLabel?: string;
}

const FILTER_TABS = [
  { key: "all",       label: "الكل" },
  { key: "pending",   label: "جديد" },
  { key: "confirmed", label: "مؤكد" },
  { key: "processing",label: "جارية" },
  { key: "shipped",   label: "شُحن" },
  { key: "delivered", label: "مكتمل" },
  { key: "cancelled", label: "ملغي" },
] as const;

export default function OrdersDashboard({ db, storeLabel = "المتجر" }: Props) {
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [selected, setSelected] = useState<FirestoreOrder | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToOrders(
      db,
      (data) => {
        setOrders(data);
        setLoading(false);
      },
      (err) => {
        console.error("Orders subscription error:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, [db]);

  // Re-open updated order if it was selected
  const handleUpdated = useCallback(() => {
    setSelected(null);
  }, []);

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (o.customerName || "").toLowerCase().includes(q) ||
        (o.customerPhone || "").includes(q) ||
        (o.orderNumber || "").includes(q) ||
        o.id.includes(q)
      );
    }
    return true;
  });

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders
      .filter((o) => o.status === "delivered")
      .reduce((s, o) => s + o.totalAmount, 0),
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">📦</div>
          <p className="text-[#64748B] font-bold">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ direction: "rtl" }}>
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: "🛒", label: "إجمالي الطلبات", value: stats.total, color: "#4A6CF7", bg: "#EEF2FF" },
          { icon: "⏳", label: "طلبات جديدة",    value: stats.pending, color: "#F97316", bg: "#FFF7ED" },
          { icon: "✅", label: "مكتملة",         value: stats.delivered, color: "#16A34A", bg: "#DCFCE7" },
          { icon: "💰", label: "الإيرادات (مكتملة)", value: formatAmount(stats.revenue), color: "#8B5CF6", bg: "#F5F3FF" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#F1F5F9] shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#94A3B8] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  ابحث بالاسم أو التليفون..."
          className="flex-1 px-4 py-2.5 border-2 border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:border-[#4A6CF7] outline-none bg-white"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {FILTER_TABS.map((f) => {
          const count = f.key === "all"
            ? orders.length
            : orders.filter((o) => o.status === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as "all" | OrderStatus)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-all whitespace-nowrap"
              style={{
                background: filter === f.key ? "#4A6CF7" : "#fff",
                color: filter === f.key ? "#fff" : "#64748B",
                borderColor: filter === f.key ? "#4A6CF7" : "#E2E8F0",
              }}
            >
              {f.label}
              {count > 0 && (
                <span
                  className="text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={
                    filter === f.key
                      ? { background: "rgba(255,255,255,0.3)", color: "#fff" }
                      : { background: "#F1F5F9", color: "#64748B" }
                  }
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="font-bold text-[#1E293B] mb-1">
            {orders.length === 0 ? "لا توجد طلبات بعد" : "لا توجد نتائج"}
          </p>
          <p className="text-sm text-[#94A3B8]">
            {orders.length === 0
              ? `الطلبات من تطبيق ${storeLabel} ستظهر هنا`
              : "جرب تغيير الفلتر أو البحث"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
          {/* Table Header */}
          <div
            className="grid bg-[#F8FAFC] border-b border-[#F1F5F9] hidden md:grid"
            style={{ gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1.2fr 1fr" }}
          >
            {["رقم الطلب", "العميل", "المنتجات", "المبلغ", "الحالة", "التاريخ"].map((h) => (
              <div key={h} className="p-3 text-xs font-bold text-[#94A3B8]">
                {h}
              </div>
            ))}
          </div>

          {/* Mobile: simple cards; Desktop: table rows */}
          <div className="hidden md:block">
            {filtered.map((order) => (
              <OrderRow key={order.id} order={order} onSelect={setSelected} />
            ))}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col divide-y divide-[#F1F5F9]">
            {filtered.map((order) => {
              const ss = STATUS_COLORS[order.status] ?? { color: "#64748B", bg: "#F1F5F9" };
              return (
                <div
                  key={order.id}
                  className="p-4 cursor-pointer hover:bg-[#FAFAFA]"
                  onClick={() => setSelected(order)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-black text-[#4A6CF7]">
                      #{order.orderNumber || order.id.slice(-6)}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ color: ss.color, background: ss.bg }}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#1E293B]">
                      {order.customerName || "عميل"}
                    </span>
                    <span className="text-sm font-black text-[#1E293B]">
                      {formatAmount(order.totalAmount)}
                    </span>
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-1">
                    {order.items.length} منتج · {formatDate(order.createdAt)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <OrderDetail
          order={selected}
          db={db}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
