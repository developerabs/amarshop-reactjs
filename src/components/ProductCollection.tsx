import { useRef } from "react";
import { Product } from "../types";
import ProductCard from "./ProductCard";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCollectionProps {
  title: string;
  highlight?: string;
  products: Product[];
  bgColor?: string;
}

export default function ProductCollection({ title, highlight, products, bgColor = "bg-gray-50/50" }: ProductCollectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className={`py-8 sm:py-12 ${bgColor} overflow-hidden`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-[13px] ml-0 -mt-[27px]">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter">
            {title} {highlight && <span className="text-emerald-600">{highlight}</span>}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="p-1.5 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-1.5 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-3 sm:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="min-w-[calc(50%-0.5rem)] sm:min-w-[280px] snap-start"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/allproducts')}
            className="px-8 py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-all shadow-xl shadow-black/10"
          >
            Explore All Products
          </motion.button>
        </div>
      </div>
    </section>
  );
}

