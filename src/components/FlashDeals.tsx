import { useState, useEffect } from "react";
import { Zap, ChevronRight, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { formatPrice } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { useCommerce } from "../context/CommerceContext";
import api from "../services/api";

type FlashProduct = {
  thumbnail?: string;
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
};

export default function FlashDeals() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });
  const [flashProducts, setFlashProducts] = useState<FlashProduct[]>([]);

  const navigate = useNavigate();
  const { addToCart } = useCommerce();

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        const response = await api.get('/home/products?type=flash-deals');
        if (response.data.success) {
          const deals = response.data.data.products.map((p: { id: number; name: string; slug: string; price: string; sale_price: string; total_stock: number; images: string[]; category_name?: string; discount_amount: string; discount_type: string; thumbnail?: string }) => ({
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
          }));
          setFlashProducts(deals);
        }
      } catch (error) {
        console.error('Failed to fetch flash deals:', error);
      }
    };

    fetchFlashDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-5xl shadow-luxury border border-gray-100 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-4 bg-red-50 text-red-600 rounded-full">
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-xs font-black uppercase tracking-widest">Limited Time Offer</span>
            </div>
            <h2 className="text-3xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Flash <span className="text-emerald-600">Deals</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5  relative z-10">
          {flashProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -8 }}
              className="bg-gray-50 rounded-3xl p-5 group border border-transparent hover:border-emerald-100 hover:bg-white transition-all duration-500 hover:shadow-xl"
            >
              <div 
                onClick={() => navigate(`/product/${product.slug}`)}
                className="aspect-square rounded-2xl overflow-hidden mb-5 relative cursor-pointer"
              >
                <img 
                  src={product.thumbnail ?? product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                />
                {product.discountAmount > 0 && (
                <div className="absolute top-3 right-3">
                  <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
                    {product.discountType === "percentage"
                    ? `-${product.discountAmount}% OFF`
                    : `-৳${product.discountAmount} OFF`}
                  </span>
                </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{product.category}</p>
                  <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-gray-900">{formatPrice(product.salePrice)}</span>
                    <span className="text-xs text-gray-400 line-through font-medium">{formatPrice(product.price)}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(Number(product.id))}
                    className="p-3 bg-gray-900 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-90 shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* View All Card - Styled as a companion grid item */}
          <div className="bg-emerald-50/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-emerald-100 hover:bg-emerald-50 transition-colors group cursor-pointer" onClick={() => navigate('/flash-deal')}>
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-xl mb-4">
              <ChevronRight className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">View All Deals</h4>
            <p className="text-[10px] font-bold text-emerald-600 mt-2">Special Offers Ending Soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
