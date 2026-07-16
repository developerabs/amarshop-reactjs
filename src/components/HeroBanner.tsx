import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
  button_text: string;
  button_link: string;
}

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await api.get("/home/sliders");
        setSlides(response.data.data.sliders);
      } catch (error) {
        console.error("Failed to fetch slides:", error);
      }
    };
    fetchSlides();
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (slides.length === 0) {
    return <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-200 rounded-2xl sm:rounded-3xl" />;
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden group touch-none rounded-2xl sm:rounded-3xl shadow-luxury">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 md:px-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-xl space-y-4 sm:space-y-6"
            >
              <h2 className="text-white text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-xl font-display">
                {slides[currentSlide].title}
              </h2>
              <p className="text-white/90 text-sm sm:text-lg md:text-xl font-medium max-w-md drop-shadow-lg">
                {slides[currentSlide].description}
              </p>
              <div className="pt-4 sm:pt-6 flex gap-4">
                <button 
                  onClick={() => navigate(slides[currentSlide].button_link)}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-2 group/btn"
                >
                  {slides[currentSlide].button_text}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-6 z-20 pointer-events-none">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 border border-white/20 pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 border border-white/20 pointer-events-auto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-8 left-8 sm:left-16 flex items-center gap-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="group relative h-8 w-1 flex items-center justify-center"
          >
            <div className={cn(
              "w-1 transition-all duration-500 rounded-full",
              currentSlide === idx ? "h-8 bg-white" : "h-4 bg-white/30 group-hover:bg-white/50"
            )} />
            {currentSlide === idx && (
              <div className="absolute left-4 whitespace-nowrap text-[10px] font-black text-white uppercase tracking-widest">
                0{idx + 1}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}



