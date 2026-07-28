import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, ChevronLeft, Star, Play, X } from "lucide-react";
import api from "../services/api";

type ClientReview = {
  id: number;
  title: string;
  description: string;
  rating: number;
  image: string | null;
  video_link: string | null;
  created_at: string;
};

type ClientReviewsApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    client_reviews?: ClientReview[];
  };
};

export default function ClientReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const endpoints = ["/client-reviews", "/client/reviews"];

      try {
        let loadedReviews: ClientReview[] = [];

        for (const endpoint of endpoints) {
          try {
            const response = await api.get<ClientReviewsApiResponse>(endpoint);
            loadedReviews = response.data?.data?.client_reviews ?? [];
            break;
          } catch {
            // Try next endpoint variant.
          }
        }

        if (loadedReviews.length === 0) {
          console.warn("Client reviews API did not return data from known endpoints.");
        }

        setReviews(loadedReviews);
      } catch (error) {
        console.error("Failed to fetch client reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-4 sm:py-6 bg-gray-50/50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter uppercase">
            Client <span className="text-emerald-600">Reviews</span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <button 
                onClick={() => scroll("left")}
                className="p-1.5 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scroll("right")}
                className="p-1.5 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <motion.div
                  key={`review-skeleton-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-[280px] sm:min-w-[350px] md:min-w-[400px] snap-start group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  <div className="aspect-video bg-gray-200 animate-pulse" />
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900">Loading...</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 italic">Loading client feedback...</p>
                  </div>
                </motion.div>
              ))
            : reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-[280px] sm:min-w-[350px] md:min-w-[400px] snap-start group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    <div className="relative w-full h-full">
                      {review.image ? (
                        <img
                          src={review.image}
                          alt={review.title}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-emerald-50 to-white" />
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 disabled:opacity-50"
                          disabled={!review.video_link}
                          aria-label="Play client review video"
                        >
                          <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1" />
                        </button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-white text-sm sm:text-base font-bold line-clamp-1">{review.title}</h3>
                      </div>
                    </div>
                  </div> */}
                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  {playingId === review.id ? (
                    <div className="absolute inset-0">
                      <iframe
                        src={review.video_link}
                        title={review.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingId(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-30"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="relative w-full h-full cursor-pointer"
                      onClick={() => setPlayingId(review.id)}
                    >
                      <img
                        src={review.image}
                        alt={review.title}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-white text-sm sm:text-base font-bold line-clamp-1">
                          {review.title}
                        </h3>
                      </div>
                    </div>
                  )}
                </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900">
                        {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 italic">{`"${review.description}"`}</p>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
