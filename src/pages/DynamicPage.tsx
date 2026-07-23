import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../services/api";

interface PageData {
  id: number;
  title: string;
  slug: string | null;
  permalink: string;
  content: string;
  banner: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  created_at: string;
  updated_at: string;
}

export default function DynamicPage() {
  const { pageName } = useParams<{ pageName: string }>();
  const [pageContent, setPageContent] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch page content when pageName changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/pages/${pageName}`)
      .then((response) => {
        console.log("Fetched page content:", response);
        setPageContent(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pageName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-12 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-600">404</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-gray-900">Page not found</h1>
          <p className="mt-4 text-sm text-gray-500">The page you are looking for does not exist, or the link is broken.</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:bg-emerald-700 transition-all"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 sm:p-12 shadow-sm">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 capitalize">
            {pageContent?.title}
          </h1>
          <div className="mt-4 prose prose-sm sm:prose text-gray-700">
            {pageContent ? (
              <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />
            ) : (
              <p>No content available</p>
            )}
            {pageContent?.banner && (
              <img className="mt-4" src={pageContent?.banner || ""} alt={pageContent?.title || ""} />
            )}
          </div>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:bg-emerald-700 transition-all"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}