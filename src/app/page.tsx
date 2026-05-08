"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  categoryName: string | null;
  featured: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    fetch("/api/seed", { method: "POST" })
      .then(() => setSeeded(true))
      .catch(() => setSeeded(true));
  }, []);

  useEffect(() => {
    if (!seeded) return;
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setFeatured(d);
      })
      .catch(() => {});

    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setCategories(d);
      })
      .catch(() => {});
  }, [seeded]);

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
  };

  const formatPeso = (price: string) => {
    return `₱${parseFloat(price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-bloom-50 via-white to-leaf-50">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-8xl">💐</div>
            <div className="absolute top-32 right-20 text-6xl">🌷</div>
            <div className="absolute bottom-20 left-1/3 text-7xl">🌹</div>
            <div className="absolute bottom-10 right-10 text-5xl">🌻</div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 relative">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block text-bloom-600 bg-bloom-50 px-4 py-1 rounded-full text-sm font-medium mb-6 border border-bloom-200">
                💐 Hand-Crafted Bouquets · Delivered Fresh
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Beautiful Bouquets for{" "}
                <span className="bg-gradient-to-r from-bloom-500 to-bloom-700 bg-clip-text text-transparent">
                  Every Occasion
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                From romantic roses to cheerful sunflowers — each BlooMery bouquet is hand-arranged by our expert florists using the freshest blooms, delivered right to your doorstep across Metro Manila.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="bg-bloom-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-bloom-600 transition shadow-lg shadow-bloom-200"
                >
                  Browse Bouquets →
                </Link>
                <Link
                  href="/about"
                  className="bg-white text-bloom-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-bloom-50 transition border border-bloom-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Shop by Occasion</h2>
              <p className="text-slate-500">Find the perfect bouquet for any moment</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.id}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-bloom-100 flex items-center justify-center text-6xl">💐</div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-white font-bold text-sm sm:text-base">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Bouquets */}
        <section className="py-16 bg-bloom-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Featured Bouquets</h2>
              <p className="text-slate-500">Our most loved arrangements, hand-picked for you</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-bloom-100 flex items-center justify-center text-6xl">💐</div>
                    )}
                    <span className="absolute top-3 left-3 bg-bloom-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      ⭐ Best Seller
                    </span>
                  </div>
                  <div className="p-5">
                    {product.categoryName && (
                      <span className="text-xs text-bloom-500 font-medium uppercase tracking-wide">
                        {product.categoryName}
                      </span>
                    )}
                    <h3 className="font-semibold text-slate-900 mt-1 text-lg">{product.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-bloom-600">{formatPeso(product.price)}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-bloom-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-bloom-600 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/shop"
                className="inline-block bg-white text-bloom-600 px-8 py-3 rounded-full font-semibold hover:bg-bloom-50 transition border border-bloom-200"
              >
                View All Bouquets →
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Metro Manila Delivery</h3>
                <p className="text-slate-500 text-sm">
                  Same-day delivery within Metro Manila for orders before 2 PM.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">💐</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Hand-Crafted Bouquets</h3>
                <p className="text-slate-500 text-sm">
                  Every bouquet is carefully arranged by our expert florists.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Fresh & Premium</h3>
                <p className="text-slate-500 text-sm">
                  Only the freshest flowers sourced from the best growers.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Easy Payment</h3>
                <p className="text-slate-500 text-sm">
                  Pay via GCash, Maya, credit card, or cash on delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-bloom-600 to-bloom-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Send a Beautiful Bouquet?</h2>
            <p className="text-bloom-100 text-lg mb-8">
              Order now and surprise someone special. Free gift message included with every bouquet!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-bloom-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-bloom-50 transition"
            >
              Order a Bouquet Now 💐
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
