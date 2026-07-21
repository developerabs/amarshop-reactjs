import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCommerce } from "../context/CommerceContext";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const commerce = useCommerce();
  const wishlistItems = commerce.wishlist;

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
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[110]"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wishlist-drawer-title"
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[340px] md:w-[380px] bg-white z-[120] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h2 id="wishlist-drawer-title" className="text-sm font-black text-gray-900 tracking-tight uppercase">My Wishlist</h2>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{wishlistItems.length} Items Saved</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                aria-label="Close wishlist drawer"
                className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div key={item.id} className="group relative flex gap-3 p-2 rounded-xl bg-white border border-gray-100 hover:border-pink-100 hover:shadow-sm transition-all">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="text-[11px] font-bold text-gray-900 line-clamp-1 leading-tight group-hover:text-pink-600 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">{item.category_name}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-black text-gray-900">৳{item.sale_price}</span>
                        <div className="flex items-center gap-1">
                              <button 
                            onClick={() => commerce.addToCart(Number(item.id))}
                            aria-label={`Add ${item.name} to cart`}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                          >
                            <ShoppingCart className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); commerce.toggleWishlist(Number(item.id)); }}
                            aria-label={`Remove ${item.name} from wishlist`}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-pink-200 mb-4">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">Your wishlist is empty</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                    Save items you love to find them later easily.
                  </p>
                  <button 
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all active:scale-95"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button 
                onClick={() => {
                  wishlistItems.forEach((item) => commerce.addToCart(Number(item.id)));
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-[10px] shadow-lg shadow-emerald-500/10 active:scale-95 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 group hover:bg-emerald-700 disabled:opacity-50"
                disabled={wishlistItems.length === 0}
              >
                Add to cart all Products
                <ShoppingCart className="w-3 h-3 transition-transform group-hover:scale-110" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
