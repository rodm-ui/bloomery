"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: number;
  productName: string | null;
  productImage: string | null;
  quantity: number;
  unitPrice: string;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  orderType: string;
  paymentMethod: string;
  totalAmount: string;
  deliveryAddress: string | null;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
}

const statuses = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusEmoji: Record<string, string> = {
  pending: "⏳",
  confirmed: "✅",
  preparing: "💐",
  ready: "📦",
  delivered: "🚚",
  cancelled: "❌",
};

const paymentLabels: Record<string, string> = {
  e_wallet: "GCash / Maya",
  card: "Card",
  cash: "Cash",
};

const formatPeso = (val: number) =>
  `₱${val.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") router.push("/login");
      });
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (Array.isArray(data)) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (orderId: number, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    revenue: orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + parseFloat(o.totalAmount), 0),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-bloom-800 to-bloom-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-bloom-200 hover:text-white transition">←</Link>
            <h1 className="text-xl font-bold">Manage Orders</h1>
          </div>
          <button onClick={loadData} className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition">🔄 Refresh</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Status Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          <button onClick={() => setFilter("all")} className={`p-3 rounded-xl text-center transition ${filter === "all" ? "bg-bloom-500 text-white" : "bg-white shadow-sm hover:shadow-md"}`}>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs opacity-75">All</p>
          </button>
          <button onClick={() => setFilter("pending")} className={`p-3 rounded-xl text-center transition ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-white shadow-sm hover:shadow-md"}`}>
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-xs opacity-75">⏳ Pending</p>
          </button>
          <button onClick={() => setFilter("confirmed")} className={`p-3 rounded-xl text-center transition ${filter === "confirmed" ? "bg-blue-500 text-white" : "bg-white shadow-sm hover:shadow-md"}`}>
            <p className="text-2xl font-bold">{stats.confirmed}</p>
            <p className="text-xs opacity-75">✅ Confirmed</p>
          </button>
          <button onClick={() => setFilter("preparing")} className={`p-3 rounded-xl text-center transition ${filter === "preparing" ? "bg-purple-500 text-white" : "bg-white shadow-sm hover:shadow-md"}`}>
            <p className="text-2xl font-bold">{stats.preparing}</p>
            <p className="text-xs opacity-75">💐 Preparing</p>
          </button>
          <button onClick={() => setFilter("ready")} className={`p-3 rounded-xl text-center transition ${filter === "ready" ? "bg-green-500 text-white" : "bg-white shadow-sm hover:shadow-md"}`}>
            <p className="text-2xl font-bold">{stats.ready}</p>
            <p className="text-xs opacity-75">📦 Ready</p>
          </button>
          <button onClick={() => setFilter("delivered")} className={`p-3 rounded-xl text-center transition ${filter === "delivered" ? "bg-emerald-500 text-white" : "bg-white shadow-sm hover:shadow-md"}`}>
            <p className="text-2xl font-bold">{stats.delivered}</p>
            <p className="text-xs opacity-75">🚚 Delivered</p>
          </button>
          <button onClick={() => setFilter("cancelled")} className={`p-3 rounded-xl text-center transition ${filter === "cancelled" ? "bg-red-500 text-white" : "bg-white shadow-sm hover:shadow-md"}`}>
            <p className="text-2xl font-bold">{stats.cancelled}</p>
            <p className="text-xs opacity-75">❌ Cancelled</p>
          </button>
          <div className="p-3 rounded-xl bg-white shadow-sm text-center">
            <p className="text-lg font-bold text-bloom-600">{formatPeso(stats.revenue)}</p>
            <p className="text-xs text-slate-500">💰 Revenue</p>
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-12"><div className="text-4xl mb-2">💐</div><p className="text-slate-500">Loading orders...</p></div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm"><div className="text-4xl mb-2">📋</div><p className="text-slate-500">No {filter === "all" ? "" : filter} orders found.</p></div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg">Order #{order.id}</h3>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">User #{order.userId}</span>
                      </div>
                      <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="text-slate-600">{order.orderType === "pickup" ? "🏪 Pickup" : "🚚 Delivery"}</span>
                        <span className="text-slate-600">💳 {paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
                      </div>
                      {order.deliveryAddress && <p className="text-sm text-slate-500 mt-1">📍 {order.deliveryAddress}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-2xl font-bold text-bloom-600">{formatPeso(parseFloat(order.totalAmount))}</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border-0 cursor-pointer ${statusColors[order.status] || "bg-slate-100"}`}
                      >
                        {statuses.map((s) => (<option key={s} value={s}>{statusEmoji[s]} {s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 bg-slate-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-white rounded-lg p-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          {item.productImage ? (<img src={item.productImage} alt={item.productName || ""} className="w-full h-full object-cover" />) : (<div className="w-full h-full bg-bloom-100 flex items-center justify-center">💐</div>)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm truncate">{item.productName}</p>
                          <p className="text-xs text-slate-500">{item.quantity} × {formatPeso(parseFloat(item.unitPrice))} = {formatPeso(parseFloat(item.unitPrice) * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <p className="text-sm text-yellow-800"><span className="font-medium">📝 Note:</span> {order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
