import { useRef } from "react";
import { motion } from "motion/react";
import { ChevronRight, ChevronLeft, Calendar, User } from "lucide-react";
import { BLOG_POSTS } from "../data/mockData";

export default function BlogSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-4 sm:py-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter uppercase">
            <span className="text-emerald-600">Blog</span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
              <button 
                onClick={() => scroll("left")}
                className="p-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => scroll("right")}
                className="p-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all">
              View All
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {BLOG_POSTS.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[calc(50%-0.5rem)] sm:min-w-[calc(50%-0.75rem)] md:min-w-[calc(33.33%-1rem)] snap-start group flex flex-col bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
            >
              <div className="relative h-32 sm:h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/90 backdrop-blur-sm text-emerald-600 text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3 text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 h-3" />
                    <span className="hidden xs:inline">{post.date}</span>
                    <span className="xs:hidden">{post.date.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-2.5 h-2.5 sm:w-3 h-3" />
                    <span className="line-clamp-1">{post.author.split(' ')[0]}</span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-lg font-black text-gray-900 mb-1 sm:mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                
                <p className="hidden sm:block text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto">
                  <button className="text-[9px] sm:text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 group/btn">
                    Read More
                    <ChevronRight className="w-2.5 h-2.5 sm:w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
