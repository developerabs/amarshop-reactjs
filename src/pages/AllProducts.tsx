import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Filter, SlidersHorizontal, ChevronDown, Grid, List, X } from "lucide-react";
import SEO from "../components/SEO";
import { cn } from "../lib/utils";
import api from "../services/api";

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Customer Rating", value: "rating" },
];

const PRICE_RANGES = [
  { label: "Under ৳1,000", min: 0, max: 1000 },
  { label: "৳1,000 - ৳5,000", min: 1000, max: 5000 },
  { label: "৳5,000 - ৳20,000", min: 5000, max: 20000 },
  { label: "Over ৳20,000", min: 20000, max: Infinity },
];

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  flashPrice: number;
  category: string;
  images: string[];
  image: string;
  available: number;
  salePrice: number;
  discountAmount: number;
  discountType: string;
  rating: number;
  reviews: number;
};

export default function AllProducts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState<{label: string, min: number, max: number} | null>(null);
 
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categorySlug = urlParams.get("category");
    if (categorySlug) {
      setSelectedCategorySlug(categorySlug);
    }
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");

            if (response.data.success) {
                setCategories(response.data.data.categories);
            }
        } catch (error) {
            console.error(error);
        }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchBrands = async () => {
        try {
            const response = await api.get("/brands");

            if (response.data.success) {
                setBrands(response.data.data.brands);
            }
        } catch (error) {
            console.error(error);
        }
    };

    fetchBrands();
  }, []);
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const params: any = {};

        if (selectedCategory) {
            params.category_id = selectedCategory;
        } 
        if (selectedCategorySlug) {
            params.category_slug = selectedCategorySlug;
        }

        if (selectedBrands.length) {
            params.brand_id = selectedBrands[0];
        }

        if (priceRange) {
            params.min_price = priceRange.min;

            if (priceRange.max !== Infinity) {
                params.max_price = priceRange.max;
            }
        }

        switch (sortBy) {
            case "newest":
                params.sort_by = "created_at";
                break;

            case "price-asc":
                params.sort_by = "sale_price";
                params.order = "asc";
                break;

            case "price-desc":
                params.sort_by = "sale_price";
                params.order = "desc";
                break;
            case "rating":
                params.sort_by = "rating";
                params.order = "desc";
                break;

            default:
                break;
        }
        
        const response = await api.get("/products/all-products", { params });
        // console.log("Fetched products:", response);
        if (response.data.success) {
          const featchProducts = response.data.data.products.data.map((p: { id: number; name: string; slug: string; price: string; sale_price: string; total_stock: number; images: string[]; category_name?: string; discount_amount: string; discount_type: string; rating?: string | number; reviews?: string | number; thumbnail: string; }) => ({
            ...p,
            id: String(p.id),
            slug: p.slug,
            name: p.name,
            price: parseFloat(p.price),
            salePrice: parseFloat(p.sale_price),
            flashPrice: Math.floor(parseFloat(p.price) * 0.8),
            category: p.category_name,
            image: p.images?.[0] ?? '',
            thumbnail: p.thumbnail,
            available: p.total_stock,
            discountAmount: parseFloat(p.discount_amount),
            discountType: p.discount_type,
            rating: typeof p.rating === 'string' ? parseFloat(p.rating) : (p.rating ?? 0),
            reviews: typeof p.reviews === 'string' ? parseInt(String(p.reviews), 10) : (p.reviews ?? 0),
          }));
          setAllProducts(featchProducts);
        }
      } catch (error) {
        console.error("Failed to fetch all products:", error);
      }
    };

    fetchAllProducts();
  }, [selectedCategory, selectedCategorySlug, selectedBrands, priceRange, sortBy]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedCategorySlug(null);
    setSelectedBrands([]);
    setPriceRange(null);
  };

  return (
    <main className="min-h-screen bg-[#FBFBFB] pb-24 pt-28">
      <SEO 
        title="Explore Collection | AmarShop" 
        description="Browse our curated collection of premium fashion, electronics, and lifestyle products." 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">Curation 2026</p>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight font-display italic">
              The <span className="text-emerald-600">Collection</span>
            </h1>
            <p className="text-sm text-gray-500 font-medium">Discovering {allProducts.length} premium artifacts across Bangladesh.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm font-black text-[10px] uppercase tracking-widest text-gray-600 hover:text-emerald-600 transition-all"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="hidden sm:flex items-center bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
              <button 
                onClick={() => setViewType("grid")}
                className={cn("p-2 rounded-xl transition-all", viewType === "grid" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600")}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewType("list")}
                className={cn("p-2 rounded-xl transition-all", viewType === "list" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-100 rounded-2xl px-6 py-3 pr-10 shadow-sm font-black text-[10px] uppercase tracking-widest text-gray-600 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-emerald-600 transition-colors" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-10 sticky top-32">
            <div className="space-y-8">
              {/* Category Filter */}
              <div>
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                  Categories
                  <span className="w-8 h-[1px] bg-emerald-600/20" />
                </h4>
                <div className="space-y-2">
                  {categories.map(category  => (
                    <button 
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(
                          selectedCategory === category.id
                              ? null
                              : category.id
                        );
                        setSelectedCategorySlug(null);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest py-2 px-3 rounded-xl transition-all",
                        (selectedCategory === category.id) 
                          ? "bg-gray-900 text-white shadow-xl translate-x-2" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-emerald-600"
                      )}
                    >
                      {category.name}
                      <span className="text-[8px] opacity-40 font-black">12</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                  Price Range
                  <span className="w-8 h-[1px] bg-emerald-600/20" />
                </h4>
                <div className="space-y-3">
                  {PRICE_RANGES.map(range => (
                    <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="price" 
                          className="sr-only"
                          checked={priceRange?.label === range.label}
                          onChange={() => setPriceRange(range as any)}
                        />
                        <div className={cn(
                          "w-5 h-5 rounded-lg border-2 transition-all",
                          priceRange?.label === range.label ? "border-emerald-600 bg-emerald-600 shadow-lg shadow-emerald-200 scale-110" : "border-gray-200 group-hover:border-emerald-400"
                        )}>
                          {priceRange?.label === range.label && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", priceRange?.label === range.label ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600")}>
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                  Featured Brands
                  <span className="w-8 h-[1px] bg-emerald-600/20" />
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {brands.map(brand => {
                    return (
                      <button 
                        key={brand.id}
                        onClick={() => {
                          if (selectedBrands.includes(brand.id)) {

                              setSelectedBrands(
                                  selectedBrands.filter(id => id !== brand.id)
                              );

                          } else {

                              setSelectedBrands([brand.id]);

                          }
                        }}
                        className={cn(
                          "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all text-center",
                          selectedBrands.includes(brand.id) 
                            ? "bg-emerald-50 border-emerald-600 text-emerald-600 shadow-sm" 
                            : "bg-white border-gray-100 text-gray-400 hover:border-emerald-200"
                        )}
                      >
                        {brand.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <button 
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
            >
              <X className="w-4 h-4" />
              Reset All Filters
            </button>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {/* Active Tags */}
            {(selectedCategory || selectedBrands.length > 0 || priceRange) && (
              <div className="flex flex-wrap gap-2 mb-8 animate-in fade-in slide-in-from-top-2">
                <AnimatePresence>
                  {selectedCategory && (
                    <motion.button 
                      initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                      onClick={() => setSelectedCategory(null)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100"
                    >
                      {categories.find(c => c.id === selectedCategory)?.name}
                      <X className="w-3 h-3" />
                    </motion.button>
                  )}
                  {selectedBrands.map(id => {
                    const brand = brands.find(b => b.id === id);
                    if (!brand) return null;
                    return (
                      <motion.button 
                        key={brand.id}
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                        onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand.id))}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100"
                    >
                      {brand.name}
                      <X className="w-3 h-3" />
                    </motion.button>
                  )
                  })}
                  {priceRange && (
                    <motion.button 
                      initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                      onClick={() => setPriceRange(null)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-orange-100"
                    >
                      {priceRange.label}
                      <X className="w-3 h-3" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            )}

            {allProducts.length > 0 ? (
              <div className={cn(
                "grid gap-6 sm:gap-8",
                viewType === "grid" ? "grid-cols-2 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              )}>
                <AnimatePresence mode="popLayout">
                  {allProducts.map((product, idx) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-20 shadow-luxury border border-gray-50 text-center space-y-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <SlidersHorizontal className="w-10 h-10 text-gray-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">No artifacts found.</h3>
                  <p className="text-gray-500 font-medium max-w-xs mx-auto">Try refining your filters or search criteria to discover more products.</p>
                </div>
                <button 
                  onClick={clearFilters}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[101] shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Filters</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Reuse sidebar content here... */}
              <div className="space-y-10">
                {/* Categories */}
                <div>
                  <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button 
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                        className={cn(
                          "w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest py-2 px-3 rounded-xl transition-all",
                          (selectedCategory === category.id)
                            ? "bg-gray-900 text-white shadow-xl translate-x-2" 
                            : "text-gray-500 hover:bg-gray-50 hover:text-emerald-600"
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price Filter */}
                <div>
                  <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Price Range</h4>
                  <div className="space-y-3">
                    {PRICE_RANGES.map(range => (
                      <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="price-mobile" 
                            className="sr-only"
                            checked={priceRange?.label === range.label}
                            onChange={() => setPriceRange(range as any)}
                          />
                          <div className={cn(
                            "w-5 h-5 rounded-lg border-2 transition-all",
                            priceRange?.label === range.label ? "border-emerald-600 bg-emerald-600 shadow-lg shadow-emerald-200 scale-110" : "border-gray-200 group-hover:border-emerald-400"
                          )}>
                            {priceRange?.label === range.label && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </div>
                        <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", priceRange?.label === range.label ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600")}>
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Featured Brands</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map(brand => {
                      return (
                        <button 
                          key={brand.id}
                          onClick={() => {
                            if (selectedBrands.includes(brand.id)) {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand.id));
                            } else {
                              setSelectedBrands([...selectedBrands, brand.id]);
                            }
                          }}
                          className={cn(
                            "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all text-center",
                            selectedBrands.includes(brand.id) 
                              ? "bg-emerald-50 border-emerald-600 text-emerald-600 shadow-sm" 
                              : "bg-white border-gray-100 text-gray-400 hover:border-emerald-200"
                          )}
                        >
                          {brand.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-3">
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
                >
                  Show Results ({allProducts.length})
                </button>
                <button 
                  onClick={() => { clearFilters(); setIsSidebarOpen(false); }}
                  className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
