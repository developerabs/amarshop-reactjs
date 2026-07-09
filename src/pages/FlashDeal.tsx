import { motion } from "motion/react";
import { getFlashDeals } from "../lib/dataService";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import api from "../services/api";
import type { Product } from "../types";

export default function FlashDeal() {
  const [deals, setDeals] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        const response = await api.get("/home/products?type=flash-deals");
        if (response.data.success) {
          const deals = response.data.data.products.map((p: { id: number; name: string; slug: string; price: string; sale_price: string; total_stock: number; images: string[]; category_name?: string; discount_amount: string; discount_type: string; rating?: string | number; reviews?: string | number }) => ({
            ...p,
            id: String(p.id),
            slug: p.slug,
            name: p.name,
            price: parseFloat(p.price),
            salePrice: parseFloat(p.sale_price),
            flashPrice: Math.floor(parseFloat(p.price) * 0.8),
            category: p.category_name,
            image: p.images?.[0] ?? '',
            available: p.total_stock,
            discountAmount: parseFloat(p.discount_amount),
            discountType: p.discount_type,
            rating: typeof p.rating === 'string' ? parseFloat(p.rating) : (p.rating ?? 0),
            reviews: typeof p.reviews === 'string' ? parseInt(String(p.reviews), 10) : (p.reviews ?? 0),
          }));
          setDeals(deals);
        }
      } catch (error) {
        console.error("Failed to fetch flash deals:", error);
      }
    };

    fetchFlashDeals();
  }, []);

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
