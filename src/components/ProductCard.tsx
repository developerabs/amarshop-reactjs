import { Star, ShoppingCart, Heart, Share2, ArrowLeftRight, MessageCircle } from "lucide-react";
import { Product } from "../types";
import { formatPrice, slugify } from "../lib/utils";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useCommerce } from "../context/CommerceContext";
import { useNotifications } from "../context/NotificationContext";
import type { KeyboardEvent, MouseEvent } from "react";
import { cn } from "../lib/utils";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }: ProductCardProps) {
  const navigate = useNavigate();
  const commerce = useCommerce();
  const { addNotification } = useNotifications();
  
  const wishlisted = typeof isWishlisted === "boolean" ? isWishlisted : commerce.isInWishlist(Number(product.id));
  const compared = commerce.isInCompare(Number(product.id));
  
  const addToCart = onAddToCart ?? commerce.addToCart;
  const toggleWishlist = onToggleWishlist ?? commerce.toggleWishlist;

  const handleProductClick = () => {
    const slug = product.slug;
    navigate(`/product/${slug}`);
  };

  const handleShare = async (e: MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/product/${product.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.name} at AmarShop!`,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      addNotification({
        type: "success",
        title: "Link Copied",
        message: "Product link copied to clipboard!"
      });
    }
  };

  const handleInquire = (e: MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`Hi AmarShop, I'm interested in ${product.name} (${product.id}). Can you provide more details?`);
    window.open(`https://wa.me/8801700000000?text=${message}`, '_blank');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleProductClick();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={handleProductClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] shadow-sm cursor-pointer relative"
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 overflow-hidden bg-gray-50">
        <img
          src={product.thumbnail ?? product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Discount Badge */}
        {((product as any).discountAmount ?? 0) > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
              {(product as any).discountType === "percentage"
                ? `-${(product as any).discountAmount}%`
                : `-৳${(product as any).discountAmount}`}
            </span>
          </div>
        )}

        {/* New Tag */}
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 translate-y-7">
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-wider">
              New
            </span>
          </div>
        )}

        {/* Top Right Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); commerce.toggleWishlist(Number(product.id)); }}
            className={cn(
              "p-2.5 rounded-full backdrop-blur-md transition-all shadow-xl border border-white/20",
              wishlisted ? "bg-pink-600 text-white" : "bg-white/90 text-gray-900 hover:bg-pink-50 hover:text-pink-600"
            )}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("w-4 h-4", wishlisted && "fill-current")} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); commerce.toggleCompareItem(Number(product.id)); }}
            className={cn(
              "p-2.5 rounded-full backdrop-blur-md transition-all shadow-xl border border-white/20",
              compared ? "bg-emerald-600 text-white" : "bg-white/90 text-gray-900 hover:bg-emerald-50 hover:text-emerald-600"
            )}
            aria-label={compared ? "Remove from comparison" : "Add to comparison"}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <button 
            onClick={handleShare}
            aria-label={`Share ${product.name}`}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-gray-900 hover:bg-blue-50 hover:text-blue-600 shadow-xl border border-white/20 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{product.category}</p>
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 h-10 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            {/* salePrice may not exist on Product type; fallback to product.price */}
            <span className="text-xl font-black text-gray-900">{formatPrice((product as any).sale_price ?? product.price)}</span>
                    <span className="text-xs text-gray-400 line-through font-medium">{formatPrice(product.price)}</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-[10px] font-bold text-yellow-700">{product.rating}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              commerce.addToCart(Number(product.id));
            }}
            aria-label={`Add ${product.name} to cart`}
            className="col-span-1 flex items-center justify-center py-2.5 rounded-xl bg-gray-50 text-gray-900 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95 border border-gray-100"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick();
            }}
            className="col-span-4 py-2.5 rounded-xl bg-gray-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-md shadow-gray-200"
          >
            View Details
          </button>
        </div>
        
        {/* WhatsApp Inquiry */}
        <button 
          onClick={handleInquire}
          className="w-full py-2 flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/30 text-emerald-700 font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-50 transition-all group/inq"
        >
          <MessageCircle className="w-3.5 h-3.5 transition-transform group-hover/inq:scale-110" />
          Inquire Now
        </button>
      </div>
    </motion.div>
  );
}
