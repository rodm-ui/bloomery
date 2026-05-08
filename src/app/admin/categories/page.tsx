"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "" });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") router.push("/login");
      });
    loadData();
  }, [router]);

  const loadData = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setCategories(d); });
  };

  const resetForm = () => {
    setForm({ name: "", description: "", imageUrl: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      description: cat.description || "",
      imageUrl: cat.imageUrl || "",
    });
    setEditing(cat);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name,
      description: form.description || null,
      imageUrl: form.imageUrl || null,
    };

    if (editing) {
      await fetch(`/api/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    resetForm();
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-bloom-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-bloom-200 hover:text-white transition">←</Link>
            <h1 className="text-xl font-bold">Manage Categories</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-bloom-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-bloom-400 transition"
          >
            + Add Category
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {editing ? "Edit Category" : "Add New Category"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-bloom-500 text-white py-2 rounded-lg font-medium hover:bg-bloom-600 transition">
                    {editing ? "Update" : "Create"}
                  </button>
                  <button type="button" onClick={resetForm} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg font-medium hover:bg-slate-200 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-40 overflow-hidden">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-bloom-100 flex items-center justify-center text-4xl">📁</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900">{cat.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{cat.description || "No description"}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(cat)} className="text-bloom-600 hover:text-bloom-800 text-sm font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12 text-slate-500">No categories yet.</div>
        )}
      </div>
    </div>
  );
}
