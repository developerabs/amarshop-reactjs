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

interface HomeProps {
  onCategorySeeMore: () => void;
  onAddToCart?: (productId: string) => void;
}

export default function Home({ onCategorySeeMore, onAddToCart }: HomeProps) {
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
            {/* Banner 1 */}
            <div className="relative h-24 sm:h-48 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
              <img
                src="https://picsum.photos/seed/promo1/800/400"
                alt="Promotion 1"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Banner 2 */}
            <div className="relative h-24 sm:h-48 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
              <img
                src="https://picsum.photos/seed/promo2/800/400"
                alt="Promotion 2"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        <FlashDeals />

        <ProductGrid title="Trending" highlightWord="Now" onAddToCart={onAddToCart} />
        <ProductGrid title="Daily" highlightWord="Offer" onAddToCart={onAddToCart} />
        <ProductGrid title="Best" highlightWord="Deals" onAddToCart={onAddToCart} />
        <ProductGrid title="Top" highlightWord="Sale" onAddToCart={onAddToCart} />
        <ProductGrid title="New" highlightWord="Arrivals" onAddToCart={onAddToCart} />
        
        <BlogSection />
        <BrandsSection />
        <ClientReviews />
        <FAQSection />
        <Newsletter />
      </div>
    </main>
  );
}
