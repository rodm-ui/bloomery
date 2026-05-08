"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const formatPeso = (price: string) =>
  `₱${parseFloat(price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setCategories(d);
      });
  }, []);

  useEffect(() => {
    const url =
      selectedCategory && selectedCategory !== "all"
        ? `/api/products?categoryId=${selectedCategory}`
        : "/api/products";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setProducts(d);
      });
  }, [selectedCategory]);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("bloomery_cart") || "[]");
    const existing = cart.find((i: { productId: number }) => i.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      });
    }
    localStorage.setItem("bloomery_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-bloom-50 to-leaf-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Our Bouquets</h1>
          <p className="text-slate-500">
            Browse our complete collection of hand-crafted flower bouquets
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search bouquets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400 focus:border-transparent bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === "all"
                  ? "bg-bloom-500 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-bloom-300"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat.id.toString()
                    ? "bg-bloom-500 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-bloom-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">💐</p>
            <p className="text-slate-500 text-lg">
              No bouquets found. Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-bloom-100 flex items-center justify-center text-6xl">
                      💐
                    </div>
                  )}
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-bloom-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      ⭐ Best Seller
                    </span>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-slate-800 px-4 py-2 rounded-full font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  {product.categoryName && (
                    <span className="text-xs text-bloom-500 font-medium uppercase tracking-wide">
                      {product.categoryName}
                    </span>
                  )}
                  <h3 className="font-semibold text-slate-900 mt-1">{product.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-bloom-600">
                      {formatPeso(product.price)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        addedId === product.id
                          ? "bg-leaf-500 text-white"
                          : product.inStock
                          ? "bg-bloom-500 text-white hover:bg-bloom-600"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {addedId === product.id ? "✓ Added!" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <p className="text-bloom-500 text-lg">Loading bouquets...</p>
            </div>
          }
        >
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
