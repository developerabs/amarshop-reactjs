import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Grid, Search, X } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

type BrandItem = {
  id: number;
  name: string;
  slug: string;
  image: string;
};

export default function BrandsSection() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("/brands");
        if (response.data.success && response.data.data.brands) {
          setBrands(response.data.data.brands);
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const displayBrands = brands.slice(0, 11);

  const filteredBrands = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return brands;
    return brands.filter((brand) => brand.name.toLowerCase().includes(query));
  }, [brands, searchQuery]);

  return (
    <section className="py-2 sm:py-4 bg-white border-b border-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <h2 className="text-sm sm:text-lg font-black text-gray-900 tracking-tight uppercase">
            Top <span className="text-emerald-600">Brands</span>
          </h2>
          <button
            onClick={() => setIsOverlayOpen(true)}
            className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-x-2 gap-y-3 sm:gap-6">
          {displayBrands.map((brand, idx) => (
            <motion.button
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              viewport={{ once: true }}
              className="group flex flex-col items-center gap-1.5"
              onClick={() => navigate(`/brand/${brand.slug}`)}
            >
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gray-50 border border-gray-100 group-hover:border-emerald-500/30 transition-all duration-300 overflow-hidden p-1 shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="block text-[9px] sm:text-[11px] font-bold text-gray-700 group-hover:text-emerald-600 transition-colors text-center line-clamp-1 uppercase tracking-tight">
                {brand.name}
              </span>
            </motion.button>
          ))}

          {/* See More Button */}
          <motion.button
            onClick={() => setIsOverlayOpen(true)}
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

      <AnimatePresence>
        {isOverlayOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOverlayOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="brands-overlay-title"
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[760px] sm:max-h-[85vh] bg-white rounded-[2rem] shadow-2xl z-[130] flex flex-col overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Grid className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 id="brands-overlay-title" className="text-base font-black text-gray-900 tracking-tight uppercase">All Brands</h2>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{brands.length} Items Found</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOverlayOpen(false)}
                  aria-label="Close brands overlay"
                  className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-4 sm:px-5 py-3 bg-gray-50/50 border-b border-gray-100">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search brands"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-4 gap-y-8">
                  {filteredBrands.map((brand, idx) => (
                    <motion.button
                      key={brand.id}
                      onClick={() => {
                        setIsOverlayOpen(false);
                        navigate(`/brand/${brand.slug}`);
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(idx * 0.01, 0.5) }}
                      className="group flex flex-col items-center gap-3 cursor-pointer"
                    >
                      <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full p-1 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-50 group-hover:shadow-emerald-500/20 group-hover:border-emerald-200 transition-all duration-300">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                          <img
                            src={brand.image}
                            alt={brand.name}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                      <span className="text-[9px] sm:text-[11px] font-black text-[#004a8d] group-hover:text-emerald-600 transition-colors text-center uppercase tracking-tight leading-tight px-1">
                        {brand.name}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {filteredBrands.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No brands found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
