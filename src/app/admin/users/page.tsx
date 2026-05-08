"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
}

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") {
          router.push("/login");
          return;
        }
        setCurrentUserId(d.user.id);
      });

    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (Array.isArray(data)) setUsers(data);
    setLoading(false);
  };

  const updateRole = async (userId: number, role: string) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    loadUsers();
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      loadUsers();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete user");
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    customers: users.filter((u) => u.role === "customer").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-bloom-800 to-bloom-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-bloom-200 hover:text-white transition">←</Link>
            <h1 className="text-xl font-bold">Manage Users</h1>
          </div>
          <button
            onClick={loadUsers}
            className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition"
          >
            🔄 Refresh
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-500">Total Users</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-bloom-600">{stats.admins}</p>
            <p className="text-sm text-slate-500">👑 Admins</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-leaf-600">{stats.customers}</p>
            <p className="text-sm text-slate-500">👤 Customers</p>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-slate-500">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">User</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Contact</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Role</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Joined</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bloom-400 to-bloom-600 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-500">ID: #{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900">{user.email}</p>
                        <p className="text-sm text-slate-500">{user.phone || "No phone"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          disabled={user.id === currentUserId}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border-0 cursor-pointer ${
                            user.role === "admin"
                              ? "bg-bloom-100 text-bloom-700"
                              : "bg-slate-100 text-slate-600"
                          } ${user.id === currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <option value="customer">👤 Customer</option>
                          <option value="admin">👑 Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(user.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.id !== currentUserId ? (
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">(You)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-12 text-slate-500">No users found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
