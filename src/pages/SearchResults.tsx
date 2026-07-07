import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { filterProducts } from "../lib/dataService";
import ProductCard from "../components/ProductCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get("q")?.trim() ?? "";
  const category = query.get("category")?.trim() ?? "";

  const results = useMemo(
    () => filterProducts({ query: searchTerm, category }),
    [searchTerm, category]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchTerm, category]);

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

        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {results.map((product) => (
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
