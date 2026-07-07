import { HIERARCHICAL_CATEGORIES } from "../data/categories";
import { useEffect } from "react";
import { motion } from "motion/react";

export default function SellerShop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pt-6">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Seller Shop</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-2xl">
            Browse curated seller categories and discover premium collections for business customers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {HIERARCHICAL_CATEGORIES.map((category) => (
            <motion.div
              key={category.name}
              whileHover={{ y: -6 }}
              className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-sm">
                  <category.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">{category.name}</h2>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">{category.subCategories?.length ?? 0} collections</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {category.subCategories?.map((sub) => (
                  <div key={sub.name} className="rounded-3xl bg-gray-50 p-4 text-sm">
                    <h3 className="font-black text-gray-900">{sub.name}</h3>
                    <p className="mt-2 text-xs text-gray-500">{sub.childCategories.join(" · ")}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
