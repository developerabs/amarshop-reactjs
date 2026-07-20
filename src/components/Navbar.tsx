import { Search, ShoppingCart, User, Menu, Heart, Phone, Globe, X, ChevronRight, ShoppingBag, Smartphone, Home, Utensils, Baby, Tv, Watch, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn, formatPrice } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { HIERARCHICAL_CATEGORIES } from "../data/categories";
import { Link, useNavigate } from "react-router-dom";
import { useCommerce } from "../context/CommerceContext";
import { useSettings } from "../context/SettingsContext";
import api from "../services/api";

const MOBILE_NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Flash Deal", href: "/flash-deal" },
  { name: "All Products", href: "/allproducts" },
  { name: "Seller Shop", href: "/seller-shop" },
  { name: "Compare", href: "/compare" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact Us", href: "/contact" },
];
type Settings = {
  site_name?: string;
  site_logo?: string;
  site_phone?: string;
  free_shipping_amount?: number;
};
type SearchResult = {
  categories: { 
    id: string; 
    name: string 
    slug: string
    image?: string
  }[];
  brands: {
    id: string;
    name: string;
    slug: string;
    image?: string;
  }[];
  products: {
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
  }[];
};

export default function Navbar({ onCartClick, onWishlistClick, onProfileClick }: { onCartClick?: () => void, onWishlistClick?: () => void, onProfileClick?: () => void }) {
  const commerce = useCommerce();
  const { cartCount, cartTotal, wishlistCount } = commerce;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'categories'>('menu');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult>({ categories: [], brands: [], products: [] });
  const navigate = useNavigate();

  const categories = ["All Categories", "Fashion", "Electronics", "Home", "Beauty", "Groceries"];

  const handleSearch = () => {
    const params = new URLSearchParams();
    const query = searchQuery.trim();
    if (query) params.set("q", query);
    if (selectedCategory !== "All Categories") params.set("category", selectedCategory);
    navigate(params.toString() ? `/search?${params.toString()}` : "/search");
    setIsSearchFocused(false);
  };
  
  const { settings } = useSettings() as { settings?: Settings };
  useEffect(() => {
    const searchResults = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults({ categories: [], brands: [], products: [] });
        return;
      }
      try {
        const response = await api.get(`/home/search-all?search=${encodeURIComponent(searchQuery.trim())}`);
        if (response.data.success) {
          setSearchResults(response.data.data || { categories: [], brands: [], products: [] });
        }
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      }
    };
    searchResults();
  }, [searchQuery]);

  return (
    <>
      {/* Top Announcement Bar - Not sticky, hidden on mobile */}
      <div className="hidden md:block bg-gray-900 text-white py-1.5 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[9px] sm:text-[10px] font-bold tracking-[0.1em] uppercase">
          <div className="flex items-center gap-3 sm:gap-6">
            {settings?.site_phone && (
              <span className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer">
                <Phone className="w-2.5 h-2.5 text-emerald-400" />
                {settings?.site_phone}
              </span>
            )}
            {settings?.free_shipping_amount && settings?.free_shipping_amount > 0 && (
              <span className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer">
                <Globe className="w-2.5 h-2.5 text-emerald-400" />
                Free Shipping over {settings?.free_shipping_amount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-4 text-gray-400">
              <button className="hover:text-white transition-colors">Track Order</button>
              <button className="hover:text-white transition-colors">Help Center</button>
            </div>
            <div className="hidden sm:block h-2.5 w-[1px] bg-white/10" />
            <button className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-black">
              <span className="sm:hidden">Track Order</span>
              <span className="hidden sm:inline">BN</span>
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50">
        {/* Main Navbar */}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-20 gap-4 sm:gap-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">
                <img src={settings?.site_logo ?? ''} alt={settings?.site_name ?? ''} className="h-8 sm:h-12 w-1/2"/>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <div className="flex items-center w-full bg-gray-50 border border-gray-100 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-[#0056b3]/10 focus-within:border-[#0056b3]/30 transition-all shadow-sm">
                {/* Custom Category Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex items-center gap-2 px-4 border-r border-gray-200 bg-gray-50/50 h-12 text-[11px] font-bold text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap uppercase tracking-wider"
                  >
                    {selectedCategory}
                    <ChevronRight className={cn("w-3 h-3 transition-transform", isCategoryDropdownOpen ? "rotate-90" : "rotate-0")} />
                  </button>
                  
                  <AnimatePresence>
                    {isCategoryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[60]"
                      >
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors",
                              selectedCategory === cat ? "text-[#0056b3] bg-blue-50" : "text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="I'm searching for..."
                    className="w-full bg-transparent py-3 pl-4 pr-10 text-sm outline-none text-gray-900 placeholder:text-gray-400"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button 
                  onClick={handleSearch} 
                  aria-label="Search"
                  className="bg-[#0056b3] text-white px-6 h-12 hover:bg-[#004494] transition-colors flex items-center gap-2 group"
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline text-[11px] font-black uppercase tracking-widest">Search</span>
                </button>
              </div>
              
              {/* Quick Search Suggestions */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-50"
                  >
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Popular Searches</p>
                        <div className="flex flex-wrap gap-2">
                          {searchResults.products.map(product => (
                            <button
                              key={product.id}
                              onClick={() => {
                                setSearchQuery(product.name);
                                setIsSearchFocused(false);
                                navigate(`/search?q=${encodeURIComponent(product.name)}`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-gray-50 text-[11px] font-bold text-gray-600 hover:bg-blue-50 hover:text-[#0056b3] transition-all"
                            >
                              {product.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Recent Views</p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 animate-pulse" />
                          <div className="w-12 h-12 rounded-lg bg-gray-100 animate-pulse" />
                          <div className="w-12 h-12 rounded-lg bg-gray-100 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={onWishlistClick}
                aria-label={`Wishlist, ${wishlistCount} items`}
                className="group flex flex-col items-center gap-1 text-gray-500 hover:text-emerald-600 transition-all"
              >
                <div className="relative">
                  <Heart className="w-6 h-6 transition-transform group-hover:scale-110" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white shadow-lg">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Wishlist</span>
              </button>
              
              <button 
                onClick={onProfileClick}
                aria-label="Account"
                className="group flex flex-col items-center gap-1 text-gray-500 hover:text-emerald-600 transition-all"
              >
                <User className="w-6 h-6 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Account</span>
              </button>
              
              <button 
                onClick={onCartClick}
                aria-label={`Cart, ${cartCount} items, total ${formatPrice(cartTotal)}`}
                className="group relative flex flex-col items-center gap-1 text-gray-900 hover:text-emerald-600 transition-all"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{formatPrice(cartTotal)}</span>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-1">
              <button 
                aria-label="Track Order"
                className="p-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Truck className="w-5 h-5" />
              </button>
              <a 
                href="tel:+8801234567890"
                aria-label="Call Us"
                className="p-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Toggle Menu"
                className="text-gray-900 p-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Dedicated Row */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-[#0056b3]/10 focus-within:border-[#0056b3]/30 transition-all shadow-sm">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-transparent py-2 pl-10 pr-10 text-sm outline-none text-gray-900 placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button onClick={handleSearch} className="bg-[#0056b3] text-white px-4 py-2.5 hover:bg-[#004494] transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="text-lg font-black text-gray-900 tracking-tighter">
                  Amar<span className="text-emerald-600">Shop</span>
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs for Menu and Categories */}
              <div className="flex p-1.5 bg-gray-50/50 mx-4 mt-4 rounded-xl border border-gray-100">
                <button
                  onClick={() => setActiveTab('menu')}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg",
                    activeTab === 'menu' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Menu
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg",
                    activeTab === 'categories' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Categories
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-4">
                {activeTab === 'menu' ? (
                  <div className="space-y-0.5">
                    {MOBILE_NAV_LINKS.map(link => (
                      <button
                        key={link.name}
                        onClick={() => {
                          navigate(link.href);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-between w-full py-2.5 px-2 text-xs font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-all"
                      >
                        {link.name}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      </button>
                    ))}
                    <div className="pt-4 mt-2 border-t border-gray-50">
                      <p className="px-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Account</p>
                      {['Profile', 'Orders', 'Wishlist'].map(item => (
                        <button 
                          key={item} 
                          onClick={() => {
                            if (item === 'Wishlist') {
                              onWishlistClick?.();
                              setIsMobileMenuOpen(false);
                            } else if (item === 'Profile') {
                              onProfileClick?.();
                              setIsMobileMenuOpen(false);
                            }
                          }}
                          className="flex items-center justify-between w-full py-2.5 px-2 text-xs font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-all"
                        >
                          {item}
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {HIERARCHICAL_CATEGORIES.map(cat => (
                      <div key={cat.name} className="space-y-0.5">
                        <button
                          onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                          className={cn(
                            "flex items-center justify-between w-full py-2.5 px-2 text-xs font-bold rounded-lg transition-all",
                            expandedCategory === cat.name ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <cat.icon className={cn("w-3.5 h-3.5", expandedCategory === cat.name ? "text-emerald-600" : "text-gray-400")} />
                            {cat.name}
                          </span>
                          {cat.subCategories && (
                            <ChevronRight className={cn("w-3.5 h-3.5 transition-transform duration-200", expandedCategory === cat.name && "rotate-90")} />
                          )}
                        </button>

                        {/* Sub Categories Accordion */}
                        <AnimatePresence>
                          {cat.subCategories && expandedCategory === cat.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden ml-4 pl-2 border-l border-emerald-100 space-y-0.5"
                            >
                              {cat.subCategories.map(sub => (
                                <div key={sub.name}>
                                  <button
                                    onClick={() => setExpandedSubCategory(expandedSubCategory === sub.name ? null : sub.name)}
                                    className={cn(
                                      "flex items-center justify-between w-full py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                                      expandedSubCategory === sub.name ? "text-emerald-600" : "text-gray-500"
                                    )}
                                  >
                                    {sub.name}
                                    <ChevronRight className={cn("w-3 h-3 transition-transform duration-200", expandedSubCategory === sub.name && "rotate-90")} />
                                  </button>

                                  {/* Child Categories Accordion */}
                                  <AnimatePresence>
                                    {expandedSubCategory === sub.name && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden pb-2 space-y-0.5"
                                      >
                                        {sub.childCategories.map(child => (
                                          <a
                                            key={child}
                                            href="#"
                                            className="block py-1.5 pl-2 text-[11px] font-bold text-gray-400 hover:text-emerald-600 transition-colors"
                                          >
                                            {child}
                                          </a>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100">
                <button className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-500/10 active:scale-95 transition-all uppercase tracking-widest">
                  Sign In
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}



