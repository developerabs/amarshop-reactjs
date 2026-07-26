import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

type BlogDetailsApiResponse = {
  success?: boolean;
  message?: string;
  data?: BlogPost;
};

export default function BlogDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!slug) {
      setError("Blog slug is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    api
      .get<BlogDetailsApiResponse>(`/blog/posts/${slug}`)
      .then((response) => {
        const post = response.data?.data;
        if (!post) {
          setError(response.data?.message || "Blog not found.");
          setBlogPost(null);
          return;
        }

        setBlogPost(post);
      })
      .catch(() => {
        setError("Unable to load blog details right now.");
        setBlogPost(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-500">
            Loading article...
          </div>
        </div>
      </main>
    );
  }

  if (error || !blogPost) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white border border-red-100 shadow-sm p-8 text-center">
            <p className="text-red-600 font-semibold">{error || "Blog not found."}</p>
            <button
              onClick={() => navigate("/blogs")}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2 text-sm font-black uppercase tracking-[0.15em] text-white hover:bg-emerald-700"
            >
              Back To Blogs
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/blogs")}
          className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-700"
        >
          ← Back To Blogs
        </button>

        <div className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm">
          {blogPost.thumbnail ? (
            <img
              src={blogPost.thumbnail}
              alt={blogPost.title}
              className="h-64 sm:h-80 w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-64 sm:h-80 w-full bg-gradient-to-br from-emerald-50 to-emerald-100" />
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-4">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">{blogPost.category}</span>
              <span>{new Date(blogPost.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-4">{blogPost.title}</h1>

            <div className="space-y-4 text-gray-700 leading-relaxed text-[15px] sm:text-base whitespace-pre-line">
              {blogPost.content}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
