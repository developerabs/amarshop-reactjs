import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { filterProducts } from "../lib/dataService";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
type SearchResult = {
  categories: { 
    id: string; 
    name: string 
    slug: string
    image?: string
  }[];
  brands: {
    id: string;
    name: string;
    slug: string;
    image?: string;
  }[];
  products: {
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
    rating: number;
    reviews: number;
  }[];
};
export default function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get("q")?.trim() ?? "";
  const category = query.get("category")?.trim() ?? "";
  const [searchResults, setSearchResults] = useState<SearchResult>({ categories: [], brands: [], products: [] });

  const results = useMemo(
    () => filterProducts({ query: searchTerm, category }),
    [searchTerm, category]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchTerm, category]);
  useEffect(() => {
    const searchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults({ categories: [], brands: [], products: [] });
        return;
      }
      try {
        const response = await api.get(`/home/search-all?search=${encodeURIComponent(searchTerm.trim())}`);
        if (response.data.success) {
          setSearchResults(response.data.data || { categories: [], brands: [], products: [] });
        }
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      }
    };
    searchResults();
  }, [searchTerm]);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pt-6">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Search Results</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-2xl">
            Showing results for <span className="font-black text-gray-900">{searchTerm || "all products"}</span>
            {category ? (<> in <span className="font-black text-gray-900">{category}</span></>) : null}
          </p>
        </div>

        {searchResults.products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {searchResults.products.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <h2 className="text-2xl font-black text-gray-900">No products found</h2>
            <p className="mt-3 text-sm text-gray-500">Try a broader search term or browse category collections.</p>
          </div>
        )}
      </div>
    </main>
  );
}
