"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});

    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("bloomery_cart") || "[]");
      setCartCount(
        cart.reduce((sum: number, i: { quantity: number }) => sum + i.quantity, 0)
      );
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("cartUpdated", updateCart);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-bloom-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">💐</span>
            <span className="text-xl font-bold bg-gradient-to-r from-bloom-600 to-bloom-400 bg-clip-text text-transparent">
              BlooMery
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-600 hover:text-bloom-600 transition font-medium">
              Home
            </Link>
            <Link href="/shop" className="text-slate-600 hover:text-bloom-600 transition font-medium">
              Bouquets
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-bloom-600 transition font-medium">
              About
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-bloom-600 transition font-medium">
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/cart" className="relative text-slate-600 hover:text-bloom-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-bloom-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-sm bg-bloom-600 text-white px-4 py-2 rounded-full hover:bg-bloom-700 transition"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link href="/orders" className="text-sm text-slate-600 hover:text-bloom-600 transition">
                  My Orders
                </Link>
                <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-500 transition">
                  Logout
                </button>
                <span className="text-sm text-bloom-600 font-medium">{user.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-slate-600 hover:text-bloom-600 transition px-3 py-2">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-bloom-500 text-white px-4 py-2 rounded-full hover:bg-bloom-600 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/cart" className="relative text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-bloom-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-bloom-100 space-y-2">
            <Link href="/" className="block py-2 text-slate-600 hover:text-bloom-600" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/shop" className="block py-2 text-slate-600 hover:text-bloom-600" onClick={() => setMenuOpen(false)}>Bouquets</Link>
            <Link href="/about" className="block py-2 text-slate-600 hover:text-bloom-600" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" className="block py-2 text-slate-600 hover:text-bloom-600" onClick={() => setMenuOpen(false)}>Contact</Link>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link href="/admin" className="block py-2 text-bloom-600 font-medium" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                )}
                <Link href="/orders" className="block py-2 text-slate-600" onClick={() => setMenuOpen(false)}>My Orders</Link>
                <button onClick={handleLogout} className="block py-2 text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-slate-600" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/register" className="block py-2 text-bloom-600 font-medium" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
