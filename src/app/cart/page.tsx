"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface CartItem {
  productId: number;
  name: string;
  price: string;
  imageUrl: string | null;
  quantity: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const formatPeso = (val: number) =>
  `₱${val.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [paymentMethod, setPaymentMethod] = useState<"e_wallet" | "cash" | "card">("e_wallet");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bloomery_cart") || "[]");
    setCart(stored);

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("bloomery_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQty = (productId: number, delta: number) => {
    const newCart = cart
      .map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(newCart);
  };

  const removeItem = (productId: number) => {
    updateCart(cart.filter((item) => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const deliveryFee = orderType === "delivery" ? 150 : 0;
  const total = subtotal + deliveryFee;

  const placeOrder = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (orderType === "delivery" && !deliveryAddress) {
      setError("Please enter a delivery address");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          orderType,
          paymentMethod,
          deliveryAddress: orderType === "delivery" ? deliveryAddress : null,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order");
      }

      updateCart([]);
      router.push("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-bloom-50 to-leaf-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Cart</h1>
            <p className="text-slate-500">Review your bouquets and place your order</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-6xl mb-4">🛒</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
              <p className="text-slate-500 mb-6">Add some beautiful bouquets to get started!</p>
              <Link
                href="/shop"
                className="inline-block bg-bloom-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-bloom-600 transition"
              >
                Browse Bouquets
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-bloom-100 flex items-center justify-center text-3xl">
                          💐
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{item.name}</h3>
                      <p className="text-bloom-600 font-medium">{formatPeso(parseFloat(item.price))}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQty(item.productId, -1)}
                          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-bloom-100 hover:text-bloom-600 transition flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.productId, 1)}
                          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-bloom-100 hover:text-bloom-600 transition flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(item.productId)} className="text-slate-400 hover:text-red-500 transition">
                        ✕
                      </button>
                      <span className="font-bold text-slate-900">
                        {formatPeso(parseFloat(item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-24 space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

                {/* Order Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Order Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setOrderType("pickup")}
                      className={`py-2 rounded-lg text-sm font-medium transition ${
                        orderType === "pickup"
                          ? "bg-bloom-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-bloom-50"
                      }`}
                    >
                      🏪 Pickup
                    </button>
                    <button
                      onClick={() => setOrderType("delivery")}
                      className={`py-2 rounded-lg text-sm font-medium transition ${
                        orderType === "delivery"
                          ? "bg-bloom-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-bloom-50"
                      }`}
                    >
                      🚚 Delivery
                    </button>
                  </div>
                </div>

                {orderType === "delivery" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Address</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400 text-sm"
                      rows={3}
                      placeholder="Enter your full delivery address..."
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                  <div className="space-y-2">
                    {[
                      {
                        value: "e_wallet" as const,
                        label: "📱 GCash / Maya",
                        desc: "Pay via e-wallet",
                      },
                      {
                        value: "card" as const,
                        label: "💳 Credit / Debit Card",
                        desc: "Visa, Mastercard, etc.",
                      },
                      {
                        value: "cash" as const,
                        label: "💵 Cash on Delivery / Pickup",
                        desc: "Pay in cash",
                      },
                    ].map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setPaymentMethod(method.value)}
                        className={`w-full p-3 rounded-lg text-left transition border ${
                          paymentMethod === method.value
                            ? "border-bloom-500 bg-bloom-50"
                            : "border-slate-200 hover:border-bloom-300"
                        }`}
                      >
                        <div className="text-sm font-medium">{method.label}</div>
                        <div className="text-xs text-slate-500">{method.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400 text-sm"
                    rows={2}
                    placeholder="Gift message, special requests..."
                  />
                </div>

                {/* Total */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-sm text-slate-500 mb-1">
                    <span>Subtotal</span>
                    <span>{formatPeso(subtotal)}</span>
                  </div>
                  {orderType === "delivery" && (
                    <div className="flex justify-between text-sm text-slate-500 mb-1">
                      <span>Delivery Fee</span>
                      <span>{formatPeso(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg text-slate-900 mt-2">
                    <span>Total</span>
                    <span className="text-bloom-600">{formatPeso(total)}</span>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="w-full bg-bloom-500 text-white py-3 rounded-full font-semibold hover:bg-bloom-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placing ? "Placing Order..." : user ? "Place Order" : "Login to Order"}
                </button>

                {!user && (
                  <p className="text-xs text-slate-500 text-center">
                    You need to{" "}
                    <Link href="/login" className="text-bloom-600 underline">
                      log in
                    </Link>{" "}
                    to place an order.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
