import HeroBanner from "../components/HeroBanner";
import CategorySidebar from "../components/CategorySidebar";
import CategoryList from "../components/CategoryList";
import ProductGrid from "../components/ProductGrid";
import BlogSection from "../components/BlogSection";
import BrandsSection from "../components/BrandsSection";
import ClientReviews from "../components/ClientReviews";
import FAQSection from "../components/FAQSection";
import Newsletter from "../components/Newsletter";
import SEO from "../components/SEO";
import FlashDeals from "../components/FlashDeals";
import api from "../services/api";
import { useEffect, useState } from "react";

interface HomeProps {
  onCategorySeeMore: () => void;
  onAddToCart?: (productId: string) => void;
}

export default function Home({ onCategorySeeMore, onAddToCart }: HomeProps) {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.get("/home/banners");
        setBanners(response.data.data.banners);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanners();
  }, []);
  
  return (
    <main className="min-h-screen bg-[#FBFBFB]">
      <SEO 
        title="AmarShop | Bangladesh's Modern E-commerce Platform" 
        description="Experience the finest selection of jewelry, traditional attire, and electronics at AmarShop. Shop our latest Eid Collection 2026."
      />
      {/* Hero Section with Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex gap-6">
          <CategorySidebar onViewAll={onCategorySeeMore} />
          <div className="flex-1 min-w-0">
            <HeroBanner />
          </div>
        </div>
      </section>
      
      <div className="space-y-2 sm:space-y-4">
        <CategoryList onSeeMoreClick={onCategorySeeMore} />

        {/* Dual Promotional Banners - Side by Side */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {banners.slice(0, 2).map((banner: any) => (
              <div key={banner.id} className="relative h-24 sm:h-48 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </section>

        <FlashDeals />

        <ProductGrid title="Trending" highlightWord="Now" type="trending" onAddToCart={onAddToCart} />
        <ProductGrid title="Daily" highlightWord="Offer" type="daily-offer" onAddToCart={onAddToCart} />
        <ProductGrid title="Best" highlightWord="Deals" type="best-deal" onAddToCart={onAddToCart} />
        <ProductGrid title="Top" highlightWord="Sale" type="top-sale" onAddToCart={onAddToCart} />
        <ProductGrid title="New" highlightWord="Arrivals" type="new-arraivals" onAddToCart={onAddToCart} />
        
        <BlogSection />
        <BrandsSection />
        <ClientReviews />
        <FAQSection />
        <Newsletter />
      </div>
    </main>
  );
}
