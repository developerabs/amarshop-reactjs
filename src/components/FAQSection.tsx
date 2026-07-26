import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
};

type FaqApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    faqs?: FaqItem[];
  };
};

export default function FAQSection() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      const endpoints = ["/faqs", "/faq", "/faq/list"];

      try {
        let loadedFaqs: FaqItem[] = [];

        for (const endpoint of endpoints) {
          try {
            const response = await api.get<FaqApiResponse>(endpoint);
            loadedFaqs = response.data?.data?.faqs ?? [];
            if (loadedFaqs.length > 0) {
              break;
            }
          } catch {
            // Try next endpoint variant.
          }
        }

        const sortedFaqs = [...loadedFaqs].sort((a, b) => a.sort_order - b.sort_order);
        setFaqs(sortedFaqs.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-emerald-50 rounded-xl mb-4">
            <HelpCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter uppercase mb-4">
            Frequently Asked <span className="text-emerald-600">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
            Everything you need to know about our products, shipping, and policies. Can't find the answer? Contact our support team.
          </p>
        </div>

        <div className="space-y-3">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <motion.div
                  key={`faq-skeleton-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border transition-all duration-300 bg-gray-50 border-gray-100"
                >
                  <div className="w-full flex items-center justify-between p-4 sm:p-5 text-left">
                    <span className="text-sm sm:text-base font-bold text-gray-600">Loading question...</span>
                    <div className="flex-shrink-0 ml-4 p-1 rounded-full bg-white text-gray-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-sm sm:text-base text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
                    Loading answer...
                  </div>
                </motion.div>
              ))
            : faqs.map((faq, idx) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className={cn(
                    "rounded-2xl border transition-all duration-300",
                    openId === faq.id
                      ? "bg-emerald-50/30 border-emerald-200 shadow-sm"
                      : "bg-gray-50 border-gray-100 hover:border-gray-200"
                  )}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left group"
                  >
                    <span
                      className={cn(
                        "text-sm sm:text-base font-bold transition-colors",
                        openId === faq.id ? "text-emerald-700" : "text-gray-900 group-hover:text-emerald-600"
                      )}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={cn(
                        "flex-shrink-0 ml-4 p-1 rounded-full transition-all duration-300",
                        openId === faq.id
                          ? "bg-emerald-600 text-white rotate-180"
                          : "bg-white text-gray-400 group-hover:text-emerald-600"
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-emerald-100/50 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 mb-4">Still have questions?</p>
          <button onClick={() => { navigate('/contact')}} className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-gray-200">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
