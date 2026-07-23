import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import api from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryList({ onSeeMoreClick }: { onSeeMoreClick?: () => void }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        if (response.data.success && response.data.data.categories) {
          setCategories(response.data.data.categories.slice(0, 11));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Show 11 categories + 1 "See More" to fill 12 columns on desktop
  const displayCategories = categories;

  return (
    <section className="py-2 sm:py-4 bg-white border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <h2 className="text-sm sm:text-lg font-black text-gray-900 tracking-tight uppercase">
            Shop by <span className="text-emerald-600">Category</span>
          </h2>
          <button 
            onClick={onSeeMoreClick}
            className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
          >
            View All
          </button>
        </div>
        
        {/* 2-Line Grid Layout */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-x-2 gap-y-3 sm:gap-6">
          {displayCategories.map((category, idx) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              viewport={{ once: true }}
              className="group flex flex-col items-center gap-1.5 cursor-pointer"
              onClick={() => navigate(`/shop?category=${category.slug}`)}
            >
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gray-50 border border-gray-100 group-hover:border-emerald-500/30 transition-all duration-300 overflow-hidden p-1 shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="block text-[9px] sm:text-[11px] font-bold text-gray-700 group-hover:text-emerald-600 transition-colors text-center line-clamp-1 uppercase tracking-tight">
                {category.name}
              </span>
            </motion.button>
          ))}

          {/* See More Button */}
          <motion.button
            onClick={onSeeMoreClick}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
            className="group flex flex-col items-center gap-1.5"
          >
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-500/20">
              <ChevronRight className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <span className="block text-[9px] sm:text-[11px] font-bold text-gray-700 group-hover:text-emerald-600 transition-colors text-center uppercase tracking-tight">
              See More
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

