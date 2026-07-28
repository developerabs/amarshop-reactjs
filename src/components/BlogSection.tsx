import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  created_at: string;
}

type BlogsApiResponse = {
  data?: {
    blogs?: BlogPost[];
  };
};

export default function BlogSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get<BlogsApiResponse>("/blog/posts");
        setBlogs(response.data?.data?.blogs ?? []);
      } catch (error) {
        console.error("Failed to fetch homepage blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-4 sm:py-6 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
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
            <button
              onClick={() => navigate("/blogs")}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all"
            >
              View All
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <motion.article
                  key={`blog-skeleton-${idx}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-[calc(50%-0.5rem)] sm:min-w-[calc(50%-0.75rem)] md:min-w-[calc(33.33%-1rem)] snap-start group flex flex-col bg-gray-50 rounded-2xl overflow-hidden border border-gray-100"
                >
                  <div className="h-32 sm:h-48 bg-gray-200 animate-pulse" />
                  <div className="p-3 sm:p-5 flex-1 flex flex-col">
                    <div className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loading...</div>
                    <h3 className="text-xs sm:text-lg font-black text-gray-900 mt-2">Loading article title...</h3>
                    <p className="hidden sm:block text-sm text-gray-500 mt-2">Loading article preview...</p>
                  </div>
                </motion.article>
              ))
            : blogs.map((post, idx) => (
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
                      onClick={() => navigate(`/blogs/${post.slug}`)}
                      src={post.thumbnail ?? ""}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
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
                        <span>{new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                      </div>
                    </div>

                    <h3 onClick={() => navigate(`/blogs/${post.slug}`)} className="text-xs sm:text-lg font-black text-gray-900 mb-1 sm:mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight cursor-pointer">
                      {post.content.replace(/<[^>]+>/g, "").slice(0, 30) + "..."}
                    </h3>

                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          post.content.replace(/<[^>]+>/g, "").slice(0, 80) + "...",
                      }}
                    />

                    <div className="mt-auto">
                      <button
                        onClick={() => navigate(`/blogs/${post.slug}`)}
                        className="text-[9px] sm:text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 group/btn cursor-pointer"
                      >
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
