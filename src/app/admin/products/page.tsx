"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  categoryId: number | null;
  categoryName: string | null;
  inStock: boolean;
  featured: boolean;
}

interface Category {
  id: number;
  name: string;
}

const formatPeso = (val: number) =>
  `₱${val.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    inStock: true,
    featured: false,
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") router.push("/login");
      });
    loadData();
  }, [router]);

  const loadData = () => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setProducts(d); });
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setCategories(d); });
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", imageUrl: "", categoryId: "", inStock: true, featured: false });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId?.toString() || "",
      inStock: product.inStock,
      featured: product.featured,
    });
    setEditing(product);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      imageUrl: form.imageUrl || null,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      inStock: form.inStock,
      featured: form.featured,
    };

    if (editing) {
      await fetch(`/api/products/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    resetForm();
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this bouquet?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-bloom-800 to-bloom-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-bloom-200 hover:text-white transition">←</Link>
            <h1 className="text-xl font-bold">Manage Bouquets</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-bloom-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-bloom-400 transition"
          >
            + Add Bouquet
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{editing ? "Edit Bouquet" : "Add New Bouquet"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (₱)</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400">
                      <option value="">No Category</option>
                      {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                  <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400" placeholder="https://..." />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="rounded border-slate-300 text-bloom-500 focus:ring-bloom-400" />
                    <span className="text-sm text-slate-700">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-slate-300 text-bloom-500 focus:ring-bloom-400" />
                    <span className="text-sm text-slate-700">Featured</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-bloom-500 text-white py-2 rounded-lg font-medium hover:bg-bloom-600 transition">{editing ? "Update" : "Create"}</button>
                  <button type="button" onClick={resetForm} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg font-medium hover:bg-slate-200 transition">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Bouquet</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          {product.imageUrl ? (<img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />) : (<div className="w-full h-full bg-bloom-100 flex items-center justify-center">💐</div>)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          {product.featured && <span className="text-xs text-bloom-500">⭐ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{product.categoryName || "—"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatPeso(parseFloat(product.price))}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(product)} className="text-bloom-600 hover:text-bloom-800 text-sm font-medium mr-3">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && <div className="text-center py-12 text-slate-500">No bouquets yet. Add your first bouquet!</div>}
        </div>
      </div>
    </div>
  );
}
