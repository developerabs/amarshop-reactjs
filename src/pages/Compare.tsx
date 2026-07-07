import { useEffect } from "react";
import { useCommerce } from "../context/CommerceContext";
import { formatPrice } from "../lib/utils";
import { Star, X, ShoppingCart, ArrowLeftRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

export default function Compare() {
  const { compareItems, toggleCompareItem, getProduct, addToCart } = useCommerce();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const products = compareItems.map(id => getProduct(id)).filter(Boolean);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-28">
      <SEO 
        title="Compare Products | AmarShop" 
        description="Compare your favorite products side-by-side at AmarShop to find the perfect match for your style and budget."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <ArrowLeftRight className="w-6 h-6 text-emerald-600" />
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Compare Products</h1>
          </div>
          <p className="text-gray-500 max-w-2xl">
            Analyze up to 4 items side-by-side to make the most informed luxury choice.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-[2.5rem] bg-white border border-gray-100 p-16 shadow-xl text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowLeftRight className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Your comparison list is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start adding products you love to compare their features and find the best fit for you.
            </p>
            <button 
              onClick={() => navigate('/all-products')}
              className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition-all shadow-lg"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto custom-sidebar-scrollbar">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr>
                    <th className="p-8 w-1/5 text-left border-b border-r border-gray-50 bg-gray-50/50">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Features</span>
                    </th>
                    <AnimatePresence>
                      {products.map((product) => (
                        <motion.th 
                          key={product!.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-8 w-1/5 text-center border-b border-r border-gray-50 relative group"
                        >
                          <button 
                            onClick={() => toggleCompareItem(product!.id)}
                            className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50">
                            <img src={product!.image} alt={product!.name} className="w-full h-full object-cover" />
                          </div>
                          <h3 className="text-sm font-black text-gray-900 line-clamp-2 h-10 mb-2">{product!.name}</h3>
                          <p className="text-xl font-black text-emerald-600">{formatPrice(product!.price)}</p>
                        </motion.th>
                      ))}
                    </AnimatePresence>
                    {/* Add more slots if less than 4 */}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <th key={`empty-${i}`} className="p-8 w-1/5 border-b border-gray-50 bg-gray-50/20">
                        <button 
                          onClick={() => navigate('/all-products')}
                          className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-300 hover:border-emerald-300 hover:text-emerald-500 transition-all bg-white/50 group"
                        >
                          <ArrowLeftRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Add Item</span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Category Row */}
                  <tr>
                    <td className="p-6 border-r border-b border-gray-50 bg-gray-50/30 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</td>
                    {products.map(p => (
                      <td key={p!.id} className="p-6 border-r border-b border-gray-50 text-center text-sm font-semibold text-gray-700">{p!.category}</td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => <td key={i} className="border-b border-gray-50" />)}
                  </tr>
                  {/* Rating Row */}
                  <tr>
                    <td className="p-6 border-r border-b border-gray-50 bg-gray-50/30 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Rating</td>
                    {products.map(p => (
                      <td key={p!.id} className="p-6 border-r border-b border-gray-50 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-bold">{p!.rating}</span>
                          <span className="text-[10px] text-gray-400">({p!.reviews} Reviews)</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => <td key={i} className="border-b border-gray-50" />)}
                  </tr>
                  {/* Availability Row */}
                  <tr>
                    <td className="p-6 border-r border-b border-gray-50 bg-gray-50/30 text-xs font-bold text-gray-500 uppercase tracking-wider">Availability</td>
                    {products.map(p => (
                      <td key={p!.id} className="p-6 border-r border-b border-gray-50 text-center">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${p!.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {p!.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => <td key={i} className="border-b border-gray-50" />)}
                  </tr>
                  {/* Sold Count Row */}
                  <tr>
                    <td className="p-6 border-r border-b border-gray-50 bg-gray-50/30 text-xs font-bold text-gray-500 uppercase tracking-wider">Popularity</td>
                    {products.map(p => (
                      <td key={p!.id} className="p-6 border-r border-b border-gray-50 text-center text-sm font-medium text-gray-600">{p!.soldCount} Items Sold</td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => <td key={i} className="border-b border-gray-50" />)}
                  </tr>
                  {/* Action Row */}
                  <tr>
                    <td className="p-6 border-r border-gray-50 bg-gray-50/30" />
                    {products.map(p => (
                      <td key={p!.id} className="p-8 border-r border-gray-50 text-center">
                        <button 
                          onClick={() => addToCart(p!.id)}
                          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add To Cart
                        </button>
                      </td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => <td key={i} />)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
