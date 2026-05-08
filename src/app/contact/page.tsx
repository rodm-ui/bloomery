"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ContactData {
  phone: string | null;
  email: string | null;
  address: string | null;
  facebook: string | null;
  instagram: string | null;
  openHours: string | null;
}

export default function ContactPage() {
  const [contact, setContact] = useState<ContactData | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setContact(d))
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-bloom-50 via-white to-leaf-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-6xl">📞</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-slate-600">
              We&apos;d love to hear from you! Visit our shop or reach out anytime.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-bloom-50 flex items-center justify-center text-xl flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Our Shop</h3>
                    <p className="text-slate-500 text-sm">
                      {contact?.address || "456 Rosal Ave., Makati City, Metro Manila, Philippines"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-leaf-50 flex items-center justify-center text-xl flex-shrink-0">
                    📞
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Phone</h3>
                    <p className="text-slate-500 text-sm">
                      {contact?.phone || "+63 917 123 4567"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-xl flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Email</h3>
                    <p className="text-slate-500 text-sm">
                      {contact?.email || "hello@bloomery.ph"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-xl flex-shrink-0">
                    🕐
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Open Hours</h3>
                    <p className="text-slate-500 text-sm">
                      {contact?.openHours || "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM"}
                    </p>
                  </div>
                </div>

                {(contact?.facebook || contact?.instagram) && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">
                      🌐
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Social Media</h3>
                      <div className="flex gap-3 mt-1">
                        {contact.facebook && (
                          <a
                            href={contact.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm"
                          >
                            Facebook
                          </a>
                        )}
                        {contact.instagram && (
                          <a
                            href={contact.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-500 hover:underline text-sm"
                          >
                            Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Form */}
              <div className="bg-bloom-50/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Send a Message
                </h2>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(
                      "Salamat! Thank you for your message! We'll get back to you soon."
                    );
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400 bg-white"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400 bg-white"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Message
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bloom-400 bg-white"
                      rows={4}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-bloom-500 text-white py-3 rounded-full font-semibold hover:bg-bloom-600 transition"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
