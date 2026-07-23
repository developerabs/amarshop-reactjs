import { X, Grid, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { useCommerce } from "../context/CommerceContext";
import api from "../services/api";

interface CategoryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FlatCategory {
  id?: number;
  name: string;
  slug?: string;
  image: string;
}

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  image: string;
  children?: CategoryData[];
}

export default function CategoryOverlay({ isOpen, onClose }: CategoryOverlayProps) {
  const navigate = useNavigate();
  const commerce = useCommerce();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/categories");
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const allCategories = useMemo(() => {
    const flat: FlatCategory[] = [];
    const flattenCategories = (items: CategoryData[]) => {
      items.forEach(parent => {
        flat.push({ 
          id: parent.id,
          name: parent.name,
          slug: parent.slug,
          image: parent.image 
        });
        if (parent.children && parent.children.length > 0) {
          flattenCategories(parent.children);
        }
      });
    };
    flattenCategories(categories);
    // Remove duplicates if any
    return Array.from(new Map(flat.map(item => [item.name, item])).values());
  }, [categories]);

  const filteredCategories = allCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-overlay-title"
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[600px] sm:max-h-[85vh] bg-white rounded-[2rem] shadow-2xl z-[130] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="category-overlay-title" className="text-base font-black text-gray-900 tracking-tight uppercase">All Categories</h2>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{allCategories.length} Items Found</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                aria-label="Close categories overlay"
                className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-4 sm:px-5 py-3 bg-gray-50/50 border-b border-gray-100">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search categories"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all"
                />
              </div>
            </div>

            {/* Flat Grid of Circles */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-8">
                {filteredCategories.map((cat, idx) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => {
                      commerce.setCategoryFilter(cat.name);
                      commerce.setSearchQuery("");
                      onClose();
                      navigate(`/shop?category=${cat.slug}`);
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(idx * 0.01, 0.5) }}
                    className="group flex flex-col items-center gap-3 cursor-pointer"
                  >
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full p-1 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-50 group-hover:shadow-emerald-500/20 group-hover:border-emerald-200 transition-all duration-300">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-black text-[#004a8d] group-hover:text-emerald-600 transition-colors text-center uppercase tracking-tight leading-tight px-1">
                      {cat.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              {filteredCategories.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No categories found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Scroll to explore all items
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

