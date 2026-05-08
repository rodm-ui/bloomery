"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string | null;
  inStock: boolean;
}

interface OrderItem {
  id: number;
  productName: string | null;
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
  createdAt: string;
  items: OrderItem[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Stats {
  products: number;
  categories: number;
  orders: number;
  users: number;
  revenue: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
}

const formatPeso = (val: number) =>
  `₱${val.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    pendingOrders: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (d) => {
        if (!d.user || d.user.role !== "admin") {
          router.push("/login");
          return;
        }
        setUserName(d.user.name);

        const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
          fetch("/api/products").then((r) => r.json()),
          fetch("/api/categories").then((r) => r.json()),
          fetch("/api/orders").then((r) => r.json()),
          fetch("/api/admin/users").then((r) => r.json()),
        ]);

        const orders = Array.isArray(ordersRes) ? ordersRes : [];
        const users = Array.isArray(usersRes) ? usersRes : [];
        const products = Array.isArray(productsRes) ? productsRes : [];

        const today = new Date().toDateString();
        const todayOrders = orders.filter(
          (o: Order) => new Date(o.createdAt).toDateString() === today
        );

        const revenue = orders.reduce(
          (sum: number, o: Order) => sum + parseFloat(o.totalAmount),
          0
        );
        const todayRevenue = todayOrders.reduce(
          (sum: number, o: Order) => sum + parseFloat(o.totalAmount),
          0
        );
        const pendingOrders = orders.filter(
          (o: Order) =>
            o.status === "pending" || o.status === "confirmed" || o.status === "preparing"
        ).length;

        setStats({
          products: products.length,
          categories: Array.isArray(categoriesRes) ? categoriesRes.length : 0,
          orders: orders.length,
          users: users.length,
          revenue,
          pendingOrders,
          todayOrders: todayOrders.length,
          todayRevenue,
        });

        setRecentOrders(orders.slice(0, 5));
        setRecentUsers(users.slice(-5).reverse());
        setTopProducts(products.filter((p: Product) => p.inStock).slice(0, 4));
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const updateOrderStatus = async (orderId: number, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const ordersRes = await fetch("/api/orders").then((r) => r.json());
    if (Array.isArray(ordersRes)) {
      setRecentOrders(ordersRes.slice(0, 5));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-5xl mb-4">💐</div>
          <div className="text-bloom-500 text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-bloom-800 to-bloom-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💐</span>
            <div>
              <h1 className="text-xl font-bold">BlooMery Admin</h1>
              <p className="text-bloom-200 text-sm">Welcome back, {userName}!</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-bloom-200 hover:text-white transition text-sm bg-white/10 px-4 py-2 rounded-full"
          >
            <span>🏪</span> View Store
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm col-span-1">
            <div className="text-2xl mb-1">📦</div>
            <p className="text-2xl font-bold text-slate-900">{stats.products}</p>
            <p className="text-xs text-slate-500">Bouquets</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm col-span-1">
            <div className="text-2xl mb-1">📁</div>
            <p className="text-2xl font-bold text-slate-900">{stats.categories}</p>
            <p className="text-xs text-slate-500">Categories</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm col-span-1">
            <div className="text-2xl mb-1">🛒</div>
            <p className="text-2xl font-bold text-slate-900">{stats.orders}</p>
            <p className="text-xs text-slate-500">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm col-span-1">
            <div className="text-2xl mb-1">👥</div>
            <p className="text-2xl font-bold text-slate-900">{stats.users}</p>
            <p className="text-xs text-slate-500">Users</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm col-span-1">
            <div className="text-2xl mb-1">💰</div>
            <p className="text-xl font-bold text-bloom-600">{formatPeso(stats.revenue)}</p>
            <p className="text-xs text-slate-500">Total Revenue</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm col-span-1">
            <div className="text-2xl mb-1">⏳</div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            <p className="text-xs text-slate-500">Active Orders</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm col-span-1">
            <div className="text-2xl mb-1">📅</div>
            <p className="text-2xl font-bold text-leaf-600">{stats.todayOrders}</p>
            <p className="text-xs text-slate-500">Today&apos;s Orders</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm col-span-1">
            <div className="text-2xl mb-1">✨</div>
            <p className="text-xl font-bold text-purple-600">{formatPeso(stats.todayRevenue)}</p>
            <p className="text-xs text-slate-500">Today&apos;s Revenue</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Link href="/admin/products" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition group text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-bloom-50 flex items-center justify-center text-2xl group-hover:bg-bloom-100 transition mb-2">💐</div>
            <h3 className="font-semibold text-slate-900 text-sm">Bouquets</h3>
            <p className="text-xs text-slate-500">Manage products</p>
          </Link>
          <Link href="/admin/categories" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition group text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-leaf-50 flex items-center justify-center text-2xl group-hover:bg-leaf-100 transition mb-2">📁</div>
            <h3 className="font-semibold text-slate-900 text-sm">Categories</h3>
            <p className="text-xs text-slate-500">Manage menu</p>
          </Link>
          <Link href="/admin/orders" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition group text-center relative">
            {stats.pendingOrders > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{stats.pendingOrders}</span>
            )}
            <div className="w-12 h-12 mx-auto rounded-xl bg-yellow-50 flex items-center justify-center text-2xl group-hover:bg-yellow-100 transition mb-2">📋</div>
            <h3 className="font-semibold text-slate-900 text-sm">Orders</h3>
            <p className="text-xs text-slate-500">Manage orders</p>
          </Link>
          <Link href="/admin/users" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition group text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-purple-50 flex items-center justify-center text-2xl group-hover:bg-purple-100 transition mb-2">👥</div>
            <h3 className="font-semibold text-slate-900 text-sm">Users</h3>
            <p className="text-xs text-slate-500">View customers</p>
          </Link>
          <Link href="/admin/contact" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition group text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-2xl group-hover:bg-blue-100 transition mb-2">📞</div>
            <h3 className="font-semibold text-slate-900 text-sm">Contact</h3>
            <p className="text-xs text-slate-500">Update info</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Recent Orders</h3>
              <Link href="/admin/orders" className="text-bloom-600 text-sm hover:underline">View All →</Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p className="text-4xl mb-2">📋</p>
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-slate-50 transition">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900">Order #{order.id}</span>
                        <span className="text-xs text-slate-500">
                          {order.orderType === "pickup" ? "🏪" : "🚚"} {order.orderType}
                        </span>
                      </div>
                      <span className="font-bold text-bloom-600">{formatPeso(parseFloat(order.totalAmount))}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500 truncate max-w-[60%]">
                        {order.items.map((item) => item.productName).join(", ")}
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[order.status] || "bg-slate-100"}`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="preparing">💐 Preparing</option>
                        <option value="ready">📦 Ready</option>
                        <option value="delivered">🚚 Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Users</h3>
                <Link href="/admin/users" className="text-bloom-600 text-sm hover:underline">View All →</Link>
              </div>
              {recentUsers.length === 0 ? (
                <div className="p-6 text-center text-slate-500"><p>No users yet</p></div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-bloom-100 flex items-center justify-center text-sm font-bold text-bloom-600">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-bloom-100 text-bloom-700" : "bg-slate-100 text-slate-600"}`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* In-Stock Bouquets */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Available Bouquets</h3>
                <Link href="/admin/products" className="text-bloom-600 text-sm hover:underline">View All →</Link>
              </div>
              {topProducts.length === 0 ? (
                <div className="p-6 text-center text-slate-500"><p>No products yet</p></div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {topProducts.map((product) => (
                    <div key={product.id} className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-bloom-100 flex items-center justify-center text-lg">💐</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{product.name}</p>
                        <p className="text-xs text-bloom-600 font-medium">{formatPeso(parseFloat(product.price))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
