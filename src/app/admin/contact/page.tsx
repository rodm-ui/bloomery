"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminContact() {
  const router = useRouter();
  const [form, setForm] = useState({
    phone: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    openHours: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") router.push("/login");
      });

    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => {
        if (d) {
          setForm({
            phone: d.phone || "",
            email: d.email || "",
            address: d.address || "",
            facebook: d.facebook || "",
            instagram: d.instagram || "",
            openHours: d.openHours || "",
          });
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-bloom-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link href="/admin" className="text-bloom-200 hover:text-white transition">←</Link>
          <h1 className="text-xl font-bold">Contact Information</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400"
                placeholder="hello@bloomery.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Open Hours</label>
              <input
                type="text"
                value={form.openHours}
                onChange={(e) => setForm({ ...form, openHours: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400"
                placeholder="Mon-Sat: 8AM-8PM, Sun: 10AM-6PM"
              />
            </div>

            {saved && (
              <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm">
                ✅ Contact information saved successfully!
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-bloom-500 text-white py-3 rounded-lg font-medium hover:bg-bloom-600 transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
