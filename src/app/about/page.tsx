import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-bloom-50 via-white to-leaf-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-6xl">💐</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-4">
              About BlooMery
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We are passionate florists dedicated to crafting the most beautiful flower bouquets for every occasion — delivered with love across Metro Manila.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h2>
                <p className="text-slate-600 mb-4">
                  Founded in 2020 in Makati City, BlooMery started as a small bouquet shop with a simple dream: to bring joy and beauty through flowers to every Filipino home.
                </p>
                <p className="text-slate-600 mb-4">
                  What began as a passion project has blossomed into one of Metro Manila&apos;s favorite flower bouquet shops, serving thousands of happy customers with hand-crafted arrangements for every celebration.
                </p>
                <p className="text-slate-600">
                  We source the freshest blooms from Benguet, Bukidnon, and select international farms — ensuring every bouquet we create is as stunning and long-lasting as possible.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bloom-50 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-bloom-600">5K+</p>
                  <p className="text-sm text-slate-500 mt-1">Happy Customers</p>
                </div>
                <div className="bg-leaf-50 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-leaf-600">50+</p>
                  <p className="text-sm text-slate-500 mt-1">Bouquet Designs</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-purple-600">15K+</p>
                  <p className="text-sm text-slate-500 mt-1">Bouquets Delivered</p>
                </div>
                <div className="bg-yellow-50 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-yellow-600">4.9★</p>
                  <p className="text-sm text-slate-500 mt-1">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-bloom-50/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Sustainability</h3>
                <p className="text-sm text-slate-500">
                  We use eco-friendly packaging and support local Filipino flower growers.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-4">💐</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Artisan Quality</h3>
                <p className="text-sm text-slate-500">
                  Every bouquet is hand-arranged by our expert florists with meticulous care.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Community</h3>
                <p className="text-sm text-slate-500">
                  We support local growers and give back to our Filipino community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
