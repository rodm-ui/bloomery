"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bloom-900 text-bloom-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">💐</span>
              <span className="text-2xl font-bold text-white">BlooMery</span>
            </div>
            <p className="text-bloom-200 max-w-md">
              Bringing beauty into your life with hand-crafted flower bouquets for every occasion. Each bouquet is made with love and the freshest blooms.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/shop" className="block text-bloom-200 hover:text-white transition">Bouquets</Link>
              <Link href="/about" className="block text-bloom-200 hover:text-white transition">About Us</Link>
              <Link href="/contact" className="block text-bloom-200 hover:text-white transition">Contact</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-bloom-200 text-sm">
              <p>📍 456 Rosal Ave., Makati City</p>
              <p>📞 +63 917 123 4567</p>
              <p>✉️ hello@bloomery.ph</p>
              <p>🕐 Mon-Sat: 8AM-8PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-bloom-800 mt-8 pt-8 text-center text-bloom-300 text-sm">
          <p>&copy; {new Date().getFullYear()} BlooMery Flower Bouquet Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
