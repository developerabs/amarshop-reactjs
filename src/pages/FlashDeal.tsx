import { motion } from "motion/react";
import { getFlashDeals } from "../lib/dataService";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";

export default function FlashDeal() {
  const deals = getFlashDeals();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pt-6">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Flash Deal</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-2xl">
            Limited-time offers on trending products with the best discounts of the season.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {deals.map((product) => (
            <motion.div key={product.id} whileHover={{ y: -4 }} className="bg-white rounded-3xl shadow-sm">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
