import { useEffect } from "react";
import api from "../services/api";
import { useState } from "react";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  content: string;
  slug: string;
  thumbnail: string;
  created_at: string;
}
export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blog/posts");
        console.log("Fetched blogs:", response.data);
        setBlogs(response.data.data.blogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pt-6">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Blog & Insights</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-2xl">
            Explore expert tips, style guides, and product stories crafted for modern ecommerce shoppers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <img src={post.thumbnail} alt={post.title} className="h-52 w-full object-cover" referrerPolicy="no-referrer" />
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                  <span>{post.category}</span>
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h2 className="text-lg font-black text-gray-900">{post.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{post.content}</p>
                <button className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-700">
                  Read Article
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );}