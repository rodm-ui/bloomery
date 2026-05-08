"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderItem {
  id: number;
  productName: string | null;
  productImage: string | null;
  quantity: number;
  unitPrice: string;
}

interface Order {
  id: number;
  status: string;
  orderType: string;
  paymentMethod: string;
  totalAmount: string;
  deliveryAddress: string | null;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
}

const formatPeso = (val: number) =>
  `₱${val.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  preparing: "bg-purple-100 text-purple-700 border-purple-200",
  ready: "bg-green-100 text-green-700 border-green-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const statusInfo: Record<string, { emoji: string; text: string; description: string }> = {
  pending: { emoji: "⏳", text: "Pending", description: "Waiting for confirmation" },
  confirmed: { emoji: "✅", text: "Confirmed", description: "Order has been confirmed" },
  preparing: { emoji: "💐", text: "Preparing", description: "Arranging your bouquet" },
  ready: { emoji: "📦", text: "Ready", description: "Ready for pickup / delivery" },
  delivered: { emoji: "🚚", text: "Delivered", description: "Bouquet delivered!" },
  cancelled: { emoji: "❌", text: "Cancelled", description: "Order was cancelled" },
};

const paymentLabels: Record<string, string> = {
  e_wallet: "GCash / Maya",
  card: "Credit / Debit Card",
  cash: "Cash",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          router.push("/login");
          return;
        }
        setUserName(d.user.name);
        return fetch("/api/orders");
      })
      .then((r) => r?.json())
      .then((d) => {
        if (Array.isArray(d)) setOrders(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">💐</div>
            <div className="text-bloom-500 text-xl">Loading your orders...</div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-bloom-50 via-white to-leaf-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Orders</h1>
            <p className="text-slate-500">Hello {userName}! Track your bouquet orders below.</p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <p className="text-6xl mb-4">📋</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
              <p className="text-slate-500 mb-6">
                Start by browsing our beautiful bouquets!
              </p>
              <Link
                href="/shop"
                className="inline-block bg-bloom-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-bloom-600 transition"
              >
                Browse Bouquets 💐
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <span className="text-sm text-slate-500">Total Orders</span>
                  <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Active</span>
                  <p className="text-2xl font-bold text-yellow-600">
                    {orders.filter((o) =>
                      ["pending", "confirmed", "preparing", "ready"].includes(o.status)
                    ).length}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Completed</span>
                  <p className="text-2xl font-bold text-green-600">
                    {orders.filter((o) => o.status === "delivered").length}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Total Spent</span>
                  <p className="text-2xl font-bold text-bloom-600">
                    {formatPeso(orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0))}
                  </p>
                </div>
              </div>

              {/* Orders */}
              {orders.map((order) => {
                const status = statusInfo[order.status] || {
                  emoji: "📋",
                  text: order.status,
                  description: "",
                };
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 text-lg">Order #{order.id}</h3>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {order.orderType === "pickup" ? "🏪 Pickup" : "🚚 Delivery"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString("en-PH", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                            statusColors[order.status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span className="text-lg">{status.emoji}</span>
                          <div className="text-left">
                            <p className="font-semibold text-sm">{status.text}</p>
                            <p className="text-xs opacity-75">{status.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    {order.status !== "cancelled" && (
                      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                        <div className="flex items-center justify-between max-w-md mx-auto">
                          {["pending", "confirmed", "preparing", "ready", "delivered"].map(
                            (step, idx) => {
                              const steps = [
                                "pending",
                                "confirmed",
                                "preparing",
                                "ready",
                                "delivered",
                              ];
                              const currentIdx = steps.indexOf(order.status);
                              const isComplete = idx <= currentIdx;
                              const isCurrent = idx === currentIdx;
                              return (
                                <div key={step} className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                      isComplete
                                        ? isCurrent
                                          ? "bg-bloom-500 text-white"
                                          : "bg-green-500 text-white"
                                        : "bg-slate-200 text-slate-400"
                                    }`}
                                  >
                                    {isComplete && !isCurrent
                                      ? "✓"
                                      : statusInfo[step]?.emoji || idx + 1}
                                  </div>
                                  {idx < 4 && (
                                    <div
                                      className={`w-8 sm:w-12 h-1 ${
                                        idx < currentIdx ? "bg-green-500" : "bg-slate-200"
                                      }`}
                                    />
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="p-6">
                      <h4 className="font-medium text-slate-900 mb-3">Bouquets Ordered</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 bg-slate-50 rounded-xl p-3"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              {item.productImage ? (
                                <img
                                  src={item.productImage}
                                  alt={item.productName || ""}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-bloom-100 flex items-center justify-center text-2xl">
                                  💐
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{item.productName}</p>
                              <p className="text-sm text-slate-500">
                                Qty: {item.quantity} × {formatPeso(parseFloat(item.unitPrice))}
                              </p>
                            </div>
                            <p className="font-bold text-slate-900">
                              {formatPeso(parseFloat(item.unitPrice) * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Details */}
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Payment:</span>
                            <p className="font-medium text-slate-900">
                              {paymentLabels[order.paymentMethod] || order.paymentMethod}
                            </p>
                          </div>
                          {order.deliveryAddress && (
                            <div>
                              <span className="text-slate-500">Delivery Address:</span>
                              <p className="font-medium text-slate-900">
                                {order.deliveryAddress}
                              </p>
                            </div>
                          )}
                        </div>
                        {order.notes && (
                          <div className="mt-3">
                            <span className="text-sm text-slate-500">Notes:</span>
                            <p className="text-sm text-slate-700 italic">&quot;{order.notes}&quot;</p>
                          </div>
                        )}
                      </div>

                      {/* Total */}
                      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="font-medium text-slate-700">Total Amount</span>
                        <span className="text-2xl font-bold text-bloom-600">
                          {formatPeso(parseFloat(order.totalAmount))}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="text-center pt-4">
                <Link
                  href="/shop"
                  className="inline-block bg-bloom-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-bloom-600 transition"
                >
                  Order More Bouquets 💐
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
